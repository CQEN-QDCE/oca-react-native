import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { OcaJs } from '../../packages/oca.js-form-core/OcaJs';
import type { OCA } from 'oca.js';
import getLanguage from './utils/getLanguage';
import getAttributes from './utils/getAttributes';
import type { HideShowOptions, StylingOptions } from './types';
import { Attribute } from './components/Attribute';

interface OcaFormProps {
  oca: OCA | undefined;
  deviceLanguage: string;
  attributeValues: Map<string, string | number>;
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
  const ocaJs = new OcaJs({});

  useEffect(() => {
    if (oca) {
      ocaJs.createStructure(oca).then((ocaStructure) => {
        const lang = getLanguage(ocaStructure.translations, deviceLanguage);
        setAttributes(
          getAttributes(ocaStructure.controls, attributeValues, lang)
        );
      });
    }
  }, [oca, attributeValues]);

  const resetShown = (): void => {
    setShown(attributes.map(() => true));
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
    <View style={{ flex: 1 }}>
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

export default OcaForm;
