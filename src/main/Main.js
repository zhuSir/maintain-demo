import { Layout, Breadcrumb, Icon } from 'antd';
import React, { Component } from 'react';
import 'antd/dist/antd.css';
import logo from '../logo.svg';
import './Main.css'
import SysMenu from './SysMenu';
import SysContent from "./SysContent";

const { Header, Content, Footer, Sider } = Layout;

class SiderDemo extends Component {

    constructor(){
        super();
        this.state={
            collapsed: false,
            mode: 'inline',
            meunType:{
                key:"",
                keyPath:[]
            }
        }

    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    handeleMeunType =(key,keyPath) =>{
        this.setState({
            meunType : {
                key : key,
                keyPath:keyPath
            }
        })
    }

    render() {
        return (
            <Layout>
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={this.state.collapsed}>
                    <div className="logo"/>

                    <SysMenu handeleMeunType={this.handeleMeunType.bind(this)} />

                </Sider>
                <Layout>
                    <Header style={{ background: '#000', padding: 0 }}>
                        <span style={{color:'#fff', paddingLeft:'2%', fontSize:'1.4em'}}>
                            <Icon
                                className="trigger"
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                                style={{cursor: 'pointer'}}
                            />
                        </span>
                        <span style={{color:'#fff', paddingLeft:'2%', fontSize:'1.4em'}}>报障管理系统</span>
                        <span style={{color:'#fff', float:'right', paddingRight:'1%'}}>
                            <img src={logo} className="App-logo" alt="logo" />
                        </span>
                    </Header>

                    <SysContent meunType={this.state.meunType} />

                    <Footer style={{ textAlign: 'center' }}>
                        maintain ©2016 Created by dongdong
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

export default SiderDemo;