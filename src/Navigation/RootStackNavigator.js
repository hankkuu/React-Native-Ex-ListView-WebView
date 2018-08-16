import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";
import { createStackNavigator } from 'react-navigation';
import ListScreen from '../Screens/ListScreen';
import ItemScreen from '../Screens/ItemScreen';
import TopicScreen from '../Screens/TopicScreen';

class RootStackNavigator extends Component {
    render() {
        return (
            //<View style={styles.container}>
                <RootStack />
            //</View>
        );
    }
}
export default RootStackNavigator;

const RootStack = createStackNavigator({
    List: { screen: ListScreen },
    Item: { screen: ItemScreen },
    Topic: { screen: TopicScreen }
}, {
    intiRouteName: 'List',
    navigationOptions: {
        title: 'List View Tester'
    }
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});