package no.asmadsen.unity.view;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class UnityNativeModule extends ReactContextBaseJavaModule implements UnityEventListener {

    // Added reference to native method defined in UnityBridge.h for capturing Java env
    private native void unityBridgeSetup();

    public UnityNativeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        UnityUtils.addUnityEventListener(this);

        // Add call to UnityBridge.h to capture Java env
        System.loadLibrary ("juce_jni");
        unityBridgeSetup();
    }

    @Override
    public String getName() {
        return "UnityNativeModule";
    }


    @ReactMethod
    public void isReady(Promise promise) {
        promise.resolve(UnityUtils.isUnityReady());
    }

    @ReactMethod
    public void createUnity(final Promise promise) {
        UnityUtils.createPlayer(getCurrentActivity(), new UnityUtils.CreateCallback() {
            @Override
            public void onReady() {
                promise.resolve(true);
            }
        });
    }

    @ReactMethod
    public void postMessage(String gameObject, String methodName, String message) {
        UnityUtils.postMessage(gameObject, methodName, message);
    }

    @ReactMethod
    public void pause() {
        UnityUtils.pause();
    }

    @ReactMethod
    public void resume() {
        UnityUtils.resume();
    }

    // Added reference to native method defined in UnityBridge.h for direct communcation
    private native void unityBridgeOnUnityMessage (String message);

    @Override
    public void onMessage(String message) {
        ReactContext context = getReactApplicationContext();
        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("onUnityMessage", message);
        unityBridgeOnUnityMessage (message);
    }

    // Added callback referenced in UnityBridge.h for direct communcation
    public static void postMessageToUnity (final String message)
    {
        UnityUtils.postMessage("UnityMessageManager", "onRNMessage", message);
    }
}
