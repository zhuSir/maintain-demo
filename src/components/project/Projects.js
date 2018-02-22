import React, {Component} from 'react';
import {Popconfirm, message, Table, Button} from 'antd';
import * as RecordsAPI from '../../util/RecordsAPI'
import * as common from '../../util/common.js';


export default class Projects extends Component {

    constructor(props) {
        super(props);
        this.getProjectList();
        this.state = {
            projects: []
        }
    }

    getProjectList = () => {
        const data = {
            uId: common.getCookie("userId")
        }
        RecordsAPI.getProjects(data).then(
            response => {
                console.log(response);
                if (response.code == 1)
                    this.setState(
                        {
                            projects: response.data
                        });

            },
            error => {
                message.error("加载项目列表失败")
            })
    }

    componentDidMount() {

    }

    handleProjectEditClick(e,project) {
        e.stopPropagation();
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

    handleDeleteClick(e,project, index) {
        console.log(project);
        e.stopPropagation();
        let postDdatas = {
            uId: common.getCookie("userId"),
            pId: project.id
        }

        RecordsAPI.delectProjects(postDdatas).then(
            response => {
                message.success("删除成功");
                let projects = this.state.projects;
                projects.splice(index, 1);
                this.setState({
                    projects: projects
                });
                console.log(this.state.projects);
            },
            error => {
                message.error("删除失败");
            });
    }

    hanleCancleClick(e) {
        e.stopPropagation();
        console.log(e);
    }

    handlePopShow(e){
        e.stopPropagation();
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
        let columns = [{
            title: '项目名称',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            width: 500
        }, {
            title: '项目原计划时间',
            dataIndex: 'date',
            key: 'date',
            width: 300
        }, {
            title: '项目状态',
            dataIndex: 'state',
            key: 'state',
            width: 100
        }, {
            title: '操作',
            key: 'action',
            width: 200,
            render: (text, project, index) => (
                <span>
                     {/*<Button type="primary" className={"mr-1"}*/}
                    {/*onClick={() => this.handleProjectDetailClick(project)}>详情</Button>*/}
                    <Button type="primary" className={"mr-1"}
                            onClick={(e) => this.handleProjectEditClick(e,project)}>编辑</Button>
                    <Popconfirm placement="topRight" title={`确定要删除 \"${project.name}\" 这个项目吗?`}
                                onConfirm={(e)=>this.handleDeleteClick(e,project,index,this)} okText="删除"
                                cancelText="取消"
                                onCancel={(e)=>this.hanleCancleClick(e,this)}>
                             <Button type="primary" onClick={(e)=>this.handlePopShow(e)}>删除</Button>
                     </Popconfirm>
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
                        onClick={this.handleCreateProjectClick.bind(this)}>创建项目</Button>
                <Table onRow={(project) => {
                    return {
                        onClick: () => {
                            this.handleProjectDetailClick(project);
                        }       // 点击行
                    };
                }} columns={columns} dataSource={data} bordered pageSize={1} total={this.state.projects.size}/>
            </div>
        );
    }
}

