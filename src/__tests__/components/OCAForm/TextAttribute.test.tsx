import renderer from 'react-test-renderer';
import React from 'react';
import { StyleSheet } from 'react-native';
import { TextAttribute } from '../../../components/OCAForm/components/AttributesTypes/TextAttribute';

const attribute = { name: 'Birth date', value: '2000-02-21', type: 'Text' };

describe('TextAttribute', () => {
  it('Given an attribute should render the attribute value properly.', () => {
    const tree = renderer
      .create(
        <TextAttribute attribute={attribute} shown={true} styles={undefined} />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Given an attribute with custom styling should render the label with custom styling properly.', () => {
    const styles = StyleSheet.create({
      value: {
        fontSize: 32,
        color: 'red',
      },
    });
    const tree = renderer
      .create(
        <TextAttribute
          attribute={attribute}
          shown={true}
          styles={styles.value}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
