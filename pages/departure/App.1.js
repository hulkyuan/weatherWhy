import React, { Component } from 'react';
import {
    View, Image, Text, StyleSheet, Dimensions,
    ScrollView, FlatList, SectionList, TouchableOpacity,
    TextInput, SafeAreaView, Button, Animated, Easing
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import queryString from 'query-string';
import Location from './assets/images/svg/ios-pin.svg';
import NavigateIcon from './assets/images/svg/ios-navigate.svg'
import CitySwtich from './CitySwitch';
import LinearGradient from 'react-native-linear-gradient';
import WeatherComponent from './WeatherComponent';
import { windCode } from './WeatherConfig';

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
        width: 20,
        height: 20
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
    },
    searchPanel: {
        width: '100%', height: '100%', backgroundColor: 'white', position: 'absolute', top: 0, left: 0, zIndex: 999,
    },
    searchBar: {
        paddingLeft: 20, flexDirection: 'row', alignItems: 'center', height: 60, paddingTop: 10
    },
    searchInputContainer: {
        flex: 4
    },
    searchInput: {
        borderWidth: 1, borderColor: '#cccccc', fontSize: 20, padding: 10, borderRadius: 10,
    },
    searchCloseBtn: {
        flex: 1
    },
    searchList: {
        flex: 1, paddingLeft: 30
    },
    searchItem: {
        fontSize: 20, paddingTop: 15
    },
    windHumidity: {
        padding: 5, position: "absolute", color: 'white', fontSize: 18
    }
});
const layer_w = 264;
const layer_h = 910;
const animtionDuration = 1000;
// 备份版本 2月3日版本
export default class FetchExample extends Component {

