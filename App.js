import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './pages/home';
import Setting from './pages/setting'
import SplashScreen from './pages/splash'
import SignScreen from './pages/authentication'
import SignupScreen from './pages/authentication/SignupScreen'
import Icon from 'react-native-vector-icons/AntDesign';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-community/async-storage';
import CitySwitch from './pages/home/CitySwitch';
// import { Font } from 'expo';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AuthContext = React.createContext();
import { InfoContext } from './authContext'


export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            userToken: null,
            isSignout: true,
            isReady: false,
        }
    }
    authContext = () => ({
        signIn: async data => {
            AsyncStorage.setItem('userToken', JSON.stringify(data));
            this.setState({
                isSignout: false,
                userToken: data,
            })
        },
        signOut: () => {
            this.setState({
                isSignout: true,
                userToken: null,
            })
        },
        signUp: async data => {
            AsyncStorage.clear();
        },
    });
    componentDidMount() {
        this.checkToken();
        // await Font.loadAsync(
        //     'antoutline',
        //     require('@ant-design/icons-react-native/fonts/antoutline.ttf')
        // );

        // await Font.loadAsync(
        //     'antfill',
        //     require('@ant-design/icons-react-native/fonts/antfill.ttf')
        // );
        // this.setState({ isReady: true });
    }
    checkToken = async () => {
        let userToken;
        const res = new Promise((resolve, reject) => {
            setTimeout(function () { resolve({ code: 200 }) }, 2000);
        })
        try {
            userToken = await AsyncStorage.getItem('userToken');
            if (userToken) {
                this.setState({
                    userToken
                })
            }
        } catch (e) {
        }
        this.setState({
            isLoading: false,
        })
    }
    HomeStack = () => {
        return (
            <Tab.Navigator>
                <Tab.Screen name="Home" component={HomeScreen}
                    options={{
                        title: '天气',
                        tabBarIcon: ({ color, size }) => {
                            return <Icon name="cloud" color={color} size={20} />
                        }
                    }} />
                <Tab.Screen name="Setting" component={Setting}
                    options={{
                        title: '设置',
                        tabBarIcon: ({ color, size }) => {
                            return <Icon name="user" color={color} size={20} />
                        }
                    }} />
            </Tab.Navigator>

        );
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
                            <Stack.Navigator headerMode='none'>
                                <Stack.Screen name="Home" component={this.HomeStack} options={{ title: '首页' }} />
                                <Stack.Screen name="City" component={CitySwitch} options={{ title: '城市天气', tabBarVisible: false }} />
                            </Stack.Navigator>
                    }
                </NavigationContainer>
            </InfoContext.Provider>

        );
    }

}