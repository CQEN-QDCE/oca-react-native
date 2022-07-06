import React, { useEffect, useState } from 'react'
//import { FlatList, StyleSheet } from 'react-native'
import { FlatList, SafeAreaView } from 'react-native'
//import { ColorPallet, TextTheme } from './theme'
import OcaAttribute from './OcaAttribute'
import { OcaJs } from './packages/oca.js-form-core/OcaJs'
import type { OCA } from 'oca.js';
import type { AttributeTranslation } from './packages/oca.js-form-core/types';

interface OcaFormProps {
    oca: OCA | undefined
    attributes?: Array<any>
    attributeValues: Map<string, string | number>
    hideAttributeValues?: boolean
    attribute?: (attribute: any) => React.ReactElement | null
  }
/*
  const styles = StyleSheet.create({
    linkContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingHorizontal: 25,
      paddingVertical: 16,
    },
    link: {
      minHeight: TextTheme.normal.fontSize, 
      paddingVertical: 2,
      color: ColorPallet.brand.link,
    },
  })
*/
  const OcaForm: React.FC<OcaFormProps> = ({
    oca,
    attributeValues,
    attributes = [],
    hideAttributeValues = false,
    attribute = null,
  }) => {
    const [shown, setShown] = useState<boolean[]>([])
    const ocaJs = new OcaJs({});   
    const lang = 'en';
    const [attributes2, setAttributes2] = useState<Array<any>>([]);
    
    useEffect(() => {
      if (oca) {
        ocaJs.createStructure(oca).then(ocaStructure => {
          for (let control of ocaStructure.controls) {
            if (control && lang in control.translations) { 
              const attributeTranslation: AttributeTranslation = control.translations[lang];
              attributes.push({name: attributeTranslation.label, value: attributeValues.get(control.name)});
            }
          }
          setAttributes2([...attributes]); 
        });
      }
    }, [oca, attributeValues]);

    const resetShown = (): void => {
      setShown(attributes.map(() => true)) 
    }
  
    useEffect(() => {
      resetShown()
    }, [])
  
    return (
      <FlatList
        data={attributes2}
        keyExtractor={({ name }) => name}
        renderItem={({ item: attr, index }) =>
            <OcaAttribute 
              attribute={attr}
              hideAttributeValue={hideAttributeValues} 
              onToggleViewPressed={() => {
                const newShowState = [...shown]
                newShowState[index] = !shown[index]
                setShown(newShowState)
              }}
              shown={hideAttributeValues ? !!shown[index] : true}
            />
        }
      />
    )
  }
  
  export default OcaForm