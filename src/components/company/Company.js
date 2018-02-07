import React,{Component} from 'react'
import CreatCompanyAlert from './CreatCompanyAlert'
import {message} from 'antd';
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
            companyInfo:"技术支持，技术研发团队",
            companyLeader:companyLeader,
            companyLeaderPhone:"188XXXXXXXX",
            companyAddress:"湖滨南路立信广场28楼"
        }

        message.config({
            top: 10,
            duration:3,
        });
    }
    componentDidMount(){
        if(this.state.isHaveCom)
        {

            let data = {
                companyID:common.getCookie("companyId"),
            };
            common.axiosPost("getCompanyInfo", "groupControllrer", data, common.guid()).then(
                response => {
                    console.log(response)
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

    }


    haveCompanyUI(){
        return(
            <div className="container mt-3">

                <div className="jumbotron">
                    <h1>{this.state.companyName}</h1>
                    <p>{this.state.companyInfo}</p>
                    <p>公司负责人：{this.state.companyLeader}</p>
                    <p>公司负责人电话：{this.state.companyLeaderPhone}</p>
                    <p>公司地址：{this.state.companyAddress}</p>
                </div>

            </div>
            )
    }
    //创建完成公司回调函数
    handleCreatCompanyBackfunction(event){
        console.log('chenggongle')


        this.setState({
            isHaveCom:true,
            companyName:event
        })

        // alert("创建完成刷新公司页面")

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
