import React, { Component } from 'react';
import {
    View, Image, SafeAreaView, Text,
} from 'react-native';
import { InfoContext } from '../../authContext'
import List from '@ant-design/react-native/lib/list'
import Button from '@ant-design/react-native/lib/button';
import Modal from '@ant-design/react-native/lib/modal'
import Provider from '@ant-design/react-native/lib/provider'
import WhiteSpace from '@ant-design/react-native/lib/white-space';
// import Icon from '@ant-design/react-native/lib/icon';
import Icon from 'react-native-vector-icons/AntDesign';
// import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import { commonStyles } from '../util/styles'

export default class SignOutScreen extends Component {
    static contextType = InfoContext;
    constructor(props) {
        super(props);
        this.state = {
            userInfo: {},
            modalVisible: false
        }
    }
    async componentDidMount() {
        let userToken;
        try {
            userToken = await AsyncStorage.getItem('userToken');
            if (userToken) {
                this.setState({
                    userInfo: JSON.parse(userToken)
                })
            }
        } catch (e) {
        }
    }
    render() {
        let value = this.context;
        const { signOut } = value;
        const { userInfo, modalVisible } = this.state;
        const footerButtons = [
            {
                text: '取消', onPress: () => {
                    this.setState({
                        modalVisible: false
                    })
                }
            },
            {
                text: '确认', onPress: () => {
                    signOut();
                    this.setState({
                        modalVisible: false
                    })
                }
            },
        ];
        return (
            <Provider>
                <SafeAreaView>
                    <View style={{ backgroundColor: 'white', padding: 15 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ paddingLeft: 0,margin: 15, marginLeft: 15 }}>
                                {/* <Icon name="twitter" size={55} color="#1da1f2"/> */}
                                <Image
                                    style={{ width: 80, height: 80,borderRadius:8 }}
                                    source={{
                                        uri: 'http://p1.music.126.net/TJZJtXxxh62ruulntlIL_A==/109951165539239539.jpg?param=180y180',
                                    }}
                                />
                            </View>
                            <View style={{ justifyContent: 'space-evenly' }}>
                                <Text style={commonStyles.font20}>{userInfo.username}</Text>
                                <Text style={{  ...commonStyles.lightColor }}>二流码农袁飘飘</Text>
                            </View>

                        </View>
                    </View>
                    <WhiteSpace />
                    <List>
                        <List.Item extra={<Icon name="right" size={30} color="#606770" />} onPress={() => { }}>
                            {userInfo.username} 
                            {/* <Icon name="rocket" size={30} color="#900" /> */}
                        </List.Item>
                    </List>
                    <WhiteSpace />
                    <Button style={{ borderRadius: 0 }} onPress={() => { this.setState({ modalVisible: true }) }} >退出登陆</Button>
                    <Modal
                        title="确认登出?"
                        transparent={true}
                        visible={modalVisible}
                        footer={footerButtons}
                    ></Modal>
                </SafeAreaView>
            </Provider>
        );
    }

}