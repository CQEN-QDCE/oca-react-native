import React from 'react';
import { LabelElement } from '../../../components/OCAForm/components/LabelElement';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';

const attribute = { name: 'Birth date', value: '2000-02-21', type: 'Text' };

describe('LabelElement', () => {
  it('Given an attribute should render the label.', async () => {
    const { findByText } = render(<LabelElement attribute={attribute} />);

    const label = await findByText(attribute.name);
    expect(label).toBeTruthy();
  });

  it('Given an attribute with custom styling should render the label with custom styling properly.', () => {
    const styles = StyleSheet.create({
      label: {
        fontSize: 32,
        color: 'red',
      },
    });
    const tree = render(
      <LabelElement attribute={attribute} style={styles.label} />
    );

    expect(tree).toMatchSnapshot();
  });
});
