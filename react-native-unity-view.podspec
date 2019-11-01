require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-unity-view"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-unity-view
                   DESC
  s.homepage     = "https://github.com/asmadsen/react-native-unity-view"
  s.license      = "MIT"
  # s.license    = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "Andreas Storesund Madsen" => "andreas@asmadsen.no" }
  s.platforms    = { :ios => "9.0", :tvos => "10.0" }
  s.source       = { :git => "https://github.com/asmadsen/react-native-unity-view.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm}"
  s.requires_arc = true

  s.dependency "React"
  s.pod_target_xcconfig = {
	'HEADER_SEARCH_PATHS' => '"${PODS_ROOT}/../UnityExport" "${PODS_ROOT}/../UnityExport/Classes" "${PODS_ROOT}/../UnityExport/Classes/Unity" "${PODS_ROOT}/../UnityExport/Classes/Native" "${PODS_ROOT}/../UnityExport/Libraries" "${PODS_ROOT}/../UnityExport/Libraries/libil2cpp/include" ${PODS_HEADER_PATHS}'
  }
  s.user_target_xcconfig = {
    'UNITY_SCRIPTING_BACKEND' => 'il2cpp',
	'GCC_PREFIX_HEADER' => '${PODS_ROOT}/../UnityExport/Classes/Prefix.pch',
	'HEADER_SEARCH_PATHS' => '"${PODS_ROOT}/../UnityExport" "${PODS_ROOT}/../UnityExport/Classes" "${PODS_ROOT}/../UnityExport/Classes/Unity" "${PODS_ROOT}/../UnityExport/Classes/Native" "${PODS_ROOT}/../UnityExport/Libraries" "${PODS_ROOT}/../UnityExport/Libraries/libil2cpp/include" ${PODS_HEADER_PATHS}',
    'LIBRARY_SEARCH_PATHS' => '"${PODS_ROOT}/../UnityExport/Libraries" "${PODS_ROOT}/../UnityExport/Libraries/libil2cpp/include" ${PODS_LIBRARY_PATHS}',
    'OTHER_CFLAGS' => '-DINIT_SCRIPTING_BACKEND=1 -fno-strict-overflow -DRUNTIME_IL2CPP=1 -DNET_4_0',
    'OTHER_LDFLAGS' => '-weak-lSystem -weak_framework CoreMotion -weak_framework GameKit -weak_framework iAd -framework AVFoundation -framework AVKit -framework AudioToolbox -framework CFNetwork -framework CoreGraphics -framework CoreLocation -framework CoreMedia -framework CoreVideo -framework Foundation -framework MediaPlayer -framework MediaToolbox -framework Metal -framework OpenAL -framework OpenGLES -framework QuartzCore -framework SystemConfiguration -framework UIKit -liconv.2 -liPhone-lib -lil2cpp',
    'CLANG_CXX_LANGUAGE_STANDARD' => 'c++0x',
    'CLANG_CXX_LIBRARY' => 'libc++',
    'CLANG_ENABLE_MODULES' => 'NO',
    'CLANG_WARN_BOOL_CONVERSION' => 'NO',
    'CLANG_WARN_CONSTANT_CONVERSION' => 'NO',
    'CLANG_WARN_DIRECT_OBJC_ISA_USAGE' => 'YES',
    'CLANG_WARN_EMPTY_BODY' => 'NO',
    'CLANG_WARN_ENUM_CONVERSION' => 'NO',
    'CLANG_WARN_INT_CONVERSION' => 'NO',
    'CLANG_WARN_OBJC_ROOT_CLASS' => 'YES',
    'CLANG_WARN_UNREACHABLE_CODE' => 'NO',
    'CLANG_WARN__DUPLICATE_METHOD_MATCH' => 'NO',
    'GCC_C_LANGUAGE_STANDARD' => 'c99',
    'GCC_ENABLE_CPP_RTTI' => 'NO',
    'GCC_PRECOMPILE_PREFIX_HEADER' => 'YES',
    'GCC_THUMB_SUPPORT' => 'NO',
    'GCC_USE_INDIRECT_FUNCTION_CALLS' => 'NO',
    'GCC_WARN_64_TO_32_BIT_CONVERSION' => 'NO',
    'GCC_WARN_64_TO_32_BIT_CONVERSION[arch=*64]' => 'YES',
    'GCC_WARN_ABOUT_RETURN_TYPE' => 'YES',
    'GCC_WARN_UNDECLARED_SELECTOR' => 'NO',
    'GCC_WARN_UNINITIALIZED_AUTOS' => 'NO',
    'GCC_WARN_UNUSED_FUNCTION' => 'NO',
    'ENABLE_BITCODE' => 'NO'
  }
end

