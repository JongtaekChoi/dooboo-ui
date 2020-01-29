import { Image, ImageSourcePropType, TextStyle, TouchableOpacity } from 'react-native';
import React, { ReactElement, useState } from 'react';

import styled from 'styled-components/native';

const defaultSize = 50;
const defaultOffset = 15;

const Container = styled.View`
  position: absolute;
  right: ${defaultOffset}px;
  bottom: ${defaultOffset}px;
`;

const ItemContainer = styled.View`
  flex-direction: row;
  height: ${defaultSize}px;
`;

const Description = styled.Text`
  margin-right: 30px;
`;

export interface ButtonStyle {
  width?: number;
  height?: number;
  borderRadius?: number;
  backgroundColor?: string;
}

export interface LayoutStyle {
  right?: number;
  bottom?: number;
}

export interface ActionItemProps {
  key?: string;
  src: ImageSourcePropType;
  text?: string;
  action?(): void;
  buttonStyle?: ButtonStyle;
  textStyle?: TextStyle;
}

export interface FABProps extends ActionItemProps{
  subItemPropsList?: FABProps[];
  expandedBackgroundColor?: string;
  layoutStyle?: LayoutStyle;
}

function ActionItem(props: ActionItemProps): ReactElement {
  const { buttonStyle: customStyle = {}, textStyle, src, action, text } = props;
  const { width = defaultSize, height = defaultSize } = customStyle;
  const borderRadius = Math.min(width, height) / 2;
  const buttonStyle = {
    width,
    height,
    borderRadius,
    shadowRadius: 1,
    ...customStyle,
  };
  return <ItemContainer style={{}}>
    {
      text ? <Description style={textStyle}>{text}</Description> : null
    }
    <TouchableOpacity style={buttonStyle} onPress={action}>
      <Image style={buttonStyle} source={src}/>
    </TouchableOpacity>
  </ItemContainer>;
}

function Fab(props: FABProps): ReactElement {
  const { layoutStyle, buttonStyle, textStyle, key, src, action, text, subItemPropsList = [] } = props;
  const [isExpanded, setExpanded] = useState(false);
  return <Container style={layoutStyle}>
    {
      isExpanded ? subItemPropsList.map((subItemProps: ActionItemProps): ReactElement => {
        const mergedProps = { buttonStyle, textStyle, ...subItemProps };
        return <ActionItem key={subItemProps.key} {...mergedProps} />;
      }) : null
    }
    <ActionItem
      key={key}
      src={src}
      text={text}
      buttonStyle={buttonStyle}
      textStyle={textStyle}
      action={(): void => {
        if (action) {
          action();
        }
        if (subItemPropsList.length > 0) {
          setExpanded(!isExpanded);
        }
      }} />
  </Container>;
}

export default Fab;
