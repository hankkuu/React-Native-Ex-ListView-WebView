import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RootStackNavigator from './src/Navigation/RootStackNavigator';

export default class App extends React.Component {
  render() {
    return (
      <RootStackNavigator />
    );
  }
}


