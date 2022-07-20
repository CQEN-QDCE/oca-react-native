// @ts-nocheck
import type { Structure } from '../oca.js-form-core/entities/Structure'
import type { Overlay, UnitOverlay } from 'oca.js'
import { gridCss } from './grid'
import { transformDataUnit } from './transformDataUnit'
import type { Data } from './types'
import React from 'react';
import { Text, View, Alert, StyleSheet } from 'react-native';
import cssToRn from 'css-to-rn';

export function generateOCACredentialNative2 (
  structure: Structure,
  data: Data,
  config: {
    defaultLanguage?: string
    dataVaultUrl?: string
    ocaRepoHostUrl?: string
    additionalOverlays?: Overlay[]
    credentialLayout?: Structure['credentialLayout']
  }
): ReactElement {
  const layout = config.credentialLayout || structure.credentialLayout
  return <View style={{backgroundColor: 'red', width: '100%', height: '100%', overflow: 'hidden'}}>
    {renderPages(layout)}
    </View>;
}

function renderPages(layout): ReactElement[] {
  const reactElements: ReactElement[] = [];
  let index = 0;
  for (const page of layout.pages) {
    reactElements.push(renderPage(page, index, layout));
    index++;
  }
  return reactElements;
}

function renderPage(page, index: number, layout): ReactElement {
  let reactElement: ReactElement;
//  Alert.alert('Page Config', JSON.stringify(page.config));
//  Alert.alert('Page Style', JSON.stringify(cssToRn(page.config.css.style)));   
  reactElement = <View></View>;
  if (page.elements) {
    reactElement = <View style={cssToRn(page.config.css.style)}>{renderElements(page.elements, layout)}</View>; 
  }
  return reactElement
}


function renderElements(elements, layout): ReactElement[] { 
  const reactElements: ReactElement[] = [];
  for (const element of elements) {
    reactElements.push(renderElement(element, layout));
  }
  return reactElements;
}

function getStyles(element) {
  let styles = [];
  if (element?.config?.css?.style) styles = cssToRn(element.config.css.style);
  return styles;
}

function renderElement(element, layout): ReactElement {
    let reactElement: ReactElement = <View></View>;
    try { 
    switch (element.type) { 
      case 'row':
        if (element.elements) { 
          reactElement = <View style={getStyles(element)}>{renderElements(element.elements, layout)}</View>;
        }
        break;
      case 'col':
//        const styles = StyleSheet.create({
//          width: '66%' 
//        });
          if (element.elements) { 
            reactElement = <View style={getStyles(element)}>{renderElements(element.elements, layout)}</View>;
          }
//        Alert.alert('Element', JSON.stringify(element));
        break;

      case 'layout-label':
        const language = 'fr';
        reactElement = <Text>{layout.labels[element.name][language]}</Text>
        break;
        /*
      case 'text':
        el = document.createElement('div')
        el.innerText = element.content
        break
      case 'oca-name':
        el = document.createElement('div')
        el.innerText = structure.translations[language].name
        break
      case 'oca-description':
        el = document.createElement('div')
        el.innerText = structure.translations[language].description
        break
      case 'category': {
        const section = structure.sections.find(
          el => el.id == element.name
        )
        el = document.createElement('div')
        let level = (section.id.match(/-/g) || []).length
        level = level > 6 ? 6 : level
        const header = document.createElement(`h${level}`)
        header.innerText = section.translations[language].label
        el.appendChild(header)
        break
      }
      case 'attribute': {
        const attr = structure.controls.find(
          el => el.name == element.name
        )
        const entryCodesMapping: { [_: string]: string } = {}
        if (attr.entryCodesMapping) {
          attr.entryCodesMapping.forEach(mapping => {
            const splitted = mapping.split(':')
            entryCodesMapping[splitted[1]] = splitted[0]
          })
        }

        const attributeDatum = data[attr.mapping || attr.name]
        if (attr.type == 'Binary') {
          el = document.createElement('img')
          if (attributeDatum) {
            const imageEl = el as HTMLImageElement
            imageEl.src = attributeDatum as string
          }
        } else if (attr.type == 'Select') {
          el = document.createElement('div')
          if (
            attr.translations[language].entries &&
            attributeDatum
          ) {
            el.innerText =
              attr.translations[language].entries[
                entryCodesMapping[attributeDatum as string] ||
                  (attributeDatum as string)
              ]
          }
        } else {
          el = document.createElement('div')
          const attributeDatum = data[attr.mapping || attr.name]
          if (attributeDatum) {
            if (
              Array.isArray(attributeDatum) &&
              attributeDatum.length > 0
            ) {
              const s = document.createElement('select')
              s.style.cssText =
                'border: 0; background-color: rgba(0,0,0,0); margin: inherit; width: 100%;'
              ;(attributeDatum as string[]).forEach(
                (dataValue: string) => {
                  const op = document.createElement('option')
                  op.value =
                    entryCodesMapping[dataValue] || dataValue
                  op.text =
                    entryCodesMapping[dataValue] || dataValue
                  s.appendChild(op)
                }
              )
              el.appendChild(s)
            } else {
              el.innerText = attributeDatum as string
            }
          }
        }
        break
      }
      case 'reference': {
        const attr = structure.controls.find(
          el => el.name == element.name
        )
        const referenceLayout =
          structure.credentialLayout.reference_layouts[
            element.layout
          ]
        const referenceData = data[attr.mapping || attr.name]
        if (attr.type == 'Reference') {
          ;(
            await Promise.all(
              [...Array(Number(attr.cardinality) || 1)].map(
                async (_, i) => {
                  const referenceDatum = attr.multiple
                    ? (referenceData as Data[])[i]
                    : referenceData
                  const frame = await generateOCACredential(
                    attr.reference,
                    (referenceDatum || {}) as Data,
                    {
                      credentialLayout: referenceLayout
                    }
                  )
                  frame.style.height =
                    referenceLayout.config.css.height
                  return frame
                }
              )
            )
          ).forEach(f => {
            el = document.createElement('div')
            el.style.height = referenceLayout.config.css.height
            el.appendChild(f)
            fragment.appendChild(el)
          })
        }
        break
      }
      case 'code': {
        const attr = structure.controls.find(
          el => el.name == element.name
        )
        const attributeDatum = data[attr.mapping || attr.name]
        el = document.createElement('div')
        if (attributeDatum) {
          el.innerText = attributeDatum as string
        }
        break
      }
      case 'label': {
        const attr = structure.controls.find(
          el => el.name == element.name
        )
        el = document.createElement('div')
        el.innerText = attr.translations[language].label
        break
      }
      case 'information': {
        const attr = structure.controls.find(
          el => el.name == element.name
        )
        el = document.createElement('div')
        el.innerText = attr.translations[language].information || ''
        break
      }

    }

    if (el) {
      if (element.config && element.config.css) {
        if (element.config.css.style) {
          el.style.cssText = element.config.css.style
        }
        if (element.config.css.classes) {
          el.classList.add(...element.config.css.classes)
        }
      }
      fragment.appendChild(el)
    }
*/
  }
  } catch (e) {
    Alert.alert('Exception', e);
  }
  return reactElement;
}
