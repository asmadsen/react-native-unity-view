#import <Foundation/Foundation.h>
#if !TARGET_OS_SIMULATOR
#import <UnityFramework/UnityFramework.h>
#endif // !TARGET_OS_SIMULATOR

#ifndef UnityUtils_h
#define UnityUtils_h

#ifdef __cplusplus
extern "C" {
#endif

void InitArgs(int argc, char* argv[]);

bool UnityIsInited(void);

void InitUnity();

void UnityPostMessage(NSString* gameObject, NSString* methodName, NSString* message);

void UnityPauseCommand();

void UnityResumeCommand();

#ifdef __cplusplus
} // extern "C"
#endif


@interface UnityUtils : NSObject

+ (BOOL)isUnityReady;
+ (void)createPlayer:(void (^)(void))completed;

@end

#endif /* UnityUtils_h */
