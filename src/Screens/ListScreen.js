import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    ListView,
    ProgressBarAndroid
} from "react-native";
import TopicListItem from '../Items/TopicListItem';
import TopicScreen from './TopicScreen';
import { StackAction } from 'react-navigation';
import { HOST, API_LATEST, API_SITE } from '../../config'

class ListScreen extends Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1.id !== r2.id });

        let secondArr = [];
        for (let i = 1; i < 100; i++)
            secondArr.push({ title: 'Sample Title' + i, sub: 'Write your message here.', txt: "힘있다 이것" });

        this.state = {
            user: {},
            topics: [],
            categories: null,
            _prevY: 0,
            currentPage: 0,
            reloading: false,
            loadingNextPage: false,
            ds: dataSource.cloneWithRows(secondArr)
        }
        
    }
    render() {
        return (
            
            <ListView style={styles.listView}
                ref="listView"
                scrollEventThrottle={10}
                removeClippedSubviews={true}
                dataSource={this.state.ds}
                renderRow={this.renderTopic}
                renderHeader={this.renderHeader}
                renderFooter={this.renderFooter}
                onScroll={this.handleScroll}
                onEndReached={this.handelEndReached}
            >
            </ListView>
            
        );
    }

    componentDidMount() {
        if (this.state.topics.length === 0) {
          this.reloadTopics();
        }
      }

    renderTopic = (topic) => {
        //console.log(topic);
        return <TopicListItem topic={topic} onSelect={this.selectTopic} />;
    }

    selectTopic = (topic) => {
        // NavigatorIOS 컴포넌트의 자식 컴포넌트에는 navigator 객체가 프로퍼티로 전달된다.
        // 주제를 클릭할 때 navigator 객체에 push 메소드를 이용해 새 라우터를 추가해주면
        // 자동으로 다음 페이지로 이동한다.
        // this.props.navigation.push({
        //     id: 'Item',
        //     routeName: TopicScreen,
        //     title: '',
        //     passProps: { topic: topic }
        // })
        //console.log(topic);
        this.props.navigation.push('Topic', topic)
    }

    handleScroll = (event) => {
        let posY = event.nativeEvent.contentOffset.y;    
          
        if (posY < this._prevY && posY < -100) {    
            console.log("reload start");          
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

    /**
   * 원격 API로부터 JSON 데이터를 가져오고 Promise 인스턴스를 반환한다.
   *
   * 타입체커에서 확인할 수 있도록 page 인수의 타입을 number로 설정했다.
   * page 뒤에 붙은 ? 표시는 이 값이 생략될 수도 있다는 뜻이다.
   */
    loadPage(page) {
        var url = (page === undefined) ? this.moreURL : API_LATEST.replace('{page}', page);
        var jsonHeader = {headers:{Accept:'application/json'}};

        var req = fetch(HOST + url, jsonHeader).then(res => res.json());

        return Promise.all([req, this.loadCategories()])
            .then(([data, categories]) => {
                
                data.users.forEach(user => {
                    this.users[user.id] = user;
                });

                var topics = data.topic_list.topics.map(topic => {
                    topic = _.pick(topic, 'id', 'title', 'posters', 'category_id', 'pinned', 'created_at', 'posts_count', 'views');
                    topic.posters.map((poster) => _.extend(poster, this.users[poster.user_id]));
                    topic.category = this.state.categories[topic.category_id];

                    return topic;
                });

                this.moreURL = data.topic_list.more_topics_url;
                this.state.topics = (page === 0 ? [] : this.state.topics).concat(topics);
                this.setState({
                    currentPage: page,
                    ds: this.state.dataSource.cloneWithRows(this.state.topics)
                });
            })
            .catch(reason => {
                console.log(reason);
            });
    }

    // 카테고리 정보를 불러온다.
    // 이미 불러왔으면 바로 resolve된 Promise 인스턴스를 반환한다.
    loadCategories() {
        if (this.state.categories) {
            return Promise.resolve(this.state.categories);
        } else {
            var jsonHeader = {headers:{Accept:'application/json'}};
            return fetch(HOST + API_SITE, jsonHeader).then(res => res.json()).then(data => {
                this.state.categories = {};
                data.categories.forEach(cate => this.state.categories[cate.id] = cate);
                return this.state.categories;
            });
        }
    }

    handleEndReached() {
        console.log("sdfsdf");
        if (this.state.loadingNextPage)
            return;

        Promise.all([
            this.loadPage(),
            new Promise(resolve => this.setState({ loadingNextPage: true }, resolve)),
            new Promise(resolve => setTimeout(() => resolve(), 1000)),
        ]).then(() => this.setState({ loadingNextPage: false }));
    }

    renderHeader = () => {
        const { reloading } = this.state;
        if (!reloading) 
            return null;

        return (
            <View style={styles.loadingIndicator}>
                <ProgressBarAndroid size="small" />
            </View>
        );
    }

    renderFooter = () => {
        const { reloading, loadingNextPage } = this.state;
        if (!loadingNextPage || reloading) 
            return null;

        return (
            <View style={styles.loadingIndicator}>
                <ProgressBarAndroid size="small" />
            </View>
        );
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