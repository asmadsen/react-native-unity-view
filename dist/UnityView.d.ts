import * as React from 'react';
import { ViewProps } from 'react-native';
import MessageHandler from './MessageHandler';
import { Component } from 'react';
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
}
declare class UnityView extends Component<UnityViewProps> {
    state: {
        handle: any;
    };
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export default UnityView;
