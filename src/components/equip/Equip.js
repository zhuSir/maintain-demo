/**
 * Created by BinYiChen on 2018/2/1.
 */
import {Table} from 'antd';
import 'antd/dist/antd.css';
import React, {Component} from 'react';
import * as net from '../../util/common';

class Equip extends Component {

    constructor() {
        super();
        this.state = {
            dataSource: [],
            columns: [{
                title: '设备名称',
                dataIndex: 'equipName',
                key: 'equipName',
            }, {
                title: '设备编号',
                dataIndex: 'equipCode',
                key: 'equipCode',
            }, {
                title: '设备型号',
                dataIndex: 'equipModel',
                key: 'equipModel',
            }]
        }
    }

    componentDidMount() {
        net.axiosPost("listEquip", "equipController", {}, net.guid()).then(
            response => {
                let data = response.data.data;
                console.log(data);
                this.setState ({
                    dataSource: data
                })
                console.log(this.state.dataSource)
            }
        ).catch(
            error => console.log(error)
        )
    }

    render() {
        return (
            <div>
                <Table rowKey='id' dataSource={this.state.dataSource} columns={this.state.columns}/>
            </div>
        )
    }
}

export default Equip;