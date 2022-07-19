import renderer from 'react-test-renderer';
import React from 'react';
import { StyleSheet } from 'react-native';
import { BinaryAttribute } from '../../../components/OCAForm/components/AttributesTypes/BinaryAttribute';

const binaryAttribute = {
  name: 'Picture',
  value:
    'iVBORw0KGgoAAAANSUhEUgAAAV4AAAFeAQAAAADlUEq3AAAAAW9yTlQBz6J3mgAAACZJREFUaN7twTEBAAAAwqD1T+1pCaAAAAAAAAAAAAAAAAAAAAC4AT2GAAGWvJzxAAAAAElFTkSuQmCC',
  type: 'Binary',
};

describe('BinaryAttribute', () => {
  it('Given a binary attribute should render the attribute value properly.', () => {
    const tree = renderer
      .create(<BinaryAttribute attribute={binaryAttribute} shown={true} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Given a hidden attribute with custom styling should render hidden value with custom styling.', () => {
    const styles = StyleSheet.create({
      value: {
        fontSize: 32,
        color: 'red',
      },
    });
    const tree = renderer
      .create(
        <BinaryAttribute
          attribute={binaryAttribute}
          shown={false}
          textStyle={styles.value}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Given a binary attribute with custom styling should render the binary attribute properly.', () => {
    const styles = StyleSheet.create({
      imageStyle: {
        height: 200,
        width: 200,
      },
    });
    const tree = renderer
      .create(
        <BinaryAttribute
          attribute={binaryAttribute}
          shown={true}
          binaryStyle={styles.imageStyle}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
