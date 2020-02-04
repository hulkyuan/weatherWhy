import React, { Component } from 'react';
import {
    View, Text, StyleSheet,
    FlatList, TouchableOpacity,ActivityIndicator,
    TextInput, SafeAreaView, Button, Animated, Easing
} from 'react-native';
import queryString from 'query-string';
import NavigateIcon from './assets/images/svg/ios-navigate.svg'
const styles = StyleSheet.create({
    iconStyle: {
        width: 20,
        height: 20
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
    }
});

export default class CitySwitch extends Component {
    queryTimeout = 0;
    /**
         * 查询城市source=xw&city=??
         */
    matchApi = 'https://wis.qq.com/city/matching';
    weatherCommonApi = "https://wis.qq.com/weather/common";//china weather
    weatherTouristApi = 'https://wis.qq.com/weather/tourist';//tourist weather
    weatherExternalApi = 'https://wis.qq.com/weather/external';//external weather
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            list: [],
            heartBeat: 500,
            source: 'xw',
        }
    }
    render() {
        const { searchText, list } = this.state;
        return (
            <SafeAreaView style={styles.searchPanel}>
                {/* <Animated.View
                    style={{
                        top: fadeAnim,
                    }}
                > */}
                <View style={{ flex: 1 }}>
                    <View style={{ alignItems: 'center', paddingTop: 10 }}>
                        <Text style={{ fontSize: 16 }}>输入城市,旅游景点名或海外城市</Text>
                    </View>
                    <View style={styles.searchBar}>
                        <View style={styles.searchInputContainer}>
                            <TextInput
                                placeholder="搜索地区"
                                onChangeText={this.onChangeText}
                                style={styles.searchInput}
                                value={searchText}
                                autoFocus={true}
                                clearButtonMode="always"
                            />
                        </View>
                        <View style={styles.searchCloseBtn}>
                            <Button onPress={this.props.onCloseSearchPanel} title="取消" />
                        </View>
                    </View>
                    <View style={{ padding: 5, paddingLeft: 20 }}>
                        <TouchableOpacity onPress={this.props.getCurrentLocation}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <NavigateIcon style={{ ...styles.iconStyle, paddingRight: 10 }} fill="lightblue" />
                                <Text>获取当前位置</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ borderBottomColor: 'white', paddingBottom: 1, borderBottomWidth: 1, shadowOpacity: 1, shadowColor: '#cccccc', shadowRadius: 1, shadowOffset: { height: 1 } }}></View>
                    <View style={{ ...styles.searchList }}>
                        <FlatList
                            data={list}
                            renderItem={this.createSearchItem}
                        />
                    </View>
                </View>

                {/* </Animated.View> */}
            </SafeAreaView>

        );
    }
    createSearchItem = ({ item }) => {
        return (
            <View >
                <TouchableOpacity onPress={() => { this.onChooseCity(item); }}>
                    <Text style={styles.searchItem}>{item.name}</Text>
                </TouchableOpacity>
            </View>
        );
    }
    onChooseCity = (item) => {
        let data;
        if (item.type === 'tourist') {
            data = {
                tourist: item.name
            };
        } else if (item.type === 'external') {
            data = {
                country: item.name.split(',')[0] && item.name.split(',')[0].trim(),
                city: item.name.split(',')[1] && item.name.split(',')[1].trim(),
            }
        } else {
            data = {
                province: item.name.split(',')[0] && item.name.split(',')[0].trim(),
                city: item.name.split(',')[1] && item.name.split(',')[1].trim(),
                county: item.name.split(',')[2] && item.name.split(',')[2].trim()
            }
        }
        this.props.onCloseSearchPanel();
        this.weatherFecth(data, item.type);
    }
    weatherFecth = (location, type) => {
        // this.setState({
        //     address_component: location
        // });
        this.setOuterState({
            address_component: location
        });
        let url, info;
        if (type === 'tourist') {
            url = this.weatherTouristApi;
            info = 'forecast_1h|forecast_24h|tips|observe|rise';
        } else if (type === "external") {
            url = this.weatherExternalApi;
            info = 'forecast_24h|tips|observe|rise';
        } else {
            url = this.weatherCommonApi;
            info = 'forecast_1h|forecast_24h|index|alarm|limit|tips|air|observe|rise';
        }
        const param = {
            source: this.state.source,
            weather_type: info,
            ...location,
        }
        //console.log(location,type,url);
        fetch(url + `?${queryString.stringify(param)}`)
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
        // this.setState({
        //     weatherData: data
        // })
        this.setOuterState({
            weatherData: data
        });
    }
    onChangeText = (text) => {
        clearTimeout(this.queryTimeout);
        this.setState({
            searchText: text
        }, () => {
            this.queryTimeout = setTimeout(this.fecthCity, this.state.heartBeat);
        });

    }
    setOuterState = (data) => {
        this.props.setOuterState(data);
    }
    /**
 * 切换城市请求
 */
    fecthCity = () => {
        const { searchText } = this.state;
        const param = {
            source: this.state.source,
            city: searchText
        }
        fetch(this.matchApi + `?${queryString.stringify(param)}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    Alert.alert(response.statusText);
                }
            })
            .then((responseJson) => {
                if (responseJson.data) {
                    const { data } = responseJson;
                    let list = [];
                    for (let prop in data) {
                        if (data[prop] instanceof Object) {
                            for (let i in data[prop]) {
                                const item = { key: i, name: data[prop][i], type: prop }
                                list.push(item);
                            }
                        }
                    }
                    this.setState({
                        list
                    });
                }
            })
    }

}