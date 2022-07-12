import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface Attribute {
  name: string;
  value: string;
  information: string;
  type: string;
  format: string;
  entries: string[];
  characterEncoding: string;
}

export type StylingOptions = {
  attributeContainerStyle: StyleProp<ViewStyle>;
  labelTextStyle?: StyleProp<TextStyle>;
  textStyle?: StyleProp<TextStyle>;
  separatorStyle?: StyleProp<ViewStyle>;
  binaryStyle?: StyleProp<any>;
};

export type HideShowOptions = {
  visibility?: boolean;
  labelHide?: React.ReactNode;
  labelShow?: React.ReactNode;
};

export type LabelElementProps = {
  attribute: Attribute;
  style?: StyleProp<TextStyle>;
};

export type ShowElementProps = {
  hideShowOptions: HideShowOptions;
  shown: boolean;
  onToggleViewPressed: () => void;
  style?: StyleProp<TextStyle>;
};

export type AttributeProps = {
  attribute: Attribute;
  shown: boolean;
  onToggleViewPressed: () => void;
  hideShowOptions: HideShowOptions;
  stylingOptions?: StylingOptions;
  attributeLabel?: ((attribute: Attribute) => React.ReactElement) | null;
  attributeValue?: ((attribute: Attribute) => React.ReactElement) | null;
};
