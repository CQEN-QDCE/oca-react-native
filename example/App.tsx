import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const structure = require('./structure.json');
const ocaCredentialLayoutBasic = require('./bundles/oca-credential-layout-basic.json');
const ocaDigitalPassport = require('./bundles/oca-digital-passport.json');
const oca = require('./bundles/oca.json');
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
  const [pageNumber, setPageNumber] = useState(0);
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
        createOcaStructure(json as OCA).then((OCAStructure: any) => {
          setOCAAttributes(getAttributes(attributeValues, 'en', OCAStructure));
        });
      })
      .catch();
  }, []);

  const dataRepo = {
    EYz7AI0ePCPnpmTpM0CApKoMzBA5bkwek1vsRBEQuMdQ: {
      Nom: 'MonNom',
      Prénom: 'MonPrénom',
      'Date de naissance': '2000-01-21',
      'Nom du parent 1': 'Parent 1',
      'Nom du parent 2': 'Parent 2',
      "Date d'émission": new Date().toJSON(),
      "Date d'expiration": '95818',
      "Niveau d'identification": 1,
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
              oca={oca}
              pageNumber={pageNumber}
              language={'en'}
              attributeValues={
                new Map(
                  Object.entries(
                    dataRepo.EYz7AI0ePCPnpmTpM0CApKoMzBA5bkwek1vsRBEQuMdQ,
                  ),
                )
              }
            />
          </View>
          <View
            style={{
              marginTop: 20,
              width: '60%',
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                borderStyle: 'solid',
                borderWidth: 2,
                borderRightWidth: 1,
                borderBottomLeftRadius: 5,
                paddingVertical: 10,
                borderTopLeftRadius: 5,
                backgroundColor: '#fcfcfc',
              }}
              onPress={_ => setPageNumber(0)}>
              <Text>Page 0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                borderStyle: 'solid',
                borderWidth: 2,
                borderLeftWidth: 1,
                paddingVertical: 10,
                borderBottomRightRadius: 5,
                borderTopRightRadius: 5,
                backgroundColor: '#fcfcfc',
              }}
              onPress={_ => setPageNumber(1)}>
              <Text>Page 1</Text>
            </TouchableOpacity>
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
                language={'en'}
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
