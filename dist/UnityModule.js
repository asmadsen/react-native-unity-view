"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_native_1 = require("react-native");
var MessageHandler_1 = require("./MessageHandler");
var UnityNativeModule = react_native_1.NativeModules.UnityNativeModule;
var sequence = 0;
function generateId() {
    sequence = sequence + 1;
    return sequence;
}
var waitCallbackMessageMap = {};
function handleMessage(message) {
    if (MessageHandler_1["default"].isUnityMessage(message)) {
        var handler = MessageHandler_1["default"].deserialize(message);
        if (handler.seq === 'end') {
            // handle callback message
            var m = waitCallbackMessageMap[handler.id];
            delete waitCallbackMessageMap[handler.id];
            if (m && m.callBack != null) {
                m.callBack(handler.data);
            }
            return;
        }
        else {
            return handler;
        }
    }
    else {
        return message;
    }
}
var UnityModuleImpl = /** @class */ (function () {
    function UnityModuleImpl() {
        this.hid = 0;
        this.createListeners();
    }
    UnityModuleImpl.prototype.isReady = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, UnityNativeModule.isReady()];
            });
        });
    };
    UnityModuleImpl.prototype.createUnity = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, UnityNativeModule.createUnity()];
            });
        });
    };
    UnityModuleImpl.prototype.postMessageToUnityManager = function (message) {
        if (typeof message === 'string') {
            this.postMessage('UnityMessageManager', 'onMessage', message);
        }
        else {
            var id = generateId();
            if (message.callBack) {
                waitCallbackMessageMap[id] = message;
            }
            this.postMessage('UnityMessageManager', 'onRNMessage', MessageHandler_1.UnityMessagePrefix + JSON.stringify({
                id: id,
                seq: message.callBack ? 'start' : '',
                name: message.name,
                data: message.data
            }));
        }
    };
    UnityModuleImpl.prototype.postMessage = function (gameObject, methodName, message) {
        UnityNativeModule.postMessage(gameObject, methodName, message);
    };
    UnityModuleImpl.prototype.pause = function () {
        UnityNativeModule.pause();
    };
    UnityModuleImpl.prototype.resume = function () {
        UnityNativeModule.resume();
    };
    UnityModuleImpl.prototype.addMessageListener = function (listener) {
        var id = this.getHandleId();
        this.stringListeners[id] = listener;
        this.unityMessageListeners[id] = listener;
        return id;
    };
    UnityModuleImpl.prototype.addStringMessageListener = function (listener) {
        var id = this.getHandleId();
        this.stringListeners[id] = listener;
        return id;
    };
    UnityModuleImpl.prototype.addUnityMessageListener = function (listener) {
        var id = this.getHandleId();
        this.unityMessageListeners[id] = listener;
        return id;
    };
    UnityModuleImpl.prototype.removeMessageListener = function (handleId) {
        if (this.unityMessageListeners[handleId]) {
            delete this.unityMessageListeners[handleId];
        }
        if (this.stringListeners[handleId]) {
            delete this.stringListeners[handleId];
        }
    };
    UnityModuleImpl.prototype.createListeners = function () {
        var _this = this;
        this.stringListeners = {};
        this.unityMessageListeners = {};
        react_native_1.DeviceEventEmitter.addListener('onUnityMessage', function (message) {
            var result = handleMessage(message);
            if (result instanceof MessageHandler_1["default"]) {
                Object.values(_this.unityMessageListeners).forEach(function (listener) {
                    listener(result);
                });
            }
            if (typeof result === 'string') {
                Object.values(_this.stringListeners).forEach(function (listener) {
                    listener(result);
                });
            }
        });
    };
    UnityModuleImpl.prototype.getHandleId = function () {
        this.hid = this.hid + 1;
        return this.hid;
    };
    return UnityModuleImpl;
}());
exports.UnityModule = new UnityModuleImpl();
//# sourceMappingURL=UnityModule.js.map