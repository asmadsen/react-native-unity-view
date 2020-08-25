import * as React from 'react'
import { NativeModules, requireNativeComponent, View, ViewProps, ViewPropTypes } from 'react-native'
import * as PropTypes from 'prop-types'
import MessageHandler from './MessageHandler'
import { UnityModule, UnityViewMessage } from './UnityModule'
import { Component, useEffect, useState } from 'react'

const { UIManager } = NativeModules

export interface UnityViewProps extends ViewProps {
    /**
     * Receive string message from unity.
     */
    onMessage?: (message: string) => void;
    /**
     * Receive unity message from unity.
     */
    onUnityMessage?: (handler: MessageHandler) => void;

    children?: React.ReactNode;

    unloadOnUnmount?: boolean;
}

let NativeUnityView

class UnityView extends Component<UnityViewProps> {

    state = {
        handle: null
    }

    componentDidMount(): void {
        const { onUnityMessage, onMessage } = this.props
        this.setState({
            handle: UnityModule.addMessageListener(message => {
                if (onUnityMessage && message instanceof MessageHandler) {
                    onUnityMessage(message)
                }
                if (onMessage && typeof message === 'string') {
                    onMessage(message)
                }
            })
        })
    }

    componentWillUnmount(): void {
        const { unloadOnUnmount } = this.props;
        UnityModule.removeMessageListener(this.state.handle);
        if (unloadOnUnmount) {
          UnityModule.unloadPlayer();
        }
    }

    render() {
        const { props } = this
        return (
            <View {...props}>
            <NativeUnityView
                style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                onUnityMessage={props.onUnityMessage}
                onMessage={props.onMessage}
            >
            </NativeUnityView>
            {props.children}
        </View>
        )
    }
}
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

NativeUnityView = requireNativeComponent('RNUnityView', UnityView)

export default UnityView;
