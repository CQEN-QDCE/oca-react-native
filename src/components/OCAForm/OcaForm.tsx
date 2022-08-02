import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import type { OCA } from 'oca.js';
import { getAttributes } from './../getAttributes';
import type {
  AttributesValues,
  HideShowOptions,
  StylingOptions,
} from '../types';
import { Attribute } from './components/Attribute';
import { createOcaStructure } from '../createOcaStructure';

interface OcaFormProps {
  oca?: OCA;
  language: string;
  attributeValues: AttributesValues[];
  stylingOptions?: StylingOptions;
  hideShowOptions?: HideShowOptions;
  maxNumberOfAttributes?: number;
}
const defaultHideShowOptions = {
  visibility: true,
};

const OcaForm = ({
  oca,
  language,
  attributeValues,
  stylingOptions,
  hideShowOptions = defaultHideShowOptions,
  maxNumberOfAttributes = 200,
}: OcaFormProps) => {
  const [shown, setShown] = useState<boolean[]>([]);
  const [attributes, setAttributes] = useState<Array<any>>([]);
  useEffect(() => {
    createOcaStructure(oca).then((ocaStructure) => {
      setAttributes(getAttributes(attributeValues, language, ocaStructure));
    });
  }, [oca, attributeValues]);

  const resetShown = (): void => {
    setShown(attributes.map(() => false));
  };

  useEffect(() => {
    resetShown();
  }, []);

  const toggleViewPressed = (index: number) => {
    const newShowState = [...shown];
    newShowState[index] = !shown[index];
    setShown(newShowState);
  };
  return (
    <View style={{ flex: 1, minWidth: '100%' }}>
      {hideShowOptions.visibility && (
        <TouchableOpacity
          testID={'reset.shown'}
          style={styles.hideAllContainer}
          activeOpacity={1}
          onPress={() => resetShown()}
          accessible={true}
        >
          {hideShowOptions.labelHideAll ? (
            hideShowOptions.labelHideAll
          ) : (
            <Text style={stylingOptions?.textStyle}>Hide All</Text>
          )}
        </TouchableOpacity>
      )}
      {attributes.map((attr, index) => {
        if (index < maxNumberOfAttributes) {
          return (
            <Attribute
              key={index}
              attribute={attr}
              shown={!hideShowOptions?.visibility ? true : shown[index]}
              onToggleViewPressed={() => toggleViewPressed(index)}
              hideShowOptions={hideShowOptions}
              stylingOptions={stylingOptions}
            />
          );
        }
        return;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  hideAllContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
});

export default OcaForm;
