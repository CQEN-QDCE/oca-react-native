import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ColorPallet, TextTheme } from '../../theme';
import type { Attribute } from '../types';

interface OcaAttributeProps {
  attribute: Attribute;
  hideAttributeValue?: boolean;
  shown?: boolean;
  onToggleViewPressed?: () => void;
  attributeLabel?: (attribute: Attribute) => React.ReactElement | null;
  attributeValue?: (attribute: Attribute) => React.ReactElement | null;
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingTop: 16,
    backgroundColor: ColorPallet.brand.secondaryBackground,
  },
  border: {
    borderBottomColor: ColorPallet.brand.primaryBackground,
    borderBottomWidth: 2,
    paddingTop: 12,
  },
  link: {
    minHeight: TextTheme.normal.fontSize,
    paddingVertical: 2,
    color: ColorPallet.brand.link,
  },
  text: {
    ...TextTheme.normal,
    color: '#FFFFFF',
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  valueText: {
    minHeight: TextTheme.normal.fontSize,
    paddingVertical: 4,
  },
});

const OcaAttribute: React.FC<OcaAttributeProps> = ({
  attribute,
  hideAttributeValue = false,
  shown = hideAttributeValue ? false : true,
  onToggleViewPressed = () => undefined,
  attributeLabel = null,
  attributeValue = null,
}) => {
  //    const { t } = useTranslation()

  return (
    <View style={styles.container}>
      {attributeLabel ? (
        attributeLabel(attribute)
      ) : (
        <Text style={TextTheme.label}>{attribute.name}</Text>
      )}
      <View style={styles.valueContainer}>
        {attributeValue ? (
          attributeValue(attribute)
        ) : (
          <>
            <View style={styles.valueText}>
              <Text style={styles.text}>
                {shown ? attribute.value : Array(10).fill('\u2022').join('')}
              </Text>
            </View>
            {hideAttributeValue ? (
              <TouchableOpacity
                activeOpacity={1}
                onPress={onToggleViewPressed}
                style={styles.link}
              >
                <Text style={TextTheme.normal}>{shown ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            ) : null}
          </>
        )}
      </View>
      <View style={styles.border} />
    </View>
  );
};

export default OcaAttribute;
