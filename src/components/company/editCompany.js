import React,{Component} from 'react';
import { Modal, Button,message,Input } from 'antd';
import 'antd/dist/antd.css';
import * as common from '../../util/common.js';

export  default class  editCompany extends  Component {




    render(){

        return (
            <div className="row">
                {/*<Button type="primary" className="ml-5 mt-5" onClick={this.showModal}>创建组</Button>*/}
                <Button  className="ml-5 mt-5" onClick={this.showModal}>{3333}</Button>

                <Modal
                    title={this.state.creatBtnName}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    okText="创建">
                    <Input placeholder="组名称"  name="groupName" onChange={this.groupNameChange.bind(this)} id="groupName"/>
                </Modal>
            </div>
        );
    }
}
