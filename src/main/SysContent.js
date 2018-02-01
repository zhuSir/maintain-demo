import React, {Component } from 'react';
import { Layout, Breadcrumb } from 'antd';
import 'antd/dist/antd.css';
import Records from '../components/records/Records';

const { Content } = Layout;
const { BreadcrumbItem } = Breadcrumb.Item;

class SysContent extends Component{
    render(){
        console.log(this.props.meunType);
        const keyPaths = this.props.meunType.keyPath;
        const routes = [{
            path: 'index',
            breadcrumbName: '首页'
        }, {
            path: 'first',
            breadcrumbName: '一级面包屑'
        }, {
            path: 'second',
            breadcrumbName: '当前页面'
        }];

        return(
            <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '12px 0' }} routes={routes}>
                </Breadcrumb>
                <div style={{ padding: 24, background: '#fff', minHeight: 780 }}>
                    <Records />
                </div>
            </Content>
        );
    }

}

export default SysContent