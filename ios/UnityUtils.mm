#include <csignal>
#import <UIKit/UIKit.h>
#import "UnityUtils.h"


// Hack to work around iOS SDK 4.3 linker problem
// we need at least one __TEXT, __const section entry in main application .o files
// to get this section emitted at right time and so avoid LC_ENCRYPTION_INFO size miscalculation
static const int constsection = 0;

bool unity_inited = false;

int g_argc;
char** g_argv;

void UnityInitTrampoline();

UnityFramework* ufw;

extern "C" void InitArgs(int argc, char* argv[])
{
    g_argc = argc;
    g_argv = argv;
}

extern "C" bool UnityIsInited()
{
    return unity_inited;
}

UnityFramework* UnityFrameworkLoad() {
    NSString* bundlePath = nil;
    bundlePath = [[NSBundle mainBundle] bundlePath];
    bundlePath = [bundlePath stringByAppendingString: @"/Frameworks/UnityFramework.framework"];

    NSBundle* bundle = [NSBundle bundleWithPath: bundlePath];
    if ([bundle isLoaded] == false) [bundle load];

    UnityFramework* ufw = [bundle.principalClass getInstance];
    return ufw;
}

extern "C" void InitUnity()
{
    if (unity_inited) {
        return;
    }
    unity_inited = true;

#if !TARGET_OS_SIMULATOR
    ufw = UnityFrameworkLoad();

    [ufw setDataBundleId: "com.unity3d.framework"];
    [ufw frameworkWarmup: g_argc argv: g_argv];
#endif
}

extern "C" void UnityPostMessage(NSString* gameObject, NSString* methodName, NSString* message)
{
#if !TARGET_OS_SIMULATOR
    dispatch_async(dispatch_get_main_queue(), ^{
        [ufw sendMessageToGOWithName:[gameObject UTF8String] functionName:[methodName UTF8String] message:[message UTF8String]];
    });
#endif // !TARGET_OS_SIMULATOR
}

extern "C" void UnityPauseCommand()
{
#if !TARGET_OS_SIMULATOR
    dispatch_async(dispatch_get_main_queue(), ^{
        [ufw pause:true];
    });
#endif // !TARGET_OS_SIMULATOR
}

extern "C" void UnityResumeCommand()
{
#if !TARGET_OS_SIMULATOR
    dispatch_async(dispatch_get_main_queue(), ^{
        [ufw pause:false];
    });
#endif // !TARGET_OS_SIMULATOR
}

@implementation UnityUtils

static NSHashTable* mUnityEventListeners = [NSHashTable weakObjectsHashTable];
static BOOL _isUnityReady = NO;

+ (BOOL)isUnityReady
{
    return _isUnityReady;
}

+ (void)handleAppStateDidChange:(NSNotification *)notification
{
    if (!_isUnityReady) {
        return;
    }
#if !TARGET_OS_SIMULATOR
    UnityAppController* unityAppController = GetAppController();

    UIApplication* application = [UIApplication sharedApplication];

    if ([notification.name isEqualToString:UIApplicationWillResignActiveNotification]) {
        [unityAppController applicationWillResignActive:application];
    } else if ([notification.name isEqualToString:UIApplicationDidEnterBackgroundNotification]) {
        [unityAppController applicationDidEnterBackground:application];
    } else if ([notification.name isEqualToString:UIApplicationWillEnterForegroundNotification]) {
        [unityAppController applicationWillEnterForeground:application];
    } else if ([notification.name isEqualToString:UIApplicationDidBecomeActiveNotification]) {
        [unityAppController applicationDidBecomeActive:application];
    } else if ([notification.name isEqualToString:UIApplicationWillTerminateNotification]) {
        [unityAppController applicationWillTerminate:application];
    } else if ([notification.name isEqualToString:UIApplicationDidReceiveMemoryWarningNotification]) {
        [unityAppController applicationDidReceiveMemoryWarning:application];
    }
#endif // !TARGET_OS_SIMULATOR
}

+ (void)listenAppState
{
    for (NSString *name in @[UIApplicationDidBecomeActiveNotification,
                             UIApplicationDidEnterBackgroundNotification,
                             UIApplicationWillTerminateNotification,
                             UIApplicationWillResignActiveNotification,
                             UIApplicationWillEnterForegroundNotification,
                             UIApplicationDidReceiveMemoryWarningNotification]) {

        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(handleAppStateDidChange:)
                                                     name:name
                                                   object:nil];
    }
}

+ (void)createPlayer:(void (^)(void))completed
{
    if (_isUnityReady) {
        completed();
        return;
    }

    [[NSNotificationCenter defaultCenter] addObserverForName:@"UnityReady" object:nil queue:[NSOperationQueue mainQueue]  usingBlock:^(NSNotification * _Nonnull note) {
        _isUnityReady = YES;
        completed();
    }];

    if (UnityIsInited()) {
        return;
    }

    dispatch_async(dispatch_get_main_queue(), ^{
        UIApplication* application = [UIApplication sharedApplication];

        // Always keep RN window in top
        application.keyWindow.windowLevel = UIWindowLevelNormal + 1;

#if !TARGET_OS_SIMULATOR
        InitUnity();
        
        UnityAppController *controller = GetAppController();
        [controller application:application didFinishLaunchingWithOptions:nil];
        [controller applicationDidBecomeActive:application];
        
        // Makes RN window key window to handle events
        [application.windows[1] makeKeyWindow];
        
        [UnityUtils listenAppState];
#endif // !TARGET_OS_SIMULATOR
    });
}

@end
