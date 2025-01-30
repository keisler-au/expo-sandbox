import * as React from 'react';
import { Dimensions, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import VerticalCards from './VerticalCards';
import CardStackAnimation from './VerticalSanbox';

export default function CarouselSandbox() {
    const width = Dimensions.get('window').width;
    return (
        // <View style={{ flex: 1}}>
            <Carousel
                loop
                width={width}
                height={width / 2}
                style={{flex: 1}}
                // autoPlay={true}
                data={[...new Array(6).keys()]}
                scrollAnimationDuration={1500}
                renderItem={({ index }) => (
                    <VerticalCards />
                )}
            />
        // </View>
    );
}