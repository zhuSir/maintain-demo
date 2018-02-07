import React, { Component } from 'react';
import {Table, Button, Modal, Form, Input, message,Radio,} from 'antd';
import * as net from '../../util/common';
import $ from 'jquery';
import moment from 'moment';
import 'moment/locale/zh-cn';
import EquipTables from './EquipTables';
import ProjectTables from './ProjectTables'

const FormItem = Form.Item;
const { TextArea } = Input;
moment.locale('zh-cn');


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
                title: '报障内容',
                dataIndex: 'remarkReason',
                key: 'remarkReason'
            },{
                title: '设备名称',
                dataIndex: 'equipName',
                key: 'equipName'
            },{
                title: '报障人名称',
                dataIndex: 'username',
                key: 'username'
            },{
                title: '报障类型',
                dataIndex: 'faultType',
                key: 'faultType'
            },{
                title: '创建时间',
                dataIndex: 'createtime',
                key: 'createtime',
                render:(text,record)=> (moment(record.createtime).format("YYYY-MM-DD HH:mm:ss"))
            }],
            projectId:0,
            equipId:0,
            formVisible: false,
            projectListVisible:false,
            equipListVisible:false,
            confirmLoading: false
        }
    }

    handleOk=()=>{
        const form = this.form;
        form.validateFields((err, values) => {
            console.log("error message: ",err,values);
            if (err) {
                return
            }
            values.projectId =this.state.projectId;
            values.equipId =this.state.equipId;
            if(!values.maintainPhone){
                message.error("请输入维修人电话号码");
                return ;
            }
            if(!values.maintainName){
                message.error("请输入维修人姓名");
                return ;
            }
            if(!values.remarkReason){
                message.error("请输入报修信息");
                return ;
            }
            if(values.equipId === 0){
                message.error("请选择报修设备");
                return ;
            }
            if(values.projectId ===0 ){
                message.error("请选择报修项目");
                return ;
            }
            if(!values.faultType){
                message.error("请选择报修类型");
                return ;
            }
            values.faultUserId=net.getCookie("userId");
            $.post("http://localhost:8080/fault/add",values).then(
                response=>{
                    message.success(response);
                    this.setState({
                        formVisible:false
                    })
                },
                error => console.log(error)
            )
            }
        )
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

    setEquipId=(id)=>{
        this.setState({
            equipId:id
        })
    }

    setProjectId=(id)=>{
        this.setState({
            projectId:id
        })
    }

    render() {
        return (
            <div>
                <div className="table-operations" style={{ marginBottom: 16 }}>
                    <Button type="primary" onClick={this.handleAddFault}>添加报障</Button>
                    <Modal title="添加报障信息"
                           visible={this.state.formVisible}
                           onOk={this.handleOk}
                           confirmLoading={this.state.confirmLoading}
                           onCancel={this.handleCancel}>

                            <FaultForm ref={this.saveFormRef} setEquipId={this.setEquipId} setProjectId={this.setProjectId}/>

                    </Modal>
                </div>
                <Table columns={this.state.columns} dataSource={this.state.data} />
            </div>
        );
    }

    saveFormRef = (form) => {
        this.form = form;
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
            equipObject:{},
            projectObject:{},
            projectListVisible:false,
            equipListVisible:false,
            faultType:1
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="vertical">
                <FormItem {...formItemLayout} label="维修人电话">
                    {getFieldDecorator('maintainPhone')(
                        <Input type="text" placeholder="维修人电话"/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="维修人名称" >
                    {getFieldDecorator('maintainName')(<Input type="text" placeholder="维修人名称"/>)}
                </FormItem>
                <FormItem {...formItemLayout} label="维修说明">
                    {getFieldDecorator('remarkReason')(
                        <TextArea placeholder="维修说明" autosize={{ minRows: 2, maxRows: 6 }} />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="选择项目">
                    {getFieldDecorator('projectId')(
                        <div>
                            <Input placeholder="未选择项目" value={this.state.projectObject.name}/>
                            <br />
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
                    {getFieldDecorator('equipId')(
                        <div>
                            <Input type="text" placeholder="未选择设备" value={this.state.equipObject.equipName}/>
                            <br />
                            <Button onClick={this.handleAddEquips}>选择设备</Button>
                            <EquipTables
                                equipObject={this.selectEquip}
                                equipListVisible={this.state.equipListVisible}
                                handleEquipOk={this.handleEquipOk}
                                handleEquipCancel={this.handleEquipCancel}
                            />
                        </div>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="报障类型">
                    {getFieldDecorator('faultType')(
                        <Radio.Group>
                            <Radio value={1} checked={true}>一遍</Radio>
                            <Radio value={2}>紧急</Radio>
                            <Radio value={3}>特急</Radio>
                        </Radio.Group>
                    )}
                </FormItem>
            </Form>
        );
    }


    selectProject=(obj)=>{
        this.setState({
            projectObject:obj
        });
        this.props.setProjectId(obj.id);
    }
    selectEquip=(obj)=>{
        this.setState({
            equipObject:obj
        });
        this.props.setEquipId(obj.id);
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
    handleEquipCancel=()=>{
        this.setState({
            equipListVisible:false
        })
    }
    handleEquipOk=()=>{
        this.setState({
            equipListVisible:false
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

export default Maintain;