import type { Structure } from '../packages/oca.js-form-core/entities/Structure';
import type { AttributesValues } from './types';
import getLanguage from './utils/getLanguage';
import type { AttributeTranslation } from '../packages/oca.js-form-core/types';
import { formatDate } from './utils/formatDate';
import { formatBinary } from './utils/formatBinary';

type Props = {
  structure?: Structure;
  attributesValues: Array<AttributesValues>;
  language: string;
};
export const getAttributes = ({
  structure,
  attributesValues,
  language,
}: Props) => {
  const attributes = [];
  if (structure) {
    const lang = getLanguage(structure.translations, language);
    for (let control of structure.controls) {
      const attributeTranslation: AttributeTranslation | undefined =
        control?.translations[lang];

      let formattedValue;
      let type = control?.type;
      const value = attributesValues.find(
        (item) => item.name === control?.name
      )?.value;
      if (control?.type === 'Date') {
        formattedValue = formatDate({
          value: value,
          format: control?.format,
        });
      } else if (control?.type === 'Binary') {
        const formattedBinary = formatBinary(
          {
            value: value,
            format: control?.format,
          },
          control?.characterEncoding
        );
        type = formattedBinary.type;
        formattedValue = formattedBinary.value;
      } else {
        formattedValue = value;
      }
      attributes.push({
        name: attributeTranslation?.label,
        information: attributeTranslation?.information,
        value: formattedValue,
        type: type,
        format: control?.format,
        entries: attributeTranslation?.entries,
        characterEncoding: control?.characterEncoding,
      });
    }
    return attributes;
  } else {
    return attributesValues;
  }
};
