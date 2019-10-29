#import <UIKit/UIKit.h>
#import <React/UIView+React.h>

#import "UnityAppController.h"
#import "UnityUtils.h"


@interface RNUnityView : UIView

@property (nonatomic, strong) RNUnityView* uView;

- (void)setUnityView:(RNUnityView *)view;

@end
