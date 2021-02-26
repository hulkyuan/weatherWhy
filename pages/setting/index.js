import React, { Component } from 'react';
import {
    View, TextInput, SafeAreaView, Button, Text
} from 'react-native';
import { InfoContext } from '../../authContext'

export default class SignOutScreen extends Component {
    static contextType = InfoContext;
    constructor(props) {
        super(props);
    }
    render() {
        let value = this.context;
        const { signOut } = value;
        return (
            <SafeAreaView>
                <Button title="登出" onPress={() => signOut()} />
            </SafeAreaView>
        );
    }

}