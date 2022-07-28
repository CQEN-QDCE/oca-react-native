import React, { useEffect, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  Platform,
  SafeAreaView,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import jsYaml from 'js-yaml';
import type { OCA } from 'oca.js';
import { OcaJs } from '../../packages/oca.js-form-core/OcaJs';
import type { WebViewError } from 'react-native-webview/lib/WebViewTypes';

type props = {
  oca: OCA;
  attributeValues: Map<string, string | number>;
  pageNumber?: number;
  onError?: (syntheticEvent: NativeSyntheticEvent<WebViewError>) => void;
  language?: string;
  width?: number | string;
  height?: number | string;
};

const HTML_SOURCE = Platform.select({
  ios: require('../../../android/src/main/assets/credential-layout.html'),
  android: { uri: 'file:///android_asset/credential-layout.html' },
});

const OcaCredential = ({
  oca,
  attributeValues,
  pageNumber = 0,
  onError,
  language,
  width = '100%',
  height = '100%',
}: props) => {
  const [structure, setStructure] = useState<any>(null);
  const ocaJs = new OcaJs({});
  let webviewRef = useRef<WebView>(null);

  useEffect(() => {
    if (oca) {
      ocaJs.createStructure(oca).then((ocaStructure) => {
        if (webviewRef.current) {
          setStructure(ocaStructure);
        }
      });
    }
  }, [oca]);

  useEffect(() => {
    if (webviewRef.current)
      webviewRef.current.injectJavaScript(getInjection(structure));
  }, [pageNumber]);

  const getInjection = (structureJson: any) => {
    if (structureJson) {
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
        ',' +
        JSON.stringify({ defaultLanguage: language }) +
        ',' +
        JSON.stringify(layout) +
        ',' +
        pageNumber +
        '); true;'
      );
    }
    return '';
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
          onError={onError}
          injectedJavaScript={getInjection(structure)}
          onMessage={() => {}}
          source={HTML_SOURCE}
          incognito={true}
          cacheEnabled={false}
          style={{
            backgroundColor: 'transparent',
            minHeight: '100%',
            minWidth: '100%',
          }}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          startInLoadingState={true}
          allowFileAccess={true}
          scrollEnabled={false}
          allowUniversalAccessFromFileURLs={true}
          allowFileAccessFromFileURLs={true}
          scalesPageToFit={Platform.select({ android: false })}
        />
      </View>
    </SafeAreaView>
  );
};

export default OcaCredential;
