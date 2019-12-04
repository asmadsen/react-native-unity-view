/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
    Button,
    Alert
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import UnityView, { UnityModule } from '@asmadsen/react-native-unity-view';

const App: () => React$Node = () => {
  const [count, setClickCount] = useState(0)
  console.log(count)
  const onUnityMessage = (hander) => {
    console.log({hander})
  }

  const onClick = () => {
      UnityModule.postMessageToUnityManager({
                                                name: 'ToggleRotate',
                                                data: '',
                                                callBack: (data) => {
                                                    Alert.alert('Tip', JSON.stringify(data))
                                                }
                                            });
  }


  return (
      <View  style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <UnityView
                style={{ flex: 1 }}
                onMessage={onUnityMessage}
                onUnityMessage={onUnityMessage}
            />
          </View>
        <Button style={{ width: '100%' }} title="Toggle rotation" onPress={onClick}/>

      </View>
  );
};

const styles = StyleSheet.create({
                                   scrollView: {
                                     backgroundColor: Colors.lighter,
                                   },
                                   engine: {
                                     position: 'absolute',
                                     right: 0,
                                   },
                                   body: {
                                     backgroundColor: Colors.white,
                                   },
                                   sectionContainer: {
                                     marginTop: 32,
                                     paddingHorizontal: 24,
                                   },
                                   sectionTitle: {
                                     fontSize: 24,
                                     fontWeight: '600',
                                     color: Colors.black,
                                   },
                                   sectionDescription: {
                                     marginTop: 8,
                                     fontSize: 18,
                                     fontWeight: '400',
                                     color: Colors.dark,
                                   },
                                   highlight: {
                                     fontWeight: '700',
                                   },
                                   footer: {
                                     color: Colors.dark,
                                     fontSize: 12,
                                     fontWeight: '600',
                                     padding: 4,
                                     paddingRight: 12,
                                     textAlign: 'right',
                                   },
                                 });

export default App;
