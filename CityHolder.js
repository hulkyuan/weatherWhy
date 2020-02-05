import React, { Component } from 'react';
import CitySwitch from './CitySwitch';
import {
    Animated
} from 'react-native';
export default class CityHolder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            duration: 200,
            fadeInAndOut:1,
            offsetX:100
        }
    }
    render() {
        const fadeIn = new Animated.Value(0);
        const offsetTop = new Animated.Value(100);
        const fadeOut = new Animated.Value(1);
        const backToZero = new Animated.Value(0);
        let reverArray = [
            { opacity: fadeIn, offset: offsetTop, targetAlpha: 1, targetOff: 0 },
            { opacity: fadeOut, offset: backToZero, targetAlpha: 0, targetOff: 100 }
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
        ]).start();
        return (
            <Animated.View
                style={{
                    top: 0,
                    opacity: fadeIn,
                    position: 'absolute',
                    left: offsetTop,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'white',
                    zIndex: 999
                }}
            >
                <CitySwitch

                />
            </Animated.View>
        );
    }
}