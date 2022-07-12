import type {
  AttributeTranslation,
  Control,
} from '../../../packages/oca.js-form-core/types';

const getAttributes = (
  controls: Control[],
  AttributesValues: Map<string, string | number>,
  lang: string
) => {
  const attributes = [];
  for (let control of controls) {
    console.log(control);
    const attributeTranslation: AttributeTranslation =
      control!.translations[lang];
    attributes.push({
      name: attributeTranslation.label,
      information: attributeTranslation.information,
      value: AttributesValues.get(control!.name),
      type: control!.type,
      format: control!.format,
      entries: attributeTranslation.entries,
      characterEncoding: control!.characterEncoding,
    });
  }

  return attributes;
};

export default getAttributes;
