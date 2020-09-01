import { Animated, PanResponder, PanResponderInstance, TransformsStyle, ViewStyle } from 'react-native';
import React, {
  PropsWithChildren, ReactElement, Ref, forwardRef,
  useEffect, useImperativeHandle, useRef, useState,
} from 'react';
import {
  TouchPosition, Vector, VectorType,
  getClamppedVector,
  getOriginScaleTargetPosition,
  getTranslate,
} from './utils';

type Props = PropsWithChildren <{
  style?: ViewStyle | { transform: Animated.WithAnimatedValue<TransformsStyle> },
  blockNativeResponder?: boolean,
  onScaleChanged?(value: number): void,
  onTranslateChanged?(valueXY: VectorType): void,
  onRelease?(): void,
}>

enum TransformState {
  IDLE = 'idle',
  GRANTED = 'granted',
  SCALING = 'scaling',
  TRANSLATION = 'translation',
  RELEASED = 'released',
}

export interface PinchZoomRef {
  animatedValue: { scale: Animated.Value, translate: Animated.ValueXY },
}

function PinchZoom(props: Props, ref: Ref<PinchZoomRef>): ReactElement {
  const {
    children,
    style,
    blockNativeResponder = true, onScaleChanged, onTranslateChanged,
    onRelease,
  } = props;
  const touches = useRef([new TouchPosition(), new TouchPosition()]).current;
  const targetPosition = useRef(new Vector()).current;
  const layoutCenter = useRef(new Vector()).current;
  const scaleValue = useRef({ offset: 1, current: 1 }).current;
  const translateValue = useRef({ offset: new Vector(), current: new Vector() }).current;
  const scale = useRef(new Animated.Value(1)).current;
  const translate = useRef(new Animated.ValueXY(new Vector())).current;
  const transformState = useRef(TransformState.IDLE);

  const [panResponder, setPanResponder] = useState<PanResponderInstance | undefined>();

  useEffect(() => {
    const id = translate.addListener(({ x, y }) => {
      onTranslateChanged && onTranslateChanged({ x, y });
      if (transformState.current === TransformState.RELEASED) {
        const maxValue = { x: (scaleValue.current - 1) * layoutCenter.x, y: (scaleValue.current - 1) * layoutCenter.y };

        if (Math.abs(x) > maxValue.x || Math.abs(y) > maxValue.y) {
          translate.stopAnimation();
          transformState.current = TransformState.IDLE;
          onRelease && onRelease();
        }
      }
      translateValue.current.set({ x, y });
    });
    return ():void => {
      translate.removeListener(id);
    };
  }, [onTranslateChanged, onRelease]);

  useEffect(() => {
    const id = scale.addListener(({ value }) => {
      scaleValue.current = value;
      onScaleChanged && onScaleChanged(value);
    });
    return ():void => {
      scale.removeListener(id);
    };
  }, [onScaleChanged]);
  useEffect(() => {
    const onPanResponderRelease = (_, gestureState): void => {
      if (transformState.current === TransformState.TRANSLATION &&
         Math.abs(translateValue.current.x) < (scaleValue.current - 1) * layoutCenter.x) {
        transformState.current = TransformState.RELEASED;
        Animated.decay(translate, {
          velocity: { x: gestureState.vx, y: gestureState.vy },
          deceleration: 0.996,
          useNativeDriver: true,
        }).start(() => {
          if (transformState.current === TransformState.RELEASED) {
            transformState.current = TransformState.IDLE;
          }
          onRelease && onRelease();
        });
      } else {
        transformState.current = TransformState.IDLE;
        onRelease && onRelease();
      }
    };
    setPanResponder(PanResponder.create({
      onStartShouldSetPanResponder: /* istanbul ignore next */ () => true,
      onStartShouldSetPanResponderCapture: /* istanbul ignore next */ () => true,
      onMoveShouldSetPanResponder: /* istanbul ignore next */ () => true,
      onMoveShouldSetPanResponderCapture: /* istanbul ignore next */ () => true,
      onPanResponderGrant: () => {
        transformState.current = TransformState.GRANTED;
        const [touch1, touch2] = touches;
        touch1.setOffset({ x: 0, y: 0 });
        touch2.setOffset({ x: 0, y: 0 });
        scaleValue.offset = scaleValue.current;
        translateValue.offset.set(translateValue.current);
      },
      onPanResponderMove: ({ nativeEvent }, gestureState) => {
        const [touch1, touch2] = touches;
        if (nativeEvent.touches.length === 2) {
          const secondEvent = nativeEvent.touches[1];
          if (touch2.offset.x === 0 && touch2.offset.y === 0) {
            transformState.current = TransformState.SCALING;
            touch1.setOffset({ x: nativeEvent.locationX, y: nativeEvent.locationY });
            touch2.setOffset({ x: secondEvent.locationX, y: secondEvent.locationY });
            targetPosition.set(
              getOriginScaleTargetPosition({
                currentPosition: touch1.offset.center(touch2.offset),
                layoutCenter,
                scale: scaleValue.offset,
                translate: translateValue.offset,
              }),
            );
          } else {
            touch1.setCurrent(touch1.current.add({ x: nativeEvent.locationX, y: nativeEvent.locationY }).multiply(0.5));
            touch2.setCurrent(touch2.current.add({ x: secondEvent.locationX, y: secondEvent.locationY }).multiply(0.5));
            const newScale = Math.max(1,
              scaleValue.offset * touch1.current.distance(touch2.current) / touch1.offset.distance(touch2.offset));
            scale.setValue(newScale);
            translate.setValue(getTranslate({
              targetPosition,
              layoutCenter,
              scale: newScale,
            }));
          }
        } else if (
          (
            transformState.current === TransformState.GRANTED ||
            transformState.current === TransformState.TRANSLATION
          ) && nativeEvent.touches.length === 1
        ) {
          transformState.current = TransformState.TRANSLATION;
          const maxValue = layoutCenter.multiply(scaleValue.current + 1);
          translate.setValue(getClamppedVector({
            vector: translateValue.offset.add({ x: gestureState.dx, y: gestureState.dy }),
            max: maxValue,
            min: maxValue.multiply(-1),
          }));
        }
      },
      onPanResponderRelease,
      onPanResponderTerminate: onPanResponderRelease,
      onPanResponderTerminationRequest: /* istanbul ignore next */ () => {
        return true;
      },
      onShouldBlockNativeResponder: /* istanbul ignore next */ () => {
        return blockNativeResponder;
      },
    }));
  }, [blockNativeResponder, onRelease, onScaleChanged, onTranslateChanged]);

  useEffect(() => {
    scaleValue.offset = 1;
    translateValue.offset = new Vector();
    scale.setValue(1);
    translate.setValue({ x: 0, y: 0 });
  }, [children]);

  useImperativeHandle(ref, () => ({
    animatedValue: { scale, translate },
  }));
  return <Animated.View
    testID="PINCH_ZOOM_CONTAINER"
    onLayout={({ nativeEvent: { layout } }): void => {
      layoutCenter.x = layout.width / 2;
      layoutCenter.y = layout.height / 2;
    }}
    style={[
      style,
      {
        transform: style?.transform || [
          {
            translateX: translate.x,
          },
          { translateY: translate.y },
          { scale },
        ],
      },
    ]}
    {...(panResponder?.panHandlers || {})}
  >
    {children}
  </Animated.View>;
}

export { PinchZoom };

export default forwardRef<PinchZoomRef, Props>(PinchZoom);
