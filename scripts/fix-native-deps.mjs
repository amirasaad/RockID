import { existsSync, readdirSync, renameSync, writeFileSync, copyFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

function fixCodegen() {
  const codegenDir = path.join(
    root,
    "node_modules",
    ".pnpm",
    "@react-native+codegen@0.81.5_@babel+core@7.29.0",
    "node_modules",
    "@react-native",
    "codegen",
    "lib",
    "parsers",
  );

  if (!existsSync(codegenDir)) return;

  const missingFiles = ["parsers-utils.js", "schema.js"];
  const codegen816 = path.join(
    root,
    "node_modules",
    ".pnpm",
    "@react-native+codegen@0.81.6_@babel+core@7.29.0",
    "node_modules",
    "@react-native",
    "codegen",
    "lib",
    "parsers",
  );

  for (const file of missingFiles) {
    const dst = path.join(codegenDir, file);
    if (!existsSync(dst) && existsSync(codegen816)) {
      const src = path.join(codegen816, file);
      if (existsSync(src)) {
        copyFileSync(src, dst);
        console.log(`[fix-native-deps] Copied ${file} from codegen 0.81.6`);
      }
    }
  }
}

function createMissingPlatformHeaders() {
  const platformCxxDir = path.join(
    root,
    "node_modules",
    "react-native",
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

  for (const [file, content] of Object.entries(headers)) {
    const filePath = path.join(platformCxxDir, file);
    if (!existsSync(filePath)) {
      writeFileSync(filePath, content);
      console.log(`[fix-native-deps] Created ${file}`);
    }
  }
}

fixCodegen();
createMissingPlatformHeaders();
