import React from 'react';
import { StyleSheet } from 'react-native';
import { ShowElement } from '../../../components/OCAForm/components/ShowElement';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
const onToggleViewPressed = () => {};

describe('ShowElement', () => {
  it('Given visible hideShowOptions and visible attribute value should render the hide button properly', async () => {
    const { findByText } = render(
      <ShowElement
        hideShowOptions={{ visibility: true }}
        onToggleViewPressed={onToggleViewPressed}
        shown={true}
      />
    );

    const hideButton = await findByText('Hide');

    expect(hideButton).toBeTruthy();
  });

  it('Given visible hideShowOptions and hidden attribute value should render the show button properly', async () => {
    const { findByText } = render(
      <ShowElement
        hideShowOptions={{ visibility: true }}
        onToggleViewPressed={onToggleViewPressed}
        shown={false}
      />
    );

    const showButton = await findByText('Show');
    expect(showButton).toBeTruthy();
  });

  it('Given a hidden hideShowOptions should not display the hide/show button', () => {
    const tree = (
      <ShowElement
        hideShowOptions={{ visibility: false }}
        onToggleViewPressed={onToggleViewPressed}
        shown={false}
      />
    );

    expect(tree).toMatchSnapshot();
  });

  it('Given a visible hideShowOptions, a hidden attribute value and a custom show label should render the custom show label', async () => {
    const { findByText } = render(
      <ShowElement
        hideShowOptions={{
          visibility: true,
          labelShow: <Text>Afficher</Text>,
        }}
        onToggleViewPressed={onToggleViewPressed}
        shown={false}
      />
    );

    const customShowButton = await findByText('Afficher');
    expect(customShowButton).toBeTruthy();
  });

  it('Given a visible hideShowOptions, a visible attribute value and a custom hide label should render the custom hide label', () => {
    const { findByText } = render(
      <ShowElement
        hideShowOptions={{
          visibility: true,
          labelHide: <Text>Cacher</Text>,
        }}
        onToggleViewPressed={onToggleViewPressed}
        shown={true}
      />
    );

    const customHideButton = findByText('Cacher');
    expect(customHideButton).toBeTruthy();
  });

  it('Given a visible hideShowOptions and a custom styling should render ShowElement with the style', () => {
    const styles = StyleSheet.create({
      hideShow: {
        fontSize: 20,
        textDecorationLine: 'underline',
      },
    });
    const tree = (
      <ShowElement
        hideShowOptions={{
          visibility: true,
        }}
        onToggleViewPressed={onToggleViewPressed}
        shown={true}
        style={styles.hideShow}
      />
    );

    expect(tree).toMatchSnapshot();
  });
});
