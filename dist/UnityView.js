"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var React = require("react");
var react_native_1 = require("react-native");
var MessageHandler_1 = require("./MessageHandler");
var UnityModule_1 = require("./UnityModule");
var react_1 = require("react");
var UIManager = react_native_1.NativeModules.UIManager;
var NativeUnityView;
var UnityView = /** @class */ (function (_super) {
    __extends(UnityView, _super);
    function UnityView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            handle: null
        };
        return _this;
    }
    UnityView.prototype.componentDidMount = function () {
        var _a = this.props, onUnityMessage = _a.onUnityMessage, onMessage = _a.onMessage;
        this.setState({
            handle: UnityModule_1.UnityModule.addMessageListener(function (message) {
                if (onUnityMessage && message instanceof MessageHandler_1["default"]) {
                    onUnityMessage(message);
                }
                if (onMessage && typeof message === 'string') {
                    onMessage(message);
                }
            })
        });
    };
    UnityView.prototype.componentWillUnmount = function () {
        UnityModule_1.UnityModule.removeMessageListener(this.state.handle);
    };
    UnityView.prototype.render = function () {
        var props = this.props;
        return (React.createElement(react_native_1.View, __assign({}, props),
            React.createElement(NativeUnityView, { style: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }, onUnityMessage: props.onUnityMessage, onMessage: props.onMessage }),
            props.children));
    };
    return UnityView;
}(react_1.Component));
/*
const UnityView = ({ onUnityMessage, onMessage, ...props } : UnityViewProps) => {
    const [handle, setHandle] = useState(null)

    useEffect(() => {
        setHandle(UnityModule.addMessageListener(message => {
            if (onUnityMessage && message instanceof MessageHandler) {
                onUnityMessage(message)
            }
            if (onMessage && typeof message === 'string') {
                onMessage(message)
            }
        }))
        return () => {
            UnityModule.removeMessageListener(handle)
        }
    }, [onUnityMessage, onMessage, handle, setHandle])

    return (
        <View {...props}>
            <NativeUnityView
                style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                onUnityMessage={onUnityMessage}
                onMessage={onMessage}
            >
            </NativeUnityView>
            {props.children}
        </View>
    )
}
*/
NativeUnityView = react_native_1.requireNativeComponent('RNUnityView', UnityView);
exports["default"] = UnityView;
//# sourceMappingURL=UnityView.js.map