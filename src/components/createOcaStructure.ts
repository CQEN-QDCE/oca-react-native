import type { OCA } from 'oca.js';
import { OcaJs } from '../packages/oca.js-form-core/OcaJs';

export const createOcaStructure = async (oca?: OCA) => {
  const ocaJs = new OcaJs({});
  if (oca) {
    return await ocaJs.createStructure(oca);
  }
  return undefined;
};
