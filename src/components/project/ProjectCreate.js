import React, {Component} from 'react';
import {Form, Input, Button, DatePicker, Select, Radio, message} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as RecordsAPI from '../../util/RecordsAPI';
import * as net from '../../util/common';

class ProjectCreate extends Component {

    constructor(props) {
        super(props);
        let data = this.props.location.state;
        console.log(data);
        if (data.isCreate === false) {
            let project = data.project;
            console.log(project);
            let date = new Date(project.planStartDate);
            console.log(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());
            project.planStartDate = moment(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(), "YYYY-MM-DD");
            date = new Date(project.planEndDate);
            console.log(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());
            project.planEndDate = moment(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(), "YYYY-MM-DD");
            this.state = {
                isCreate: false,
                members: [],
                companys: [],
                project: project
            }
            console.log(this.state.project);
        } else {
            this.state = {
                isCreate: true,
                members: [],
                companys: [],
                project: {}
            }
        }
    }

    handleProjectListOnClick() {

    }

    componentDidMount() {
        let postCompanyData = {
            companyid: net.getCookie("companyId"),
        };
        console.log(postCompanyData);
        net.axiosPost("listCompanyMember", "groupControllrer", postCompanyData, net.guid()).then(
            response => {
                console.log(response.data.data.data);
                if (response.data.data.code === 0) {
                    this.setState({
                        ...this.state,
                        members: response.data.data.data
                    });
                } else {
                    this.setState({
                        ...this.state,
                        members: []
                    });
                }
            }
        ).catch(
            error => {
                console.log(error + "error")
            }
        )

        let projectCompanyData = {
            uId: net.getCookie("userId")
        }
        console.log(projectCompanyData);
        RecordsAPI.getProjectsCompany(projectCompanyData).then(
            response => {
                console.log(response);
                if (response.code === 1) {
                    this.setState({
                        ...this.state,
                        companys: response.data
                    });
                }
            },
            error => {
                console.log(error)
            }
        );
    }

    handleInputChange(event) {
        let name = event.target.name;
        let project = this.state.project;
        project["" + name] = event.target.value;
        console.log(this.state.project);
        this.setState({
            ...this.state.project,
            project: project
        });
    }

    handleSelectChange(value, label) {
        if (typeof (value) === "undefined") {
            let project = this.state.project;
            delete project.auditPersonId;
            this.setState({
                ...this.state.project,
                project: project
            });
        } else {
            let name = label.ref;
            let project = this.state.project;
            project["" + name] = value;
            this.setState({
                ...this.state.project,
                project: project
            });
        }
        console.log(this.state.project);
    }

    isCanSubmit() {
        if (typeof (this.state.project.managerId) === "undefined") {
            return false;
        }
        if (typeof (this.state.project.name) === "undefined" || this.state.project.name === "") {
            return false;
        }
        if (typeof (this.state.project.bidState) === "undefined") {
            return false;
        }
        if (typeof (this.state.project.projectState) === "undefined") {
            return false;
        }
        if (typeof (this.state.project.planStartDate) === "undefined" || this.state.project.planStartDate === null) {
            return false;
        }
        if (typeof (this.state.project.planEndDate) === "undefined" || this.state.project.planEndDate === null) {
            return false;
        }
        if (typeof (this.state.project.constructUnitId) === "undefined" || this.state.project.constructUnitId === null) {
            return false;
        }
        if (typeof (this.state.project.owenerUnitId) === "undefined" || this.state.project.owenerUnitId === null) {
            return false;
        }

        return true;
    }

    rangePickerChange([start, end]) {
        console.log(start);
        let project = this.state.project;
        if (typeof (start) === "undefined") {
            project.planStartDate = null;
            project.planEndDate = null;
        } else {
            project.planStartDate = start;
            project.planEndDate = end;
        }
        this.setState({
            ...this.state,
            project: project
        });
        console.log(this.state.project);
    }

