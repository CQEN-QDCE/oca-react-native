import type { StyleProp } from 'react-native';

export interface Attribute {
  name: string;
  value: string;
  information?: string;
  type?: string;
  format?: string;
  entries?: string[];
  characterEncoding?: string;
}

export type AttributesValues = {
  name: string;
  value: string | number;
};

export type FormatValueProps = {
  value?: string | number;
  format?: string;
};

export type StylingOptions = {
  attributeContainerStyle?: StyleProp<any>;
  labelTextStyle?: StyleProp<any>;
  textStyle?: StyleProp<any>;
  separatorStyle?: StyleProp<any>;
  binaryStyle?: StyleProp<any>;
};

export type HideShowOptions = {
  visibility?: boolean;
  labelHide?: React.ReactNode;
  labelShow?: React.ReactNode;
  labelHideAll?: React.ReactNode;
};

export type LabelElementProps = {
  attribute: Attribute;
  style?: StyleProp<any>;
};

export type ShowElementProps = {
  hideShowOptions: HideShowOptions;
  shown: boolean;
  onToggleViewPressed: () => void;
  style?: StyleProp<any>;
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
