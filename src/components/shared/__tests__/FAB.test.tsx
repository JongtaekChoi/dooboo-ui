import * as React from 'react';
import Fab, { FABProps } from '../FAB';

import { IC_EDIT } from '../Icons';
import { View } from 'react-native';
import renderer from 'react-test-renderer';

let props: FABProps;
let component: React.ReactElement;
// let testingLib: RenderResult;

describe('[Fab] render', () => {
  beforeEach(() => {
    props = {
      src: IC_EDIT,
    };
    component = <View style={{ flex: 1 }}><Fab {...props} /></View>;
  });

  it('renders without crashing', () => {
    const rendered: renderer.ReactTestRendererJSON | null = renderer
      .create(component)
      .toJSON();
    expect(rendered).toMatchSnapshot();
    expect(rendered).toBeTruthy();
  });

  // describe('interactions', () => {
  //   beforeEach(() => {
  //     testingLib = render(component);
  //   });

  //   it('should simulate onClick', () => {
  //     const btn = testingLib.queryByTestId('btn');
  //     act(() => {
  //       fireEvent.press(btn);
  //     });
  //     expect(cnt).toBe(3);
  //   });
  // });
});
