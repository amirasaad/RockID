import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

function getReactNativeRoot() {
  return path.join(root, "node_modules", "react-native");
}

function isDirectory(filePath) {
  try {
    return statSync(filePath).isDirectory();
  } catch {
    return false;
  }
}

function normalizeAndroidResourceName(filename) {
  return filename
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_.]/g, "_");
}
function hasFinderCopySuffix(name) {
  return / \d+(?=(\.[^.]+)?$)/.test(name);
}

function withoutFinderCopySuffix(name) {
  return name.replace(/ \d+(?=(\.[^.]+)?$)/, "");
}

function cleanAndroidResourceNames(dir) {
  if (!existsSync(dir)) return;

  for (const entry of readdirSync(dir)) {
    const entryPath = path.join(dir, entry);
    const stats = statSync(entryPath);

    if (stats.isDirectory()) {
      cleanAndroidResourceNames(entryPath);

      if (!hasFinderCopySuffix(entry)) continue;

      const canonicalPath = path.join(dir, withoutFinderCopySuffix(entry));
      if (existsSync(canonicalPath)) {
        rmSync(entryPath, { recursive: true, force: true });
        console.log(`[fix-native-deps] Removed duplicate Android resource dir ${entryPath}`);
      } else {
        renameSync(entryPath, canonicalPath);
        console.log(`[fix-native-deps] Renamed Android resource dir ${entryPath} to ${canonicalPath}`);
      }

      continue;
    }

    const canonicalName = normalizeAndroidResourceName(withoutFinderCopySuffix(entry));
    if (canonicalName === entry) continue;

    const canonicalPath = path.join(dir, canonicalName);
    if (existsSync(canonicalPath)) {
      rmSync(entryPath, { recursive: true, force: true });
      console.log(`[fix-native-deps] Removed duplicate Android resource file ${entryPath}`);
    } else {
      renameSync(entryPath, canonicalPath);
      console.log(`[fix-native-deps] Renamed Android resource file ${entryPath} to ${canonicalPath}`);
    }
  }
}

function cleanFinderCopyArtifacts(dir) {
  if (!existsSync(dir)) return;

  for (const entry of readdirSync(dir)) {
    const entryPath = path.join(dir, entry);
    const stats = statSync(entryPath);

    if (stats.isDirectory()) {
      cleanFinderCopyArtifacts(entryPath);
    }

    if (!hasFinderCopySuffix(entry)) continue;

    const canonicalPath = path.join(dir, withoutFinderCopySuffix(entry));
    if (existsSync(canonicalPath)) {
      rmSync(entryPath, { recursive: true, force: true });
      console.log(`[fix-native-deps] Removed duplicate Android artifact ${entryPath}`);
    } else {
      renameSync(entryPath, canonicalPath);
      console.log(`[fix-native-deps] Renamed Android artifact ${entryPath} to ${canonicalPath}`);
    }
  }
}

function getPackageRoots() {
  const pnpmDir = path.join(root, "node_modules", ".pnpm");
  if (!existsSync(pnpmDir)) return [];

  const packageRoots = [];
  for (const entry of readdirSync(pnpmDir)) {
    const nodeModulesDir = path.join(pnpmDir, entry, "node_modules");
    if (!existsSync(nodeModulesDir)) continue;

    for (const packageEntry of readdirSync(nodeModulesDir)) {
      const packageRoot = path.join(nodeModulesDir, packageEntry);
      if (!isDirectory(packageRoot)) continue;

      if (packageEntry.startsWith("@")) {
        for (const scopedEntry of readdirSync(packageRoot)) {
          const scopedPackageRoot = path.join(packageRoot, scopedEntry);
          if (isDirectory(scopedPackageRoot)) {
            packageRoots.push(scopedPackageRoot);
          }
        }
      } else {
        packageRoots.push(packageRoot);
      }
    }
  }

  return packageRoots;
}

function fixAndroidResourceCopyArtifacts() {
  for (const packageRoot of getPackageRoots()) {
    const androidRoot = path.join(packageRoot, "android");
    if (!existsSync(androidRoot)) continue;

    const srcRoot = path.join(androidRoot, "src");
    if (existsSync(srcRoot)) {
      for (const sourceSet of readdirSync(srcRoot)) {
        cleanAndroidResourceNames(path.join(srcRoot, sourceSet, "res"));
      }
    }

    cleanFinderCopyArtifacts(path.join(androidRoot, "build"));
  }
}

function getExpoDevLauncherResBases() {
  const directResBase = path.join(
    root,
    "node_modules",
    "expo-dev-launcher",
    "android",
    "src",
    "debug",
    "res",
  );
  const resBases = existsSync(directResBase) ? [directResBase] : [];
  const pnpmDir = path.join(root, "node_modules", ".pnpm");

  if (!existsSync(pnpmDir)) return resBases;

  for (const entry of readdirSync(pnpmDir)) {
    if (!entry.startsWith("expo-dev-launcher@")) continue;

    const resBase = path.join(
      pnpmDir,
      entry,
      "node_modules",
      "expo-dev-launcher",
      "android",
      "src",
      "debug",
      "res",
    );

    if (existsSync(resBase)) {
      resBases.push(resBase);
    }
  }

  return resBases;
}

