import type { FormatValueProps } from '../types';
import type { ControlType } from '../../packages/oca.js-form-core/types';

export const formatBinary = (
  { value, format }: FormatValueProps,
  characterEncoding: string | undefined
) => {
  const regexAttributeType = new RegExp('^image/(jpeg|png|jpg|JPEG|PNG|JPG)');

  if (
    typeof value === 'string' &&
    format &&
    characterEncoding === 'base64' &&
    regexAttributeType.test(format)
  ) {
    let uriImage = value;
    const base64Data =
      uriImage.includes(',') &&
      uriImage.substr(value.lastIndexOf(',') + 1).split(' ')[0];
    uriImage = 'data:' + format + ';' + characterEncoding + ',';
    if (base64Data) {
      uriImage += base64Data;
    } else {
      uriImage += value;
    }
    return { type: 'Binary' as ControlType, value: uriImage };
  }
  return { type: 'Text' as ControlType, value: value };
};
