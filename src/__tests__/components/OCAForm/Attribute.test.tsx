import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Attribute } from '../../../components/OCAForm/components/Attribute';
import { Text } from 'react-native';
const textAttribute = { name: 'Birth date', value: '2000-02-21', type: 'Text' };
const binaryAttribute = {
  name: 'Picture',
  value:
    'iVBORw0KGgoAAAANSUhEUgAAAV4AAAFeAQAAAADlUEq3AAAAAW9yTlQBz6J3mgAAACZJREFUaN7twTEBAAAAwqD1T+1pCaAAAAAAAAAAAAAAAAAAAAC4AT2GAAGWvJzxAAAAAElFTkSuQmCC',
  type: 'Binary',
};

const onTogglePress = () => {};

describe('Oca Attribute', () => {
  it('Given a visible text attribute should render label and value visible.', async () => {
    await waitFor(() =>
      render(
        <Attribute
          attribute={textAttribute}
          onToggleViewPressed={onTogglePress}
          shown={true}
          hideShowOptions={{ visibility: true }}
        />
      )
    )
      .then(async ({ findByText }) => {
        const label = await findByText(textAttribute.name);
        expect(label).toBeTruthy();
        return { findByText };
      })
      .then(async ({ findByText }) => {
        const value = await findByText(textAttribute.value);
        expect(value).toBeTruthy();
      });
  });

  it('Given a binary attribute should render properly', () => {
    const tree = render(
      <Attribute
        attribute={binaryAttribute}
        onToggleViewPressed={onTogglePress}
        shown={true}
        hideShowOptions={{ visibility: true }}
      />
    );

    expect(tree).toMatchSnapshot();
  });

  it('Given a attributeLabel should render the attribute label properly', async () => {
    const { findByText } = render(
      <Attribute
        attribute={textAttribute}
        onToggleViewPressed={onTogglePress}
        shown={true}
        hideShowOptions={{ visibility: false }}
        attributeLabel={(attribute) => {
          return <Text>{attribute.name}</Text>;
        }}
      />
    );

    const label = await findByText(textAttribute.name);
    expect(label).toBeTruthy();
  });

  it('Given a attributeValue should render the attribute value properly', async () => {
    const { findByText } = render(
      <Attribute
        attribute={textAttribute}
        onToggleViewPressed={onTogglePress}
        shown={true}
        hideShowOptions={{ visibility: false }}
        attributeValue={(attribute) => {
          return <Text>{attribute.value}</Text>;
        }}
      />
    );

    const value = await findByText(textAttribute.value);
    expect(value).toBeTruthy();
  });
});
