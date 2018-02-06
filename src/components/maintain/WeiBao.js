import React, { Component } from 'react';
import { Table, Button } from 'antd';
import { Link } from 'react-router';
import * as net from '../../util/common';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const columns = [{
    title: '维修单号',
    dataIndex: 'maintainCode',
    key: 'maintainCode'
}, {
    title: '项目名称',
    dataIndex: 'projectName',
    key: 'projectName'
}, {
    title: '报障内容',
    dataIndex: 'remarkReason',
    key: 'remarkReason'
},{
    title: '报障类型',
    dataIndex: 'faultType',
    key: 'faultType'
},{
    title: '创建时间',
    key: 'createtime',
    render:(text,record)=> (console.log(record),moment(record.createtime).format("YYYY-MM-DD HH:mm:ss"))
},{
    title: '设备名称',
    dataIndex: 'equipName',
    key: 'equipName'
},{
    title: '报障人名称',
    dataIndex: 'faultUserName',
    key: 'faultUserName'
}];

class WeiBao extends Component {

    constructor(){
        super();
        this.state={
            dataSource: []
        }
    }

    componentDidMount() {
        net.axiosPost("listMaintain", "maintainController", {}, net.guid()).then(
            response => {
                let data = response.data.data;
                this.setState({
                    dataSource: data
                })
            }
        ).catch(
            error => {
                net.httpError(error);
            }
        )
    }

    render() {
        return (
            <div>
                <Table rowKey='id' columns={columns} dataSource={this.state.dataSource} />
            </div>
        );
    }
}

export default WeiBao;
