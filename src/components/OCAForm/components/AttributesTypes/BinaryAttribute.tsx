import React from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native';
import type { Attribute } from '../../../types';
import { attributeTypeStyle } from '../../../utils/attributeTypeStyle';

interface BinaryAttributeProps {
  attribute: Attribute;
  shown?: boolean;
  binaryStyle?: StyleProp<any>;
  textStyle?: StyleProp<TextStyle>;
}

export const BinaryAttribute = ({
  attribute,
  shown = false,
  binaryStyle,
  textStyle,
}: BinaryAttributeProps) => {
  const defaultStyle = StyleSheet.create({
    image: {
      height: 150,
      aspectRatio: 1,
      resizeMode: 'contain',
      borderRadius: 10,
      ...binaryStyle,
    },
  });

  return (
    <View style={attributeTypeStyle.textValueContainer}>
      {shown ? (
        <Image style={defaultStyle.image} source={{ uri: attribute.value }} />
      ) : (
        <Text style={[attributeTypeStyle.text, textStyle]}>
          {Array(10).fill('\u2022').join('')}
        </Text>
      )}
    </View>
  );
};
