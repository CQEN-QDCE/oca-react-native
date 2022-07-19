import React, {useEffect, useState} from 'react';
import {
  Alert,
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
const ocaCredentialLayoutBasic = require('./bundles/oca-credential-layout-basic.json');
const ocaDigitalPassport = require('./bundles/oca-digital-passport.json');

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
        newAttributeValues.set('dateOfBirth', '02-22-1989');
        newAttributeValues.set('dateOfExpiry', '01-21-2025');
        newAttributeValues.set('dateOfIssue', new Date().toJSON());
        newAttributeValues.set('documentCode', '001-XX');
        newAttributeValues.set('documentNumber', '971');
        newAttributeValues.set('documentType', 'PASSPORT');
        newAttributeValues.set('fullName', 'Juraj Slafkovsky');
        newAttributeValues.set('issuedBy', 'XXXXX');
        newAttributeValues.set('issuingState', 'XXXXX');
        newAttributeValues.set('issuingStateCode', 'XXXXX');
        newAttributeValues.set('nationality', 'Slovakia');
        newAttributeValues.set('personalNumber', '000 000-0000');
        newAttributeValues.set(
          'photoImage',
          'iVBORw0KGgoAAAANSUhEUgAAAV4AAAFeAQAAAADlUEq3AAAAAW9yTlQBz6J3mgAAACZJREFUaN7twTEBAAAAwqD1T+1pCaAAAAAAAAAAAAAAAAAAAAC4AT2GAAGWvJzxAAAAAElFTkSuQmCC',
        );
        newAttributeValues.set('placeOfBirth', 'Slovakia');
        newAttributeValues.set('primaryIdentifier', 'NA');
        newAttributeValues.set('secondaryIdentifier', 'NA');
        newAttributeValues.set('sex', 'Male');
        newAttributeValues.set(
          'signatureImage',
          'data;image/jpg,iVBORw0KGgoAAAANSUhEUgAAAV4AAAFeAQAAAADlUEq3AAAAAW9yTlQBz6J3mgAAACZJREFUaN7twTEBAAAAwqD1T+1pCaAAAAAAAAAAAAAAAAAAAAC4AT2GAAGWvJzxAAAAAElFTkSuQmCC',
        );

        setAttributeValues(newAttributeValues);
      })
      .catch();
  }, []);
  const dataRepo = {
    EYz7AI0ePCPnpmTpM0CApKoMzBA5bkwek1vsRBEQuMdQ: {
      drivingLicenseID: 'I12345678',
      expirationDate: '08/31/2019',
      lastName: 'Card',
      firstName: 'Holder',
      buildingNumber: '3570',
      street: '21th Street',
      city: 'Sacramento',
      state: 'CA',
      zipCode: '95818',
      dateOfBirth: '08/29/1977',
      restrictions: 'None',
      class: 'C',
      endorsements: 'None',
      sex: 'M',
      hairColor: 'brn',
      eyesColor: 'blu',
      height: '5\'-55"',
      weight: '125',
      documentDiscriminator: '09/30/201060221/21FD/18',
      issueDate: '09/06/2010',
    },
  };
  return (
    <SafeAreaView
      style={[
        backgroundStyle,
        {flex: 1, alignItems: 'center', marginVertical: 15},
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
            OCA Branding
          </Text>
          <View
            style={{
              width: 350,
              height: 250,
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center', 
            }}>
            <OcaCredential height={'100%'} width={'100%'} oca={ocaCredentialLayoutBasic} attributeValues={new Map(Object.entries(dataRepo.EYz7AI0ePCPnpmTpM0CApKoMzBA5bkwek1vsRBEQuMdQ))} />
          </View>
        </View>
        <View
          style={{
            width: '100%',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
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
              OCA Form
            </Text>
            <ScrollView>
              <OcaForm
                oca={data}
                attributeValues={attributeValues}
                deviceLanguage={'en'}
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
