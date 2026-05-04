#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

#if __has_include(<onnxruntime.h>)
#import <UIKit/UIKit.h>
#import <onnxruntime.h>
#endif

@interface RockIdOnnxImageEncoder : NSObject <RCTBridgeModule>
@end

@implementation RockIdOnnxImageEncoder

RCT_EXPORT_MODULE(RockIdOnnxImageEncoder)

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

RCT_REMAP_METHOD(runImageEncoder,
                 runImageEncoder:(NSString *)modelUri
                 input:(NSDictionary *)input
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
  NSString *imageUri = [input objectForKey:@"imageUri"];
  if (![imageUri isKindOfClass:[NSString class]] || imageUri.length == 0) {
    reject(@"E_BAD_INPUT", @"Missing required input.imageUri", nil);
    return;
  }

  NSURL *imageURL = [NSURL URLWithString:imageUri];
  if (imageURL == nil || !imageURL.isFileURL) {
    reject(@"E_UNSUPPORTED_URI", @"Only file:// image URIs are supported by this build.", nil);
    return;
  }

  dispatch_async(dispatch_get_global_queue(QOS_CLASS_USER_INITIATED, 0), ^{
#if __has_include(<onnxruntime.h>)
    @try {
      NSError *err = nil;

      NSString *modelPath = [self resolveModelPath:modelUri];
      if (modelPath.length == 0) {
        reject(@"E_MODEL_NOT_FOUND", @"Model URI could not be resolved to an on-device file.", nil);
        return;
      }

      ORTSession *session = [self sessionForModelPath:modelPath error:&err];
      if (session == nil || err != nil) {
        reject(@"E_ORT_SESSION", @"Failed to create ORT session.", err);
        return;
      }

      UIImage *image = [UIImage imageWithContentsOfFile:imageURL.path];
      if (image == nil) {
        reject(@"E_IMAGE_DECODE", @"Failed to decode image from file URI.", nil);
        return;
      }

      const int targetSize = 224;
      NSMutableData *tensorData = [self createFloatCHWTensorDataFromImage:image
                                                                    width:targetSize
                                                                   height:targetSize];
      if (tensorData == nil) {
        reject(@"E_PREPROCESS", @"Failed to preprocess image for model input.", nil);
        return;
      }

      ORTValue *inputValue = [[ORTValue alloc] initWithTensorData:tensorData
                                                     elementType:ORTTensorElementDataTypeFloat
                                                           shape:@[ @1, @3, @(targetSize), @(targetSize) ]
                                                           error:&err];
      if (inputValue == nil || err != nil) {
        reject(@"E_ORT_INPUT", @"Failed to create ORT input tensor.", err);
        return;
      }

      NSArray<NSString *> *inputNames = [session inputNamesWithError:&err];
      if (inputNames.count == 0 || err != nil) {
        reject(@"E_ORT_MODEL_IO", @"Failed to read model input names.", err);
        return;
      }

      NSArray<NSString *> *outputNames = [session outputNamesWithError:&err];
      if (outputNames.count == 0 || err != nil) {
        reject(@"E_ORT_MODEL_IO", @"Failed to read model output names.", err);
        return;
      }

      NSMutableSet<NSString *> *requestedOutputs = [NSMutableSet setWithArray:outputNames];
      NSDictionary<NSString *, ORTValue *> *outputs =
          [session runWithInputs:@{ inputNames[0] : inputValue }
                     outputNames:requestedOutputs
                      runOptions:nil
                           error:&err];
      if (outputs == nil || err != nil) {
        reject(@"E_ORT_RUN", @"ORT session run failed.", err);
        return;
      }

      ORTValue *embeddingValue = outputs[@"image_embedding"];
      if (embeddingValue == nil) {
        embeddingValue = outputs[outputNames[0]];
      }

      NSData *embeddingData = [embeddingValue tensorDataWithError:&err];
      if (embeddingData == nil || err != nil) {
        reject(@"E_ORT_OUTPUT", @"Failed to read embedding tensor data.", err);
        return;
      }

      NSUInteger count = embeddingData.length / sizeof(float);
      const float *fp = (const float *)embeddingData.bytes;
      NSMutableArray<NSNumber *> *vector = [NSMutableArray arrayWithCapacity:count];
      for (NSUInteger i = 0; i < count; i += 1) {
        [vector addObject:@(fp[i])];
      }

      resolve(@{
        @"image_embedding" : @{
          @"data" : vector,
        }
      });
    } @catch (NSException *exception) {
      reject(@"E_NATIVE_EXCEPTION", exception.reason ?: @"Native exception.", nil);
    }
#else
    NSData *data = [NSData dataWithContentsOfFile:imageURL.path];
    if (data == nil) {
      reject(@"E_READ_FAIL", @"Failed to read image bytes from URI.", nil);
      return;
    }

    NSArray<NSNumber *> *embedding = [self embedBytesDeterministic:data dimension:8];
    resolve(@{
      @"image_embedding" : @{
        @"data" : embedding,
      }
    });
#endif
  });
}

#if __has_include(<onnxruntime.h>)
static ORTEnv *_rockidOrtEnv = nil;
static NSMutableDictionary<NSString *, ORTSession *> *_rockidSessions = nil;
static dispatch_queue_t _rockidOrtQueue;

+ (void)initialize {
  if (self != [RockIdOnnxImageEncoder class]) return;
  _rockidSessions = [NSMutableDictionary dictionary];
  _rockidOrtQueue = dispatch_queue_create("com.anonymous.rockid.ort", DISPATCH_QUEUE_SERIAL);
}

