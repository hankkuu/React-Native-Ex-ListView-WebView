import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    ListView,
    ProgressBarAndroid
} from "react-native";

class ListScreen extends Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1.id !== r2.id });
        this.state = {
            user: {},
            topics: [],
            categories: null,
            _prevY: 0,
            currentPage: 0,
            reloading: false,
            loadingNextPage: false
        }
    }
    render() {
        return (
            <ListView style={styles.listView}
                ref="listView"
                scrollEventThrottle={10}
                removeClippedSubviews={true}
                dataSource={}
                renderRow={this.renderTopic}
                renderHeader={}
                renderFooter={}
                onScroll={this.handleScroll}
                onEndReached={this.handelEndReached}
            >
            </ListView>
        );
    }

    renderTopic = (topic) => {
        return <TopicListItem topic={topic} onSelect={this.selectTopic} />;
    }

    selectTopic = (topic) => {
        // NavigatorIOS 컴포넌트의 자식 컴포넌트에는 navigator 객체가 프로퍼티로 전달된다.
        // 주제를 클릭할 때 navigator 객체에 push 메소드를 이용해 새 라우터를 추가해주면
        // 자동으로 다음 페이지로 이동한다.
        this.props.navigation.push({
            id: 'Item',
            component: TopicView,
            title: '',
            passProps: { topic: topic }
        })
    }

    renderHeader() {
        if (!this.state.reloading) return null;

        return (
            <View style={styles.loadingIndicator}>
                <ProgressBarAndroid size="small" />
            </View>
        );
    }

    handleScroll = (event) => {
        let posY = event.nativeEvent.contentOffset.y;
        if (posY < this._prevY && posY < -100) {
            this.reloadTopics();
        }
        this._prevY = posY;
    }

    reloadTopics() {
        if (this.state.reloading)
            return;

        Promise.all([
            this.loadPage(0),
            new Promise(resolve => this.setState({ reloading: true }, resolve)),
            new Promise(resolve => setTimeout(() => resolve(), 1500))
        ]).then(() => this.setState({ reloading: false }));
    }

    handleEndReached() {
        if (this.state.loadingNextPage)
            return;

        Promise.all([
            this.loadPage(),
            new Promise(resolve => this.setState({ loadingNextPage: true }, resolve)),
            new Promise(resolve => setTimeout(() => resolve(), 1000)),
        ]).then(() => this.setState({ loadingNextPage: false }));
    }
}
export default ListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    listView: {
        backgroundColor: '#eee'
    },
});