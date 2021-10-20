#import "RCTViewManager.h"
#if !TARGET_OS_SIMULATOR
#import <UnityFramework/UnityFramework.h>
#endif // !TARGET_OS_SIMULATOR
#import "UnityUtils.h"
#import "RNUnityView.h"

@interface RNUnityViewManager : RCTViewManager

@property (nonatomic, strong) RNUnityView *currentView;

@end
