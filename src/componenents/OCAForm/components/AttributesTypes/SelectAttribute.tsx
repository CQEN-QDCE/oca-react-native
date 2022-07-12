import React from 'react';
import { StyleProp, Text, TextStyle, View } from 'react-native';
import type { Attribute } from '../../types';
import { attributeTypeStyle } from '../../utils/attributeTypeStyle';

interface SelectAttributeProps {
  attribute: Attribute;
  shown: boolean;
  styles: StyleProp<TextStyle>;
}

export const SelectAttribute = ({
  attribute,
  shown = false,
  styles,
}: SelectAttributeProps) => {
  return (
    <View style={attributeTypeStyle.textValueContainer}>
      <Text style={[attributeTypeStyle.text, styles]}>
        {shown ? attribute.value : Array(10).fill('\u2022').join('')}
      </Text>
    </View>
  );
};
