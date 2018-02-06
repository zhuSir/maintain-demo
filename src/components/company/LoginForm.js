/**
 * Created by zhangzhifu on 2018/2/1.
 */
import React, {Component} from 'react';
import {message} from 'antd';
import 'antd/dist/antd.css'
import './css/Login.css';
import * as md5 from'./md5.js';
import * as common from '../../util/common.js';


class LoginFrom extends Component {

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
            top: 5,
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

    loginValid() {
        return this.state.mobilephone && this.state.mobilephone && this.state.password;
    }

    registerValid() {
        return this.state.mobilephone && this.state.mobilephone && this.state.password && this.state.createName;
    }

    canLogin() {
        if (!(/^1[34578]\d{9}$/.test(this.state.mobilephone))) {
            message.warning("手机号码有误，请重填");
            return false;
        }

        if (this.state.password.length < 6) {
            message.warning('密码至少要6位数');
            return false;
        }
        return true;
    }

    canRegister() {
        let chineseReg = /^[\u4e00-\u9fa5]+$/i;//只能输入中文
        if (!(/^1[34578]\d{9}$/.test(this.state.mobilephone))) {
            message.warning("手机号码有误，请重填");
            return false;
        }

        if (!chineseReg.test(this.state.createName)) {
            message.warning('请输入中文名字');
            return false;
        }

        if (this.state.password.length < 6) {
            message.warning('密码至少要6位数');
            return false;
        }
        return true;
    }


    handleRegisterChange(event) {
        let name, obj;
        name = event.target.name;
        this.setState((
            obj = {},
                obj["" + name] = event.target.value,
                obj
        ))
    }

    handleLoginChange(event) {
        let name, obj;
        name = event.target.name;
        this.setState((
            obj = {},
                obj["" + name] = event.target.value,
                obj
        ))
    }

    handleLoginSubmit(event) {
        event.preventDefault();
        if (!this.canLogin()) {
            return;
        }
        let data = {
            mobilephone: this.state.mobilephone,
            password: md5.hex_md5(this.state.password)
        };

        common.axiosPost("login", "userController", data, common.guid()).then(
            response => {
                let res = JSON.parse(response.data.data);
                console.log(res)

                message.success(res.info)
                common.setCookie('userId', res.data.id, 60);
                common.setCookie('phone', res.data.mobilephone, 60);
                common.setCookie('userName', res.data.createName, 60);
                common.setCookie('companyId', res.data.companyid, 60);
                common.setCookie('companyName', res.data.companyName, 60);
                common.setCookie('groupId', res.data.groupid, 60);
                common.setCookie('groupName', res.data.groupName, 60);
            }
        ).catch(
            error => {
                console.log(error)
            }
        )
    }

