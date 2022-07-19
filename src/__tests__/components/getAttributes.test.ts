import type { Structure } from 'src/packages/oca.js-form-core/entities/Structure';
import { createOCAStructure } from '../../components/createOCAStructure';
import { getAttributes } from '../../components/getAttributes';

const oca = require('../OCA.json');

describe('Get attributes from Structure', () => {
  let ocaStructure: Structure | undefined;
  beforeAll(async () => {
    ocaStructure = await createOCAStructure(oca);
  });
  it('getAttributes with valid structure, valid attributesValues and valid language. Should return translated name and a formatted value', () => {
    const attributesValues = [{ name: 'dateOfBirth', value: '22n07n18' }];

    const attributes = getAttributes({
      structure: ocaStructure,
      attributesValues,
      language: 'en',
    });

    expect(attributes[0].value).toEqual('22n07n18');
    expect(attributes[0].name).toEqual('Date of birth');
  });

  it('getAttributes with undefined structure, valid attributesValues and valid language. Should return attributesValues.', () => {
    const attributesValues = [{ name: 'dateOfBirth', value: '22n07n18' }];

    const attributes = getAttributes({
      structure: undefined,
      attributesValues,
      language: 'en',
    });
    expect(attributes).toEqual(attributesValues);
  });

  it('getAttributes with valid structure, empty attributesValues and valid language. Should return attributes with translated name and undefined value.', () => {
    const attributesValues: any[] = [];

    const attributes = getAttributes({
      structure: ocaStructure,
      attributesValues,
      language: 'en',
    });

    expect(attributes[0].value).toEqual(undefined);
    expect(attributes[0].name).toEqual('Date of birth');
  });

  it('getAttributes with undefined structure, empty attributesValues and valid language. Should return the empty attributesValues.', () => {
    const attributesValues: any[] = [];

    const attributes = getAttributes({
      structure: undefined,
      attributesValues,
      language: 'en',
    });

    expect(attributes).toEqual(attributesValues);
  });
  it('getAttributes with valid structure, valid attributesValues and invalid language. Should return translated name with the first available translation and a formatted value', () => {
    const attributesValues = [{ name: 'dateOfBirth', value: '22n07n18' }];

    const attributes = getAttributes({
      structure: ocaStructure,
      attributesValues,
      language: '',
    });

    expect(attributes[0].value).toEqual('22n07n18');
    expect(attributes[0].name).toEqual('Date de naissance');
  });
});
