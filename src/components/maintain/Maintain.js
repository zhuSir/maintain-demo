import React, { Component } from 'react';
import { Table, Button } from 'antd';
import { Link } from 'react-router';

const data = [];
for (let i = 0; i < 46; i++) {
    data.push({
        faultCode: i,
        projectName: `Edward King ${i}`,
        remarkReason: 32,
        faultType: `London, Park Lane no. ${i}`,
        createtime:'',
        equipName:'equip name',
        faultUserName:'lucy ',
    });
}

const columns = [{
    title: '报障单号',
    dataIndex: 'faultCode',
    key: 'faultCode'
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
    dataIndex: 'createtime',
    key: 'createtime'
},{
    title: '设备名称',
    dataIndex: 'equipName',
    key: 'equipName'
},{
    title: '报障人名称',
    dataIndex: 'faultUserName',
    key: 'faultUserName'
}];

class Maintain extends Component {
    state = {
        filteredInfo: null,
        sortedInfo: null,
    };

    render() {
        return (
            <div>
                <div className="table-operations" style={{ marginBottom: 16 }}>
                    <Button type="primary">添加报障</Button>
                </div>
                <Table columns={columns} dataSource={data} />
            </div>
        );
    }
}

export default Maintain;
