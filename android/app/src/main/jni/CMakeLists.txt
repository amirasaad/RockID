# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

cmake_minimum_required(VERSION 3.13)
project(appmodules)

# Keep React Native's default New Architecture app setup, then make the
# packaged React Native headers win over host-level Homebrew headers such as
# /usr/local/include/glog during Android C++ compilation.
include(${REACT_ANDROID_DIR}/cmake-utils/ReactNative-application.cmake)

get_target_property(ROCKID_REACT_NATIVE_INCLUDE_DIRS ReactAndroid::reactnative INTERFACE_INCLUDE_DIRECTORIES)

if(ROCKID_REACT_NATIVE_INCLUDE_DIRS)
  set(ROCKID_NATIVE_TARGETS ${CMAKE_PROJECT_NAME})

  if(DEFINED AUTOLINKED_LIBRARIES)
    list(APPEND ROCKID_NATIVE_TARGETS ${AUTOLINKED_LIBRARIES})
  endif()

  if(DEFINED APP_CODEGEN_TARGET)
    list(APPEND ROCKID_NATIVE_TARGETS ${APP_CODEGEN_TARGET})
  endif()

  foreach(rockid_target ${ROCKID_NATIVE_TARGETS})
    if(TARGET ${rockid_target})
      target_include_directories(${rockid_target} BEFORE PRIVATE ${ROCKID_REACT_NATIVE_INCLUDE_DIRS})
      foreach(rockid_include_dir ${ROCKID_REACT_NATIVE_INCLUDE_DIRS})
        target_compile_options(${rockid_target} BEFORE PRIVATE "-I${rockid_include_dir}")
      endforeach()
    endif()
  endforeach()
endif()
