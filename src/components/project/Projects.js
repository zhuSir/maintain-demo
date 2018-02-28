import React, {Component} from 'react';
import {Popconfirm, message, Table, Button} from 'antd';
import * as net from '../../util/common';

let startIndex = 0;

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
            uId: net.getCookie("userId")
        }
        net.axiosPost("listProject", "projectController", data, net.guid()).then(
            response => {
                console.log(response);
                let data = response.data.data;
                this.setState({
                    projects: data
                })
            }
        ).catch(
            error => {
                message.error("加载项目列表失败");
            }
        );
    }

    componentDidMount() {

    }

    handleProjectEditClick(e, project) {
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

    handleDeleteClick(e, project, projectIndex) {
        console.log(projectIndex);
        e.stopPropagation();
        let postDdatas = {
            uId: net.getCookie("userId"),
            id: project.id
        }

        net.axiosPost("deleteProject", "projectController", postDdatas, net.guid()).then(
            response => {
                message.success("删除成功");
                const newProjects = this.state.projects.filter((item, index) => index !== (startIndex+projectIndex));
                this.setState({
                    projects: newProjects
                });
                console.log(this.state.projects);
            }
        ).catch(
            error => {
                message.error("加载项目列表失败");
            }
        );
    }

    hanleCancleClick(e) {
        e.stopPropagation();
        console.log(e);
    }

    handlePopShow(e) {
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

    handleShowTotal(total, range) {
        if (total > 0)
            startIndex = range[0] - 1;
        else
            startIndex = 0;
    }

    render() {
        let columns = [{
            title: '项目名称',
            dataIndex: 'name',
            key: 'name',
            width: "45%"
        }, {
            title: '项目原计划时间',
            dataIndex: 'date',
            key: 'date',
            width: "25%"
        }, {
            title: '项目状态',
            dataIndex: 'state',
            key: 'state',
            width: "10%"
        }, {
            title: '操作',
            key: 'action',
            width: "20%",
            render: (text, project, index) => (
                <span>
                     {/*<Button type="primary" className={"mr-1"}*/}
                    {/*onClick={() => this.handleProjectDetailClick(project)}>详情</Button>*/}
                    <Button type="primary" className={"mr-1"}
                            onClick={(e) => this.handleProjectEditClick(e, project)}>编辑</Button>
                    <Popconfirm placement="topRight" title={`确定要删除 \"${project.name}\" 这个项目吗?`}
                                onConfirm={(e) => this.handleDeleteClick(e, project, index)} okText="删除"
                                cancelText="取消"
                                onCancel={(e) => this.hanleCancleClick(e, this)}>
                             <Button type="primary" onClick={(e) => this.handlePopShow(e)}>删除</Button>
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
                }} columns={columns} dataSource={data} bordered
                       pagination={{  //分页
                           total: this.state.projects.length,
                           pageSize: 6,
                           showTotal: this.handleShowTotal.bind(this),
                           hideOnSinglePage: true
                       }}/>
            </div>
        );
    }
}

