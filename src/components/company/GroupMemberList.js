/**
 * Created by zhangzhifu on 2018/2/4.
 */
import React, {Component} from 'react';
import {Table, message} from 'antd';
import 'antd/dist/antd.css'
import * as common from '../../util/common.js';

class GroupMemberList extends Component {

    constructor() {
        super();
        this.state = {
            groupId: 83,
            userList: []
        }
    }


    userInfo(id, event) {
        alert(id)
    }

    componentDidMount() {
        let data = {
            groupId:this.state.groupId
        };

        common.axiosPost("listGroupMember", "groupControllrer", data, common.guid()).then(
            response => {
                this.setState({
                    userList: response.data.data.data
                })
            }
        ).catch(
            error => {
                console.log(error)
            }
        )
    }

    render() {
        const {userList} = this.state;
        const columns = [{
            title: '姓名',
            dataIndex: 'createName',
            key: 'createName',
            render: (text, record) => (<a onClick={this.userInfo.bind(this, record.id)}>{text}</a>),
        }, {
            title: '手机号',
            dataIndex: 'mobilephone',
            key: 'mobilephone',
        }, {
            title: '部门',
            dataIndex: 'groupName',
            key: 'groupName',
        }];

        return (
            <div className="container">
                <Table rowKey="id" columns={columns} dataSource={userList}/>
            </div>
        )
    }
}

export default GroupMemberList;