#import "UnityNativeModule.h"

@implementation UnityNativeModule

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE(UnityNativeModule);

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"onUnityMessage"];
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

RCT_EXPORT_METHOD(isReady:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve(@([UnityUtils isUnityReady]));
}

RCT_EXPORT_METHOD(createUnity:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [UnityUtils createPlayer:^{
        resolve(@(YES));
    }];
}

RCT_EXPORT_METHOD(postMessage:(NSString *)gameObject methodName:(NSString *)methodName message:(NSString *)message)
{
    UnityPostMessage(gameObject, methodName, message);
}

RCT_EXPORT_METHOD(pause)
{
    UnityPauseCommand();
}

RCT_EXPORT_METHOD(resume)
{
    UnityResumeCommand();
}

RCT_EXPORT_METHOD(unload)
{
    UnityUnloadCommand();
}

RCT_EXPORT_METHOD(reloadAfterUnload)
{
    UnityReloadAfterUnloadCommand();
}

@end
