import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Card, Col, Row ,List} from 'antd';
class Information extends Component {
    constructor(props){
        console.log("公司详情");
        console.log(props.company);
        super(props);
    }
    handleCompanyformOnClick(company){
        this.props.handleCompanyformOnClick();
    }
    render(){
        /* let date = new Date(this.props.company.create_Time);
         let createDate;
         date = new Date(this.props.company.create_Time);
         createDate = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";*/
        return (
            <div>
                <h3>公司名称:><small>{this.props.location.state.company.name}</small></h3>
                <List className="list-group">
                    <li className="list-group-item">
                        <p className="navbar-text">公司名称: <span className="proname" id="proname">{this.props.location.state.company.name}</span></p>
                    </li>
                    <li className="list-group-item">
                        <p className="navbar-text">公司负责人：<span className="forperson" id="forperson">{this.props.location.state.company.managerName}</span></p>
                    </li>
                    <li className="list-group-item">
                        <p className="navbar-text">联系人电话：<span className="forperson" id="forphone">{this.props.location.state.company.managerPhone}</span></p>
                    </li>
                   {/* <li className="list-group-item">
                        <p className="navbar-text">建设单位： <span className="build" id="build">{this.props.location.state.company.build}</span></p>
                    </li>
                    <li className="list-group-item">
                        <p className="navbar-text">归属部门：<span className="deparment" id="deparment">{this.props.location.state.company.deportment}</span></p>
                    </li>*/}
                    <li className="list-group-item beish">
                        <div className="reference">
                            <p className="navbar-text">建设单位: <div className="discribe" id="discribe">{this.props.location.state.company.mark}</div></p>
                        </div>
                    </li>
                </List>
               {/* <div style={{ background: '#ECECEC', padding: '30px' }}>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Card title="创建日期" bordered={false}>2018-02-8</Card>
                        </Col>
                        <Col span={8}>
                            <Card title="结束日期" bordered={false}>2018-02-09</Card>
                        </Col>
                    </Row>
                </div>*/}
            </div>
        )
    }
}
export default Information;