import * as React from 'react'
import { NativeModules, requireNativeComponent, View, ViewProps, ViewPropTypes } from 'react-native'
import * as PropTypes from 'prop-types'
import MessageHandler from './MessageHandler'
import { UnityModule, UnityViewMessage } from './UnityModule'
import { useEffect, useState } from 'react'

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

    children: React.ReactNode
}

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
    })

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

export default UnityView;

class oldUnityView extends React.Component<UnityViewProps> {
    public static propTypes = {
        ...ViewPropTypes,
        onMessage: PropTypes.func
    }

    private handle: number

    constructor (props) {
        super(props)
    }

    public componentWillMount () {
        this.handle = UnityModule.addMessageListener(message => {
            if (this.props.onUnityMessage && message instanceof MessageHandler) {
                this.props.onUnityMessage(message)
            }
            if (this.props.onMessage && typeof message === 'string') {
                this.props.onMessage(message)
            }
        })
    }

    public componentWillUnmount () {
        UnityModule.removeMessageListener(this.handle)
    }

    public render () {
        const { onUnityMessage, onMessage, ...props } = this.props
        return (
            <View {...props}>
                <NativeUnityView
                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                    onUnityMessage={onUnityMessage}
                    onMessage={onMessage}
                >
                </NativeUnityView>
                {this.props.children}
            </View>
        )
    }
}

const NativeUnityView = requireNativeComponent('UnityView', UnityView)
