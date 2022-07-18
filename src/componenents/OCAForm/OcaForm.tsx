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
import { createOCAStructure } from '../createOCAStructure';

interface OcaFormProps {
  oca?: OCA;
  deviceLanguage: string;
  attributeValues: AttributesValues[];
  stylingOptions?: StylingOptions;
  hideShowOptions?: HideShowOptions;
}
const defaultHideShowOptions = {
  visibility: true,
};

const OcaForm = ({
  oca,
  deviceLanguage,
  attributeValues,
  stylingOptions,
  hideShowOptions = defaultHideShowOptions,
}: OcaFormProps) => {
  const [shown, setShown] = useState<boolean[]>([]);
  const [attributes, setAttributes] = useState<Array<any>>([]);
  useEffect(() => {
    createOCAStructure(oca).then((ocaStructure) => {
      console.log('Start');
      setAttributes(
        getAttributes({
          structure: ocaStructure,
          attributesValues: attributeValues,
          language: deviceLanguage,
        })
      );
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
