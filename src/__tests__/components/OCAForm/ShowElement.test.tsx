import renderer from 'react-test-renderer';
import React from 'react';
import { StyleSheet } from 'react-native';
import { ShowElement } from '../../../components/OCAForm/components/ShowElement';
import { Text } from 'react-native';
const onToggleViewPressed = () => {};

describe('ShowElement', () => {
  it('Given visible hideShowOptions and visible attribute value should render the hide button properly', () => {
    const tree = renderer
      .create(
        <ShowElement
          hideShowOptions={{ visibility: true }}
          onToggleViewPressed={onToggleViewPressed}
          shown={true}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Given visible hideShowOptions and hidden attribute value should render the show button properly', () => {
    const tree = renderer
      .create(
        <ShowElement
          hideShowOptions={{ visibility: true }}
          onToggleViewPressed={onToggleViewPressed}
          shown={false}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Given a hidden hideShowOptions should not display the hide/show button', () => {
    const tree = renderer
      .create(
        <ShowElement
          hideShowOptions={{ visibility: false }}
          onToggleViewPressed={onToggleViewPressed}
          shown={false}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Given a visible hideShowOptions, a hidden attribute value and a custom show label should render the custom show label properly', () => {
    const tree = renderer
      .create(
        <ShowElement
          hideShowOptions={{
            visibility: true,
            labelShow: <Text>Afficher</Text>,
          }}
          onToggleViewPressed={onToggleViewPressed}
          shown={false}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Given a visible hideShowOptions, a visible attribute value and a custom hide label should render the custom hide label properly', () => {
    const tree = renderer
      .create(
        <ShowElement
          hideShowOptions={{
            visibility: true,
            labelHide: <Text>Cacher</Text>,
          }}
          onToggleViewPressed={onToggleViewPressed}
          shown={true}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Given a visible hideShowOptions and a custom styling should render ShowElement with the style', () => {
    const styles = StyleSheet.create({
      hideShow: {
        fontSize: 20,
        textDecorationLine: 'underline',
      },
    });
    const tree = renderer
      .create(
        <ShowElement
          hideShowOptions={{
            visibility: true,
          }}
          onToggleViewPressed={onToggleViewPressed}
          shown={true}
          style={styles.hideShow}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
