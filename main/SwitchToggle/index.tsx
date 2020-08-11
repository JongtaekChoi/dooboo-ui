import {
  Animated,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

interface Props {
  testID?: string;
  switchOn: boolean;
  onPress: () => void;
  containerStyle?: ViewStyle;
  circleStyle?: ViewStyle;
  backgroundColorOn?: string;
  backgroundColorOff?: string;
  backgroundImageOn?: React.ReactElement;
  backgroundImageOff?: React.ReactElement;
  circleColorOff?: string;
  circleColorOn?: string;
  duration?: number;
  type?: number;
  buttonText?: string;
  backTextEnd?: string;
  backTextStart?: string;
  buttonTextStyle?: StyleProp<TextStyle>;
  textEndStyle?: StyleProp<TextStyle>;
  textStartStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  // limitation: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/12202
  buttonContainerStyle?: StyleProp<ViewStyle> | any;
  endContainerStyle?: StyleProp<ViewStyle> | any;
  startContainerStyle?: StyleProp<ViewStyle> | any;
  RTL?: boolean;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

function SwitchToggle(props: Props): React.ReactElement {
  const [animXValue] = useState(new Animated.Value(props.switchOn ? 1 : 0));
  const getStart = (): number | Record<string, unknown> | undefined => {
    // prettier-ignore
    return props.type === undefined
      ? 0
      : props.type === 0
        ? 0
        : props.containerStyle && props.containerStyle.padding
          ? (props.containerStyle.padding as number) * 2
          : {};
  };

  const runAnimation = (): void => {
    const animValue = {
      fromValue: props.switchOn ? 0 : 1,
      toValue: props.switchOn ? 1 : 0,
      duration: props.duration,
      useNativeDriver: false,
    };
    Animated.timing(animXValue, animValue).start();
  };

  const endPos =
    props.containerStyle && props.circleStyle
      ? (props.containerStyle.width as number) -
        ((props.circleStyle.width as number) +
          (props.containerStyle.padding as number || 0) * 2)
      : 0;
  const circlePosXEnd = props.RTL ? -endPos : endPos;
  const [circlePosXStart] = useState(getStart());

  const prevSwitchOnRef = useRef<boolean>();
  const prevSwitchOn = !!prevSwitchOnRef.current;
  useEffect(() => {
    prevSwitchOnRef.current = props.switchOn;
    if (prevSwitchOn !== props.switchOn) {
      runAnimation();
    }
  }, [props.switchOn]);

  const generateEndText = (): React.ReactElement => {
    return (
      <Animated.View style={props.endContainerStyle}>
        <Text style={props.textEndStyle}>{props.backTextEnd}</Text>
      </Animated.View>
    );
  };

  const generateStartText = (): React.ReactElement => {
    return (
      <Animated.View style={props.startContainerStyle}>
        <Text style={props.textStartStyle}>{props.backTextStart}</Text>
      </Animated.View>
    );
  };

  const generateStartIcon = (): React.ReactElement => {
    return (
      <View style={{ position: 'absolute', start: 5 }}>
        {props.backgroundImageOn}
      </View>
    );
  };

  const generateEndIcon = (): React.ReactElement => {
    return (
      <View style={{ position: 'absolute', end: 5 }}>
        {props.backgroundImageOff}
      </View>
    );
  };

  return (
    <TouchableOpacity
      testID={props.testID}
      onPress={props.onPress}
      activeOpacity={0.5}
    >
      <Animated.View
        style={[
          styles.container,
          props.containerStyle,
          {
            backgroundColor: animXValue.interpolate({
              inputRange: [0, 1],
              outputRange: [
                props.backgroundColorOff as string | number,
                props.backgroundColorOn as string | number,
              ] as string[] | number[],
            }),
          },
        ]}
      >
        {generateStartText()}
        {props.switchOn && generateStartIcon()}
        <Animated.View
          style={[
            props.circleStyle,
            {
              backgroundColor: animXValue.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  props.circleColorOff as string | number,
                  props.circleColorOn as string | number,
                ] as string[] | number[],
              }),
            },
            {
              transform: [
                {
                  translateX: animXValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      circlePosXStart as string | number,
                      circlePosXEnd as string | number,
                    ] as string[] | number[],
                  }),
                },
              ],
            },
            props.buttonStyle,
          ]}
        >
          <Animated.View style={props.buttonContainerStyle}>
            <Text style={props.buttonTextStyle}>{props.buttonText}</Text>
          </Animated.View>
        </Animated.View>
        {generateEndText()}
        {!props.switchOn && generateEndIcon()}
      </Animated.View>
    </TouchableOpacity>
  );
}

export default SwitchToggle;
