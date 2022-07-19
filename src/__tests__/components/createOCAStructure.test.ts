import { createOCAStructure } from '../../components/createOCAStructure';

const oca = require('../OCA.json');
describe('Create Structure from OCA', () => {
  it('createOCAStructure with valid oca ', async () => {
    const ocaStructure = await createOCAStructure(oca);
    expect(ocaStructure).toBeDefined();
  });

  it('createOCAStructure with undefined', async () => {
    const ocaStructure = await createOCAStructure(undefined);
    expect(ocaStructure).toBeUndefined();
  });
});
