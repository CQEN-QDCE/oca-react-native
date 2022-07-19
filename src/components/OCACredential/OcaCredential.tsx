import React, { useEffect, useRef } from 'react';
import { SafeAreaView, View } from 'react-native';
import { WebView } from 'react-native-webview';
import jsYaml from 'js-yaml';
import type { OCA } from 'oca.js';
import { OcaJs } from '../../packages/oca.js-form-core/OcaJs';

type props = {
  oca: OCA;
  attributeValues: Map<string, string | number>;
  width: number | string | undefined;
  height: number | string | undefined;
};

export function OcaCredential({
  oca,
  attributeValues,
  width,
  height,
}: props): JSX.Element {
  const ocaJs = new OcaJs({});
  let webviewRef = useRef<WebView>();

  useEffect(() => {
    if (oca) {
      ocaJs.createStructure(oca).then((ocaStructure) => {
        if (webviewRef.current) {
          webviewRef.current.injectJavaScript(getInjection(ocaStructure));
        }
      });
    }
  }, [oca]);

  const getInjection = (structureJson: any) => {
    let layout = jsYaml.load(structureJson.credentialLayout, {
      schema: jsYaml.JSON_SCHEMA,
    });
    return (
      'renderOCACredential2(' +
      JSON.stringify(structureJson) +
      ', ' +
      JSON.stringify(
        attributeValues ? Object.fromEntries(attributeValues) : {}
      ) +
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
          ref={webviewRef}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
          }}
          onMessage={() => {}}
          source={require('./credential-layout.html')}
          incognito={true}
          cacheEnabled={false}
          style={{
            backgroundColor: 'transparent',
            minHeight: '100%',
            minWidth: '100%',
          }}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
        />
      </View>
    </SafeAreaView>
  );
}
