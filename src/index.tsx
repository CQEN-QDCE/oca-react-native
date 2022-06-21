import React from "react";
import {SafeAreaView, View} from "react-native";
import {WebView} from 'react-native-webview';
import jsYaml  from 'js-yaml';
const structureJson = require("./structure.json");


export function Component(): JSX.Element {
    let webview = React.createRef<WebView<{}>>();
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
            issueDate: '09/06/2010'
        }
    };
    let layout = jsYaml.load(structureJson.credentialLayout, { schema: jsYaml.JSON_SCHEMA });
    if (webview.current !== null) {
        console.log('YESS');
        webview.current.injectJavaScript("renderOCACredential(" + JSON.stringify(structureJson) + ", " + JSON.stringify(dataRepo['EYz7AI0ePCPnpmTpM0CApKoMzBA5bkwek1vsRBEQuMdQ']) + ", { dataVaultUrl: 'https://data-vault.argo.colossi.network/api/v1/files'}, " + JSON.stringify(layout) + "); true;");
    }

    return (
    <SafeAreaView style={{width: '100%', height: 150, backgroundColor: '#a7a7a7'}}>
        <View style={{width: '100%', height: '100%'}}>
            <WebView
                automaticallyAdjustContentInsets={false}
                originWhitelist={["*"]}
                ref={webview}
                source={{html: require('./html.js')()}}
                incognito={true}
                cacheEnabled={false}
                style={{backgroundColor:'#000000', height: '100%', width: '100%'}}
                onLoadEnd={()=>{webview?.current?.postMessage('Hello from RN');}}
                //injectedJavaScript={jscode}
                domStorageEnabled={true}
                javaScriptEnabled={true}
                allowFileAccess={true}
                allowUniversalAccessFromFileURLs={true}
            />
        </View>
    </SafeAreaView>
  )
}
