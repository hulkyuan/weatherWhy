import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './pages/home';
import Setting from './pages/setting'
import SplashScreen from './pages/splash'
import SignScreen from './pages/authentication'
import SignupScreen from './pages/authentication/SignupScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-community/async-storage';
import CitySwitch from './pages/home/CitySwitch';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AuthContext = React.createContext();
import {InfoContext} from './authContext'


export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            userToken: null,
            isSignout: true
        }
    }
    authContext = () => ({
        signIn: async data => {
            this.setState({
                isSignout: false,
                userToken: 'dummy-auth-token',
            })
        },
        signOut: () => {
            this.setState({
                isSignout: true,
                userToken: null,
            })
        },
        signUp: async data => {

        },
    });
    componentDidMount() {
        this.checkToken();
    }
    checkToken = async () => {
        let userToken;
        const res =  new Promise((resolve, reject) => {
            setTimeout(function (){resolve({ code: 200 })}, 2000);
        })
        try {
            userToken = await AsyncStorage.getItem('userToken');
        } catch (e) {
        }
        this.setState({
            isLoading: false,
        })
    }
    //保护路由
    render() {
        const { isLoading, userToken, isSignout } = this.state;
        if (isLoading) {
            return <SplashScreen />;
        }

        return (
            <InfoContext.Provider value={this.authContext()}>
                <NavigationContainer>
                    {
                        userToken === null
                            ?
                            <Stack.Navigator >
                                <Stack.Screen name="SignIn" component={SignScreen} options={{
                                    title: '登陆',
                                }} />
                            </Stack.Navigator>
                            :
                            <Tab.Navigator>
                                <Tab.Screen name="Home" component={HomeScreen} options={{ title: '首页' }} />
                                <Tab.Screen name="City" component={CitySwitch} options={{ title: '城市天气'}} />
                                <Tab.Screen name="Setting" component={Setting} options={{ title: '设置' }} />
                            </Tab.Navigator>
                    }
                </NavigationContainer>
            </InfoContext.Provider>

        );
    }

}