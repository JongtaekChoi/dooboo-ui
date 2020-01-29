# FAB (Floating Action Button)

[![Npm Version](http://img.shields.io/npm/v/@dooboo-ui/native-fab.svg?style=flat-square)](https://npmjs.org/package/@dooboo-ui/native-fab)
[![Downloads](http://img.shields.io/npm/dm/@dooboo-ui/native-fab.svg?style=flat-square)](https://npmjs.org/package/@dooboo-ui/native-fab)

> Simple FAB for react-native.

## Installation

At this point, this component has not yet been published, and after it has been published, it may be installed with the command below.

```sh
yarn add @dooboo-ui/native
```

or

```sh
yarn add @dooboo-ui/native-fab
```

## Usage

# Props

```ts

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

```

# Getting started

- Import

  ```tsx
  import { FAB } from '@dooboo-ui/native';
  // or
  import FAB from '@dooboo-ui/native-fab';
  ```

- Usage
  ```tsx

  // TODO Fill this.

  ```

