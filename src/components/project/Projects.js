import React, {Component} from 'react';
import Project from './Project';
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
                // if (response.code == 1)
                this.setState({projects: response.data});

            },
            error => console.log(error));
    }

    handleDelete(project) {
        console.log("projects-handleDelete");
        const projectIndex = this.state.projects.indexOf(project);
        const newProjects = this.state.projects.filter((item, index) => index !== projectIndex);
        this.setState({
            projects: newProjects
        });
        this.props.handleAlertHidden();
    }

    handleProjectEditClick(project){
        console.log("项目编辑");
        // this.props.handleProjectEditClick(project);
        let data={
            isCreate:false,
            project:project
        }
        let path = {
            pathname:"/ProjectCreate",
            state:data
        }
        this.props.history.push(path);
    }

    handleProjectDetailClick(project) {
        // this.props.handleProjectDetailOnClick(project);
        let data={
            project:project
        }
        let path = {
            pathname:"/ProjectDetail",
            state:data
        }
        this.props.history.push(path);
    }

    handleDeleteClick(alertContent) {
        // this.props.handleAlertShow(alertContent);
    }

    handleCreateProjectClick() {
        console.log("创建项目点击");
        // this.props.handleCreateProjectClick();
        let data={
            isCreate:false
        }
        let path = {
            pathname:"/ProjectCreate",
            state:data
        }
        this.props.history.push(path);
    }

    render() {
        const {visible, confirmLoading, ModalText} = this.state;
        let projects;
        if (this.state.projects.length > 0) {
            console.log("有项目");
            projects = (
                this.state.projects.map(project =>
                    <Project handleProjectDetailClick={this.handleProjectDetailClick.bind(this)}
                             handleDeleteClick={this.handleDeleteClick.bind(this)}
                             handleProjectEditClick={this.handleProjectEditClick.bind(this)}
                             key={project.id} project={project}/>)
            );
        } else {
            console.log("无项目");
            <div>
                暂无项目
            </div>
        }

        return (
            <div>
                {/*<div className="bg-info pl-4 pr-4 pb-1">*/}
                    {/*<h6>我的项目</h6>*/}
                {/*</div>*/}
                <div className="ml-4 mr-4 mb-4 mt-4">
                    <div className="mr-4 mt-4 pr-4 pull-right">
                        <button className="btn pull-right btn-danger mr-4"
                                onClick={this.handleCreateProjectClick.bind(this)}>创建项目
                        </button>
                    </div>
                    <table className="table mr-4 mt-4 pr-4">
                        <thead>
                        <tr className="bg-info table-condensed ">
                            <th><h5>项目名称</h5></th>
                            <th><h5>项目原计划时间</h5></th>
                            <th><h5>项目状态</h5></th>
                            <th><h5>操作</h5></th>
                        </tr>
                        </thead>
                        <tbody>
                        {projects}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

