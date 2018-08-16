import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ProgressBarAndroid,
    Image,
    WebView
} from "react-native";
//import WebViewAndroid from 'react-native-webview-android';
import { getFormattedDate, getAvatarURL } from '../Util/Formatter';
import { HOST, API_LATEST, API_SITE, API_TOPIC } from '../../config';
import contentTemplate from '../Util/contentTemplate';
import WebIntent from 'react-native-webintent';

class TopicScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topic: this.props.navigation.state.params,
            posts: false,
            content: null,
            height: ''
        }
        //console.log(this.state.posts);
    }

    render() {

        // 게시물을 아직 불러오지 못한 상태면 액티비디 인디케이터를 화면에 표시한다
        if (!this.state.posts || this.state.posts.length === 0) {
            this.state.posts = [];
            this.state.content = <ProgressBarAndroid style={styles.loading} size='large' />
        }
        //console.log(this.state.posts);
        //console.log(this.state.content);

        return (
            <ScrollView>
                <View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{this.state.topic.title}</Text>
                        <View style={styles.metaContainer}>
                            <View style={[styles.category, { backgroundColor: '#' + this.state.topic.category.color }]}></View>
                            <Text style={styles.meta}>
                                {this.state.topic.category.name} · {getFormattedDate(this.state.topic.created_at)} · {this.state.topic.views}명 읽음
                        </Text>
                        </View>
                    </View>
                    {/* {this.state.content} */}
                    {this.state.posts.map(post => {
                        //console.log(post.cooked);
                        var ref = 'webview' + post.id;
                        return (
                            <View key={post.id} style={styles.post}>
                                <View style={styles.user}>
                                    <Image source={{ uri: getAvatarURL(post.avatar_template, 40) }} style={styles.avatar} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.username}>{post.username} / {post.name}</Text>
                                        <Text style={styles.username}>{getFormattedDate(post.created_at)}</Text>
                                    </View>
                                </View>
                                <WebView
                                    ref={ref}
                                    bounces={false}
                                    scrollEnabled={false}
                                    automaticallyAdjustContentInsets={false}
                                    onNavigationStateChange={ (state) => this.handleNavigationStateChange(state, ref)}
                                    style={[styles.webView, this.state[ref + 'Height'] && { height: this.state[ref + 'Height'] }]}
                                    //style={[styles.webView]} 
                                    source={{ html: this.overcook(post.cooked)}}
                                />
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        );
    }

    /**
   * componentDidMount()와 마찬가지로 이 메소드 역시 컴포넌트 인스턴스당 한 번만 발생하기 때문에
   * 1번만 실행하면 되는 동작을 위해 사용한다. fetch() 통신에 걸릴 시간을 감안해
   * componentDidMount()가 아닌componentWillMount()를 사용해 조금 더 빨리 불러오도록 했다.
   */
    componentWillMount() {
        fetch(HOST + API_TOPIC.replace('{id}', this.state.topic.id), { headers: { accept: 'application/json' } })
            .then(res => res.json())
            .then(data => {
                //console.log(data);
                this.setState({
                    posts: data.post_stream.posts
                });
            })
            .catch(reason => {
                console.log("catch!!!")
                console.log(reason);
            })
            .done();
    }

    /**
   * Native와 달리 컨텐츠의 높이에 접근할 수 있는 방법이 아직 없기때문에
   * 자바스크립트로 location.hash 값을 변경시켜 onNavigationStateChange 이벤트를 발생시키고
   * 그 때의 document.title을 JSON 형식으로 해석하여 메시지를 주고받는다.
   * 이 방식을 사용해 자동으로 높이 조절을 하거나, 외부 링크를 사파리로 여는 동작을 구현할 수 있다.
   */
    handleNavigationStateChange(navState, ref) {
        //console.log(navState.title.indexOf('!'));
        //console.log(ref);
        
        if (!navState.title || navState.title.indexOf('!') !== 0) 
            return;

        //console.log("22");
        var msg = JSON.parse(navState.title.substr(1));
        //console.log(msg.type);
        switch (msg.type) {
            case 'height':
                var state = {}; 
                state[ref + 'Height'] = msg.data;
                //console.log(state);
                this.setState(state);
                break;
            case 'link':
                if (/^https?:/i.test(msg.data)) {
                    WebIntent.open(msg.data);
                }
                break;
        }
    }

    overcook = (html) => {
        
        // 이미지 경로 수정
        html = html.replace(/\bsrc="\/\//g, 'src="http://');
        html = html.replace(/\bsrc="\/(?=[^\/])/, 'src="'+HOST+'/');
        //console.log("11111111111111111");
        //console.log(html);
        // support youtube
        html = html.replace(/<div .*?data-youtube-id="(.+?)"(.*?)><\/div>/g, ($0,id,$2) => {
          var width, height, ratio = 56.25; // 16:9 ratio
          if (width = /\b(?:data-)?width="(\d+)"/.exec($2)) {
            width = +width[1];
          }
          if (height = /\b(?:data-)?height="(\d+)"/.exec($2)) {
            height = +height[1];
          }
          if (width && height) {
            ratio = height/width * 100;
          }
    
          return `<div class="youtube-container" style="padding-bottom:${ratio}%"><iframe src="https://www.youtube.com/embed/${id}" frameborder="0"></iframe></div>`;
        });
        //console.log("222222222222222")
        //console.log(html);

        //onsole.log(contentTemplate);

        let resultHtml = contentTemplate.replace('{content}', html);

        //console.log("3333333333333333")
        //console.log(resultHtml);
    
        return resultHtml;
      }
}
export default TopicScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 16
    },
    titleContainer: {
        padding: 15,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1
    },
    category: {
        width: 8,
        height: 8,
        marginRight: 4,
        borderRadius: 4
    },
    metaContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5
    },
    meta: {
        color: '#777',
        fontSize: 12
    },
    loading: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 80
    },
    post: {
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#dddddd'
    },
    webView: {
        flex: 1,
        marginTop: 10,
        height: 5
    },
    avatar: {
        borderRadius: 20,
        width: 40,
        height: 40
    },
    user: {
        flex: 1,
        flexDirection: 'row'
    },
    username: {
        marginTop: 2,
        marginLeft: 10,
        fontSize: 13,
        color: '#333'
    },
    icon: {
        width: 40,
        height: 40,
        alignSelf: 'flex-end'
    }
});