- (NSString *)resolveModelPath:(NSString *)modelUri {
  if (![modelUri isKindOfClass:[NSString class]] || modelUri.length == 0) return @"";

  NSURL *url = [NSURL URLWithString:modelUri];
  if (url != nil && url.isFileURL) {
    return url.path ?: @"";
  }

  if ([modelUri hasPrefix:@"bundle://"]) {
    NSString *relative = [modelUri substringFromIndex:@"bundle://".length];
    NSString *fileName = [relative lastPathComponent];
    NSString *dir = [relative stringByDeletingLastPathComponent];

    NSString *base = [fileName stringByDeletingPathExtension];
    NSString *ext = [fileName pathExtension];
    if (ext.length == 0) ext = @"onnx";

    NSString *path = [[NSBundle mainBundle] pathForResource:base ofType:ext inDirectory:dir];
    return path ?: @"";
  }

  return @"";
}

- (ORTSession *)sessionForModelPath:(NSString *)modelPath error:(NSError **)error {
  __block ORTSession *session = nil;
  __block NSError *capturedError = nil;
  dispatch_sync(_rockidOrtQueue, ^{
    session = _rockidSessions[modelPath];
    if (session != nil) return;

    NSError *envError = nil;
    if (_rockidOrtEnv == nil) {
      _rockidOrtEnv = [[ORTEnv alloc] initWithLoggingLevel:ORTLoggingLevelWarning error:&envError];
    }
    if (envError != nil) {
      capturedError = envError;
      return;
    }

    NSError *sessionError = nil;
    session = [[ORTSession alloc] initWithEnv:_rockidOrtEnv modelPath:modelPath sessionOptions:nil error:&sessionError];
    if (sessionError != nil) {
      capturedError = sessionError;
      return;
    }

    _rockidSessions[modelPath] = session;
  });

  if (error != nil) *error = capturedError;
  return session;
}

- (NSMutableData *)createFloatCHWTensorDataFromImage:(UIImage *)image width:(int)width height:(int)height {
  CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
  if (colorSpace == nil) return nil;

  const size_t bytesPerRow = (size_t)width * 4;
  NSMutableData *rgba = [NSMutableData dataWithLength:(NSUInteger)height * bytesPerRow];
  const CGBitmapInfo bitmapInfo = (CGBitmapInfo)kCGBitmapByteOrder32Little | (CGBitmapInfo)kCGImageAlphaPremultipliedFirst;
  CGContextRef ctx = CGBitmapContextCreate(rgba.mutableBytes,
                                           (size_t)width,
                                           (size_t)height,
                                           8,
                                           bytesPerRow,
                                           colorSpace,
                                           bitmapInfo);
  CGColorSpaceRelease(colorSpace);
  if (ctx == nil) return nil;

  CGContextSetInterpolationQuality(ctx, kCGInterpolationHigh);
  CGContextDrawImage(ctx, CGRectMake(0, 0, width, height), image.CGImage);
  CGContextRelease(ctx);

  const uint8_t *pixels = (const uint8_t *)rgba.bytes;
  if (pixels == nil) return nil;

  const float mean[3] = { 0.48145466f, 0.4578275f, 0.40821073f };
  const float stdv[3] = { 0.26862954f, 0.26130258f, 0.27577711f };

  const NSUInteger hw = (NSUInteger)width * (NSUInteger)height;
  NSMutableData *floats = [NSMutableData dataWithLength:hw * 3 * sizeof(float)];
  float *out = (float *)floats.mutableBytes;
  if (out == nil) return nil;

  for (NSUInteger i = 0; i < hw; i += 1) {
    const uint8_t a = pixels[i * 4 + 0];
    (void)a;
    const uint8_t r = pixels[i * 4 + 1];
    const uint8_t g = pixels[i * 4 + 2];
    const uint8_t b = pixels[i * 4 + 3];

    const float rf = ((float)r) / 255.0f;
    const float gf = ((float)g) / 255.0f;
    const float bf = ((float)b) / 255.0f;

    out[i] = (rf - mean[0]) / stdv[0];
    out[hw + i] = (gf - mean[1]) / stdv[1];
    out[2 * hw + i] = (bf - mean[2]) / stdv[2];
  }

  return floats;
}
#endif

- (NSArray<NSNumber *> *)embedBytesDeterministic:(NSData *)data dimension:(NSInteger)dimension {
  if (dimension <= 0) return @[];

  NSMutableArray<NSNumber *> *buckets = [NSMutableArray arrayWithCapacity:(NSUInteger)dimension];
  for (NSInteger i = 0; i < dimension; i += 1) {
    [buckets addObject:@(0.0)];
  }

  const uint8_t *bytes = (const uint8_t *)data.bytes;
  const NSUInteger length = data.length;
  for (NSUInteger i = 0; i < length; i += 1) {
    const NSInteger index = (NSInteger)(i % (NSUInteger)dimension);
    const double existing = buckets[(NSUInteger)index].doubleValue;
    buckets[(NSUInteger)index] = @(existing + (double)bytes[i]);
  }

  double norm = 0.0;
  for (NSNumber *value in buckets) {
    const double v = value.doubleValue;
    norm += v * v;
  }
  norm = sqrt(norm);
  if (norm <= 0.0) {
    NSMutableArray<NSNumber *> *zeros = [NSMutableArray arrayWithCapacity:(NSUInteger)dimension];
    for (NSInteger i = 0; i < dimension; i += 1) {
      [zeros addObject:@(0.0)];
    }
    return zeros;
  }

  NSMutableArray<NSNumber *> *normalized = [NSMutableArray arrayWithCapacity:(NSUInteger)dimension];
  for (NSNumber *value in buckets) {
    [normalized addObject:@(value.doubleValue / norm)];
  }
  return normalized;
}

@end
