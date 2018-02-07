import React, { Component } from 'react';
import {Table, Modal} from 'antd';
import * as net from '../../util/common';

class EquipTables extends Component{
    constructor(){
        super();
        this.state={
            dataSourc:[],
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
            },{
                title: '设备详情',
                dataIndex: 'equipDetail',
                key: 'equipDetail',
            }]
        }
    }

    componentDidMount(){
        net.axiosPost("listEquip", "equipController", {}, net.guid()).then(
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

    render(){
        const rowSelectionObject={
            onChange:this.handleChangeRow,
            type :"radio",
            fixed:true
        };
        return (
            <div>
                <Modal title="添加关联项目"
                       visible={this.props.equipListVisible}
                       onOk={this.props.handleEquipOk}
                       onCancel={this.props.handleEquipCancel}
                >
                    <Table dataSource={this.state.dataSource} columns={this.state.columns} rowSelection={rowSelectionObject} />
                </Modal>
            </div>

        );
    }
    handleChangeRow=(event)=>{
        const index = event[0];
        const equipObj = this.state.dataSource[index];
        this.props.equipObject(equipObj);
    }
}

export default EquipTables;