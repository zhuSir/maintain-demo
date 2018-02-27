import React, { Component } from 'react';
import { Pagination } from 'antd';
import { Spin } from 'antd';

import { Icon,Menu } from 'antd';
import { Modal } from 'antd';
import { Input } from 'antd';

import { Popconfirm, message, Button } from 'antd';

import {Table} from 'antd';
import  * as common from '../../util/common'


const ButtonGroup = Button.Group;
const menu = (

    <Menu onClick={handleMenuClick}>
        <Menu.Item key="1">1st item</Menu.Item>
        <Menu.Item key="2">2nd item</Menu.Item>
        <Menu.Item key="3">3rd item</Menu.Item>
    </Menu>
);

//录入成功提示===========
function success(title) {
    Modal.success({
        title: '提示',
        content: title,
    });
}

function AlertError(title) {
    Modal.error({
        title: '提示',
        content: title,
    });
}

function handleMenuClick(e) {
    console.log('click', e);
}


const data = [];
// for (let i = 0; i < 19; i++) {
//     data.push({
//         key: i.toString(),
//         mobilephone: `老李 ${i}`,
//         createName: `福建${i}`,
//     });
// }

const EditableCell = ({ editable, value, onChange }) => (
    <div>
        {editable ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} /> : value}
    </div>
);

export default  class RolePage extends Component{

    constructor(props)
    {
        super(props)
        this.state = {
            responData:[],
            isLoad:false,


            beforData:[],
            searchText:'',
            rolecode:'',
            rolename:''
        }

        //初始化的时候就请求数据======================
         this.checkRole();
         this.requestPersons();
    }

    checkRole =() =>{

        let para = {id:'1'};
        common.axiosPost("selectUserInfoByRoleId","roleController",para,common.guid()).then(responseObj =>{

            let res = responseObj.data.data;
            if (res.error == null) {

            }else if(res.code == 1) {

            }
        }).catch(error =>{

                this.setState({
                    responData : [],
                    isLoad:false
                });
                AlertError("网络崩溃了，请重新加载。。。。。")
            }
        );
    }


    // 网络请求  请求角色接口 =======================================
    requestPersons =() =>{

        let para = {};
        common.axiosPost("getAllRoles","roleController",para,common.guid()).then(responseObj =>{
            let res = responseObj.data.data;
            if (res.error == null) {
                message.success(res.info);
                this.setState({
                    responData : res,
                    isLoad:true,
                    beforData:res
                });
            }else if(res.code == 1) {

                message.warning(res.info)

            }
        }).catch(error =>{

            this.setState({
                responData : [],
                isLoad:false
            });
            AlertError("网络崩溃了，请重新加载。。。。。")
            }
        );
    }
    //删除角色的接口======
    deleteRole =(index) => {

        let obj = this.state.responData[index];
        const para = {id:obj.id};
        common.axiosPost("deleteRole","roleController",para,common.guid()).then(responseObj =>{
            let res = responseObj.data.data;
            if (res.error == null) {
                success('删除成功');
                this.setState({
                    responData : res
                });
            }else if(res.code == 1) {

                message.warning(res.info)
            }
        }).catch(error =>{

            AlertError('删除失败');
            }
        );
    }

    //添加角色接口==========
    addRole = (role) => {

        common.axiosPost("addRole","roleController",role,common.guid()).then(responseObj =>{
            let res = responseObj.data.data;
            if (res.error == null) {

                success('录入成功');
                this.setState({
                    responData : res
                });
            }
        }).catch(error =>{

            AlertError('录入失败');
            }
        );
    }

    //提交表单的请求求确定按钮=============
    state = {
        ModalText: 'Content of the modal',
        surevisible: false,
        confirmLoading: false,
    }
    showSureModal = () => {
        this.setState({
            surevisible: true,
        });
    }

    //提交录入的驱动按钮
    handleSureOk = (values) => {

        this.setState({
            confirmLoading: true,
        });

        setTimeout(() => {

            this.setState({
                surevisible: false,
                confirmLoading: false,
            });

            const rolename = this.state.rolename
            const rolecode = this.state.rolecode
            if(rolename.length == 0 || rolecode.length == 0){
                AlertError("角色名字和编码不能为空")
                return
            }

            let value = {
                rolename:rolename,
                rolecode:rolecode
            }
            //请求添加===========
            this.addRole(value)


        }, 2000);
    }
    handleSureCancel = () => {
        this.setState({
            surevisible: false,
        });

    }

   //头部收索的事件   查询人员列表==================================
   searchRoleByName =() =>{

        const rolename = this.state.searchText
       if(rolename.length == 0){

            AlertError("角色名称不能为空")
           return
       }
       let para = {rolename:rolename}
       common.axiosPost("getRoleByRoleName","roleController",para,common.guid()).then(responseObj =>{
           let res = responseObj.data.data;
           if (res.error == null) {
               this.setState({
                   responData : res
               });
           }
       }).catch(error =>{
               AlertError('查询失败');
           }
       );

   }

