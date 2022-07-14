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
    const isValidDate = Date.parse(attribute.value);
    let currentData: Date | moment.Moment;
    console.log(isValidDate);
    if (!isNaN(isValidDate)) {
      currentData = new Date(attribute.value);
    } else if (
      isNaN(isValidDate) &&
      moment(attribute.value, attribute.format).isValid()
    ) {
      currentData = moment(attribute.value, attribute.format);
    } else {
      return setDate(attribute.value);
    }
    setDate(moment(currentData).format(attribute.format));
  }, [attribute.value, attribute.format]);

  return (
    <View style={attributeTypeStyle.textValueContainer}>
      <Text style={[attributeTypeStyle.text, styles]}>
        {shown ? date : Array(10).fill('\u2022').join('')}
      </Text>
    </View>
  );
};
