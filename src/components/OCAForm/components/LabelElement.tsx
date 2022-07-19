import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LabelElementProps } from '../../types';

export const LabelElement = ({ attribute, style }: LabelElementProps) => {
  return (
    <View>
      <Text style={[styles.label, style]} numberOfLines={1}>
        {attribute.name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
