import renderer from 'react-test-renderer';
import React from 'react';
import { LabelElement } from '../../../components/OCAForm/components/LabelElement';
import { StyleSheet } from 'react-native';

const attribute = { name: 'Birth date', value: '2000-02-21', type: 'Text' };

describe('LabelElement', () => {
  it('Given an attribute should render the label properly.', () => {
    const tree = renderer
      .create(<LabelElement attribute={attribute} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Given an attribute with custom styling should render the label with custom styling properly.', () => {
    const styles = StyleSheet.create({
      label: {
        fontSize: 32,
        color: 'red',
      },
    });
    const tree = renderer
      .create(<LabelElement attribute={attribute} style={styles.label} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
