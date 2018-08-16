import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    Image
} from "react-native";
import { getFormattedDate, getAvatarURL } from '../Util/Formatter';

class TopicListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topic: this.props.topic,
            poster: this.props.topic.posters[0]
        }
        //console.log(this.state.topic);

    }
    render() {
        const { topic,
            poster
        } = this.state;

        if (!topic.category) {
            topic.category = { color: 'ffffff' };
        }

        return (
            <View >
                <TouchableHighlight onPress={this.handleSelect} >
                    <View style={[styles.row, topic.pinned && styles.pinned]}>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{topic.title}</Text>
                            <View style={styles.metaContainer}>
                                <View style={[styles.category, { backgroundColor: '#' + topic.category.color }]}></View>
                                <Text style={styles.meta}>
                                    {topic.category.name} · {getFormattedDate(topic.created_at)} · {topic.views}명 읽음 · 댓글 {topic.posts_count - 1}개
                                </Text>
                            </View>
                        </View>
                        <Image style={styles.avatar} source={{uri:getAvatarURL(poster.avatar_template, 25)}} />
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    handleSelect = () => {
        //console.log(this.state.topic);
        //console.log("fffff");
        //const { topic } = this.state;
        return this.props.onSelect(this.props.topic);
    }
}
export default TopicListItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    row: {
        alignItems: 'stretch',
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        paddingTop: 12,
        paddingBottom: 10,
        borderBottomColor: '#eee',
        borderBottomWidth: 1
    },
    pinned: {
        backgroundColor: '#ffffcc'
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
        marginRight: 10
    },
    title: {
        flex: 1,
        fontSize: 14,
        marginBottom: 2
    },
    metaContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    meta: {
        color: '#777',
        fontSize: 12
    },
    avatar: {
        borderRadius: 12,
        width: 25,
        height: 25
    },
    category: {
        width: 8,
        height: 8,
        marginRight: 4,
        borderRadius: 4
    }
});