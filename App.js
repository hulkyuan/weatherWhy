import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';
// import Geolocation from 'react-native-geolocation-service';
import Geolocation from '@react-native-community/geolocation';

export default class FetchExample extends React.Component {

    geoApi = "https://apis.map.qq.com/ws/geocoder/v1/";

    constructor(props) {
        super(props);
        this.state = { isLoading: true }
    }

    componentDidMount() {
        this.geolocation();
    }
    /**
     * https://wis.qq.com/weather/common
     * source: pc || xw
     * weather_type: forecast_1h|forecast_24h|index|alarm|limit|tips|air|observe
     * observe:天气大概信息
     * observe: {
  "degree": "12",
  "humidity": "62",
  "precipitation": "0.0",
  "pressure": "990",
  "update_time": "202001111521",
  "weather": "阴",
  "weather_code": "02",
  "weather_short": "阴",
  "wind_direction": "3",
  "wind_power": "1"
  },
     * index:一些提示信息
     * {
      "index": {
          "airconditioner": {
              "detail": "您将感到很舒适，一般不需要开启空调。",
              "info": "较少开启",
              "name": "空调开启"
          },
          "allergy": {
              "detail": "天气条件极不易诱发过敏，可放心外出，享受生活。",
              "info": "极不易发",
              "name": "过敏"
          },
          "carwash": {
              "detail": "适宜洗车，未来持续两天无雨天气较好，适合擦洗汽车，蓝天白云、风和日丽将伴您的车子连日洁净。",
              "info": "适宜",
              "name": "洗车"
          },
          "chill": {
              "detail": "感觉有点凉，室外活动注意适当增减衣物。",
              "info": "凉",
              "name": "风寒"
          },
          "clothes": {
              "detail": "建议着厚外套加毛衣等服装。年老体弱者宜着大衣、呢外套加羊毛衫。",
              "info": "较冷",
              "name": "穿衣"
          },
          "cold": {
              "detail": "各项气象条件适宜，无明显降温过程，发生感冒机率较低。",
              "info": "少发",
              "name": "感冒"
          },
          "comfort": {
              "detail": "白天天气阴沉，您会感觉偏冷，不很舒适，请注意添加衣物，以防感冒。",
              "info": "较不舒适",
              "name": "舒适度"
          },
          "diffusion": {
              "detail": "气象条件较不利于空气污染物稀释、扩散和清除。",
              "info": "较差",
              "name": "空气污染扩散条件"
          },
          "dry": {
              "detail": "阴天，路面比较干燥，路况较好。",
              "info": "干燥",
              "name": "路况"
          },
          "drying": {
              "detail": "天气阴沉，不利于水分的迅速蒸发，不太适宜晾晒。若需要晾晒，请尽量选择通风的地点。",
              "info": "不太适宜",
              "name": "晾晒"
          },
          "fish": {
              "detail": "天气不好，有风，不适合垂钓。",
              "info": "不宜",
              "name": "钓鱼"
          },
          "heatstroke": {
              "detail": "天气不热，在炎炎夏日中十分难得，可以告别暑气漫漫啦~",
              "info": "无中暑风险",
              "name": "中暑"
          },
          "makeup": {
              "detail": "皮肤易缺水，用润唇膏后再抹口红，用保湿型霜类化妆品。",
              "info": "保湿",
              "name": "化妆"
          },
          "mood": {
              "detail": "天气阴沉，会感觉莫名的压抑，情绪低落，此时将所有的悲喜都静静地沉到心底，在喧嚣的尘世里，感受片刻恬淡的宁静。",
              "info": "较差",
              "name": "心情"
          },
          "morning": {
              "detail": "早晨气象条件较适宜晨练，但天气阴沉，风力稍大，请选择合适的地点晨练。",
              "info": "较适宜",
              "name": "晨练"
          },
          "sports": {
              "detail": "有降水，推荐您在室内进行各种健身休闲运动，若坚持户外运动，须注意保暖并携带雨具。",
              "info": "较不宜",
              "name": "运动"
          },
          "sunglasses": {
              "detail": "白天天空阴沉，但太阳辐射较强，建议佩戴透射比1级且标注UV380-UV400的浅色太阳镜",
              "info": "必要",
              "name": "太阳镜"
          },
          "sunscreen": {
              "detail": "属弱紫外辐射天气，长期在户外，建议涂擦SPF在8-12之间的防晒护肤品。",
              "info": "弱",
              "name": "防晒"
          },
          "time": "20200111",
          "tourism": {
              "detail": "天气较好，温度适宜，总体来说还是好天气哦，这样的天气适宜旅游，您可以尽情地享受大自然的风光。",
              "info": "适宜",
              "name": "旅游"
          },
          "traffic": {
              "detail": "阴天，路面干燥，交通气象条件良好，车辆可以正常行驶。",
              "info": "良好",
              "name": "交通"
          },
          "ultraviolet": {
              "detail": "属弱紫外线辐射天气，无需特别防护。若长期在户外，建议涂擦SPF在8-12之间的防晒护肤品。",
              "info": "最弱",
              "name": "紫外线强度"
          },
          "umbrella": {
              "detail": "阴天，但降水概率很低，因此您在出门的时候无须带雨伞。",
              "info": "不带伞",
              "name": "雨伞"
          }
      }
  }
     * tips:整个大页面文字提示
     * "tips": {
        "observe": {
          "0": "天暗下来，你就是阳光~",
          "1": "现在的温度比较凉爽~"
          }
        }
     * air:空气质量数据
     * "air": {
        "aqi": 51,
        "aqi_level": 2,
        "aqi_name": "良",
        "co": "1.2",
        "no2": "38",
        "o3": "46",
        "pm10": "52",
        "pm2.5": "31",
        "so2": "7",
        "update_time": "20200111150000"
      }
     * province: 重庆
     * city: 重庆
     * county: 渝北
     */

