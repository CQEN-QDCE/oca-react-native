import React, { useEffect, useState } from 'react'
//import { FlatList, StyleSheet } from 'react-native'
import { FlatList } from 'react-native'
//import { ColorPallet, TextTheme } from './theme'
import OcaAttribute from './OcaAttribute'
import { OcaJs } from './packages/oca.js-form-core/OcaJs'
import type { OCA } from 'oca.js';

interface OcaFormProps {
    attributes?: Array<any>
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
    attributes = [],
    hideAttributeValues = false,
    attribute = null,
  }) => {
    const [shown, setShown] = useState<boolean[]>([])
    fetch('https://repository.oca.argo.colossi.network/api/v0.1/schemas/E2oRZ5zEKxTfTdECW-v2Q7bM_H0OD0ko7IcCwdo_u9co').then((response) => response.json()).then(schema => {
      const ocaJs = new OcaJs({});  
      const ocaTest: OCA = schema;
      ocaJs.createStructure(schema).then(ocaStructure => {
        let bla = 1; 
      });
    });
    
    attributes.push({name: 'name123', value: 'value1dvdvdvdvdvd'})
    const resetShown = (): void => {
      setShown(attributes.map(() => false)) 
    }
  
    useEffect(() => {
      resetShown()
    }, [])
  
    return (
      <FlatList
        data={attributes}
        keyExtractor={({ name }) => name}
        renderItem={({ item: attr, index }) =>
          attribute ? (
            attribute(attr)
          ) : (
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
          )
        }
      />
    )
  }
  
  export default OcaForm