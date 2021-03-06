/**
 * Created by zhangzhifu on 2018/2/2.
 */
import React, {Component} from 'react';
import {Table, Button, message} from 'antd';
import 'antd/dist/antd.css'
import * as common from '../../util/common.js';


class MemberList extends Component {

    constructor() {
        super();
        this.state = {
            companyID: common.getCookie("companyId"),
            userList: []
        }
    }

    handleDele(id, event) {
        if(common.getCookie("isConpanyLeader")==0)
        {
            message.error("您没有权限删除成员")
            return;
        }
        const userList = [...this.state.userList];

        let data = {
            id: id
        };

        common.axiosPost("deleteGroupUser", "userController", data, common.guid()).then(
            response => {
                let res = response.data.data;
                if (res.code == 0) {
                    message.success(res.info)
                    this.setState({
                        userList: userList.filter(item => item.id !== id)
                    });
                } else if (res.code == 1) {
                    message.warning(res.info)
                }
            }
        ).catch(
            error => {
                console.log(error)
            }
        )
    }

    userInfo(id, event) {
        var path = {
            pathname: '/userinfo',
            state: id,
        }
        this.props.history.push(path);
    }

    componentDidMount() {
        let data = {
            companyId: this.state.companyID
        };

        common.axiosPost("listCompanyMember", "groupControllrer", data, common.guid()).then(
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
            title: '编辑',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Button type="primary" style={{ marginRight: 16 }} onClick={this.handleDele.bind(this, record.id)}>删除</Button>
                    <Button type="primary" onClick={this.userInfo.bind(this, record.id)} >查看详情</Button>
                </div>

            ),
        }];

        return (
            <div className="container">
                <Table rowKey="id" columns={columns} dataSource={userList}/>
            </div>
        )
    }
}

export default MemberList;