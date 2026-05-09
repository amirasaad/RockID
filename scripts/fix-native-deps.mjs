import { existsSync, mkdirSync, readdirSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

function getReactNativeRoot() {
  return path.join(root, "node_modules", "react-native");
}

function normalizeAndroidResourceName(filename) {
  return filename
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_.]/g, "_");
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

fixExpoDevLauncherResourceNames();
fixPromiseSetImmediateFiles();
createMissingPlatformHeaders();
