import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

class TopicScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topic: this.props.navigation.state.params
        }
        console.log(this.state.topic);        
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>TopicScreen</Text>
            </View>
        );
    }
}
export default TopicScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});