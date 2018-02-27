/**
 * Created by zhangzhifu on 2018/2/8.
 */
import React, {Component} from 'react';
import {Card, Col, Row} from 'antd';
import 'antd/dist/antd.css'
import * as common from '../../util/common.js';

class UserInfo extends Component {

    constructor(event) {
        super(event);
        this.state = {
            companyName: common.getCookie("companyName"),
            createName: "",
            mobilephone: "",
            groupName: "",
            authorityList: [],
            authorityListText: [],
        }

        common.axiosPost("getAllList", "authorityController", "", common.guid()).then(
            response => {
                this.setState({
                    authorityList: response.data.data
                })
            }
        ).catch(
            error => {
                console.log(error)
            }
        )
    }

    componentDidMount() {
        var id = this.props.location.state;

        let data = {
            userID: id
        };

        let data2 = {
            userId: id
        };

        common.axiosPost("getUserById", "userController", data2, common.guid()).then(
            response => {
                this.setState({
                    createName: response.data.data.createName,
                    mobilephone: response.data.data.mobilephone,
                    groupName: response.data.data.groupName,
                })
            }
        ).catch(
            error => {
                console.log(error)
            }
        )

        common.axiosPost("getGroupAuIDWithUserID", "authorityController", data, common.guid()).then(
            response => {
                const resList = response.data.data;

                for (var index = 0; index < this.state.authorityList.length; index++) {
                    for (var value of resList) {
                        if (index == (value - 1)) {
                            this.state.authorityListText.push(this.state.authorityList[index])

                            this.setState({
                                authorityListText: this.state.authorityListText
                            })
                        }
                    }
                }
            }
        ).catch(
            error => {
                console.log(error)
            }
        )
    }

    render() {
        return (
            <div style={{background: '#ECECEC', padding: '30px'}}>
                <Row gutter={16}>
                    <Col span={8}>
                        <Card title="个人信息" bordered={false}>
                            <div >
                                <p >姓名：<span id="name">{this.state.createName}</span></p>
                                <p >手机：<span id="phone">{this.state.mobilephone}</span></p>
                                <p >公司：<span id="company">{this.state.companyName}</span></p>
                            </div>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="所属部门" bordered={false}>
                            <p >部门：<span
                                id="groupName">{this.state.groupName == "" ? "暂无部门" : this.state.groupName}</span></p>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="部门权限" bordered={false}>
                            <div>
                                {this.state.authorityListText.map((record) =>
                                    <p><span>{record.name}</span></p>)
                                }
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default UserInfo;