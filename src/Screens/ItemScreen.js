import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

class ItemScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>ItemScreen</Text>
            </View>
        );
    }
}
export default ItemScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});