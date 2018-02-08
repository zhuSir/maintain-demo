import React, {Component} from 'react';
import {Modal, message, Table, Divider, Button} from 'antd';
import * as RecordsAPI from '../../util/RecordsAPI'
import * as common from '../../util/common.js';


export default class Projects extends Component {

    constructor(props) {
        super(props);
        this.state = {
            projects: []
        }
    }

    componentDidMount() {
        const data = {
            uId: common.getCookie("userId")
        }
        RecordsAPI.getProjects(data).then(
            response => {
                console.log(response);
                if (response.code == 1)
                    this.setState({projects: response.data});

            },
            error => console.log(error));
    }

    handleProjectEditClick(project) {
        console.log("项目编辑");
        console.log(project);
        // this.props.handleProjectEditClick(project);
        let data = {
            isCreate: false,
            project: project
        }
        let path = {
            pathname: "/ProjectCreate",
            state: data
        }
        this.props.history.push(path);
    }

    handleProjectDetailClick(project) {
        // this.props.handleProjectDetailOnClick(project);
        let data = {
            project: project
        }
        let path = {
            pathname: "/ProjectDetail",
            state: data
        }
        this.props.history.push(path);
    }

    handleDeleteClick(project) {
        const confirm = Modal.confirm;
        confirm({
            title: '警告',
            content: '确定要删除 \"'+project.name+' \"这个项目吗',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                let postDdatas = {
                    uId: common.getCookie("userId"),
                    pId: project.id
                }
                RecordsAPI.delectProjects(postDdatas).then(
                    response => {
                        console.log(response);

                    },
                    error => {
                        console.log(error);
                        this.setState({
                            ...this.state,
                            alertShow:false
                        });
                    });
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    handleCreateProjectClick() {
        console.log("创建项目点击");
        // this.props.handleCreateProjectClick();
        let data = {
            isCreate: true
        }
        let path = {
            pathname: "/ProjectCreate",
            state: data
        }
        this.props.history.push(path);
    }

    render() {
        const columns = [{
            title: '项目名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '项目原计划时间',
            dataIndex: 'date',
            key: 'date',
        }, {
            title: '项目状态',
            dataIndex: 'state',
            key: 'state',
        }, {
            title: '操作',
            key: 'action',
            render: (text, project) => (
                <span>
                     <Button type="primary" onClick={()=>this.handleProjectDetailClick(project)}>详情</Button>
                     <Divider type="vertical"/>
                     <Button  type="primary" onClick={()=>this.handleProjectEditClick(project)}>编辑</Button>
                     <Divider type="vertical"/>
                     <Button type="primary" onClick={()=>this.handleDeleteClick(project)}>删除</Button>
                 </span>
            ),
        }];

        let data = this.state.projects;

        data.map(project => {
            let projectState;
            switch (project.projectState) {
                case 0:
                    projectState = "未开工";
                    break;
                case 1:
                    projectState = "已开工";
                    break;
                case 2:
                    projectState = "已完工";
                    break;
                case 3:
                    projectState = "已停工";
                    break;
            }

            let date = new Date(project.planStartDate);
            const stareDate = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";
            date = new Date(project.planEndDate);
            const endDate = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";
            project["date"] = stareDate + "-" + endDate;
            project["state"] = projectState;
        });

        return (
            <div>
                <Button type="primary" style={{margin: '0px 0px 20px 0px'}}
                        onClick ={this.handleCreateProjectClick.bind(this)} >创建项目</Button>
                <Table columns={columns} dataSource={data}/>
            </div>
        );
    }
}

