import React,{Component} from 'react'
import CreatCompanyAlert from './CreatCompanyAlert'
import { Modal, Button,message,Input } from 'antd';
import {Popconfirm} from 'antd';


import 'antd/dist/antd.css';
import * as common from '../../util/common.js';

class Company extends  Component{

    constructor() {
        super();
        let iaHaveCom;
        let conpanyName;
        let companyLeader;

        console.log(common.getCookie("companyId"))

        if (common.getCookie("userId")>0){
            if (common.getCookie("companyId")>0)
            {
                iaHaveCom=true;
                conpanyName=common.getCookie("companyName");
                companyLeader=common.getCookie("companyLeader");
            }
            else
            {
                iaHaveCom=false;
                message.warning('请先创建公司！')
            }
        }
        else
        {
            iaHaveCom=false;
            message.warning('请先登录！')
        }

        this.state = {
            isHaveCom: iaHaveCom,
            companyName:conpanyName,
            companyLeader:companyLeader,
            groupName: '',
            visible:false,
            inputCompanyName:""
        }

        message.config({
            top: 10,
            duration:3,
        });
    }
    //全局变量，控制编辑公司模态框的消失与弹出
    state = {visible: false}

    //初始化数据，获取公司信息
    componentDidMount(){
        if(this.state.isHaveCom)
        {

            let data = {
                companyID:common.getCookie("companyId"),
            };
            common.axiosPost("getCompanyInfo", "groupControllrer", data, common.guid()).then(
                response => {

                    common.setCookie('companyName',response.data.data.groupName, 60)
                    common.setCookie('companyLeader',response.data.data.createName, 60)
                    common.setCookie('createBy', response.data.data.createBy, 60);
                    this.setState({
                        isHaveCom:true,
                        companyName:response.data.data.groupName,
                        companyLeader:response.data.data.createName,

                })
                }
            ).catch(
                error => {
                    console.log(error+"error")
                }
            )
        }

        //  ------------------

        var  data = {
            name:"张三",
            age:12,
            title:"今天下雨了"
        }
        data={
            ...data,
            content:"我也不知道明天下不下雨"
        }
        // console.log(data);

        var  arrList=[
            {name:"张三",age:12,content:"我是大深化"},
            {name:"李四",age:18,content:"十大"},
            {name:"王五",age:14,content:"啊大叔大婶的"},
            {name:"住6",age:19,content:"个儿童"},
            {name:"谢5",age:11,content:"还是觉得咖啡还是困"},

        ]
        arrList=[
            ...arrList,
            {name:"新添加的",age:110,content:"阿迪企鹅起舞"},

        ]
       var arrList1=[
            {name:"谢000",age:11,content:"还是觉得咖啡还是困"}
        ]
        arrList=[...arrList,...arrList1]

        // const recordIndex = this.state.records.indexOf(record);
        // const newRecords = this.state.records.map( (item, index) => {
        //     if(index !== recordIndex) {
        //         return item;
        //     }
        //     return {
        //         ...item,
        //         ...data
        //     };
        // });

        // console.log(arrList);
        //遍历。。。
        for (let index of arrList) {

        }

        //替换数据
        //原数据
        var record = arrList[0]
        var newData = {name:"要替换的数据",age:11,content:"要替换的数据"}
        const recordIndex = arrList.indexOf(record);
        const  newArr =arrList.map((item,index)=>{
            // console.log(item,index);

            if(index!=recordIndex)
            {
                return item;
            }
            return{
                ...newData
            }
        })
        // console.log(newArr);

        //filter 过滤器
        // const newRecords = this.state.records.filter( (item, index) => index !== recordIndex);
        // this.setState({
        //     records: newRecords
        // });
       var arrList22=[1,2,3,4,5,6,6,4,3,2,23,23,42342,]
        var  num = arrList22.reduce(function (first,second) {
            // console.log(first,second.age);
            return first + second;
        })
        console.log(num)

        //  ---------------------

    }

    //修改公司确定事件
    handleOk = (e) => {
        if(this.state.inputCompanyName.length==0)
        {
            message.warning("公司名称不能为空！");
            return;
        }
        let data = {
            companyID:common.getCookie("companyId"),
            companyName:this.state.inputCompanyName
        }
        common.axiosPost("updateCompanyInfo","groupControllrer",data,common.guid()).then(
            response => {
                 message.success("修改成功")
                common.setCookie('companyName',this.state.inputCompanyName, 60)

                this.setState({
                    inputCompanyName:""
                })
            }
        ).catch(
            error => {
                message.error("修改失败")
            }
        )
        this.setState({
            visible: false,
        });
    }

    //取消修改公司名称，模态消失
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
            inputCompanyName:""

        });
    }
    //修改公司名称的输入框的值变化时的函数
    groupNameChange(event){
        console.log(event.target.value)

        this.setState({
            inputCompanyName:event.target.value
        })
    }
    //编辑按钮事件，弹出对话框
    editBtnClick(event){
        if(common.getCookie("isConpanyLeader")==0)
        {
            message.error("您没有权限修改！")
            return;
        }
        this.setState({
            visible: true,
            inputCompanyName:common.getCookie("companyName")
        });
    }
    //确定退出公司
     confirm(e) {
         if(common.getCookie("isConpanyLeader")==1)
         {
             message.error("您是公司的责任人不能退出公司哦！")
             return;
         }
         let data = {
             userID:common.getCookie("userId"),
         }
         common.axiosPost("outCompany","groupControllrer",data,common.guid()).then(
             response => {
                 message.success("退出公司成功")
                 common.setCookie('companyName',"", 60)
                 common.setCookie('companyId',0, 60)
                 common.setCookie('groupName',"", 60)
                 common.setCookie('groupId',"", 60)

                 this.setState({
                     isHaveCom:false
                 })
             }
         ).catch(
             error => {
                 message.error("退出公司失败")
             }
         )


    }

    //取消退出公司
     cancel(e) {
     }

     //有公司的UI页面，
    haveCompanyUI(){
        return(
            <div className="container mt-3">

                <div className="jumbotron">
                    <h1>{common.getCookie("companyName")}</h1>
                    <p>公司负责人：{this.state.companyLeader}</p>
                    <Button   className="ml-5 mt-5" onClick={this.editBtnClick.bind(this)}>编辑公司</Button>
                    <Popconfirm title="确定要退出公司？" onConfirm={this.confirm.bind(this)} onCancel={this.cancel.bind(this)} okText="退出" cancelText="取消">
                        <Button  className="ml-5 mt-5">退出公司</Button>
                    </Popconfirm>

                </div>
                <Modal
                    title='编辑公司名称'
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    okText="确定">
                    <Input placeholder="公司名称"  name="groupName" defaultValue={this.state.companyName} onChange={this.groupNameChange.bind(this)} id="groupName"/>
                </Modal>

            </div>
            )
    }
    //创建完成公司回调函数
    handleCreatCompanyBackfunction(event){
        console.log('chenggongle')
        this.setState({
            isHaveCom:true,
            companyName:event,
            companyLeader:common.getCookie('userName')
        })
    }


    render(){
        if(this.state.isHaveCom)
        {
            return this.haveCompanyUI();
        }
        else
        {
            console.log('没有公司')
            return <CreatCompanyAlert type={1} handleCreatCompany = {this.handleCreatCompanyBackfunction.bind(this)}  />
        }
    }


}
export default Company;
