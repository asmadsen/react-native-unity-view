"use strict";
exports.__esModule = true;
var react_native_1 = require("react-native");
var UnityNativeModule = react_native_1.NativeModules.UnityNativeModule;
exports.UnityMessagePrefix = '@UnityMessage@';
var MessageHandler = /** @class */ (function () {
    function MessageHandler() {
    }
    MessageHandler.deserialize = function (message) {
        if (!MessageHandler.isUnityMessage(message)) {
            throw new Error("\"" + message + "\" is't an UnityMessage.");
        }
        message = message.replace(exports.UnityMessagePrefix, '');
        var m = JSON.parse(message);
        var handler = new MessageHandler();
        handler.id = m.id;
        handler.seq = m.seq;
        handler.name = m.name;
        handler.data = m.data;
        return handler;
    };
    MessageHandler.isUnityMessage = function (message) {
        if (message.startsWith(exports.UnityMessagePrefix)) {
            return true;
        }
        else {
            return false;
        }
    };
    MessageHandler.prototype.send = function (data) {
        UnityNativeModule.postMessage('UnityMessageManager', 'onRNMessage', exports.UnityMessagePrefix + JSON.stringify({
            id: this.id,
            seq: 'end',
            name: this.name,
            data: data
        }));
    };
    return MessageHandler;
}());
exports["default"] = MessageHandler;
//# sourceMappingURL=MessageHandler.js.map