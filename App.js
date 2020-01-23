import React, { Component } from 'react';
import { View, Image, Text, StyleSheet, Dimensions, ScrollView, FlatList, SectionList } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import queryString from 'query-string';
import Location from './assets/images/svg/ios-pin.svg';
import LinearGradient from 'react-native-linear-gradient';
import WeatherComponent from './WeatherComponent';
import { windCode } from './WeatherConfig'

const styles = StyleSheet.create({
    section1: {
        //flex: 5,
        position: 'relative', alignItems: "center", width: '100%', paddingTop: 40
    },
    layer: {
        width: "100%",
        position: "absolute",
        bottom: 0
    },
    layerImage: {
        width: '100%',
        height: 132,
        // resizeMode:'contain'
    },
    section2: {
        flex: 4,
        justifyContent: "flex-start",
        backgroundColor: 'white',
    },
    section3: {
        flex: 3,
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        borderTopColor: '#cccccc',
        borderTopWidth: 1,
        backgroundColor: 'white',
    },
    lightColor: {
        color: 'white'
    },
    darkColor: {
        color: '#434343'
    },
    todayTop: {
        flex: 1,
        flexDirection: 'row',
    },
    today24hours: {
        flex: 2,
        flexDirection: 'row',
        paddingTop: 10,
    },
    weekNumberStyle: {
        fontSize: 20
    },
    degreeNumberStyle: {
        fontSize: 18
    },
    maxDegreeStyle: {
        fontSize: 18,
    },
    minDegreeStyle: {
        fontSize: 18,
        color: 'grey'
    },
    iconStyle: {
        width: 16,
        height: 16
    },
    font22: {
        fontSize: 22
    },
    font20: {
        fontSize: 20
    },
    observeTitle: {
        fontSize: 14, color: 'grey', flex: 1
    },
    observeLine: {
        paddingTop: 5, paddingBottom: 5, flexDirection: "row"
    },
    observeInfo: {
        fontSize: 20, flex: 2
    },
    borderBottom: {
        borderBottomColor: '#cccccc', borderBottomWidth: 1
    }
});
const skyLine = {
    day: {
        d1: {
            colors: ['#86c3ca', '#b5e9e8']
        },
        d2: {
            colors: ['#43697f', '#abd2d7']
        },
        d3: {
            colors: ['#67a1dc', '#a8e0f7']
        },
        d4: {
            colors: ['#9b9b96', '#c1c1bc']
        },
        d5: {
            colors: ['#c09461', '#eedfa1']
        },
        d6: {
            colors: ['#50ade8', '#7ae0fa']
        },
        d7: {
            colors: ['#81aedc', '#a9def1']
        }
    },
    night: {
        n1: {
            colors: ['#313877', '#44abec']
        }
    },
    deg: -90
}
const layer_w = 264;
const layer_h = 910;

export default class FetchExample extends Component {

    geoApi = "https://apis.map.qq.com/ws/geocoder/v1/";//经纬度转换城市
    weatherApi = "https://wis.qq.com/weather/common";//城市天气
    /**
     * 查询城市source=xw&city=??
     */
    matchApi = 'https://wis.qq.com/city/matching';

