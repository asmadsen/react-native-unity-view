#import <React/RCTEventDispatcher.h>
#import <React/RCTBridgeModule.h>
#import "UnityUtils.h"

@interface UnityNativeModule : NSObject <RCTBridgeModule, UnityEventListener>
@end
