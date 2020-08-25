package no.asmadsen.unity.view;

import android.app.Activity;
import android.content.Context;
import android.graphics.PixelFormat;
import android.os.Build;
import android.view.ViewGroup;
import android.view.WindowManager;
import com.unity3d.player.UnityPlayer;
import java.util.concurrent.CopyOnWriteArraySet;

import static android.view.ViewGroup.LayoutParams.MATCH_PARENT;

public class UnityUtils {
    private static final CopyOnWriteArraySet<UnityEventListener> mUnityEventListeners =
            new CopyOnWriteArraySet<>();
    private static UnityPlayer unityPlayer;
    private static boolean _isUnityReady;
    private static boolean _isUnityPaused;

    public static UnityPlayer getPlayer() {
        if (!_isUnityReady) {
            return null;
        }
        return unityPlayer;
    }

    public static boolean isUnityReady() {
        return _isUnityReady;
    }

    public static boolean isUnityPaused() {
        return _isUnityPaused;
    }

    public static void createPlayer(final Activity activity, final CreateCallback callback) {
        if (unityPlayer != null) {
            _isUnityReady = true;
            callback.onReady();
            return;
        }
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                activity.getWindow().setFormat(PixelFormat.RGBA_8888);
                int flag = activity.getWindow().getAttributes().flags;
                boolean fullScreen = false;
                if ((flag & WindowManager.LayoutParams.FLAG_FULLSCREEN) == WindowManager.LayoutParams.FLAG_FULLSCREEN) {
                    fullScreen = true;
                }

                unityPlayer = new UnityPlayer(activity);

                try {
                    // wait a moument. fix unity cannot start when startup.
                    Thread.sleep(1000);
                } catch (Exception e) {
                }

                // start unity
                addUnityViewToBackground();
                unityPlayer.windowFocusChanged(true);
                unityPlayer.requestFocus();
                unityPlayer.resume();

                // restore window layout
                if (!fullScreen) {
                    activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);
                    activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
                }
                _isUnityReady = true;
                callback.onReady();
            }
        });
    }

    public static void unloadPlayer(final Activity activity, final CreateCallback callback) {
        if (unityPlayer == null) {
            callback.onReady();
            return;
        }
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                unityPlayer.unload();
                _isUnityReady = false;
                callback.onReady();
            }
        });
    }

    public static void postMessage(String gameObject, String methodName, String message) {
        if (!_isUnityReady) {
            return;
        }
        UnityPlayer.UnitySendMessage(gameObject, methodName, message);
    }

    public static void pause() {
        if (unityPlayer != null) {
            unityPlayer.pause();
            _isUnityPaused = true;
        }
    }

    public static void resume() {
        if (unityPlayer != null) {
            unityPlayer.resume();
            _isUnityPaused = false;
        }
    }

    /**
     * Invoke by unity C#
     */
    public static void onUnityMessage(String message) {
        for (UnityEventListener listener : mUnityEventListeners) {
            try {
                listener.onMessage(message);
            } catch (Exception e) {
            }
        }
    }

    public static void addUnityEventListener(UnityEventListener listener) {
        mUnityEventListeners.add(listener);
    }

    public static void removeUnityEventListener(UnityEventListener listener) {
        mUnityEventListeners.remove(listener);
    }

    public static void addUnityViewToBackground() {
        if (unityPlayer == null) {
            return;
        }
        if (unityPlayer.getParent() != null) {
            ((ViewGroup) unityPlayer.getParent()).removeView(unityPlayer);
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            unityPlayer.setZ(-1f);
        }
        final Activity activity = ((Activity) unityPlayer.getContext());
        ViewGroup.LayoutParams layoutParams = new ViewGroup.LayoutParams(1, 1);
        activity.addContentView(unityPlayer, layoutParams);
    }

    public static void addUnityViewToGroup(ViewGroup group) {
        if (unityPlayer == null) {
            return;
        }
        if (unityPlayer.getParent() != null) {
            ((ViewGroup) unityPlayer.getParent()).removeView(unityPlayer);
        }
        ViewGroup.LayoutParams layoutParams = new ViewGroup.LayoutParams(MATCH_PARENT, MATCH_PARENT);
        group.addView(unityPlayer, 0, layoutParams);
        unityPlayer.windowFocusChanged(true);
        unityPlayer.requestFocus();
        unityPlayer.resume();
    }

    public interface CreateCallback {
        void onReady();
    }
}
