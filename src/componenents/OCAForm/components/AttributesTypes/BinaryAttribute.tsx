import React from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native';
import type { Attribute } from '../../types';
import { attributeTypeStyle } from '../../utils/attributeTypeStyle';

interface BinaryAttributeProps {
  attribute: Attribute;
  shown?: boolean | 'disabled';
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
  const regexAttributeType = new RegExp('^image/(jpeg|png|jpg|JPEG|PNG|JPG)');

  const displayBinary = (attributeData: Attribute) => {
    if (
      attributeData.value &&
      attributeData.characterEncoding === 'base64' &&
      regexAttributeType.test(attributeData.format)
    ) {
      let uriImage = attributeData.value;
      const base64Data =
        uriImage.includes(',') &&
        uriImage.substr(attributeData.value.lastIndexOf(',') + 1).split(' ')[0];
      uriImage =
        'data:' +
        attributeData.format +
        ';' +
        attributeData.characterEncoding +
        ',';
      if (base64Data) {
        uriImage += base64Data;
      } else {
        uriImage += attributeData.value;
      }

      return <Image style={defaultStyle.image} source={{ uri: uriImage }} />;
    } else {
      return (
        <Text style={[attributeTypeStyle.text, textStyle]}>
          {attribute.value}
        </Text>
      );
    }
  };

  return (
    <View style={attributeTypeStyle.textValueContainer}>
      {shown ? (
        displayBinary(attribute)
      ) : (
        <Text style={[attributeTypeStyle.text, textStyle]}>
          {Array(10).fill('\u2022').join('')}
        </Text>
      )}
    </View>
  );
};
