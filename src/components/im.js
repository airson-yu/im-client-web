import axios from 'axios';
import Qs from 'qs';
//import SockJS from 'sockjs-client';
//import Stomp from 'stompjs';
import {Container, Main, Row, Col, Button, Header, Footer, Input} from "element-ui";

export default {
    name: 'IM',
    components: {
        Container, Main, Row, Col, Button, Header, Footer, Input
    },
    data() {
        return {
            im_list: [],
            uid: null,
            receiver: null,
            account: 'airson',
            password: '123123',
            token: null,
            text_content: null
        }
    },
    props: {
        msg: String
    },
    mounted: function () {
        //this.initWebSocket();
    },
    beforeDestroy: function () {
        // 页面离开时断开连接,清除定时器
        this.disconnect();
    },
    methods: {
        initWebSocket() {
            let that = this;
            that.socket && that.socket.close();
            that.connection();
        },
        disconnect() {
            let that = this;
            that.socket && that.socket.close();
        },
        connection() {
            let that = this;
            //let token = new Date().getTime();
            //that.uid = token;
            if (!that.uid) {
                console.log("请设置你自己的ID，随便填写一个1-1000的整数");
                return;
            }
            that.token = that.uid;
            //let url = 'ws://localhost:9990/ws/im/' + that.token;
            let url = 'ws://172.81.216.81:8081/ws/ws/im/' + that.token;
            that.socket = new WebSocket(url);
            //连接打开事件
            that.socket.onopen = function () {
                //console.clear();
                console.info("ws onopen");
                //that.socket.send("消息发送测试(From Client)");
            };
            //收到消息事件
            that.socket.onmessage = function (msg) {
                //console.log(msg.data);
                that.receive_msg(msg);
            };
            //连接关闭事件
            that.socket.onclose = function () {
                //console.clear();
                console.warn("ws onclose");
            };
            //发生了错误事件
            that.socket.onerror = function (ev) {
                //console.clear();
                console.warn("ws onerror:", ev);
                //alert("Socket发生了错误");
            }
            window.unload = function () {
                //console.clear();
                that.disconnect();
            }
        },
        //----------------------------------------------------
        login() {
            let that = this;
            let url = 'http://localhost:8880/v1/auth/login';
            let param = {account: that.account, password: that.password};
            axios.post(url, Qs.stringify(param)).then(function (response) {
                let rsp = response.data;
                if (rsp && rsp.success) {
                    console.log(rsp.uid);
                    that.uid = rsp.uid;
                    that.token = rsp.token;
                    that.connection();
                } else {
                    console.log(rsp);
                }
            }).catch(function (err) {
                console.log(err)
            });
        },
        send_im_msg() {
            let that = this;
            if (!that.receiver) {
                console.log("请设置对方的ID");
                return;
            }
            that.append_im_msg();
            that.text_content = '';
        },
        append_im_msg() {
            let that = this;
            let content = that.text_content;
            let data = {
                'content': content,
                'ts': new Date().getTime(),
                'state': 1, //1:local_append, 11:sending_to_server 21:sent_to_server_success 21:sent_to_server_failure
                'receiver': that.receiver,
                'sender': that.uid
            }
            //let ary_len = that.im_list.push(data);
            //that.remote_send_msg(data, ary_len);
            that.remote_send_msg(data);
            console.log('send:', content);
        },
        receive_msg(msg) {
            //let that = this;
            //console.clear();
            console.log("receive:", JSON.parse(msg.data).content);
            //that.im_list.push(JSON.parse(msg.data));
        },
        clear() {
            let that = this;
            that.im_list = [];
            console.clear();
        },
        remote_send_msg(data) { //, ary_len
            let that = this;
            try {
                /*let index = ary_len - 1;
                that.im_list[index].state = 11;*/
                let msg = JSON.stringify(data);
                //that.stompClient.send("/app/chat", {}, msg);
                that.socket.send(msg);
            } catch (err) {
                console.log("断线了: " + err);
                that.connection();
            }
        }

        /*connection() {
            let that = this;
            // way 2: base on stomp
            // 建立连接对象
            let url = 'http://localhost:8888/chat';
            this.socket = new SockJS(url);//连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
            // 获取STOMP子协议的客户端对象
            this.stompClient = Stomp.over(this.socket);
            // 定义客户端的认证信息,按需求配置
            var headers = {
                login: 'mylogin',
                passcode: 'mypasscode',
                // additional header
                'client-id': 'my-client-id'
            };
            // 向服务器发起websocket连接
            this.stompClient.connect(headers, (frame) => {
                this.stompClient.subscribe('/topic/greetings', (msg) => { // 订阅服务端提供的某个topic
                    console.log(msg.body);  // msg.body存放的是服务端发送给我们的信息
                    console.log(frame);
                });
            }, (err) => {
                // 连接发生错误时的处理函数
                console.log(err);
            });

        },
        disconnect() {// 断开连接
            if (this.stompClient != null) {
                this.stompClient.disconnect();
                console.log("Disconnected");
            }
        },*/

        /*remote_send_msg(data, ary_len) {
            let that = this;
            let index = ary_len - 1;
            that.im_list[index].state = 11;
            //let param = JSON.stringify(data);
            // https://www.kancloud.cn/yunye/axios/234845
            // https://blog.csdn.net/LostSh/article/details/68923874
            // https://www.cnblogs.com/small-coder/p/9115972.html
            // 当Ajax以application/x-www-form-urlencoded格式上传即使用JSON对象，后台需要使用@RequestParam 或者Servlet获取。 当Ajax以application/json格式上传即使用JSON字符串，后台需要使用@RquestBody获取。
            let url = 'http://localhost:8888/v1/im/json/send';
            let param = data;
            //axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
            axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
            axios.post(url, param).then(function (response) {
                if (response && response.success) {
                    that.im_list[index].state = 20;
                } else {
                    that.im_list[index].state = 21;
                }
            }).catch(function (err) {
                console.log(err)
            });
        }*/
    }
}
