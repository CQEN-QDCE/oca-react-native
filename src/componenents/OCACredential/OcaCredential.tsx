import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { WebView } from 'react-native-webview';
import jsYaml from 'js-yaml';

type props = {
  structure: any;
  width: number | string | undefined;
  height: number | string | undefined;
};

export function OcaCredential({
  structure,
  width,
  height,
}: props): JSX.Element {
  const getInjection = (structureJson: any) => {
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
    let layout = jsYaml.load(structureJson.credentialLayout, {
      schema: jsYaml.JSON_SCHEMA,
    });
    return (
      'renderOCACredential(' +
      JSON.stringify(structureJson) +
      ', ' +
      JSON.stringify(dataRepo.EYz7AI0ePCPnpmTpM0CApKoMzBA5bkwek1vsRBEQuMdQ) +
      ", { dataVaultUrl: 'https://data-vault.argo.colossi.network/api/v1/files'}, " +
      JSON.stringify(layout) +
      '); true;'
    );
  };

  return (
    <SafeAreaView
      style={{ width: width, height: height, backgroundColor: 'transparent' }}
    >
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <WebView
          automaticallyAdjustContentInsets={false}
          originWhitelist={['*']}
          source={{ html: require('./html.js')() }}
          incognito={true}
          cacheEnabled={false}
          style={{
            backgroundColor: 'transparent',
            minHeight: '100%',
            minWidth: '100%',
          }}
          injectedJavaScript={getInjection(structure)}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
        />
      </View>
    </SafeAreaView>
  );
}
