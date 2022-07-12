import React, { useEffect, useState } from 'react';
import { StyleProp, Text, TextStyle, View } from 'react-native';
import type { Attribute } from '../../types';
import { attributeTypeStyle } from '../../utils/attributeTypeStyle';
import moment from 'moment';

interface DateAttributeProps {
  attribute: Attribute;
  shown: boolean;
  styles: StyleProp<TextStyle>;
}

export const DateAttribute = ({
  attribute,
  shown = false,
  styles,
}: DateAttributeProps) => {
  const [date, setDate] = useState<string>();

  useEffect(() => {
    let dataValue: Date | moment.Moment = new Date(attribute.value);
    if (!dataValue && moment(attribute.value, attribute.format).isValid()) {
      dataValue = moment(attribute.value, attribute.format);
    } else {
      return setDate(attribute.value);
    }
    setDate(moment(dataValue).format(attribute.format));
  }, [attribute.value, attribute.format]);

  return (
    <View style={attributeTypeStyle.textValueContainer}>
      <Text style={[attributeTypeStyle.text, styles]}>
        {shown ? date : Array(10).fill('\u2022').join('')}
      </Text>
    </View>
  );
};