function fixExpoDevLauncherResourceNames() {
  for (const resBase of getExpoDevLauncherResBases()) {
    for (const dir of readdirSync(resBase).filter((entry) => entry.startsWith("drawable"))) {
      const dirPath = path.join(resBase, dir);

      for (const file of readdirSync(dirPath)) {
        const normalized = normalizeAndroidResourceName(file);
        if (normalized === file) continue;

        const src = path.join(dirPath, file);
        const dst = path.join(dirPath, normalized);
        if (!existsSync(dst)) {
          renameSync(src, dst);
          console.log(`[fix-native-deps] Renamed ${file} to ${normalized}`);
        }
      }
    }
  }
}

function fixPromiseSetImmediateFiles() {
  const setImmediateDir = path.join(root, "node_modules", "promise", "setimmediate");
  const duplicateFinally = path.join(setImmediateDir, "finally 2.js");
  const expectedFinally = path.join(setImmediateDir, "finally.js");

  if (existsSync(duplicateFinally) && !existsSync(expectedFinally)) {
    renameSync(duplicateFinally, expectedFinally);
    console.log("[fix-native-deps] Renamed promise setimmediate finally shim");
  }
}

function createMissingPlatformHeaders() {
  const platformCxxDir = path.join(
    getReactNativeRoot(),
    "ReactCommon",
    "react",
    "renderer",
    "components",
    "view",
    "platform",
    "cxx",
    "react",
    "renderer",
    "components",
    "view",
  );

  if (!existsSync(platformCxxDir)) return;

  const headers = {
    "HostPlatformViewEventEmitter.h": `/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <react/renderer/components/view/BaseViewEventEmitter.h>

namespace facebook::react {
using HostPlatformViewEventEmitter = BaseViewEventEmitter;
} // namespace facebook::react
`,
    "HostPlatformTouch.h": `/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <react/renderer/components/view/BaseTouch.h>

namespace facebook::react {
using HostPlatformTouch = BaseTouch;
} // namespace facebook::react
`,
  };

  const headerDirs = [
    platformCxxDir,
    path.join(root, "ios", "Pods", "Headers", "Public", "React-Fabric", "react", "renderer", "components", "view"),
  ];

  for (const headerDir of headerDirs) {
    if (!existsSync(headerDir)) {
      mkdirSync(headerDir, { recursive: true });
    }

    for (const [file, content] of Object.entries(headers)) {
      const filePath = path.join(headerDir, file);
      if (!existsSync(filePath)) {
        writeFileSync(filePath, content);
        console.log(`[fix-native-deps] Created ${file} in ${headerDir}`);
      }
    }
  }
}

function patchCMakeReactNativeIncludes(filePath, targetName) {
  if (!existsSync(filePath)) return;

  const marker = "# RockID: prefer React Native prefab headers over host-level includes.";
  const content = readFileSync(filePath, "utf8");
  if (content.includes(marker) && content.includes(`target_compile_options(${targetName} BEFORE PRIVATE`)) {
    return;
  }

  const findPackage = "find_package(ReactAndroid REQUIRED CONFIG)";
  if (!content.includes(findPackage)) return;

  const patchBody = `${marker}
get_target_property(ROCKID_REACT_NATIVE_INCLUDE_DIRS ReactAndroid::reactnative INTERFACE_INCLUDE_DIRECTORIES)
if(ROCKID_REACT_NATIVE_INCLUDE_DIRS)
  target_include_directories(${targetName} BEFORE PRIVATE \${ROCKID_REACT_NATIVE_INCLUDE_DIRS})
  foreach(ROCKID_REACT_NATIVE_INCLUDE_DIR \${ROCKID_REACT_NATIVE_INCLUDE_DIRS})
    target_compile_options(${targetName} BEFORE PRIVATE "-I\${ROCKID_REACT_NATIVE_INCLUDE_DIR}")
  endforeach()
endif()`;

  if (content.includes(marker)) {
    const markerStart = content.indexOf(marker);
    const markerEnd = content.indexOf("endif()", markerStart);
    if (markerEnd === -1) return;

    writeFileSync(filePath, `${content.slice(0, markerStart)}${patchBody}${content.slice(markerEnd + "endif()".length)}`);
  } else {
    writeFileSync(filePath, content.replace(findPackage, `${findPackage}\n\n${patchBody}`));
  }
  console.log(`[fix-native-deps] Patched React Native include priority in ${filePath}`);
}

function patchAndroidCMakeIncludePriority() {
  for (const packageRoot of getPackageRoots()) {
    const packageName = path.basename(packageRoot);

    if (packageName === "react-native-screens") {
      patchCMakeReactNativeIncludes(path.join(packageRoot, "android", "CMakeLists.txt"), "rnscreens");
    }

    if (packageName === "expo-modules-core") {
      patchCMakeReactNativeIncludes(path.join(packageRoot, "android", "CMakeLists.txt"), "expo-modules-core");
    }
  }
}

fixExpoDevLauncherResourceNames();
fixAndroidResourceCopyArtifacts();
fixPromiseSetImmediateFiles();
createMissingPlatformHeaders();
patchAndroidCMakeIncludePriority();
