import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const structure = require('./structure.json');
const ocaCredentialLayoutBasic = require('./bundles/oca-credential-layout-basic.json');
const ocaDigitalPassport = require('./bundles/oca-digital-passport.json');
import {
  OcaCredential,
  OcaForm,
  OCA,
  createOcaStructure,
  getAttributes,
} from 'oca-react-native';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [data, setData] = useState<OCA | undefined>(undefined);
  const [OCAAttributes, setOCAAttributes] = useState<any>();
  const [attributeValues] = useState([
    {name: 'dateOfBirth', value: '02-22-1989'},
    {name: 'dateOfExpiry', value: '01-21-2025'},
    {name: 'dateOfIssue', value: new Date().toJSON()},
    {name: 'documentCode', value: '001-XX'},
    {name: 'documentNumber', value: '971'},
    {name: 'documentType', value: 'PASSPORT'},
    {name: 'fullName', value: 'Juraj Slafkovsky'},
    {name: 'issuedBy', value: 'XXXXX'},
    {name: 'issuingState', value: 'XXXXX'},
    {name: 'issuingStateCode', value: 'XXXXX'},
    {name: 'nationality', value: 'Slovakia'},
    {name: 'personalNumber', value: '000 000-0000'},

    {
      name: 'photoImage',
      value:
        'iVBORw0KGgoAAAANSUhEUgAAAV4AAAFeAQAAAADlUEq3AAAAAW9yTlQBz6J3mgAAACZJREFUaN7twTEBAAAAwqD1T+1pCaAAAAAAAAAAAAAAAAAAAAC4AT2GAAGWvJzxAAAAAElFTkSuQmCC',
    },
    {name: 'placeOfBirth', value: 'Slovakia'},
    {name: 'primaryIdentifier', value: 'NA'},
    {name: 'secondaryIdentifier', value: 'NA'},
    {name: 'sex', value: 'Male'},
    {
      name: 'signatureImage',
      value:
        'data;image/jpg,iVBORw0KGgoAAAANSUhEUgAAAV4AAAFeAQAAAADlUEq3AAAAAW9yTlQBz6J3mgAAACZJREFUaN7twTEBAAAAwqD1T+1pCaAAAAAAAAAAAAAAAAAAAAC4AT2GAAGWvJzxAAAAAElFTkSuQmCC',
    },
  ]);

  useEffect(() => {
    fetch(
      'https://repository.oca.argo.colossi.network/api/v0.1/schemas/E2oRZ5zEKxTfTdECW-v2Q7bM_H0OD0ko7IcCwdo_u9co',
    )
      .then(result => {
        return result.json();
      })
      .then(json => {
        setData(json as OCA);
        createOcaStructure(json as OCA).then(OCAStructure => {
          setOCAAttributes(getAttributes(attributeValues, 'en', OCAStructure));
        });
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
    <ScrollView style={[backgroundStyle, {flex: 1, marginVertical: 15}]}>
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
            <OcaCredential
              height={'100%'}
              width={'100%'}
              oca={ocaDigitalPassport}
              attributeValues={
                new Map(
                  Object.entries(
                    dataRepo.EYz7AI0ePCPnpmTpM0CApKoMzBA5bkwek1vsRBEQuMdQ,
                  ),
                )
              }
            />
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
            <View>
              <OcaForm
                oca={data}
                attributeValues={attributeValues}
                deviceLanguage={'en'}
              />
            </View>
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
          </View>
        </View>

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
              Form from Attributes
            </Text>
            <View>
              {OCAAttributes &&
                OCAAttributes.map(({name, value, index}: any) => {
                  return (
                    <View
                      key={index}
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                      }}>
                      <Text style={{color: '#000'}}>{name}</Text>
                      <Text style={{color: '#000'}}>{value}</Text>
                    </View>
                  );
                })}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
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
