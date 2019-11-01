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
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import UnityView from '@asmadsen/react-native-unity-view';

const App: () => React$Node = () => {
  const [count, setClickCount] = useState(0)
  console.log(count)
  const onUnityMessage = (hander: MessageHandler) => {
    setClickCount(count + 1)
    setTimeout(() => {
      hander.send('I am click callback!');
    }, 2000);
  }


  return (
      <View
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      >
        <UnityView
            style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
            onMessage={onUnityMessage}
        />
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
