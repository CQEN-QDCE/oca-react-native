import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import OcaCredential from '../../../components/OCACredential/OcaCredential';
const oca = require('../../utils/OCA.json');
const attribute = new Map();
attribute.set('Prénom', 'test');

describe('OcaCredential', () => {
  it('Given the minimal OcaCredential props.', async () => {
    let tree;
    await waitFor(
      async () =>
        (tree = render(<OcaCredential attributeValues={attribute} oca={oca} />))
    );
    expect(tree).toMatchSnapshot();
  });

  it('Given a default language should pass the default language to the webview', async () => {
    let tree;
    await waitFor(
      async () =>
        (tree = render(
          <OcaCredential
            attributeValues={attribute}
            oca={oca}
            language={'en'}
          />
        ))
    );
    expect(tree).toMatchSnapshot();
  });

  it('Given a page should pass the page to the webview', async () => {
    let tree;
    await waitFor(
      async () =>
        (tree = render(
          <OcaCredential attributeValues={attribute} oca={oca} pageNumber={1} />
        ))
    );
    expect(tree).toMatchSnapshot();
  });
});