    constructor(props) {
        super(props);
        this.state = {
            address_component: null,
            latitude: '29.552469',
            longitude: '106.510468',
            weatherData: null
        }
    }
    chooseDayLine = (weather) => {

    }
    componentDidMount() {
        this.geolocation();
    }
    geolocation = () => {
        Geolocation.getCurrentPosition((info) => {
            let { coords } = info;
            coords = {
                latitude: '29.66741302',
                longitude: '106.56316441'
            };
            this.setState({
                latitude: coords.latitude,
                longitude: coords.longitude
            });
            let param = {
                key: '3BFBZ-ZKD3X-LW54A-ZT76D-E7AHO-4RBD5', location: coords.latitude + "," + coords.longitude
                // key: '3BFBZ-ZKD3X-LW54A-ZT76D-E7AHO-4RBD5', location: coords.latitude + "," + coords.longitude
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
            weather_type: 'forecast_1h|forecast_24h|index|alarm|limit|tips|air|observe|rise',
            ...location,
        }
        fetch(this.weatherApi + `?${queryString.stringify(param)}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok.');
                }
            })
            .then((responseJson) => {
                this.reBuildForecast(responseJson.data);

            })
    }
    reBuildForecast = (data) => {
        let { forecast_24h, forecast_1h } = data;
        let forecast_arr24 = [];
        let forecast_arr1 = []
        for (let i in forecast_24h) {
            forecast_arr24.push(forecast_24h[i]);
        }
        for (let i in forecast_1h) {
            forecast_arr1.push(forecast_1h[i]);
        }
        data.forecast_24h = forecast_arr24;
        data.forecast_1h = forecast_arr1;
        this.setState({
            weatherData: data
        })
    }
    render() {
        const _hscale = Dimensions.get('window').height / layer_h;
        const deviceHeight=Dimensions.get('window').height;
        //{"fontScale": 1, "height": 896, "scale": 2, "width": 414}
        const _hoffset = Math.ceil(_hscale * layer_w - layer_w);
        const { address_component } = this.state;
        styles.layer = {
            ...styles.layer,
            //bottom: _hoffset
        }
        console.log(Dimensions.get('window').height);
        return (
            <ScrollView style={{ position: "relative", flex: 1 }}>
                {/* <LinearGradient colors={['#50ade8', '#7ae0fa']} angle={-90}></LinearGradient> */}
                <View style={{ ...styles.section1, backgroundColor: 'lightblue', height:deviceHeight/2}}>
                    <Text style={{ fontSize: 16, color: 'white' }}>
                        <Location style={styles.iconStyle} fill="white" />
                        {address_component && this.showAddress()}
                    </Text>
                    {this.showBreifObserve()}
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
                {/* 底部天气界面部分 */}
                <View style={styles.section2}>
                    {this.createListItem()}
                </View>
                <View style={styles.section3}>
                    {this.showMoreObserve()}
                </View>
            </ScrollView >
        );
    }
    createListItem = () => {
        const { weatherData } = this.state;
        if (!weatherData || !weatherData.forecast_24h) {
            return false;
        } else {
            let { forecast_24h } = weatherData;
            forecast_24h = forecast_24h.slice(1, forecast_24h.length);
            forecast_24h = forecast_24h.map((item, index) => {
                return {
                    ...item,
                    key: index.toString()
                }
            })
            return (
                <SectionList
                    renderItem={this.weekInfo}
                    sections={[
                        { data: forecast_24h.slice(0, 1), renderItem: this.overrideRenderItem },
                        { title: 'yeah', data: forecast_24h.slice(1, forecast_24h.length) },
                    ]}
                    renderSectionHeader={this.getToday24Info}
                />
            );

        }

    }
    /**
     * 重写list头部样式
     */
    overrideRenderItem = ({ item }) => {
        return (
            <View style={{ paddingTop: 20 }}>
                {this.getTodayDegree()}
                {/* <View style={styles.today24hours}>
                    {this.getToday24Info()}
                </View> */}
            </View>);

    }
    // section1 start 
    /**
     * 顶部信息
     */
    showBreifObserve = () => {
        const { weatherData } = this.state;
        if (!weatherData || !weatherData.observe) {
            return false;
        } else {
            const { observe, tips } = weatherData;
            return (
                <View style={{ alignItems: "center", position: 'relative', zIndex: 999 }}>
                    <Text style={{ fontSize: 50, ...styles.lightColor, paddingTop: 10 }}>{observe.degree}°</Text>
                    <Text style={{ fontSize: 22, ...styles.lightColor, padding: 5 }}>{observe.weather_short}</Text>
                    <Text style={{ ...styles.lightColor, ...styles.degreeNumberStyle, padding: 5 }}>{tips.observe[0]}</Text>
                </View>
            );
        }
    }
    //section1 end
    //section3 start
    showMoreObserve = () => {
        const { weatherData } = this.state;
        if (!weatherData || !weatherData.observe) {
            return false;
        } else {
            const { observe, air, rise } = weatherData;
            const updateTime = observe.update_time.substring(8, 10) + ':' + observe.update_time.substring(10);
            return (
                <View style={{ flex: 1 }}>
                    <View style={{ ...styles.borderBottom, flex: 1 }}>
                        <Text style={{ ...styles.observeInfo, padding: 10, paddingLeft: 20 }}>中央气象台 {updateTime}发布</Text>
                    </View>
                    <View style={{ paddingLeft: 20, paddingRight: 20, flex: 1 }}>
                        <View style={{ ...styles.borderBottom, ...styles.observeLine, flex: 1 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.observeTitle}>日出</Text>
                                <Text style={styles.observeInfo}>{rise['0'].sunrise}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.observeTitle}>日落</Text>
                                <Text style={styles.observeInfo}>{rise['0'].sunset}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ paddingLeft: 20, paddingRight: 20, flex: 1 }}>
                        <View style={{ ...styles.borderBottom, ...styles.observeLine, flex: 1 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.observeTitle}>空气指数</Text>
                                <Text style={styles.observeInfo}>{air.aqi}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.observeTitle}>空气质量</Text>
                                <Text style={styles.observeInfo}>{air.aqi_name}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ paddingLeft: 20, paddingRight: 20, flex: 1 }}>
                        <View style={{ ...styles.borderBottom, ...styles.observeLine, flex: 1 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.observeTitle}>气压</Text>
                                <Text style={styles.observeInfo}>{observe.pressure}百帕</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.observeTitle}>湿度</Text>
                                <Text style={styles.observeInfo}>{observe.humidity}%</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ paddingLeft: 20, paddingRight: 20, flex: 1 }}>
                        <View style={{ ...styles.observeLine, flex: 1 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.observeTitle}>降水量</Text>
                                <Text style={styles.observeInfo}>{observe.precipitation}%</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.observeTitle}>风速</Text>
                                <Text style={styles.observeInfo}>{windCode[observe.wind_direction]} {observe.wind_power}级</Text>
                            </View>
                        </View>
                    </View>
                </View >
            );
        }
    }

    //section2 start
    /**
     * 今日天气
     */
    getTodayDegree = () => {
        const { weatherData } = this.state;
        if (!weatherData || !weatherData.forecast_24h) {
            return false;
        } else {
            let { forecast_24h } = weatherData;
            let today = forecast_24h[1];
            return (
                <View style={{ ...styles.todayTop, paddingLeft: 20, paddingRight: 10 }} >
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', }}>
                        <Text style={styles.degreeNumberStyle}>{this.getDay(Date.now())} </Text>
                        <Text style={styles.weekNumberStyle - 4}> 今天</Text>
                    </View>
                    <View style={{ flex: 1 }}></View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text style={styles.degreeNumberStyle}>{today.max_degree} </Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={styles.minDegreeStyle}> {today.min_degree}</Text>
                        </View>
                    </View>
                </View>
            );
        }
    }
    /**
     * 显示此刻到未来24小时天气
     */
    getToday24Info = ({ section }) => {
        if (!section.title) {
            return;
        }
        const { weatherData } = this.state;
        if (!weatherData || !weatherData.forecast_1h) {
            return false;
        } else {
            let { forecast_1h } = weatherData;
            forecast_1h = forecast_1h.map((item, index) => {
                return {
                    ...item,
                    key: index.toString()
                }
            })
            forecast_1h = forecast_1h.slice(0, 24);
            return (
                <View style={{ ...styles.today24hours, backgroundColor: 'white' }}>
                    <FlatList
                        data={forecast_1h}
                        horizontal={true}
                        renderItem={({ item }) => {
                            const hour = item.update_time.substring(8, 10);
                            const min = item.update_time.substring(10, 12);
                            return (
                                <View style={{ alignItems: 'center', padding: 15, justifyContent: "space-around", borderTopColor: '#cccccc', borderBottomColor: '#cccccc', borderStyle: "solid", borderTopWidth: 1, borderBottomWidth: 1 }}>
                                    <Text style={styles.degreeNumberStyle}>{hour}:{min}</Text>
                                    <WeatherComponent weatherCode={item.weather_code}></WeatherComponent>
                                    <Text style={styles.degreeNumberStyle}>{item.degree}°</Text>
                                </View>
                            );
                        }}
                    />
                </View>
            );
        }
    }
    /**
     * 未来一周天气（不包含今日）
     */
    weekInfo = ({ item }) => {
        return (
            <View style={{ flexDirection: 'row', padding: 10, paddingLeft: 20, justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.degreeNumberStyle}>{this.getDay(item.time)}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                    <WeatherComponent weatherCode={item.day_weather_code}></WeatherComponent>
                    <WeatherComponent weatherCode={item.night_weather_code}></WeatherComponent>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Text style={styles.degreeNumberStyle}>{item.max_degree}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={styles.minDegreeStyle}>{item.min_degree}</Text>
                    </View>
                </View>
            </View>
        );
    }

    /**
     * 地址处理
     */
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
    /**
     * 获取从当前时间到未来24小时天气
     */
    getFromNowToNext24Hours = () => {
        const now = new Date().getHours();
        const { weatherData } = this.state;
        if (!weatherData || !weatherData.forecast_1h) {
            return false;
        } else {
            const { forecast_1h } = this.state.weatherData;
        }

    }
    /**
     * 显示工作日
     */
    getDay = (time) => {
        const day = new Date(time).getDay();
        switch (day) {
            case 1:
                return '星期一';
            case 2:
                return '星期二';
            case 3:
                return '星期三';
            case 4:
                return '星期四';
            case 5:
                return '星期五';
            case 6:
                return '星期六';
            case 0:
                return '星期日';
            default:
                return '坏天气'
        }

    }

}