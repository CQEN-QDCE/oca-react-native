import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import OcaForm from '../../../components/OCAForm/OcaForm';

const attribute = [{ name: 'dateOfBirth', value: '2000-02-21' }];
const oca = require('../../OCA.json');

describe('OcaForm', () => {
  it('Given valid params should render oca form properly.', async () => {
    let tree;
    await waitFor(
      async () =>
        (tree = render(
          <OcaForm
            oca={oca}
            attributeValues={attribute}
            deviceLanguage={'en'}
          />
        ))
    );

    expect(tree).toMatchSnapshot();
  });

  it('When clicking show attribute value should be visible', async () => {
    const { findByText, findAllByText } = await waitFor(() => {
      return render(
        <OcaForm oca={oca} attributeValues={attribute} deviceLanguage={'en'} />
      );
    });

    const showButton = await findAllByText('Show');
    expect(showButton).toBeTruthy();

    fireEvent(showButton[0], 'press');

    const attributeValueVisible = await findByText('00n02n20');
    expect(attributeValueVisible).toBeTruthy();
  });

  it('When clicking hide all should hide all values', async () => {
    const { findByText, findAllByText, queryAllByText } = await waitFor(() => {
      return render(
        <OcaForm oca={oca} attributeValues={attribute} deviceLanguage={'en'} />
      );
    });

    let showButtons = await findAllByText('Show');
    const attributesLength = showButtons.length;
    expect(showButtons).toBeTruthy();
    showButtons.forEach((button) => fireEvent(button, 'press'));

    showButtons = await queryAllByText('Show');
    let hideButtons = await findAllByText('Hide');
    expect(hideButtons.length).toEqual(attributesLength);
    expect(showButtons.length).toEqual(0);

    const hideAllButton = await findByText('Hide All');
    fireEvent(hideAllButton, 'press');

    hideButtons = await queryAllByText('Hide');
    showButtons = await findAllByText('Show');

    expect(showButtons.length).toEqual(attributesLength);
    expect(hideButtons.length).toEqual(0);
  });
});
