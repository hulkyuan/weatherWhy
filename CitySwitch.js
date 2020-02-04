import React, { Component } from 'react';
import {
    View, Text, StyleSheet,
    FlatList, TouchableOpacity, ActivityIndicator,
    TextInput, SafeAreaView, Button,
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
        flex: 1, paddingLeft: 30, paddingTop: 15
    },
    searchItem: {
        fontSize: 20, paddingBottom: 15
    }
});

export default class CitySwitch extends Component {
    queryTimeout = 0;
    /**
         * 查询城市source=xw&city=??
         */
    matchApi = 'https://wis.qq.com/city/matching';
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            list: [],
            heartBeat: 500,
            source: 'xw',
            result: ''
        }
    }
    render() {
        const { searchText, list, result, loading } = this.state;
        return (
            <SafeAreaView style={styles.searchPanel}>
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
                        {loading &&
                            <View >
                                <ActivityIndicator size="small" color="lightblue" />
                            </View>
                        }
                        {result !== '' &&
                            <Text>{result}</Text>
                        }
                        {result === '' &&
                            <FlatList
                                data={list}
                                renderItem={this.createSearchItem}
                            />
                        }
                    </View>
                </View>
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
        this.props.weatherFecth(data, item.type);
    }
    onChangeText = (text) => {
        clearTimeout(this.queryTimeout);
        this.setState({
            searchText: text
        }, () => {
            if (!text) {
                this.setState({
                    result: ''
                })
                return;
            }
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
        this.setState({
            loading: true
        });
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
                        list,
                        result: list.length === 0 ? '未找到结果' : '',
                        loading: false
                    });
                }
            })
    }

}