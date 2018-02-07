import React, { Component } from 'react';
import {Table, Modal} from 'antd';
import $ from 'jquery';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

class ProjectTables extends Component{
    constructor(){
        super();
        this.state={
            dataSourc:[],
            columns : [{
                title: '项目名称',
                dataIndex: 'name',
                key: 'name',
            }, {
                title: '项目负责人',
                dataIndex: 'managerName',
                key: 'managerName',
            }, {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                render:(text,record)=> (moment(record.createTime).format("YYYY-MM-DD HH:mm:ss"))
            }, {
                title: '项目状态',
                dataIndex: 'projectState',
                key: 'projectState',
            }]
        }
    }

    componentDidMount(){
        $.post("http://localhost:8080/project/select",{uId:1}).then(
            response=>{
                if(response.code == 1){
                    this.setState({
                        dataSource : response.data
                    })
                }
            },
            error => console.log(error)
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
                       visible={this.props.projectListVisible}
                       onOk={this.props.handleProjectOk}
                       onCancel={this.props.handleProjectCancel}
                >
                    <Table dataSource={this.state.dataSource} columns={this.state.columns} rowSelection={rowSelectionObject} />
                </Modal>
            </div>

        );
    }
    handleChangeRow=(event)=>{
        const index = event[0];
        const projectObj = this.state.dataSource[index];
        this.props.projectObject(projectObj);
    }
}

export default ProjectTables;