import React from 'react';
import renderer from 'react-test-renderer';
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
  it('Given a text attribute should render properly.', () => {
    const tree = renderer
      .create(
        <Attribute
          attribute={textAttribute}
          onToggleViewPressed={onTogglePress}
          shown={true}
          hideShowOptions={{ visibility: true }}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Given a binary attribute should render properly', () => {
    const tree = renderer
      .create(
        <Attribute
          attribute={binaryAttribute}
          onToggleViewPressed={onTogglePress}
          shown={true}
          hideShowOptions={{ visibility: true }}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Given a attributeLabel should render the attribute label properly', () => {
    const tree = renderer
      .create(
        <Attribute
          attribute={textAttribute}
          onToggleViewPressed={onTogglePress}
          shown={true}
          hideShowOptions={{ visibility: false }}
          attributeLabel={(attribute) => {
            return <Text>{attribute.name}</Text>;
          }}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Given a attributeValue should render the attribute value properly', () => {
    const tree = renderer
      .create(
        <Attribute
          attribute={textAttribute}
          onToggleViewPressed={onTogglePress}
          shown={true}
          hideShowOptions={{ visibility: false }}
          attributeValue={(attribute) => {
            return <Text>{attribute.value}</Text>;
          }}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
