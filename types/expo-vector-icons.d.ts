declare module '@expo/vector-icons/FontAwesome' {
  import type { ComponentType } from 'react';
  import type { TextProps } from 'react-native';

  export type FontAwesomeName = string;

  const FontAwesome: ComponentType<
    TextProps & {
      name: FontAwesomeName;
      size?: number;
      color?: string;
    }
  >;

  export default FontAwesome;
}
