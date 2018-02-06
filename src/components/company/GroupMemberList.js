/**
 * Created by zhangzhifu on 2018/2/4.
 */
import React, {Component} from 'react';
import {Table, message,Button } from 'antd';
import 'antd/dist/antd.css'
import * as common from '../../util/common.js';

class GroupMemberList extends Component {

    constructor(event) {
        super(event);

        this.state = {
            groupId: this.props.groupid,
            userList: []
        }
    }

    lookDetail(id, event) {
        alert(id)
    }

    componentDidMount() {
        console.log(this.props.groupid)

        let data = {
            groupId:this.props.groupid
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
        }, {
            title: '手机号',
            dataIndex: 'mobilephone',
            key: 'mobilephone',
        }, {
            title: '部门',
            dataIndex: 'groupName',
            key: 'groupName',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Button type="primary" onClick={this.lookDetail.bind(this, record.id)}>查看详情</Button>
            ),
        }];

        return (
            <Table rowKey="id" columns={columns} dataSource={userList}/>
        )
    }
}

export default GroupMemberList;