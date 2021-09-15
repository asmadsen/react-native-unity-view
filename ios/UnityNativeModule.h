#import <React/RCTEventDispatcher.h>
#import <React/RCTBridgeModule.h>
#import "UnityUtils.h"

#if TARGET_OS_SIMULATOR
@interface UnityNativeModule : NSObject <RCTBridgeModule>
#else
@interface UnityNativeModule : NSObject <RCTBridgeModule, UnityEventListener>
#endif
@end
