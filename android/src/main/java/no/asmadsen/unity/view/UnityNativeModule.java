package no.asmadsen.unity.view;

import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class UnityViewModule extends ReactContextBaseJavaModule implements UnityEventListener {

    private final ReactApplicationContext reactContext;

    public UnityViewModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "UnityView";
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

    @Override
    public void onMessage(String message) {
        ReactContext context = getReactApplicationContext();
        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("onUnityMessage", message);
    }
}
