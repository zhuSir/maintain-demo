import React, { Component } from 'react';
import {Table, Button, Modal, Form, Input,InputNumber,Transfer, Cascader,Radio, Divider, DatePicker, Menu, Dropdown, Icon,notification} from 'antd';
import * as net from '../../util/common';
import $ from 'jquery';
import * as areaHelper from '../../util/area';
const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;

const mockData = [];
for (let i = 0; i < 20; i++) {
    mockData.push({
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        disabled: i % 3 < 1,
    });
}

const targetKeys = mockData
    .filter(item => +item.key % 3 > 1)
    .map(item => item.key);

class Maintain extends Component {

    constructor(){
        super();
        this.state = {
            data:[],
            columns:[{
                title: '报障单号',
                dataIndex: 'faultCode',
                key: 'faultCode'
            }, {
                title: '项目名称',
                dataIndex: 'projectName',
                key: 'projectName'
            }, {
                title: '公司名称',
                dataIndex: 'companyName',
                key: 'companyName'
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
                dataIndex: 'username',
                key: 'username'
            }],
            formVisible: false,
            projectListVisible:false,
            equipListVisible:false,
            confirmLoading: false
        }
    }

    handleOk=()=>{
        this.setState({
            formVisible:false
        })
    }

    handleCancel=()=>{
        this.setState({
            formVisible:false
        })
    }

    handleAddFault=()=>{
        this.setState({
            formVisible:true
        })
    }

    handleCreate =() => {
        const form = this.form;
        form.validateFields((err, values) => {
                if (err) {
                    return
                }
                net.axiosPost('saveEquip', 'equipController', values, net.guid()).then(
                    response => {
                        form.resetFields();
                        this.setState({formVisible: false});
                    }
                ).catch(
                    error => {
                        net.httpError(error);
                        console.log(error)
                    }
                );
            }
        )
    }

    render() {
        // const data = [{"remarkReason":"1","faultCode":"1","createtime":1516740176000,"equipName":"新增设备","companyName":"第一个公司","faultType":"1","projectName":"测试项目创建","key":1,"username":"fafafd"}];

        return (
            <div>
                <div className="table-operations" style={{ marginBottom: 16 }}>
                    <Button type="primary" onClick={this.handleAddFault}>添加报障</Button>
                    <Modal title="添加报障信息"
                           visible={this.state.formVisible}
                           onOk={this.handleOk}
                           confirmLoading={this.state.confirmLoading}
                           onCancel={this.handleCancel}>

                            <FaultForm
                                // projectListVisible={this.state.projectListVisible}
                                //        handleProjectOk={this.handleProjectOk}
                                //        handleProjectCancel={this.handleProjectCancel}
                                //        handleAddProject={this.handleAddProject}
                            />

                    </Modal>
                </div>
                <Table columns={this.state.columns} dataSource={this.state.data} />
            </div>
        );
    }

    componentDidMount(){
        $.post("http://localhost:8080/fault/list",{id:1}).then(
            response =>(
                console.log('response body: ',response),
                this.setState({
                    data : response
                })
            ),
            error => console.log(error)
        )
    }
}

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 8},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
    },
};

class FaultFormObject extends Component{

