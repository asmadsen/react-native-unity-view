#import "RNUnityViewManager.h"
#import "RNUnityView.h"

@implementation RNUnityViewManager

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE(RNUnityView)

- (UIView *)view
{
    self.currentView = [[RNUnityView alloc] init];
    if ([UnityUtils isUnityReady]) {
        [self.currentView setUnityView: [GetAppController() unityView]];
    } else {
        [UnityUtils createPlayer:^{
            [self.currentView setUnityView: [GetAppController() unityView]];
        }];
        [GetAppController() setUnityMessageHandler: ^(const char* message) {
            [_bridge.eventDispatcher sendDeviceEventWithName:@"onUnityMessage"
                                                            body:[NSString stringWithUTF8String:message]];
        }];
    }
    return self.currentView;
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (void)setBridge:(RCTBridge *)bridge {
    _bridge = bridge;
}

RCT_EXPORT_METHOD(postMessage:(nonnull NSNumber *)reactTag gameObject:(NSString *)gameObject methodName:(NSString *)methodName message:(NSString *)message)
{
    UnityPostMessage(gameObject, methodName, message);
}

RCT_EXPORT_METHOD(pause:(nonnull NSNumber *)reactTag)
{
    UnityPauseCommand();
}

RCT_EXPORT_METHOD(resume:(nonnull NSNumber *)reactTag)
{
    UnityResumeCommand();
}

RCT_EXPORT_METHOD(unload:(nonnull NSNumber *)reactTag)
{
    UnityUnloadCommand();
}

RCT_EXPORT_METHOD(reloadAfterUnload:(nonnull NSNumber *)reactTag)
{
    UnityReloadAfterUnloadCommand();
}

@end
