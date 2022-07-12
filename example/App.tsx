import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {OcaCredential, OcaForm, OCA} from 'oca-react-native';

const structure = require('./structure.json');

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [data, setData] = useState<OCA | undefined>(undefined);

  const [attributeValues, setAttributeValues] = useState<
    Map<string, string | number>
  >(new Map<string, string | number>());

  useEffect(() => {
    fetch(
      'https://repository.oca.argo.colossi.network/api/v0.1/schemas/E2oRZ5zEKxTfTdECW-v2Q7bM_H0OD0ko7IcCwdo_u9co',
    )
      .then(result => {
        return result.json();
      })
      .then(json => {
        setData(json as OCA);
        let newAttributeValues = new Map<string, string | number>();
        newAttributeValues.set('dateOfBirth', '02-04-03');
        newAttributeValues.set('documentType', 'PASSPORT');
        newAttributeValues.set('fullName', 'Meo');
        newAttributeValues.set(
          'photoImage',
          'iVBORw0KGgoAAAANSUhEUgAAAV4AAAFeAQAAAADlUEq3AAAAAW9yTlQBz6J3mgAAACZJREFUaN7twTEBAAAAwqD1T+1pCaAAAAAAAAAAAAAAAAAAAAC4AT2GAAGWvJzxAAAAAElFTkSuQmCC',
        );

        setAttributeValues(newAttributeValues);
      })
      .catch();
  }, []);

  return (
    <SafeAreaView
      style={[
        backgroundStyle,
        {flex: 1, alignItems: 'center', maxHeight: '100%', marginVertical: 15},
      ]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View
        style={{
          flex: 1,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            flex: 1,
            borderRadius: 10,
            paddingVertical: 10,
            width: '90%',
            alignItems: 'center',
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: isDarkMode ? Colors.white : Colors.black,
              },
            ]}>
            OCA React Native Component.
          </Text>
          <View
            style={{
              width: 350,
              height: 250,
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <OcaCredential height={'80%'} width={'80%'} structure={structure} />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            borderRadius: 10,
            paddingVertical: 10,
            marginTop: 15,
            width: '90%',
            alignItems: 'center',
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: isDarkMode ? Colors.white : Colors.black,
              },
            ]}>
            OCA React Native Form.
          </Text>
          <ScrollView>
            <OcaForm
              oca={data}
              attributeValues={attributeValues}
              deviceLanguage={'fr'}
              hideShowOptions={{visibility: false}}
            />
            {
              // OCAForm other possible props
              /*
                stylingOptions?={
                  attributeContainerStyle: StyleProp<ViewStyle>;
                  labelTextStyle?: StyleProp<TextStyle>;
                  textStyle?: StyleProp<TextStyle>;
                  separatorStyle?: StyleProp<ViewStyle>;
                  binaryStyle?: StyleProp<any>;
                 };
                 hideShowOptions?: {
                  visibility?: boolean;
                  labelHide?: React.ReactNode;
                  labelShow?: React.ReactNode;
                 };
            */
            }
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