    handleSubmit() {
        let startDate, endDate;
        startDate = this.state.project.planStartDate.format('YYYY-MM-DD HH:mm:ss');
        endDate = this.state.project.planEndDate.format('YYYY-MM-DD HH:mm:ss');

        let data = {
            uId: net.getCookie("userId"),
            startData: startDate,
            endDate: endDate,
            name: this.state.project.name,
            bidState: this.state.project.bidState,
            owenerUnitId: this.state.project.owenerUnitId,
            constructUnitId: this.state.project.constructUnitId,
            depId: RecordsAPI.companyId,
            managerId: this.state.project.managerId,
            projectState: this.state.project.projectState,
        }
        if (typeof (this.state.project.auditPersonId) !== "undefined" && this.state.project.auditPersonId != null) {
            data = {
                ...data,
                auditPersonId: this.state.project.auditPersonId
            }
        }
        if (typeof (this.state.project.mark) !== "undefined") {
            data = {
                ...data,
                mark: this.state.project.mark
            }
        }
        if (typeof (this.state.project.caption) !== "undefined") {
            data = {
                ...data,
                caption: this.state.project.caption
            }
        }
        if (this.state.isCreate) {
            console.log(data);
            net.axiosPost("saveProject", "projectController", data, net.guid()).then(
                response => {
                    console.log(response.data);
                    if (response.data.result==="true") {
                        message.success('创建成功');
                        this.props.history.push("/Projects");
                    } else {
                        message.error('创建失败');
                    }
                }
            ).catch(
                error => {
                    message.error('创建失败');
                }
            );
        } else {
            data = {
                ...data,
                id: this.state.project.id
            }
            net.axiosPost("updateProject", "projectController", data, net.guid()).then(
                response => {
                    console.log(response.data);
                    if (response.data.result==="true") {
                        message.success('修改成功');
                        this.props.history.push("/Projects");
                    } else {
                        message.error('修改失败');
                    }
                }
            ).catch(
                error => {
                    message.error('修改失败');
                }
            );
        }
    }

