import React, { Component } from 'react';
import {
    View, TextInput,
} from 'react-native';
// import Button from '@ant-design/react-native/lib/button';
import { Button, InputItem, List } from '@ant-design/react-native';
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
            <View>
                <TextInput
                    placeholder="Username"
                    value={username}
                    onChangeText={this.setUsername}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={this.setPassword}
                    secureTextEntry
                />
                <Button  onPress={() => signIn({ username, password })} >登陆</Button>
            </View>
        );
    }

}