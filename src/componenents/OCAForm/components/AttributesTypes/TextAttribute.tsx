import React from 'react';
import { StyleProp, Text, TextStyle, View } from 'react-native';
import type { Attribute } from '../../../types';
import { attributeTypeStyle } from '../../../utils/attributeTypeStyle';

interface TextAttributeProps {
  attribute: Attribute;
  shown: boolean;
  styles: StyleProp<TextStyle>;
}

export const TextAttribute = ({
  attribute,
  shown = false,
  styles,
}: TextAttributeProps) => {
  return (
    <View style={attributeTypeStyle.textValueContainer}>
      <Text style={[attributeTypeStyle.text, styles]} numberOfLines={200}>
        {shown ? attribute.value : Array(10).fill('\u2022').join('')}
      </Text>
    </View>
  );
};