    //表单的文字改变
    textOnChange =(index,event) =>{

        if (index == 0){
            //头部收索框的文字
            this.state.searchText = event.target.value;
            if(!this.state.searchText){
                this.setState({
                    responData : this.state.beforData
                });
            }

        }
    else if (index == 1){

         this.state.rolename = event.target.value;

     }else if (index == 2){

         this.state.rolecode = event.target.value;
     }

    }

    cheackValue =() =>{
        return this.state.rolecode.length>0&&this.state.rolename.length>0
    }


    //添加头部的收索和按照牛组合
    addheader = () =>{

        return (<div>
            <div>
                <Input.Search
                    style={{ width: 300 }}
                    placeholder="输入角色名称"
                    onChange = {this.textOnChange.bind(this,0)}
                    onSearch={value => {
                    }}/>

                <Button className="ml-5 " icon="search" type="primary" onClick = {this.searchRoleByName}>查询</Button>

            </div>
            <br/>
            <ButtonGroup>

                <Button className="ml-2 " icon="plus" onClick={this.showSureModal}>角色录入</Button>
                <Modal
                    title="角色录入"
                    visible={this.state.surevisible}
                    onOk={this.handleSureOk}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.handleSureCancel}
                    footer={[
                        <Button key="back" onClick={this.handleSureCancel}>取消</Button>,
                        <Button key="submit" type="primary"
                                loading={this.state.confirmLoading}
                                onClick={this.handleSureOk}
                        >
                            确定
                        </Button>,
                    ]}

                >
                    <div className="example-input">
                        <Input size="large"  placeholder="角色名称" onChange = {this.textOnChange.bind(this,1)}  />
                        <br/>
                        <br/>
                        <Input  size="large" placeholder="角色编码" onChange = {this.textOnChange.bind(this,2)}/>
                    </div>

                </Modal>
                <Button className="ml-2 " icon="edit" onClick={this.showModals}>角色编辑</Button>

                <Button className="ml-2 " icon="login">导入</Button>
                <Button className="ml-2 " icon="logout">导出</Button>
                <Button className="ml-2 " icon="download">模版下载</Button>

            </ButtonGroup>
            <br/>
            <br/>


        </div>)

    }

    // 查看权限的操作
    addpermissionSetting =() =>{

        return <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover table-condensed">
                <tbody>
                <tr>
                    <td>{"查看权限"}</td>
                </tr>
                <tr>
                    <td>{"删除权限"}</td>
                </tr>
                <tr>
                </tr>
                </tbody>
            </table>
        </div>
    }


    renderColumns(text, record, column) {
        return (
            <EditableCell
                editable={record.editable}
                value={text}
                onChange={value => this.handleChange(value, record.key, column)}
            />
        );
    }

    handleChange(value, key, column) {
        const newData = [...this.state.responData];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target[column] = value;
            this.setState({ responData: newData });
        }
    }
    edit(key) {
        const newData = [...this.state.responData];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target.editable = true;
            this.setState({ responData: newData });
        }
    }

    save(key) {
        const newData = [...this.state.responData];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            delete target.editable;
            this.setState({ responData: newData });
            this.cacheData = newData.map(item => ({ ...item }));
        }
    }
    cancel(key) {
        const newData = [...this.state.responData];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
            delete target.editable;
            this.setState({ responData: newData });
        }
    }
    onSelect =(record) =>{

        alert("dianjile ")


    }


    render() {

        this.columns = [{
            title: '角色编码',
            dataIndex: 'rolecode',
            width: '20%',
            render: (text, record) => this.renderColumns(text, record, 'rolecode'),
        },  {
            title: '角色名称',
            dataIndex: 'rolename',
            width: '20%',
            render: (text, record) => this.renderColumns(text, record, 'rolename'),
        }, {
            title: '操作',
            width: '40%',
            dataIndex: 'id',
            key:"id",

        render: (text, record,index) => {

                const {editable} = record;
                return (
                    <div className="Button.Group">
                        <Popconfirm placement="topLeft"
                                    title={"确定删除该条记录吗"}
                                    okText="确定"
                                    cancelText="取消"
                                    onConfirm = {() => this.deleteRole(index)}
                        >
                            <Button offset ={3} icon="close" type="primary">删除</Button>
                        </Popconfirm>

                        <Button offset ={3} icon="user-add" type="danger">用户</Button>

                        <Popconfirm placement="topRight"
                                    title={this.addpermissionSetting()}
                                    okText="确定"
                                    cancelText="取消">
                            <Button offset ={3} icon="setting" type="danger">权限设置</Button>
                        </Popconfirm>

                    </div>)

            },

        }]

        const data = [...this.state.responData];
        this.cacheData = data.map(item => ({ ...item }));

        if(!this.state.isLoad){

          return (<div>
                <Spin size="small" />
                <Spin />
                <Spin size="large" />
            </div>)
        }else {

            return (<div className="container">
                <br/>
                {this.addheader()}
                <Table bordered dataSource={data} columns={this.columns} />
            </div>);


        }


    }

}

