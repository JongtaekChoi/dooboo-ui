import React, { ReactElement } from 'react';

import { ImageSourcePropType } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: transparent;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

interface FABProps {
  width: number;
  height: number;
  borderRadius: number;
  src: ImageSourcePropType;
  text?: string;
  action(): void;
  subAction?: FABProps[];
}

function floatingActionButton(props: FABProps): ReactElement {
  return <Container></Container>;
}

export default floatingActionButton;
