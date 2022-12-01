[![img](https://img.shields.io/badge/Cycle%20de%20Vie-Phase%20d%C3%A9couverte-339999)](https://www.quebec.ca/gouv/politiques-orientations/vitrine-numeriqc/accompagnement-des-organismes-publics/demarche-conception-services-numeriques)
[![License](https://img.shields.io/badge/Licence-LiLiQ--R-blue)](LICENSE)

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
    pageNumber,
    onError,
    language,
    width,
    height
/>
```


### &ensp;OCA Form
```
<OcaForm 
    oca,
    language,
    attributeValues,
    stylingOptions,
    hideShowOptions,
    maxNumberOfAttributes
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

## Licence
Distribué sous Licence Libre du Québec – Réciprocité (LiLiQ-R). Voir [LICENCE](LICENSE) pour plus d'informations.