    render() {
        let buttonText;
        if (this.state.isCreate === true) {
            buttonText = "创建";
        } else {
            buttonText = "提交";
        }
        const FormItem = Form.Item;
        const Option = Select.Option;
        const MonthPicker = DatePicker.MonthPicker;
        const RangePicker = DatePicker.RangePicker;
        const RadioGroup = Radio.Group;
        const {TextArea} = Input;

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 5},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 12},
            },
        };
        if (this.state.isCreate === true) {
            return (
                <Form className="pt-4">
                    <FormItem
                        {...formItemLayout}
                        label="项目名称"
                    >
                        <Input placeholder="输入项目名称" id="name" maxLength="20"
                               name="name"
                               onChange={this.handleInputChange.bind(this)}
                               value={this.state.project.name}/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="项目负责人"
                    >
                        <Select placeholder="选择项目负责人" onChange={this.handleSelectChange.bind(this)}
                                value={this.state.project.managerId}>
                            {this.state.members.map(member => <Option value={member.id} ref={"managerId"}
                                                                      key={member.id}>{member.createName}</Option>)}
                        </Select>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="投标状态"
                    >
                        <RadioGroup className="form-control pl-2"
                                    name="bidState"
                                    onChange={this.handleInputChange.bind(this)}
                                    value={this.state.project.bidState}>
                            <Radio value={0} checked="checked" ref={"bidState"}>未中标</Radio>
                            <Radio value={1} ref={"bidState"}>已中标</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="项目状态"
                    >
                        <RadioGroup className="form-control pl-2"
                                    name="projectState"
                                    onChange={this.handleInputChange.bind(this)}
                                    value={this.state.project.projectState}>
                            <Radio value={0} checked="checked" ref={"projectState"}>未开工</Radio>
                            <Radio value={1} ref={"projectState"}>已开工</Radio>
                            <Radio value={2} ref={"projectState"}>已完工</Radio>
                            <Radio value={3} ref={"projectState"}>已停工</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="项目原定计划日期"
                    >
                        <RangePicker placeholder={["选择开始日期", "选择结束日期"]}
                                     name={"date"} format={"YYYY-MM-DD"}
                                     onChange={this.rangePickerChange.bind(this)}
                                     value={[this.state.project.planStartDate, this.state.project.planEndDate]}
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="业主单位"
                    >
                        <Select placeholder="选择业主单位"
                                onChange={this.handleSelectChange.bind(this)}
                                value={this.state.project.owenerUnitId}>
                            {this.state.companys.map(company => <Option value={company.id} ref={"owenerUnitId"}
                                                                        key={company.id}>{company.name}</Option>)}
                        </Select>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="建设单位"
                    >
                        <Select placeholder="选择建设单位"
                                onChange={this.handleSelectChange.bind(this)}
                                value={this.state.project.constructUnitId}>
                            {this.state.companys.map(company => <Option value={company.id} ref={"constructUnitId"}
                                                                        key={company.id}>{company.name}</Option>)}
                        </Select>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="项目备注"
                    >
                    <TextArea placeholder="输入项目备注(选填)" id="mark"
                              name="mark"
                              onChange={this.handleInputChange.bind(this)}
                              value={this.state.project.mark}/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="项目说明"
                    >
                    <TextArea placeholder="输入项目说明(选填)" id="caption"
                              name="caption"
                              onChange={this.handleInputChange.bind(this)}
                              value={this.state.project.caption}/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="审核人"
                    >
                        <Select placeholder="选择审核人(选填)" allowClear={true}
                                onChange={this.handleSelectChange.bind(this)}
                        >
                            {this.state.members.map(member => <Option value={member.id} ref={"auditPersonId"}
                                                                      key={member.id}>{member.createName}</Option>)}
                        </Select>
                    </FormItem>
                    <FormItem
                        wrapperCol={{
                            xs: {span: 24, offset: 0},
                            sm: {span: 16, offset: 8},
                        }}
                    >
                        <Button type="primary" onClick={this.handleSubmit.bind(this)}
                                disabled={!this.isCanSubmit()}>{buttonText}</Button>
                    </FormItem>
                </Form>);
        } else {
            return (
                <Form className="pt-4">
                    <FormItem
                        {...formItemLayout}
                        label="项目名称"
                    >
                        <Input placeholder="输入项目名称" maxLength="20"
                               name="name"
                               onChange={this.handleInputChange.bind(this)}
                               value={this.state.project.name}/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="项目负责人"
                    >
                        <Select placeholder="选择项目负责人"
                                onChange={this.handleSelectChange.bind(this)}
                                value={this.state.project.managerId}>
                            {this.state.members.map(member => <Option value={member.id} ref={"managerId"}
                                                                      key={member.id}>{member.createName}</Option>)}
                        </Select>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="投标状态"
                    >
                        <RadioGroup className="form-control pl-2"
                                    name="bidState"
                                    onChange={this.handleInputChange.bind(this)}
                                    value={this.state.project.bidState}
                        >
                            <Radio value={0} ref={"bidState"}>未中标</Radio>
                            <Radio value={1} ref={"bidState"}>已中标</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="项目状态"
                    >
                        <RadioGroup className="form-control pl-2"
                                    name="projectState"
                                    onChange={this.handleInputChange.bind(this)}
                                    value={this.state.project.projectState}>
                            <Radio value={0} ref={"projectState"}>未开工</Radio>
                            <Radio value={1} ref={"projectState"}>已开工</Radio>
                            <Radio value={2} ref={"projectState"}>已完工</Radio>
                            <Radio value={3} ref={"projectState"}>已停工</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="项目原定计划日期"
                    >
                        <RangePicker placeholder={["选择开始日期", "选择结束日期"]}
                                     name={"date"} format={"YYYY-MM-DD"}
                                     onChange={this.rangePickerChange.bind(this)}
                                     value={[this.state.project.planStartDate, this.state.project.planEndDate]}
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="业主单位"
                    >
                        <Select placeholder="选择业主单位"
                                onChange={this.handleSelectChange.bind(this)}
                                value={this.state.project.owenerUnitId}>
                            {this.state.companys.map(company => <Option value={company.id} ref={"owenerUnitId"}
                                                                        key={company.id}>{company.name}</Option>)}
                        </Select>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="建设单位"
                    >
                        <Select placeholder="选择建设单位"
                                onChange={this.handleSelectChange.bind(this)}
                                value={this.state.project.constructUnitId}>
                            {this.state.companys.map(company => <Option value={company.id} ref={"constructUnitId"}
                                                                        key={company.id}>{company.name}</Option>)}
                        </Select>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="项目备注"
                    >
                        <TextArea placeholder="输入项目备注(选填)" id="mark"
                                  name="mark"
                                  onChange={this.handleInputChange.bind(this)}
                                  value={this.state.project.mark}/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="项目说明"
                    >
                        <TextArea placeholder="输入项目说明(选填)" id="caption"
                                  name="caption"
                                  onChange={this.handleInputChange.bind(this)}
                                  value={this.state.project.caption}/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="审核人"
                    >
                        <Select placeholder="选择审核人(选填)" allowClear={true}
                                onChange={this.handleSelectChange.bind(this)}>
                            {this.state.members.map(member => <Option value={member.id} ref={"auditPersonId"}
                                                                      key={member.id}>{member.createName}</Option>)}
                        </Select>
                    </FormItem>
                    <FormItem
                        wrapperCol={{
                            xs: {span: 24, offset: 0},
                            sm: {span: 16, offset: 8},
                        }}
                    >
                        <Button type={"primary"} onClick={this.handleSubmit.bind(this)}
                                disabled={!this.isCanSubmit()}>{buttonText}</Button>
                    </FormItem>
                </Form>);
        }
        ;


    }
}

export default ProjectCreate = Form.create()(ProjectCreate);
