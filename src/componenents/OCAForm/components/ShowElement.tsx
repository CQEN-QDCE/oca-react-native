import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import type { ShowElementProps } from '../../types';
import { attributeTypeStyle } from '../../utils/attributeTypeStyle';

export const ShowElement = ({
  hideShowOptions,
  onToggleViewPressed,
  shown = false,
  style,
}: ShowElementProps) => {
  return (
    <View>
      {hideShowOptions.visibility && (
        <TouchableOpacity activeOpacity={1} onPress={onToggleViewPressed}>
          <View>
            {shown ? (
              hideShowOptions?.labelHide ? (
                hideShowOptions.labelHide
              ) : (
                <Text style={[attributeTypeStyle.text, style]}>Hide</Text>
              )
            ) : hideShowOptions?.labelShow ? (
              hideShowOptions.labelShow
            ) : (
              <Text style={[attributeTypeStyle.text, style]}>Show</Text>
            )}
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};
