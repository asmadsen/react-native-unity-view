/*
MIT License
Copyright (c) 2017 Jiulong Wang
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

#if UNITY_IOS

using System;
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEditor.Callbacks;
using UnityEditor.iOS.Xcode;

public static class XcodePostBuild {
    private const string TouchedMarker = "https://github.com/asmadsen/react-native-unity-view";

    [PostProcessBuild]
    public static void OnPostBuild(BuildTarget target, string pathToBuiltProject) {
        if (target != BuildTarget.iOS) {
            return;
        }

        PatchUnityNativeCode(pathToBuiltProject);

        UpdateUnityProjectFiles(pathToBuiltProject);
    }

    private static void UpdateUnityProjectFiles(string pathToBuiltProject) {
        var pbx = new PBXProject();
        var pbxPath = Path.Combine(pathToBuiltProject, "Unity-iPhone.xcodeproj/project.pbxproj");
        pbx.ReadFromFile(pbxPath);

        var targetGuid = pbx.TargetGuidByName("UnityFramework");
        var fileGuid = pbx.AddFolderReference(Path.Combine(pathToBuiltProject, "Data"), "Data");
        pbx.AddFileToBuild(targetGuid, fileGuid);

        pbx.WriteToFile(pbxPath);
    }

    private static void PatchUnityNativeCode(string pathToBuiltProject) {
        EditUnityFrameworkH(Path.Combine(pathToBuiltProject, "UnityFramework/UnityFramework.h"));
        EditUnityAppControllerH(Path.Combine(pathToBuiltProject, "Classes/UnityAppController.h"));
        EditUnityAppControllerMM(Path.Combine(pathToBuiltProject, "Classes/UnityAppController.mm"));
        EditUnityViewMM(Path.Combine(pathToBuiltProject, "Classes/UI/UnityView.mm"));
    }

    private static void EditUnityFrameworkH(string path) {
        var inScope = false;

        EditCodeFile(path, line => {
            inScope |= line.Contains("- (void)runUIApplicationMainWithArgc:");

            if (!inScope) return new string[] {line};
            if (line.Trim() != "") return new string[] {line};
            inScope = false;

            return new string[] {
                "",
                "// Added by " + TouchedMarker,
                "- (void)frameworkWarmup:(int)argc argv:(char*[])argv;",
                ""
            };
        });
    }

    private static void EditUnityAppControllerH(string path) {
        var inScope = false;
        var markerDetected = false;

        // Modify inline GetAppController
        EditCodeFile(path, line => {
            inScope |= line.Contains("include \"RenderPluginDelegate.h\"");

            if (!inScope || markerDetected) return new string[] {line};
            if (line.Trim() != "") return new string[] {line};
            inScope = false;
            markerDetected = true;

            return new string[] {
                "",
                "// Added by " + TouchedMarker,
                "@protocol UnityEventListener <NSObject>",
                "- (void)onMessage:(NSString *)message;",
                "@end",
                "",
            };
        });

        inScope = false;
        markerDetected = false;

        // Modify inline GetAppController
        EditCodeFile(path, line => {
            inScope |= line.Contains("quitHandler)");

            if (!inScope || markerDetected) return new string[] {line};
            if (line.Trim() != "") return new string[] {line};
            inScope = false;
            markerDetected = true;

            return new string[] {
                "@property (nonatomic, copy)                                 void(^unityMessageHandler)(const char* message);",
            };
        });

        inScope = false;
        markerDetected = false;

        // Add static GetAppController
        EditCodeFile(path, line => {
            inScope |= line.Contains("- (void)startUnity:");

            if (!inScope) return new string[] {line};
            if (line.Trim() != "") return new string[] {line};
            inScope = false;

            return new string[] {
                "",
                "// Added by " + TouchedMarker,
                "+ (UnityAppController*)GetAppController;",
                ""
            };
        });

        inScope = false;
        markerDetected = false;

        // Modify inline GetAppController
        EditCodeFile(path, line => {
            inScope |= line.Contains("extern UnityAppController* GetAppController");

            if (!inScope || markerDetected) return new string[] {line};
            if (line.Trim() != "") return new string[] {"// " + line};
            inScope = false;
            markerDetected = true;

            return new string[] {
                "// }",
                "",
                "// Added by " + TouchedMarker,
                "static inline UnityAppController* GetAppController()",
                "{",
                "    return [UnityAppController GetAppController];",
                "}",
                "",
            };
        });
    }

    private static void EditUnityAppControllerMM(string path) {
        var inScope = false;
        var markerDetected = false;

        EditCodeFile(path, line => {
            if (line.Trim() == "@end") {
                return new string[] {
                    "",
                    "// Added by " + TouchedMarker,
                    "static UnityAppController *unityAppController = nil;",
                    "",
                    @"+ (UnityAppController*)GetAppController",
                    "{",
                    "    static dispatch_once_t onceToken;",
                    "    dispatch_once(&onceToken, ^{",
                    "        unityAppController = [[self alloc] init];",
                    "    });",
                    "    return unityAppController;",
                    "}",
                    "",
                    "// Added by " + TouchedMarker,
                    "extern \"C\" void onUnityMessage(const char* message)",
                    "{",
                    "    if (GetAppController().unityMessageHandler) {",
                    "        GetAppController().unityMessageHandler(message);",
                    "    }",
                    "}",
                    line,
                };
            }

            inScope |= line.Contains("- (void)startUnity:");
            markerDetected |= inScope && line.Contains(TouchedMarker);

            if (!inScope || line.Trim() != "}") return new string[] {line};
            inScope = false;

            if (markerDetected) {
                return new string[] {line};
            }
            else {
                return new string[] {
                    "    // Modified by " + TouchedMarker,
                    @"    [[NSNotificationCenter defaultCenter] postNotificationName: @""UnityReady"" object:self];",
                    "}",
                };
            }

        });

        inScope = false;
        markerDetected = false;

        // Modify inline GetAppController
        EditCodeFile(path, line => {
            inScope |= line.Contains("UnityAppController* GetAppController()");

            if (!inScope || markerDetected) return new string[] {line};
            if (line.Trim() != "}") return new string[] {"// " + line};
            inScope = false;
            markerDetected = true;

            return new string[] {
                "",
            };

        });

        inScope = false;
        markerDetected = false;

        // Modify inline GetAppController
        EditCodeFile(path, line => {
            inScope |= line.Contains("@synthesize quitHandler");

            if (!inScope || markerDetected) return new string[] {line};
            if (line.Trim() != "") return new string[] {line};
            inScope = false;
            markerDetected = true;

            return new string[] {
                "@synthesize unityMessageHandler     = _unityMessageHandler;",
            };

        });
    }

    private static void EditUnityViewMM(string path) {
        var inScope = false;

        // Add frameworkWarmup method
        EditCodeFile(path, line => {
            inScope |= line.Contains("UnityGetRenderingResolution(&requestedW, &requestedH)");

            if (!inScope) return new string[] {line};
            if (line.Trim() != "") return new string[] {line};
            inScope = false;

            return new string[] {
                "",
                "// Added by " + TouchedMarker,
                "        if (requestedW == 0) {",
                "            requestedW = _surfaceSize.width;",
                "        }",
                "        if (requestedH == 0) {",
                "            requestedH = _surfaceSize.height;",
                "        }",
                ""
            };

        });
    }

    private static void EditCodeFile(string path, Func<string, IEnumerable<string>> lineHandler) {
        var bakPath = path + ".bak";
        if (File.Exists(bakPath)) {
            File.Delete(bakPath);
        }

        File.Move(path, bakPath);

        using (var reader = File.OpenText(bakPath))
        using (var stream = File.Create(path))
        using (var writer = new StreamWriter(stream)) {
            string line;
            while ((line = reader.ReadLine()) != null) {
                var outputs = lineHandler(line);
                foreach (var o in outputs) {
                    writer.WriteLine(o);
                }
            }
        }
    }
}

#endif
