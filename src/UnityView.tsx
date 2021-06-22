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

    children?: React.ReactNode

    /**
     * Calls Application.Unload() when the view is unmounted.
     */
    unloadOnUnmount?: boolean;
}

let NativeUnityView

class UnityView extends Component<UnityViewProps> {

    state = {
        handle: null
    }

    componentDidMount(): void {
        const { onUnityMessage, onMessage, unloadOnUnmount } = this.props
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
        if (unloadOnUnmount) {
            UnityModule.reloadAfterUnload();
        }
    }

    componentWillUnmount(): void {
        const { unloadOnUnmount } = this.props;

        UnityModule.removeMessageListener(this.state.handle)

        if (unloadOnUnmount) {
            UnityModule.unload();
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

NativeUnityView = requireNativeComponent('RNUnityView', UnityView)

export default UnityView;
