# oca-react-native library

React Native library for Overlay Capture Architecture (OCA).

## Installation

For now, you can only run the library locally. You need to clone the repository and do the installation.
After, you can pack the library with the prepare command line.

    npm install
    npm run prepare

## Examples

The code for the example is under the [example/](https://github.com/CQEN-QDCE/oca-react-native/tree/main/example)
directory. If you want to play with the oca components you can run the example project. Check [example/](https://github.com/CQEN-QDCE/oca-react-native/tree/main/example)
directory README for installation instructions.

## Documentation

The library is principally an adaptation of [oca.js-form-core](https://github.com/THCLab/oca.js-form-core) and
[oca.js-form-html](https://github.com/THCLab/oca.js-form-html) to be easily use in react native. For that, the library oca-react-native expose OcaCredential, 
OcaForm, createOcaStructure and getAttributes.

### &ensp;OCA Credential
```
<OcaCredential
    oca,
    attributeValues,
    width,
    height,
/>
```


### &ensp;OCA Form
```
<OcaForm 
    oca,
    deviceLanguage,
    attributeValues,
    stylingOptions,
    hideShowOptions = defaultHideShowOptions,
    maxNumberOfAttributes = 200
/>
```

### &ensp; Create Oca Structure
```
createOcaStructure(oca): Promise<Structure | undefined>
```

### &ensp; Get Attribute
```
getAttributes(attributesValues, language, structure): AttributesValues | object{name: string | undefined, ..., value: string | undefined}
```
