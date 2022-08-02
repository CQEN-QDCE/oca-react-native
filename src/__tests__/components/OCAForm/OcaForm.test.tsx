import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import OcaForm from '../../../components/OCAForm/OcaForm';
import { Text } from 'react-native';

const attribute = [{ name: 'dateOfBirth', value: '2000-02-21' }];
const oca = require('../../OCA.json');

describe('OcaForm', () => {
  it('Given valid params should render oca form properly.', async () => {
    let tree;
    await waitFor(
      async () =>
        (tree = render(
          <OcaForm oca={oca} attributeValues={attribute} language={'en'} />
        ))
    );

    expect(tree).toMatchSnapshot();
  });

  it('Given OcaForm with a undefined oca should return the attributeValues array', async () => {
    const { queryAllByText } = await waitFor(async () =>
      render(
        <OcaForm
          oca={undefined}
          attributeValues={attribute}
          language={'en'}
          hideShowOptions={{ visibility: false }}
        />
      )
    );

    const label = queryAllByText(attribute[0].name);
    const value = queryAllByText(attribute[0].value);

    expect(label.length).toEqual(1);
    expect(value.length).toEqual(1);
  });

  it('Given valid params and hidden hideShowOption should render oca form properly without hideShowOption.', async () => {
    const { queryAllByText } = await waitFor(async () =>
      render(
        <OcaForm
          oca={oca}
          attributeValues={attribute}
          language={'en'}
          hideShowOptions={{ visibility: false }}
        />
      )
    );

    const hideButton = queryAllByText('Hide');
    const showButton = queryAllByText('Show');

    expect(hideButton.length).toEqual(0);
    expect(showButton.length).toEqual(0);
  });

  it('Given valid params and hidden hideShowOption should not display hide all button.', async () => {
    const { queryAllByText } = await waitFor(async () =>
      render(
        <OcaForm
          oca={oca}
          attributeValues={attribute}
          language={'en'}
          hideShowOptions={{ visibility: false }}
        />
      )
    );

    const hideAllButton = queryAllByText('Hide All');

    expect(hideAllButton.length).toEqual(0);
  });

  it('Given valid params width a max number of attributes should display the correct number of attributes.', async () => {
    const maxNumberOfAttributes = 5;
    const { queryAllByText } = await waitFor(async () =>
      render(
        <OcaForm
          oca={oca}
          attributeValues={attribute}
          language={'en'}
          maxNumberOfAttributes={maxNumberOfAttributes}
        />
      )
    );

    const hideAllButton = queryAllByText('Show');

    expect(hideAllButton.length).toEqual(maxNumberOfAttributes);
  });

  it('Given valid params width a custom hide all label should display the hide all correctly', async () => {
    const hideAllLabel = 'Tout Cacher';
    const { queryAllByText } = await waitFor(async () =>
      render(
        <OcaForm
          oca={oca}
          attributeValues={attribute}
          language={'en'}
          hideShowOptions={{
            visibility: true,
            labelHideAll: <Text>{hideAllLabel}</Text>,
          }}
        />
      )
    );

    const hideAllButton = queryAllByText(hideAllLabel);

    expect(hideAllButton.length).toEqual(1);
  });

  it('When clicking show attribute. Value should be visible', async () => {
    await waitFor(() => {
      return render(
        <OcaForm oca={oca} attributeValues={attribute} language={'en'} />
      );
    })
      .then(async ({ findByText, findAllByText }) => {
        const showButton = await findAllByText('Show');

        fireEvent(showButton[0], 'press');
        return findByText;
      })
      .then(async (findByText) => {
        const attributeValueVisible = await findByText('00n02n20');
        expect(attributeValueVisible).toBeTruthy();
      });
  });

  it('When clicking hide all should hide all values', async () => {
    let attributesLength: number;
    await waitFor(() => {
      return render(
        <OcaForm oca={oca} attributeValues={attribute} language={'en'} />
      );
    })
      .then(async ({ findByText, findAllByText, queryAllByText }) => {
        let showButtons = await findAllByText('Show');
        attributesLength = showButtons.length;
        expect(showButtons).toBeTruthy();
        showButtons.forEach((button) => fireEvent(button, 'press'));
        return { queryAllByText, findByText, findAllByText };
      })
      .then(async ({ queryAllByText, findByText, findAllByText }) => {
        const showButtons = queryAllByText('Show');
        let hideButtons = await findAllByText('Hide');
        expect(hideButtons.length).toEqual(attributesLength);
        expect(showButtons.length).toEqual(0);
        return { queryAllByText, findByText, findAllByText };
      })
      .then(async ({ queryAllByText, findByText, findAllByText }) => {
        const hideAllButton = await findByText('Hide All');
        fireEvent(hideAllButton, 'press');
        return { queryAllByText, findAllByText };
      })
      .then(async ({ queryAllByText, findAllByText }) => {
        const hideButtons = queryAllByText('Hide');
        const showButtons = await findAllByText('Show');

        expect(showButtons.length).toEqual(attributesLength);
        expect(hideButtons.length).toEqual(0);
      });
  });
});
