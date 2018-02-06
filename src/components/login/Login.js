/**
 * Created by zhangzhifu on 2018/2/5.
 */
import React, {Component} from 'react';
import * as net from '../../util/common';
import * as md5 from'../../util/md5.js';
import './Login.css'
import {Form, Icon, Input, Button, Checkbox, message, Row, Col} from 'antd';
const FormItem = Form.Item;

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            location: 0,
            //登陆
            mobilephone: "",
            password: "",
            createName: ""
        }

        message.config({
            top: 10,
            duration: 2,
        });
    }

    btnChange(page, event) {
        this.setState({
            location: page,
            mobilephone: "",
            password: "",
            createName: ""
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values)
            if (!(/^1[34578]\d{9}$/.test(values.mobilephone))) {
                message.warning("手机号码有误，请重填");
            } else if (values.password && values.password.length < 6) {
                message.warning('密码至少要6位数');
            } else {
                const data = {
                    mobilephone: values.mobilephone,
                    password: md5.hex_md5(values.password)
                };

                net.axiosPost("login", "userController", data, net.guid()).then(
                    response => {
                        const res = JSON.parse(response.data.data);
                        message.success(res.info)
                        net.setCookie('userId', res.data.id, 60);
                        net.setCookie('phone', res.data.mobilephone, 60);
                        net.setCookie('userName', res.data.createName, 60);
                        net.setCookie('companyId', res.data.companyid, 60);
                        net.setCookie('companyName', res.data.companyName, 60);
                        net.setCookie('groupId', res.data.groupid, 60);
                        net.setCookie('groupName', res.data.groupName, 60);
                        this.props.jumpToMain(0);//跳到主页
                    }
                ).catch(
                    error => {
                        console.log(error)
                    }
                )
            }
        });
    };

    handleRegister=(e)=> {
        e.preventDefault();
        const chineseReg = /^[\u4e00-\u9fa5]+$/i;//只能输入中文
        this.props.form.validateFields((err, values) => {
            console.log(values)
            if (!(/^1[34578]\d{9}$/.test(values.mobilephone))) {
                message.warning("手机号码有误，请重填");
            } else if (!chineseReg.test(values.createName)) {
                message.warning('请输入中文名字');
            }else if (values.password && values.password.length < 6) {
                message.warning('密码至少要6位数');
            }else{
                const data = {
                    mobilephone: values.mobilephone,
                    password: md5.hex_md5(values.password),
                    createName: values.createName
                };

                net.axiosPost("register", "userController", data, net.guid()).then(
                    response => {
                        let res = JSON.parse(response.data.data);
                        if(res.code==0){
                            message.success(res.info);
                            this.setState({
                                location: 0,
                            })
                        }else {
                            message.warning(res.info);
                        }
                    }
                ).catch(
                    error => {
                        console.log(error)
                    }
                )
            }
        });
    }

    loginPage() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div className="login">
                <Row type="flex" justify="center" align="top">
                    <h1>咚咚维保云</h1>
                </Row>
                <Row className="loginForm" type="flex" justify="center" align="top">
                    <Form onSubmit={this.handleSubmit} className="login-form ant-col-12">
                        <FormItem hasFeedback>
                            {getFieldDecorator('mobilephone', {
                                rules: [
                                    {required: true, message: '请输入手机号!'},
                                ],
                            })(
                                <Input prefix={<Icon type="mobile" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                       name="mobilephone" placeholder="手机号"/>
                            )}
                        </FormItem>
                        <FormItem hasFeedback>
                            {getFieldDecorator('password', {
                                rules: [
                                    {required: true, message: '请输入密码!'},
                                ],
                            })(
                                <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                       name="password" placeholder="密码"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>记住密码</Checkbox>
                            )}
                            <a className="login-form-forgot">忘记密码？</a>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登陆
                            </Button>
                            <a onClick={this.btnChange.bind(this, 1)}>立即注册</a>
                        </FormItem>
                    </Form>
                </Row>
            </div>
        )
    }

    registerPage() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div className="login">
                <Row type="flex" justify="center" align="top">
                    <h1>注册</h1>
                </Row>
                <Row className="loginForm" type="flex" justify="center" align="top">
                    <Form onSubmit={this.handleRegister} className="login-form ant-col-12">
                        <FormItem>
                            {getFieldDecorator('mobilephone', {
                                rules: [
                                    {required: true, message: '请输入手机号!'},
                                ],
                            })(
                                <Input prefix={<Icon type="mobile" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                       name="mobilephone" placeholder="手机号"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('createName', {
                                rules: [
                                    {required: true, message: '请输入用户名!'},
                                ],
                            })(
                                <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                       name="createName" placeholder="用户名"/>
                            )}
                        </FormItem>

                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [
                                    {required: true, message: '请输入密码!'},
                                ],
                            })(
                                <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                       name="password" placeholder="密码"/>
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                注册
                            </Button>
                            <a onClick={this.btnChange.bind(this, 0)}>返回登陆</a>
                        </FormItem>
                    </Form>
                </Row>
            </div>

        )
    }

    render() {
        if (this.state.location == 0) {
            return this.loginPage();
        } else if (this.state.location == 1) {
            return this.registerPage();
        }
    }
}
const LoginForm = Form.create()(Login);
export default LoginForm;