    /**
     * 获取地址信息
     * https://apis.map.qq.com/ws/geocoder/v1/
     * key:3BFBZ-ZKD3X-LW54A-ZT76D-E7AHO-4RBD5
     * location:29.5518871,106.5141759
     * 
     * {
      "status": 0,
      "message": "query ok",
      "request_id": "61e99ada-3447-11ea-9521-52540007c7bc",
      "result": {
          "location": {
              "lat": 29.551887,
              "lng": 106.514176
          },
          "address": "重庆市渝中区嘉陵江滨江路",
          "formatted_addresses": {
              "recommend": "渝中区化龙桥翠湖天地SOHO LOFT北",
              "rough": "渝中区化龙桥翠湖天地SOHO LOFT北"
          },
          "address_component": {
              "nation": "中国",
              "province": "重庆市",
              "city": "重庆市",
              "district": "渝中区",
              "street": "嘉陵江滨江路",
              "street_number": "嘉陵江滨江路"
          },
          "ad_info": {
              "nation_code": "156",
              "adcode": "500103",
              "city_code": "156500000",
              "name": "中国,重庆市,重庆市,渝中区",
              "location": {
                  "lat": 29.537729,
                  "lng": 106.5
              },
              "nation": "中国",
              "province": "重庆市",
              "city": "重庆市",
              "district": "渝中区"
          },
          "address_reference": {
              "street_number": {
                  "id": "",
                  "title": "",
                  "location": {
                      "lat": 29.565809,
                      "lng": 106.547119
                  },
                  "_distance": 51.8,
                  "_dir_desc": "南"
              },
              "business_area": {
                  "id": "209777636837993855",
                  "title": "化龙桥",
                  "location": {
                      "lat": 29.552299,
                      "lng": 106.514
                  },
                  "_distance": 0,
                  "_dir_desc": "内"
              },
              "famous_area": {
                  "id": "209777636837993855",
                  "title": "化龙桥",
                  "location": {
                      "lat": 29.552299,
                      "lng": 106.514
                  },
                  "_distance": 0,
                  "_dir_desc": "内"
              },
              "crossroad": {
                  "id": "637304",
                  "title": "瑞天路/临湖路(路口)",
                  "location": {
                      "lat": 29.552469,
                      "lng": 106.510468
                  },
                  "_distance": 359.4,
                  "_dir_desc": "东"
              },
              "town": {
                  "id": "500103013",
                  "title": "化龙桥街道",
                  "location": {
                      "lat": 29.554314,
                      "lng": 106.535583
                  },
                  "_distance": 0,
                  "_dir_desc": "内"
              },
              "street": {
                  "id": "4411341731887188327",
                  "title": "嘉陵江滨江路",
                  "location": {
                      "lat": 29.565809,
                      "lng": 106.547119
                  },
                  "_distance": 51.8,
                  "_dir_desc": "南"
              },
              "landmark_l2": {
                  "id": "11197037626347392365",
                  "title": "翠湖天地SOHO LOFT",
                  "location": {
                      "lat": 29.550381,
                      "lng": 106.514214
                  },
                  "_distance": 167.8,
                  "_dir_desc": "北"
              }
          }
      }
  }
     */
    geolocation = () => {
        Geolocation.getCurrentPosition((info) => {
            const { coords } = info;
            this.setState({
                latitude: coords.latitude,
                longitude: coords.longitude
            });
            let param = {
                key: '3BFBZ-ZKD3X-LW54A-ZT76D-E7AHO-4RBD5', location: coords.latitude + coords.longitude
            }
            fetch(this.geoApi + `?key=3BFBZ-ZKD3X-LW54A-ZT76D-E7AHO-4RBD5&location=${coords.latitude + ',' + coords.longitude}`)
                .then((response) => {
                    if(response.ok){
                        return response.json();
                    }else{
                        throw new Error('Network response was not ok.');
                    }
                })
                .then((responseJson) => {
                    console.log(responseJson);
                })
        });
    }
    fetchWeather = () => {
        return fetch('http://movie.mtime.com/comingsoon/')
            .then((response) => response.text())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,

                });

            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {


        return (
            <View style={{ flex: 1 }}>
                {/* <WebView
          source={{ uri: 'http://movie.mtime.com/comingsoon/' }}
          style={{ marginTop: 20 }}
        /> */}
            </View>
        );
    }
}