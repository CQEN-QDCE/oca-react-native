import React from 'react';
import type { AttributeProps } from '../../types';
import { StyleSheet, View } from 'react-native';
import { LabelElement } from './LabelElement';
import { ShowElement } from './ShowElement';
import { TextAttribute } from './AttributesTypes/TextAttribute';
import { BinaryAttribute } from './AttributesTypes/BinaryAttribute';

export const Attribute = ({
  attribute,
  shown,
  hideShowOptions,
  onToggleViewPressed,
  stylingOptions,
  attributeLabel = null,
  attributeValue = null,
}: AttributeProps) => {
  const attributeTypeSelector = () => {
    if (attribute.type === 'Binary') {
      return (
        <BinaryAttribute
          attribute={attribute}
          shown={shown}
          binaryStyle={stylingOptions?.binaryStyle}
          textStyle={stylingOptions?.textStyle}
        />
      );
    }
    return (
      <TextAttribute
        attribute={attribute}
        shown={shown}
        styles={stylingOptions?.textStyle}
      />
    );
  };

  return (
    <View style={[styles.container, stylingOptions?.attributeContainerStyle]}>
      {attributeLabel ? (
        attributeLabel(attribute)
      ) : (
        <LabelElement
          attribute={attribute}
          style={stylingOptions?.labelTextStyle}
        />
      )}

      {attributeValue ? (
        attributeValue(attribute)
      ) : (
        <View style={styles.valueContainer}>
          {attributeTypeSelector()}

          <ShowElement
            hideShowOptions={hideShowOptions}
            shown={shown}
            onToggleViewPressed={onToggleViewPressed}
          />
        </View>
      )}
      <View style={[styles.separator, stylingOptions?.separatorStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 25,
    paddingTop: 16,
    backgroundColor: 'transparent',
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    maxWidth: '100%',
  },
  separator: {
    borderBottomColor: '#c9c9c9',
    borderBottomWidth: 2,
    paddingTop: 12,
  },
});
