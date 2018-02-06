/**
 * Created by zhangzhifu on 2018/2/5.
 */
import React, {Component} from 'react';
import * as net from '../util/common';
import Login from "../components/login/Login";
import Main from './Main';

class ChangePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: net.getCookie("userId"),
            changeType: net.getCookie("userId") == "0"|| net.getCookie("userId") == null? 1 : 0//未登陆
        }
    }

    changePage(data) {
        this.setState({
            changeType: data
        })
    }

    render() {
        if (this.state.changeType == 0) {
            return <Main/>
        } else if (this.state.changeType == 1) {
            return <Login jumpToMain={this.changePage.bind(this)}/>
        }
    }
}

export default ChangePage;