    handleRegister(event) {
        event.preventDefault();

        if (!this.canRegister()) {
            return;
        }

        let data = {
            mobilephone: this.state.mobilephone,
            password: md5.hex_md5(this.state.password),
            createName: this.state.createName
        };

        common.axiosPost("register", "userController", data, common.guid()).then(
            response => {
                let res = JSON.parse(response.data.data);
                if(res.code==0){
                    message.success(res.info);
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

    loginPage() {
        return (
            <div className="container">
                <h5 className="text-center">登陆</h5>
                <form onSubmit={this.handleLoginSubmit.bind(this)}>
                    <div className="form-group row">
                        <a className="col-md-4"></a>
                        <input type="text" className="form-control col-md-4"
                               name="mobilephone" placeholder="手机号"
                               onChange={this.handleLoginChange.bind(this)}
                               value={this.state.mobilephone}></input>
                        <a className="col-md-4"></a>
                    </div>
                    <div className="form-group row">
                        <a className="col-md-4"></a>
                        <input type="text" className="form-control col-md-4"
                               name="password" placeholder="密码"
                               onChange={this.handleLoginChange.bind(this)}
                               value={this.state.password}></input>
                        <a className="col-md-4"></a>
                    </div>
                    <div className="row">
                        <a className="col-md-4 row"></a>
                        <div className="col-md-4">
                            <p onClick={this.btnChange.bind(this, 1)} className="btn btn-default password">忘记密码?</p>
                            <p onClick={this.btnChange.bind(this, 2)} className="btn btn-default register">注册</p>
                        </div>
                    </div>
                    <div className="row">
                        <a className="col-md-4"></a>
                        <button type="submit"
                                className="btn btn-success col-md-4 text-center" disabled={!this.loginValid()}>登陆
                        </button>
                    </div>
                </form>
            </div>
        )
    }

    registerPage() {
        return (
            <div className="container">
                <h5 className="text-center">注册</h5>
                <form role="form" onSubmit={this.handleRegister.bind(this)}>
                    <div className="form-group row">
                        <a className="col-md-4"></a>
                        <input type="text" className="form-control col-md-4"
                               name="mobilephone" placeholder="手机号"
                               onChange={this.handleRegisterChange.bind(this)}
                               value={this.state.mobilephone}></input>
                        <a className="col-md-4"></a>
                    </div>
                    <div className="form-group row">
                        <a className="col-md-4"></a>
                        <input type="text" className="form-control col-md-4"
                               name="createName" placeholder="用户名"
                               onChange={this.handleRegisterChange.bind(this)}
                               value={this.state.createName}></input>
                        <a className="col-md-4"></a>
                    </div>
                    <div className="form-group row">
                        <a className="col-md-4"></a>
                        <input type="text" className="form-control col-md-4"
                               name="password" placeholder="密码"
                               onChange={this.handleRegisterChange.bind(this)}
                               value={this.state.password}></input>
                        <a className="col-md-4"></a>
                    </div>
                    <div className="row">
                        <a className="col-md-4 row"></a>
                        <div className="col-md-4">
                            <p onClick={this.btnChange.bind(this, 0)} className="btn btn-default login">登陆</p>
                        </div>
                    </div>
                    <div className="row">
                        <a className="col-md-4"></a>
                        <button type="submit" className="btn btn-success col-md-4 text-center"
                                disabled={!this.registerValid()}>注册
                        </button>
                    </div>
                </form>
            </div>
        )
    }

    passwordPage() {
        return (
            <div className="container">
                <h5 className="text-center">忘记密码</h5>
                <form role="form">
                    <div className="form-group row">
                        <a className="col-md-4"></a>
                        <input type="text" className="form-control col-md-4"
                               name="mobilephone" placeholder="手机号"
                               value={this.state.mobilephone}></input>
                        <a className="col-md-4"></a>
                    </div>
                    <div className="form-group row">
                        <a className="col-md-4"></a>
                        <input type="text" className="form-control col-md-4"
                               name="createName" placeholder="验证码"
                               value={this.state.createName}></input>
                        <a className="col-md-4"></a>
                    </div>
                    <div className="form-group row">
                        <a className="col-md-4"></a>
                        <input type="text" className="form-control col-md-4"
                               name="password" placeholder="密码"
                               value={this.state.password}></input>
                        <a className="col-md-4"></a>
                    </div>
                    <div className="row">
                        <a className="col-md-4 row"></a>
                        <div className="col-md-4">
                            <p onClick={this.btnChange.bind(this, 0)} className="btn btn-default back">返回</p>
                        </div>
                    </div>
                    <div className="row">
                        <a className="col-md-4"></a>
                        <button type="submit" className="btn btn-success col-md-4 text-center">确定</button>
                    </div>
                </form>
            </div>
        )
    }

    render() {
        if (this.state.location == 0) {
            return this.loginPage();
        } else if (this.state.location == 1) {
            return this.passwordPage();
        } else if (this.state.location == 2) {
            return this.registerPage();
        }
    }
}

export default LoginFrom;