import React,{Component} from 'react';
import { View, Image, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import queryString from 'query-string';
import Location from './assets/images/svg/ios-pin.svg';
const styles = StyleSheet.create({
    section1: {
        width: '100%', height: 470, backgroundColor: 'lightblue', position: 'relative', alignItems: "center", paddingTop: 50
    },
    layer: {
        width: "100%",
        position: "absolute",
        bottom: 0
    },
    layerImage: {
        width: '100%',
        height: 132,
        resizeMode: "contain"
    },
    section2: {
        flexDirection: 'row',
        height: 103,
        backgroundColor: 'white',
        position: 'relative',
        paddingTop: 26,
        marginBottom: 10
    },
});
const layer_w = 264;
const layer_h = 910;

export default class FetchExample extends Component {

    geoApi = "https://apis.map.qq.com/ws/geocoder/v1/";
    weatherApi = "https://wis.qq.com/weather/common";

    constructor(props) {
        super(props);
        this.state = {
            address_component: null,
            latitude: '29.552469',
            longitude: '106.510468',
            weatherData: null
        }
    }

    componentDidMount() {
        this.geolocation();
    }
    geolocation = () => {
        Geolocation.getCurrentPosition((info) => {
            const { coords } = info;
            this.setState({
                latitude: coords.latitude || '29.552469',
                longitude: coords.longitude || '106.510468'
            });
            let param = {
                key: '3BFBZ-ZKD3X-LW54A-ZT76D-E7AHO-4RBD5', location: '29.552469' + "," + '106.510468'
            }
            fetch(this.geoApi + `?${queryString.stringify(param)}`)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        Alert.alert(response.statusText);
                    }
                })
                .then((responseJson) => {
                    const { address_component } = responseJson.result;
                    this.setState({
                        address_component
                    })
                    //console.log(address_component);
                    if (address_component) {
                        this.weatherFecth(address_component);
                    }
                })
        });
    }
    weatherFecth = (location) => {
        const param = {
            source: 'xw',
            weather_type: 'forecast_1h|forecast_24h|index|alarm|limit|tips|air|observe',
            ...location,
        }
        //console.log(queryString.stringify(param));
        fetch(this.weatherApi + `?${queryString.stringify(param)}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok.');
                }
            })
            .then((responseJson) => {
                this.setState({
                    weatherData: responseJson.data
                })
            })
    }
    render() {
        const _hscale = Dimensions.get('window').height / layer_h;
        const _hoffset = Math.ceil(_hscale * layer_w - layer_w);
        const { address_component } = this.state;
        styles.layer = {
            ...styles.layer,
            bottom: _hoffset
        }
        return (
            <View style={{ flex: 1, position: "relative", background: 'linear-gradient(-90deg,#50ade8,#7ae0fa)' }}>
                <View style={styles.section1}>
                    <Text style={{ fontSize: 16 }}>
                        <Location width='16' height='16' fill="white"/>
                        {address_component && this.showAddress()}
                    </Text>
                    {this.showObserve()}
                    <View style={styles.layer}>
                        <Image style={styles.layerImage} source={require('./assets/images/layer1.png')}></Image>
                    </View>
                    <View style={styles.layer}>
                        <Image style={styles.layerImage} source={require('./assets/images/layer2.png')}></Image>
                    </View>
                    <View style={styles.layer}>
                        <Image style={styles.layerImage} source={require('./assets/images/layer3.png')}></Image>
                    </View>
                </View>
                <View style={styles.section2}>

                </View>
            </View>
        );
    }
    showObserve = () => {
        const { weatherData } = this.state;
        if (!weatherData || !weatherData.observe) {
            return false;
        } else {
            const { observe, tips } = weatherData;
            return (
                <View style={{ alignItems: "center", position: 'relative' }}>
                    <Text style={{ fontSize: 62 }}>{observe.degree}</Text>
                    <Text style={{ fontSize: 22 }}>{observe.weather_short}</Text>
                    <Text>湿度 {observe.humidity}%</Text>
                    <Text>北风 {observe.wind_power}级</Text>
                    <Text>{tips.observe[0]}</Text>
                </View>
            );
        }
    }
    showAddress = () => {
        const { address_component } = this.state;
        let address_array = [];
        if (address_component.nation) {
            address_array.push(address_component.nation);
        }
        if (address_component.province) {
            address_array.push(address_component.province);
        }
        if (address_component.city) {
            address_array.push(address_component.city);
        }
        if (address_component.county) {
            address_array.push(address_component.county);
        }
        if (address_component.district) {
            address_array.push(address_component.district);
        }
        return address_array.slice(-2).join(' ');
    }
}