    constructor(){
        super();
        this.state={
            selectedEquipName:"",
            projectObjectName:"",
            projectListVisible:false,
            equipListVisible:false,
            projectSelectVisible:false
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="vertical">
                <FormItem {...formItemLayout} label="维修人电话">
                    {getFieldDecorator('maintainTel')(
                        <Input type="text" placeholder="维修人电话"/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="维修人名称" >
                    {getFieldDecorator('maintainName')(<Input type="text" placeholder="维修人名称"/>)}
                </FormItem>
                <FormItem {...formItemLayout} label="维修说明">
                    {getFieldDecorator('reasonRemark')(
                        <TextArea placeholder="维修说明" autosize={{ minRows: 2, maxRows: 6 }} />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="选择项目">
                    {getFieldDecorator('project')(
                        <div>
                            <Input type="text" placeholder="未选择项目" defaultValue={this.state.projectObjectName}/>
                            <br/>
                            <Button onClick={this.handleAddProject}>选择项目</Button>
                            <ProjectTables
                                projectObject={this.selectProject}
                                projectListVisible={this.state.projectListVisible}
                                handleProjectOk={this.handleProjectOk}
                                handleProjectCancel={this.handleProjectCancel}
                            />
                        </div>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="选择设备">
                    {getFieldDecorator('equip')(

                        <div>
                            <Input type="text" placeholder="未选择设备" defaultValue={this.state.selectedEquipName}/>
                            <br/>
                            <Button onClick={this.handleAddEquips}>选择设备</Button>
                            <ProjectTables
                                projectObject={this.selectProject}
                                projectListVisible={this.state.projectListVisible}
                                handleProjectOk={this.handleProjectOk}
                                handleProjectCancel={this.handleProjectCancel}
                            />
                        </div>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="报障类型">
                    {getFieldDecorator('faultType')(
                        <input defaultValue={this.state.projectObjectName}/>
                    )}
                </FormItem>
            </Form>
        );
    }

    selectProject=(obj)=>{
        this.setState({
            projectObjectName:"aasssdfsdf",
            projectListVisible:false,
            projectSelectVisible:false,
        })
        console.log("projectObjectName",this.state.projectObjectName);
    }

    handleProjectCancel=()=>{
        this.setState({
            projectListVisible:false
        })
    }

    handleProjectOk=()=>{
        this.setState({
            projectListVisible:false
        })
    }

    handleAddProject=()=>{
        this.setState({
            projectListVisible:true
        })
    }

    handleAddEquips=()=>{
        this.setState({
            equipListVisible:true
        })
    }


}

const FaultForm = Form.create()(FaultFormObject);


class ProjectTables extends Component{
    constructor(){
        super();
        this.state={
            dataSource : [{
                key: '1',
                name: '胡彦斌',
                age: 32,
                address: '西湖区湖底公园1号'
            }, {
                key: '2',
                name: '胡彦祖',
                age: 42,
                address: '西湖区湖底公园1号'
            },{
                key: '3',
                name: '胡彦斌',
                age: 32,
                address: '西湖区湖底公园1号'
            }, {
                key: '4',
                name: '胡彦祖',
                age: 42,
                address: '西湖区湖底公园1号'
            },{
                key: '5',
                name: '胡彦斌',
                age: 32,
                address: '西湖区湖底公园1号'
            }, {
                key: '6',
                name: '胡彦祖',
                age: 42,
                address: '西湖区湖底公园1号'
            },{
                key: '7',
                name: '胡彦斌',
                age: 32,
                address: '西湖区湖底公园1号'
            }, {
                key: '8',
                name: '胡彦祖',
                age: 42,
                address: '西湖区湖底公园1号'
            },{
                key: '9',
                name: '胡彦斌',
                age: 32,
                address: '西湖区湖底公园1号'
            }, {
                key: '10',
                name: '胡彦祖',
                age: 42,
                address: '西湖区湖底公园1号'
            },{
                key: '11',
                name: '胡彦斌',
                age: 32,
                address: '西湖区湖底公园1号'
            }, {
                key: '12',
                name: '胡彦祖',
                age: 42,
                address: '西湖区湖底公园1号'
            }],
            columns : [{
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            }, {
                title: '年龄',
                dataIndex: 'age',
                key: 'age',
            }, {
                title: '住址',
                dataIndex: 'address',
                key: 'address',
            }]
        }
    }
    render(){
        const rowSelectionObject={
            onChange:this.handleChangeRow,
            type :"radio",
            fixed:true
        };
        return (
            <div>
                <Modal title="添加报障信息"
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

export default Maintain;