    geoApi = "https://apis.map.qq.com/ws/geocoder/v1/";//经纬度转换城市
    weatherCommonApi = "https://wis.qq.com/weather/common";//china weather
    weatherTouristApi = 'https://wis.qq.com/weather/tourist';//tourist weather
    weatherExternalApi = 'https://wis.qq.com/weather/external';//external weather
    /**
     * 查询城市source=xw&city=??
     */
    matchApi = 'https://wis.qq.com/city/matching';
    queryTimeout = 0;
    constructor(props) {
        super(props);
        this.state = {
            address_component: null,
            latitude: '29.552469',
            longitude: '106.510468',
            weatherData: null,
            searchPanel: false,
            searchText: '',
            source: 'xw',
            heartBeat: 500,
            type: 'common', //3种天气请求类型
            list: [],//搜索的城市列表
        }
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
    getCurrentLocation = () => {
        this.onCloseSearchPanel();
        this.geolocation();
    }
    // weatherFecth = (location, type) => {
    //     this.setState({
    //         address_component: location
    //     });
    //     let url, info;
    //     if (type === 'tourist') {
    //         url = this.weatherTouristApi;
    //         info = 'forecast_1h|forecast_24h|tips|observe|rise';
    //     } else if (type === "external") {
    //         url = this.weatherExternalApi;
    //         info = 'forecast_24h|tips|observe|rise';
    //     } else {
    //         url = this.weatherCommonApi;
    //         info = 'forecast_1h|forecast_24h|index|alarm|limit|tips|air|observe|rise';
    //     }
    //     const param = {
    //         source: this.state.source,
    //         weather_type: info,
    //         ...location,
    //     }
    //     //console.log(location,type,url);
    //     fetch(url + `?${queryString.stringify(param)}`)
    //         .then((response) => {
    //             if (response.ok) {
    //                 return response.json();
    //             } else {
    //                 throw new Error('Network response was not ok.');
    //             }
    //         })
    //         .then((responseJson) => {
    //             this.reBuildForecast(responseJson.data);
    //         })
    // }
    // reBuildForecast = (data) => {
    //     let { forecast_24h, forecast_1h } = data;
    //     let forecast_arr24 = [];
    //     let forecast_arr1 = []
    //     for (let i in forecast_24h) {
    //         forecast_arr24.push(forecast_24h[i]);
    //     }
    //     for (let i in forecast_1h) {
    //         forecast_arr1.push(forecast_1h[i]);
    //     }
    //     data.forecast_24h = forecast_arr24;
    //     data.forecast_1h = forecast_arr1;
    //     this.setState({
    //         weatherData: data
    //     })
    // }
    openCityView = (event) => {
        this.setState({
            searchPanel: true
        });
    }
    /**
     * 城市搜索界面
     */
    // showSearchView = () => {
    //     const { searchText, list } = this.state;
    //     // const fadeAnim = new Animated.Value(-500);
    //     // Animated.timing(
    //     //     fadeAnim,
    //     //     {
    //     //         toValue: 0,
    //     //         duration: 200,
    //     //     }
    //     // ).start();
    //     return (
    //         <SafeAreaView style={styles.searchPanel}>
    //             {/* <Animated.View
    //                 style={{
    //                     top: fadeAnim,
    //                 }}
    //             > */}
    //             <View style={{ flex: 1 }}>
    //                 <View style={{ alignItems: 'center', paddingTop: 10 }}>
    //                     <Text style={{ fontSize: 16 }}>输入城市,旅游景点名或海外城市</Text>
    //                 </View>
    //                 <View style={styles.searchBar}>
    //                     <View style={styles.searchInputContainer}>
    //                         <TextInput
    //                             placeholder="搜索地区"
    //                             onChangeText={this.onChangeText}
    //                             style={styles.searchInput}
    //                             value={searchText}
    //                             autoFocus={true}
    //                             clearButtonMode="always"
    //                         />
    //                     </View>
    //                     <View style={styles.searchCloseBtn}>
    //                         <Button onPress={this.onCloseSearchPanel} title="取消" />
    //                     </View>
    //                 </View>
    //                 <View style={{ padding: 5, paddingLeft: 20 }}>
    //                     <TouchableOpacity onPress={this.getCurrentLocation}>
    //                         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    //                             <NavigateIcon style={{ ...styles.iconStyle, paddingRight: 10 }} fill="lightblue" />
    //                             <Text>获取当前位置</Text>
    //                         </View>
    //                     </TouchableOpacity>
    //                 </View>
    //                 <View style={{ borderBottomColor: 'white', paddingBottom: 1, borderBottomWidth: 1, shadowOpacity: 1, shadowColor: '#cccccc', shadowRadius: 1, shadowOffset: { height: 1 } }}></View>
    //                 <View style={{ ...styles.searchList }}>
    //                     <FlatList
    //                         data={list}
    //                         renderItem={this.createSearchItem}
    //                     />
    //                 </View>
    //             </View>

    //             {/* </Animated.View> */}
    //         </SafeAreaView>

    //     );
    // }
    // createSearchItem = ({ item }) => {
    //     return (
    //         <View >
    //             <TouchableOpacity onPress={() => { this.onChooseCity(item); }}>
    //                 <Text style={styles.searchItem}>{item.name}</Text>
    //             </TouchableOpacity>
    //         </View>
    //     );
    // }
    // onChooseCity = (item) => {
    //     let data;
    //     if (item.type === 'tourist') {
    //         data = {
    //             tourist: item.name
    //         };
    //     } else if (item.type === 'external') {
    //         data = {
    //             country: item.name.split(',')[0] && item.name.split(',')[0].trim(),
    //             city: item.name.split(',')[1] && item.name.split(',')[1].trim(),
    //         }
    //     } else {
    //         data = {
    //             province: item.name.split(',')[0] && item.name.split(',')[0].trim(),
    //             city: item.name.split(',')[1] && item.name.split(',')[1].trim(),
    //             county: item.name.split(',')[2] && item.name.split(',')[2].trim()
    //         }
    //     }
    //     this.onCloseSearchPanel();
    //     this.weatherFecth(data, item.type);
    // }
    onCloseSearchPanel = () => {
        this.setState({
            searchPanel: false
        })
    }
    // onChangeText = (text) => {
    //     clearTimeout(this.queryTimeout);
    //     this.setState({
    //         searchText: text
    //     }, () => {
    //         this.queryTimeout = setTimeout(this.fecthCity, this.state.heartBeat);
    //     });

    // }
    /**
     * 切换城市请求
     */
    // fecthCity = () => {
    //     const { searchText } = this.state;
    //     const param = {
    //         source: this.state.source,
    //         city: searchText
    //     }

    //     fetch(this.matchApi + `?${queryString.stringify(param)}`)
    //         .then((response) => {
    //             if (response.ok) {
    //                 return response.json();
    //             } else {
    //                 Alert.alert(response.statusText);
    //             }
    //         })
    //         .then((responseJson) => {
    //             if (responseJson.data) {
    //                 const { data } = responseJson;
    //                 let list = [];
    //                 for (let prop in data) {
    //                     if (data[prop] instanceof Object) {
    //                         for (let i in data[prop]) {
    //                             const item = { key: i, name: data[prop][i], type: prop }
    //                             list.push(item);
    //                         }
    //                     }
    //                 }
    //                 this.setState({
    //                     list
    //                 });
    //             }
    //         })
    // }
    render() {
        const _hscale = Dimensions.get('window').height / layer_h;
        const deviceHeight = Dimensions.get('window').height;
        //{"fontScale": 1, "height": 896, "scale": 2, "width": 414}
        const _hoffset = Math.ceil(_hscale * layer_w - layer_w);
        const { address_component, searchPanel } = this.state;
        styles.layer = {
            ...styles.layer,
            //bottom: _hoffset
        }
        return (
            <View style={{ position: "relative", flex: 1 }}>
                {
                    searchPanel &&
                    <CitySwtich
                        setOuterState={this.setOuterState}
                        onCloseSearchPanel={this.onCloseSearchPanel}
                        getCurrentLocation={this.getCurrentLocation}
                    ></CitySwtich>
                }
                <LinearGradient colors={['#50ade8', '#7ae0fa']} angle={-90}>
                    <View style={{ ...styles.section1, height: deviceHeight / 2 }}>
                        <TouchableOpacity onPress={this.openCityView} >
                            <Text style={{ ...styles.lightColor, ...styles.font20 }}>
                                <Location style={styles.iconStyle} fill="white" />
                                {address_component && this.showAddress()}
                            </Text>
                        </TouchableOpacity>
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
                </LinearGradient>
                {/* 底部天气界面部分 */}
                <FlatList
                    ListHeaderComponent={
                        <View style={styles.section2}>
                            {this.createListItem()}
                        </View>
                    }
                    ListFooterComponent={
                        <View style={styles.section3}>
                            {this.showMoreObserve()}
                        </View>
                    }
                >
                </FlatList>
            </View >
        );
    }
    setOuterState = (data) => {
        this.setState(
            data
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
            });
            return (
                <View>
                    <SectionList
                        renderItem={this.weekInfo}
                        sections={[
                            { data: forecast_24h.slice(0, 1), renderItem: this.overrideRenderItem },
                            { title: 'yeah', data: forecast_24h.slice(1, forecast_24h.length) },
                        ]}
                        renderSectionHeader={this.getToday24Info}
                    />
                </View>
            );

        }

    }
    /**
     * 重写list头部样式
     */
    overrideRenderItem = ({ item }) => {
        return (
            <View style={{ paddingTop: 10, paddingBottom: 10 }}>
                {this.getTodayDegree(item)}
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
                    <View style={{ position: 'relative' }}>
                        {/* {this.humidityAnimate(observe)} */}


                        {/* <Text style={{ ...styles.windHumidity }}>{windCode[observe.wind_direction]} {observe.wind_power}级</Text> */}

                    </View>
                    <Text style={{ ...styles.lightColor, ...styles.degreeNumberStyle, padding: 5 }}>{tips.observe[0]}</Text>
                </View >
            );
        }
    }
    humidityAnimate = (observe) => {
        const fadeIn = new Animated.Value(0);
        const offsetTop = new Animated.Value(-20);
        const fadeOut = new Animated.Value(1);
        const backToZero = new Animated.Value(0);
        let reverArray = [
            { opacity: fadeIn, offset: offsetTop, targetAlpha: 1, targetOff: 0 },
            { opacity: fadeOut, offset: backToZero, targetAlpha: 0, targetOff: -20 }
        ];

        Animated.parallel([
            Animated.timing(
                reverArray[0].opacity,
                {
                    toValue: reverArray[0].targetAlpha,
                    duration: animtionDuration,
                }
            ),
            Animated.timing(
                reverArray[0].offset,
                {
                    toValue: reverArray[0].targetOff,
                    duration: animtionDuration,
                }
            )
        ]).start(() => {
            reverArray.reverse();
        });

        return (
            <Animated.View
                style={{
                    top: offsetTop,
                    opacity: fadeIn,
                    alignItems: 'center'
                }}
            >
                <Text style={{ ...styles.windHumidity }}>湿度 {observe.humidity}%</Text>
            </Animated.View>
        );
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
                    {rise['0'] &&
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
                    }
                    {air &&
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
                    }
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
                                <Text style={styles.observeInfo}>{Math.round(observe.precipitation * 100)}%</Text>
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
    getTodayDegree = (item) => {
        const { weatherData } = this.state;
        if (!weatherData || !weatherData.forecast_24h) {
            return false;
        } else {
            let { forecast_24h, forecast_1h } = weatherData;
            let today = forecast_24h[1];
            return (
                <View style={{ ...styles.todayTop, paddingLeft: 20, paddingRight: 10 }} >
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', }}>
                        <Text style={styles.degreeNumberStyle}>{this.getDay(Date.now())} </Text>
                        <Text style={styles.weekNumberStyle - 4}> 今天</Text>
                    </View>
                    {forecast_1h.length === 0 &&
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                            <WeatherComponent weatherCode={item.day_weather_code}></WeatherComponent>
                            <WeatherComponent weatherCode={item.night_weather_code}></WeatherComponent>
                        </View>
                    }
                    {forecast_1h.length !== 0 &&
                        <View style={{ flex: 1 }}></View>
                    }
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
                <View>
                    <View style={{ borderBottomColor: '#cccccc', borderBottomWidth: 1 }}></View>
                    <View style={{ ...styles.today24hours, backgroundColor: 'white' }}>
                        <FlatList
                            data={forecast_1h}
                            horizontal={true}
                            renderItem={({ item }) => {
                                const hour = item.update_time.substring(8, 10);
                                const min = item.update_time.substring(10, 12);
                                return (
                                    <View style={{ alignItems: 'center', padding: 15, justifyContent: "space-around" }}>
                                        <Text style={styles.degreeNumberStyle}>{hour}:{min}</Text>
                                        <WeatherComponent weatherCode={item.weather_code}></WeatherComponent>
                                        <Text style={styles.degreeNumberStyle}>{item.degree}°</Text>
                                    </View>
                                );
                            }}
                        />
                    </View>
                    <View style={{ borderBottomColor: '#cccccc', borderBottomWidth: 1 }}></View>
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
        if (address_component.country) {
            address_array.push(address_component.country);
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
        if (address_component.tourist) {
            address_array.push(address_component.tourist);
        }
        if (address_array.length === 2) {
            if (address_array[0] === address_array[1]) {
                return address_array.slice(-1).join(' ');
            } else {
                return address_array.join(' ');
            }
        } else {
            return address_array.slice(-2).join(' ');
        }
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