require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-unity-view"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-unity-view
                   DESC
  s.homepage     = "https://github.com/cartographr/react-native-unity-view"
  s.license      = "MIT"
  # s.license    = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "Andreas Storesund Madsen" => "andreas@asmadsen.no" }
  s.platforms    = { :ios => "9.0", :tvos => "10.0" }
  s.source       = { :git => "https://github.com/cartographr/react-native-unity-view.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm}"
  s.public_header_files = 'ios/**/*.h'
  # s.weak_frameworks = 'UnityFramework'
  s.dependency "React"

  s.xcconfig = {
    'FRAMEWORK_SEARCH_PATHS' => '"${PODS_ROOT}/../unityExport" "${PODS_CONFIGURATION_BUILD_DIR}"',
    'OTHER_LDFLAGS[sdk=iphoneos*]' => '$(inherited) -framework UnityFramework ${PODS_LIBRARIES}'
  }
end

