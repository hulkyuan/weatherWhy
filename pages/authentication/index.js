import React, { Component } from 'react';
import {
    ScrollView, TextInput,
} from 'react-native';
import Button from '@ant-design/react-native/lib/button';
import InputItem from '@ant-design/react-native/lib/input-item'
import List from '@ant-design/react-native/lib/list'
import Icon from '@ant-design/react-native/lib/icon';
import { IconFill} from "@ant-design/icons-react-native";
// import { Button,InputItem } from '@ant-design/react-native/lib';

import { InfoContext } from '../../authContext'

export default class SignInScreen extends Component {
    static contextType = InfoContext;
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null
        }


    }
    setUsername = value => {
        this.setState({
            username: value
        })
    }
    setPassword = value => {
        this.setState({
            password: value
        })
    }
    render() {
        const { username, password } = this.state;
        let value = this.context;
        const { signIn } = value;
        return (
            <ScrollView
                style={{ flex: 1 }}
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>
                <List renderHeader="登陆">
                    <InputItem
                        placeholder="用户名"
                        type="digit"
                        value={username}
                        onChange={this.setUsername}
                    />
                    <InputItem
                        placeholder="密码"
                        value={password}
                        type="password"
                        onChange={this.setPassword}
                    />
                    {/* <IconFill name="account-book" /> */}
                    <List.Item>
                        <Button type="primary" onPress={() => signIn({ username, password })} >登陆</Button>
                    </List.Item>
                </List>
            </ScrollView>
        );
    }

}