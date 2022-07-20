import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import type { OCA } from 'oca.js';
import { OcaJs } from '../../packages/oca.js-form-core/OcaJs';
import { generateOCACredentialNative2 } from '../../packages/oca.js-form-html/generateOCACredentialNative2';

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
  const [credential, setCredential] = useState<ReactElement>(<View></View>);
  useEffect(() => {
    if (oca) {
      ocaJs.createStructure(oca).then((ocaStructure) => {
        setCredential(generateOCACredentialNative2(ocaStructure, {}, {}));
      });
    }
  }, [oca]);

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
        {credential}
      </View>
    </SafeAreaView>
  );
}
