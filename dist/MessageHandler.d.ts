export declare const UnityMessagePrefix = "@UnityMessage@";
export default class MessageHandler {
    id: number;
    seq: 'start' | 'end' | '';
    name: string;
    data: any;
    constructor();
    static deserialize(message: string): MessageHandler;
    static isUnityMessage(message: string): boolean;
    send(data: any): void;
}
