import React from 'react';
import { StyleSheet } from 'react-native';
import { TextAttribute } from '../../../components/OCAForm/components/AttributesTypes/TextAttribute';
import { render } from '@testing-library/react-native';

const attribute = { name: 'Birth date', value: '2000-02-21', type: 'Text' };

describe('TextAttribute', () => {
  it('Given an attribute should render the attribute value.', async () => {
    const { findByText } = render(
      <TextAttribute attribute={attribute} shown={true} styles={undefined} />
    );

    const value = await findByText(attribute.value);
    expect(value).toBeTruthy();
  });

  it('Given an attribute with custom styling should render the label with custom styling properly.', () => {
    const styles = StyleSheet.create({
      value: {
        fontSize: 32,
        color: 'red',
      },
    });
    const tree = render(
      <TextAttribute attribute={attribute} shown={true} styles={styles.value} />
    );

    expect(tree).toMatchSnapshot();
  });
});
