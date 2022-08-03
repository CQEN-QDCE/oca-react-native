import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import OcaCredential from '../../../components/OCACredential/OcaCredential';
const oca = require('../../utils/OCA.json');
const attribute = new Map();
attribute.set('Prénom', 'test');

describe('OcaCredential', () => {
  it('Minimal OcaCredential props.', async () => {
    let tree;
    await waitFor(
      async () =>
        (tree = render(<OcaCredential attributeValues={attribute} oca={oca} />))
    );
    expect(tree).toMatchSnapshot();
  });
});
