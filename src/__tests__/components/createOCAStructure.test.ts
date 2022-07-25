import { createOcaStructure } from '../../components/createOcaStructure';

const oca = require('../OCA.json');
describe('Create Structure from OCA', () => {
  it('createOcaStructure with valid oca ', async () => {
    const ocaStructure = await createOcaStructure(oca);
    expect(ocaStructure).toBeDefined();
  });

  it('createOcaStructure with undefined', async () => {
    const ocaStructure = await createOcaStructure(undefined);
    expect(ocaStructure).toBeUndefined();
  });
});
