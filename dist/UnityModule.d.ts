import MessageHandler from './MessageHandler';
export interface UnityViewMessage {
    name: string;
    data: any;
    callBack?: (data: any) => void;
}
export interface UnityModule {
    /**
     * Return whether is unity ready.
     */
    isReady(): Promise<boolean>;
    /**
     * Manual init the Unity. Usually Unity is auto created when the first view is added.
     */
    createUnity(): Promise<boolean>;
    /**
     * Send Message to UnityMessageManager.
     * @param message The message will post.
     */
    postMessageToUnityManager(message: string | UnityViewMessage): void;
    /**
     * Send Message to Unity.
     * @param gameObject The Name of GameObject. Also can be a path string.
     * @param methodName Method name in GameObject instance.
     * @param message The message will post.
     */
    postMessage(gameObject: string, methodName: string, message: string): void;
    /**
     * Pause the unity player
     */
    pause(): void;
    /**
     * Pause the unity player
     */
    resume(): void;
    /**
     * Receive string and json message from unity.
     */
    addMessageListener(listener: (message: string | MessageHandler) => void): number;
    /**
     * Only receive string message from unity.
     */
    addStringMessageListener(listener: (message: string) => void): number;
    /**
     * Only receive json message from unity.
     */
    addUnityMessageListener(listener: (handler: MessageHandler) => void): number;
    /**
     * Remove message listener.
     */
    removeMessageListener(handleId: number): void;
}
export declare const UnityModule: UnityModule;
