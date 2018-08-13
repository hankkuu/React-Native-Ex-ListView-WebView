import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";
import ListScreen from '../Screens/ListScreen';
import ItemScreen from '../Screens/ItemScreen';

class RootStackNavigator extends Component {
    render() {
        return (
            <View style={styles.container}>
                <RootStack />
            </View>
        );
    }
}
export default RootStackNavigator;

const RootStack = createStackNavigation({
    List: { screen: ListScreen },
    Item: { screen: ItemScreen }
}, {
    intiRouteName: List
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});