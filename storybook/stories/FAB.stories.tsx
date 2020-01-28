import { Alert } from 'react-native';
import { ContainerDeco } from '../decorators';
import FAB from '../../src/components/shared/FAB';
import { IC_EDIT } from '../../src/components/shared/Icons';
import React from 'react';

import { storiesOf } from '@storybook/react-native';
import styled from 'styled-components/native';

storiesOf('FAB', module)
  .addDecorator(ContainerDeco)
  .add('default', () => (
    <Default />
  ));

const Container = styled.View`
  background-color: #ccccff;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80%;
  margin-top: 28;
  padding-top: 80;
  flex-direction: column;
`;

const Text = styled.Text`
`;

function Default(): React.ReactElement {
  return (
    <Container>
      <Text>FAB is floating in this View.</Text>
      <FAB
        src={IC_EDIT}
        action={(): void => Alert.alert('Some action!!')}
        buttonStyle={{ backgroundColor: 'white' }}
      />
    </Container>
  );
}
