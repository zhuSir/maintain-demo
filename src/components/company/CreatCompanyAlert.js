import React,{Component} from 'react';
import { Modal, Button,message,Input } from 'antd';
import 'antd/dist/antd.css';
import * as common from '../../util/common.js';


export default  class CreatCompanyAlert extends Component {

    //type 1，创建组，2。创建分组 3,邀请组成员
    constructor(props) {
        super(props);
        let btnName = "创建";
        if (this.props.type == 1) {
            btnName = "创建公司";
        }
        else if (this.props.type == 2) {
            btnName = "创建分组";
        }
        else {
            btnName = "请设置type";
        }

        this.state = {
            groupName: '',
            alertShow: false,
            btnType: this.props.type,
            creatBtnName: btnName
        }
    }

    state = {visible: false}

    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = (e) => {
        console.log(e);

        this.setState({
            visible: false,
        });
//创建公司
        if (this.props.type == 1)
        {
            let data = {
                createName:common.getCookie("userName"),
                groupName:this.state.groupName,
                createUserId:common.getCookie("userId")
            };
            common.axiosPost("creatCompany", "groupControllrer", data, common.guid()).then(
                response => {
                    common.setCookie('companyId', response.data.data.companyID, 60);
                    common.setCookie('companyName',this.state.groupName, 60);
                    common.setCookie('isConpanyLeader',1, 60);

                    this.props.handleCreatCompany(this.state.groupName);
                }
            ).catch(
                error => {
                    console.log(error+"error")
                }
            )
        }
        else if(this.props.type == 2){
            //创建分组
            console.log("99999999999")
            this.props.handleCreatgroup(this.state.groupName);
        }
    }
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    groupNameChange(event){
        this.setState({
            groupName:event.target.value
        })
    }

     render(){

         return (
             <div className="row">
                 {/*<Button type="primary" className="ml-5 mt-5" onClick={this.showModal}>创建组</Button>*/}
                 <Button  className="ml-5 mt-5" onClick={this.showModal}>{this.state.creatBtnName}</Button>

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