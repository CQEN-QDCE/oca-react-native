module.exports = `
  /******/ (() => { // webpackBootstrap
/******/ "use strict";
/******/ var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateOCACredential = void 0;
const grid_1 = __webpack_require__(2);
const transformDataUnit_1 = __webpack_require__(3);
const generateOCACredential = async (structure, data, config) => {
    const unitMappingOverlays = config.additionalOverlays
        ? config.additionalOverlays.filter(o => o.type.includes(\`/unit/\`))
        : [];
    data = await (0, transformDataUnit_1.transformDataUnit)(data, {
        structure,
        unitOverlays: unitMappingOverlays,
        ocaRepoHostUrl: config.ocaRepoHostUrl
    });
    const layout = config.credentialLayout || structure.credentialLayout;
    const iframe = document.createElement('iframe');
    iframe.id = 'credential';
    iframe.style.cssText = 'width: 100%; height: 100%; border: none;';
    // iframe.scrolling =
    //   !layout.config?.css?.height || !layout.config?.css?.width ? 'yes' : 'no'
    const iframeHead = document.createElement('head');
    if (layout.config && layout.config.css && layout.config.css.style) {
        const iframeStyle = document.createElement('style');
        iframeStyle.innerHTML = layout.config.css.style;
        iframeHead.appendChild(iframeStyle);
    }
    const iframeGridStyle = document.createElement('style');
    iframeGridStyle.innerHTML = grid_1.gridCss;
    iframeHead.appendChild(iframeGridStyle);
    const iframeBody = document.createElement('body');
    const availableLanguages = Object.keys(structure.translations);
    let defaultLanguage = availableLanguages[0];
    if (config.defaultLanguage) {
        if (availableLanguages.includes(config.defaultLanguage)) {
            defaultLanguage = config.defaultLanguage;
        }
        else if (availableLanguages.find(lang => lang.startsWith(config.defaultLanguage))) {
            defaultLanguage = availableLanguages.find(lang => lang.startsWith(config.defaultLanguage));
        }
    }
    const languageSelect = document.createElement('select');
    languageSelect.id = 'language-select';
    languageSelect.className = 'language-select';
    availableLanguages.forEach(lang => {
        const option = document.createElement('option');
        option.setAttribute('value', lang);
        option.innerText = lang;
        if (lang === defaultLanguage) {
            option.setAttribute('selected', '');
        }
        languageSelect.appendChild(option);
    });
    iframeBody.appendChild(languageSelect);
    const credentials = [];
    (await Promise.all(availableLanguages.map(async (language) => {
        const credential = document.createElement('div');
        credential.className = 'credential';
        credential.id = language;
        if (language == defaultLanguage) {
            credential.style.display = 'block';
        }
        else {
            credential.style.display = 'none';
        }
        if (layout.pages.length > 1) {
            const pageSelect = document.createElement('select');
            pageSelect.className = 'page-select';
            layout.pages.forEach((page, i) => {
                const option = document.createElement('option');
                option.setAttribute('value', 'page-' + i);
                option.innerText = page.config.name;
                pageSelect.appendChild(option);
            });
            credential.appendChild(pageSelect);
        }
        ;
        (await Promise.all(layout.pages.map(async (page, i) => {
            const pageDiv = document.createElement('div');
            pageDiv.className = 'page';
            pageDiv.classList.add('page-' + i);
            if (page.config && page.config.css) {
                if (page.config.css.style) {
                    pageDiv.style.cssText = page.config.css.style;
                }
                if (page.config.css.background_image) {
                    const imageSAI = page.config.css.background_image.replace('SAI:', '');
                    pageDiv.style.cssText += \`background-image: url("\${
                      config.dataVaultUrl
                    }/api/v1/files/\${imageSAI}");\`;
                }
            }
            if (i != 0) {
                pageDiv.style.display = 'none';
            }
            else {
                pageDiv.style.display = 'block';
            }
            const renderElement = async (element) => {
                const fragment = document.createDocumentFragment();
                let el;
                switch (element.type) {
                    case 'row':
                        el = document.createElement('div');
                        el.className = 'row';
                        if (element.elements) {
                            ;
                            (await Promise.all(element.elements.map(async (e) => await renderElement(e)))).forEach(e => el.appendChild(e));
                        }
                        break;
                    case 'col':
                        el = document.createElement('div');
                        el.className = element.size ? \`col-\${
                          element.size
                        }\` : 'col';
                        if (element.elements && element.elements.length > 0) {
                            ;
                            (await Promise.all(element.elements.map(async (e) => await renderElement(e)))).forEach(e => el.appendChild(e));
                        }
                        break;
                    case 'layout-label':
                        el = document.createElement('div');
                        el.innerText = layout.labels[element.name][language];
                        break;
                    case 'text':
                        el = document.createElement('div');
                        el.innerText = element.content;
                        break;
                    case 'oca-name':
                        el = document.createElement('div');
                        el.innerText = structure.translations[language].name;
                        break;
                    case 'oca-description':
                        el = document.createElement('div');
                        el.innerText = structure.translations[language].description;
                        break;
                    case 'category': {
                        const section = structure.sections.find(el => el.id == element.name);
                        el = document.createElement('div');
                        let level = (section.id.match(/-/g) || []).length;
                        level = level > 6 ? 6 : level;
                        const header = document.createElement(\`h\${level}\`);
                        header.innerText = section.translations[language].label;
                        el.appendChild(header);
                        break;
                    }
                    case 'attribute': {
                        const attr = structure.controls.find(el => el.name == element.name);
                        const entryCodesMapping = {};
                        if (attr.entryCodesMapping) {
                            attr.entryCodesMapping.forEach(mapping => {
                                const splitted = mapping.split(':');
                                entryCodesMapping[splitted[1]] = splitted[0];
                            });
                        }
                        const attributeDatum = data[attr.mapping || attr.name];
                        if (attr.type == 'Binary') {
                            el = document.createElement('img');
                            if (attributeDatum) {
                                const imageEl = el;
                                imageEl.src = attributeDatum;
                            }
                        }
                        else if (attr.type == 'Select') {
                            el = document.createElement('div');
                            if (attr.translations[language].entries &&
                                attributeDatum) {
                                el.innerText =
                                    attr.translations[language].entries[entryCodesMapping[attributeDatum] ||
                                        attributeDatum];
                            }
                        }
                        else {
                            el = document.createElement('div');
                            const attributeDatum = data[attr.mapping || attr.name];
                            if (attributeDatum) {
                                if (Array.isArray(attributeDatum) &&
                                    attributeDatum.length > 0) {
                                    const s = document.createElement('select');
                                    s.style.cssText =
                                        'border: 0; background-color: rgba(0,0,0,0); margin: inherit; width: 100%;';
                                    attributeDatum.forEach((dataValue) => {
                                        const op = document.createElement('option');
                                        op.value =
                                            entryCodesMapping[dataValue] || dataValue;
                                        op.text =
                                            entryCodesMapping[dataValue] || dataValue;
                                        s.appendChild(op);
                                    });
                                    el.appendChild(s);
                                }
                                else {
                                    el.innerText = attributeDatum;
                                }
                            }
                        }
                        break;
                    }
                    case 'reference': {
                        const attr = structure.controls.find(el => el.name == element.name);
                        const referenceLayout = structure.credentialLayout.reference_layouts[element.layout];
                        const referenceData = data[attr.mapping || attr.name];
                        if (attr.type == 'Reference') {
                            ;
                            (await Promise.all([...Array(Number(attr.cardinality) || 1)].map(async (_, i) => {
                                const referenceDatum = attr.multiple
                                    ? referenceData[i]
                                    : referenceData;
                                const frame = await (0, exports.generateOCACredential)(attr.reference, (referenceDatum || {}), {
                                    credentialLayout: referenceLayout
                                });
                                frame.style.height =
                                    referenceLayout.config.css.height;
                                return frame;
                            }))).forEach(f => {
                                el = document.createElement('div');
                                el.style.height = referenceLayout.config.css.height;
                                el.appendChild(f);
                                fragment.appendChild(el);
                            });
                        }
                        break;
                    }
                    case 'code': {
                        const attr = structure.controls.find(el => el.name == element.name);
                        const attributeDatum = data[attr.mapping || attr.name];
                        el = document.createElement('div');
                        if (attributeDatum) {
                            el.innerText = attributeDatum;
                        }
                        break;
                    }
                    case 'label': {
                        const attr = structure.controls.find(el => el.name == element.name);
                        el = document.createElement('div');
                        el.innerText = attr.translations[language].label;
                        break;
                    }
                    case 'information': {
                        const attr = structure.controls.find(el => el.name == element.name);
                        el = document.createElement('div');
                        el.innerText = attr.translations[language].information || '';
                        break;
                    }
                }
                if (el) {
                    if (element.config && element.config.css) {
                        if (element.config.css.style) {
                            el.style.cssText = element.config.css.style;
                        }
                        if (element.config.css.classes) {
                            el.classList.add(...element.config.css.classes);
                        }
                    }
                    fragment.appendChild(el);
                }
                return fragment;
            };
            (await Promise.all(page.elements.map(async (element) => await renderElement(element)))).forEach(el => {
                if (pageDiv && el) {
                    pageDiv.appendChild(el);
                }
            });
            return pageDiv;
        }))).forEach(pageDiv => credential.appendChild(pageDiv));
        return credential;
    }))).forEach(credential => credentials.push(credential));
    credentials.forEach(credential => iframeBody.appendChild(credential));
    const languageScript = document.createElement('script');
    languageScript.innerText = \`let currentPage = 'page-0'; document.getElementById('language-select').addEventListener('change', e => { [...document.getElementsByClassName('credential')].forEach(el => el.style.display = 'none'); document.getElementById(e.target.value).style.display = 'block'; [...document.getElementsByClassName('page-select')].forEach(s => s.value = currentPage )})\`;
    iframeBody.appendChild(languageScript);
    if (layout.pages.length > 1) {
        const pageScript = document.createElement('script');
        pageScript.innerText = \`[...document.getElementsByClassName('page-select')].forEach(s => s.addEventListener('change', e => { currentPage = e.target.value; [...document.getElementsByClassName('page')].forEach(el => el.style.display = 'none'); [...document.getElementsByClassName(e.target.value)].forEach(el => el.style.display = 'block') } ))\`;
        iframeBody.appendChild(pageScript);
    }
    iframe.src =
        'data:text/html;charset=utf-8,' +
            encodeURI(iframeHead.outerHTML) +
            encodeURI(iframeBody.outerHTML);
    return iframe;
};
exports.generateOCACredential = generateOCACredential;


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.gridCss = void 0;
// @ts-nocheck
exports.gridCss = \`html{-webkit-box-sizing:border-box;box-sizing:border-box;-ms-overflow-style:scrollbar}*,*::before,*::after{-webkit-box-sizing:inherit;box-sizing:inherit}.container{width:100%;padding-right:15px;padding-left:15px;margin-right:auto;margin-left:auto}@media (min-width: 576px){.container{max-width:540px}}@media (min-width: 768px){.container{max-width:720px}}@media (min-width: 992px){.container{max-width:960px}}@media (min-width: 1200px){.container{max-width:1140px}}.container-fluid,.container-sm,.container-md,.container-lg,.container-xl{width:100%;padding-right:15px;padding-left:15px;margin-right:auto;margin-left:auto}@media (min-width: 576px){.container,.container-sm{max-width:540px}}@media (min-width: 768px){.container,.container-sm,.container-md{max-width:720px}}@media (min-width: 992px){.container,.container-sm,.container-md,.container-lg{max-width:960px}}@media (min-width: 1200px){.container,.container-sm,.container-md,.container-lg,.container-xl{max-width:1140px}}.row{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;margin-right:-15px;margin-left:-15px}.no-gutters{margin-right:0;margin-left:0}.no-gutters>.col,.no-gutters>[class*="col-"]{padding-right:0;padding-left:0}.col-1,.col-2,.col-3,.col-4,.col-5,.col-6,.col-7,.col-8,.col-9,.col-10,.col-11,.col-12,.col,.col-auto,.col-sm-1,.col-sm-2,.col-sm-3,.col-sm-4,.col-sm-5,.col-sm-6,.col-sm-7,.col-sm-8,.col-sm-9,.col-sm-10,.col-sm-11,.col-sm-12,.col-sm,.col-sm-auto,.col-md-1,.col-md-2,.col-md-3,.col-md-4,.col-md-5,.col-md-6,.col-md-7,.col-md-8,.col-md-9,.col-md-10,.col-md-11,.col-md-12,.col-md,.col-md-auto,.col-lg-1,.col-lg-2,.col-lg-3,.col-lg-4,.col-lg-5,.col-lg-6,.col-lg-7,.col-lg-8,.col-lg-9,.col-lg-10,.col-lg-11,.col-lg-12,.col-lg,.col-lg-auto,.col-xl-1,.col-xl-2,.col-xl-3,.col-xl-4,.col-xl-5,.col-xl-6,.col-xl-7,.col-xl-8,.col-xl-9,.col-xl-10,.col-xl-11,.col-xl-12,.col-xl,.col-xl-auto{position:relative;width:100%;padding-right:15px;padding-left:15px}.col{-ms-flex-preferred-size:0;flex-basis:0;-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;max-width:100%}.row-cols-1>*{-webkit-box-flex:0;-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}.row-cols-2>*{-webkit-box-flex:0;-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.row-cols-3>*{-webkit-box-flex:0;-ms-flex:0 0 33.3333333333%;flex:0 0 33.3333333333%;max-width:33.3333333333%}.row-cols-4>*{-webkit-box-flex:0;-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.row-cols-5>*{-webkit-box-flex:0;-ms-flex:0 0 20%;flex:0 0 20%;max-width:20%}.row-cols-6>*{-webkit-box-flex:0;-ms-flex:0 0 16.6666666667%;flex:0 0 16.6666666667%;max-width:16.6666666667%}.col-auto{-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;width:auto;max-width:100%}.col-1{-webkit-box-flex:0;-ms-flex:0 0 8.3333333333%;flex:0 0 8.3333333333%;max-width:8.3333333333%}.col-2{-webkit-box-flex:0;-ms-flex:0 0 16.6666666667%;flex:0 0 16.6666666667%;max-width:16.6666666667%}.col-3{-webkit-box-flex:0;-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.col-4{-webkit-box-flex:0;-ms-flex:0 0 33.3333333333%;flex:0 0 33.3333333333%;max-width:33.3333333333%}.col-5{-webkit-box-flex:0;-ms-flex:0 0 41.6666666667%;flex:0 0 41.6666666667%;max-width:41.6666666667%}.col-6{-webkit-box-flex:0;-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.col-7{-webkit-box-flex:0;-ms-flex:0 0 58.3333333333%;flex:0 0 58.3333333333%;max-width:58.3333333333%}.col-8{-webkit-box-flex:0;-ms-flex:0 0 66.6666666667%;flex:0 0 66.6666666667%;max-width:66.6666666667%}.col-9{-webkit-box-flex:0;-ms-flex:0 0 75%;flex:0 0 75%;max-width:75%}.col-10{-webkit-box-flex:0;-ms-flex:0 0 83.3333333333%;flex:0 0 83.3333333333%;max-width:83.3333333333%}.col-11{-webkit-box-flex:0;-ms-flex:0 0 91.6666666667%;flex:0 0 91.6666666667%;max-width:91.6666666667%}.col-12{-webkit-box-flex:0;-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}.order-first{-webkit-box-ordinal-group:0;-ms-flex-order:-1;order:-1}.order-last{-webkit-box-ordinal-group:14;-ms-flex-order:13;order:13}.order-0{-webkit-box-ordinal-group:1;-ms-flex-order:0;order:0}.order-1{-webkit-box-ordinal-group:2;-ms-flex-order:1;order:1}.order-2{-webkit-box-ordinal-group:3;-ms-flex-order:2;order:2}.order-3{-webkit-box-ordinal-group:4;-ms-flex-order:3;order:3}.order-4{-webkit-box-ordinal-group:5;-ms-flex-order:4;order:4}.order-5{-webkit-box-ordinal-group:6;-ms-flex-order:5;order:5}.order-6{-webkit-box-ordinal-group:7;-ms-flex-order:6;order:6}.order-7{-webkit-box-ordinal-group:8;-ms-flex-order:7;order:7}.order-8{-webkit-box-ordinal-group:9;-ms-flex-order:8;order:8}.order-9{-webkit-box-ordinal-group:10;-ms-flex-order:9;order:9}.order-10{-webkit-box-ordinal-group:11;-ms-flex-order:10;order:10}.order-11{-webkit-box-ordinal-group:12;-ms-flex-order:11;order:11}.order-12{-webkit-box-ordinal-group:13;-ms-flex-order:12;order:12}.offset-1{margin-left:8.3333333333%}.offset-2{margin-left:16.6666666667%}.offset-3{margin-left:25%}.offset-4{margin-left:33.3333333333%}.offset-5{margin-left:41.6666666667%}.offset-6{margin-left:50%}.offset-7{margin-left:58.3333333333%}.offset-8{margin-left:66.6666666667%}.offset-9{margin-left:75%}.offset-10{margin-left:83.3333333333%}.offset-11{margin-left:91.6666666667%}@media (min-width: 576px){.col-sm{-ms-flex-preferred-size:0;flex-basis:0;-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;max-width:100%}.row-cols-sm-1>*{-webkit-box-flex:0;-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}.row-cols-sm-2>*{-webkit-box-flex:0;-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.row-cols-sm-3>*{-webkit-box-flex:0;-ms-flex:0 0 33.3333333333%;flex:0 0 33.3333333333%;max-width:33.3333333333%}.row-cols-sm-4>*{-webkit-box-flex:0;-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.row-cols-sm-5>*{-webkit-box-flex:0;-ms-flex:0 0 20%;flex:0 0 20%;max-width:20%}.row-cols-sm-6>*{-webkit-box-flex:0;-ms-flex:0 0 16.6666666667%;flex:0 0 16.6666666667%;max-width:16.6666666667%}.col-sm-auto{-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;width:auto;max-width:100%}.col-sm-1{-webkit-box-flex:0;-ms-flex:0 0 8.3333333333%;flex:0 0 8.3333333333%;max-width:8.3333333333%}.col-sm-2{-webkit-box-flex:0;-ms-flex:0 0 16.6666666667%;flex:0 0 16.6666666667%;max-width:16.6666666667%}.col-sm-3{-webkit-box-flex:0;-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.col-sm-4{-webkit-box-flex:0;-ms-flex:0 0 33.3333333333%;flex:0 0 33.3333333333%;max-width:33.3333333333%}.col-sm-5{-webkit-box-flex:0;-ms-flex:0 0 41.6666666667%;flex:0 0 41.6666666667%;max-width:41.6666666667%}.col-sm-6{-webkit-box-flex:0;-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.col-sm-7{-webkit-box-flex:0;-ms-flex:0 0 58.3333333333%;flex:0 0 58.3333333333%;max-width:58.3333333333%}.col-sm-8{-webkit-box-flex:0;-ms-flex:0 0 66.6666666667%;flex:0 0 66.6666666667%;max-width:66.6666666667%}.col-sm-9{-webkit-box-flex:0;-ms-flex:0 0 75%;flex:0 0 75%;max-width:75%}.col-sm-10{-webkit-box-flex:0;-ms-flex:0 0 83.3333333333%;flex:0 0 83.3333333333%;max-width:83.3333333333%}.col-sm-11{-webkit-box-flex:0;-ms-flex:0 0 91.6666666667%;flex:0 0 91.6666666667%;max-width:91.6666666667%}.col-sm-12{-webkit-box-flex:0;-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}.order-sm-first{-webkit-box-ordinal-group:0;-ms-flex-order:-1;order:-1}.order-sm-last{-webkit-box-ordinal-group:14;-ms-flex-order:13;order:13}.order-sm-0{-webkit-box-ordinal-group:1;-ms-flex-order:0;order:0}.order-sm-1{-webkit-box-ordinal-group:2;-ms-flex-order:1;order:1}.order-sm-2{-webkit-box-ordinal-group:3;-ms-flex-order:2;order:2}.order-sm-3{-webkit-box-ordinal-group:4;-ms-flex-order:3;order:3}.order-sm-4{-webkit-box-ordinal-group:5;-ms-flex-order:4;order:4}.order-sm-5{-webkit-box-ordinal-group:6;-ms-flex-order:5;order:5}.order-sm-6{-webkit-box-ordinal-group:7;-ms-flex-order:6;order:6}.order-sm-7{-webkit-box-ordinal-group:8;-ms-flex-order:7;order:7}.order-sm-8{-webkit-box-ordinal-group:9;-ms-flex-order:8;order:8}.order-sm-9{-webkit-box-ordinal-group:10;-ms-flex-order:9;order:9}.order-sm-10{-webkit-box-ordinal-group:11;-ms-flex-order:10;order:10}.order-sm-11{-webkit-box-ordinal-group:12;-ms-flex-order:11;order:11}.order-sm-12{-webkit-box-ordinal-group:13;-ms-flex-order:12;order:12}.offset-sm-0{margin-left:0}.offset-sm-1{margin-left:8.3333333333%}.offset-sm-2{margin-left:16.6666666667%}.offset-sm-3{margin-left:25%}.offset-sm-4{margin-left:33.3333333333%}.offset-sm-5{margin-left:41.6666666667%}.offset-sm-6{margin-left:50%}.offset-sm-7{margin-left:58.3333333333%}.offset-sm-8{margin-left:66.6666666667%}.offset-sm-9{margin-left:75%}.offset-sm-10{margin-left:83.3333333333%}.offset-sm-11{margin-left:91.6666666667%}}@media (min-width: 768px){.col-md{-ms-flex-preferred-size:0;flex-basis:0;-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;max-width:100%}.row-cols-md-1>*{-webkit-box-flex:0;-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}.row-cols-md-2>*{-webkit-box-flex:0;-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.row-cols-md-3>*{-webkit-box-flex:0;-ms-flex:0 0 33.3333333333%;flex:0 0 33.3333333333%;max-width:33.3333333333%}.row-cols-md-4>*{-webkit-box-flex:0;-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.row-cols-md-5>*{-webkit-box-flex:0;-ms-flex:0 0 20%;flex:0 0 20%;max-width:20%}.row-cols-md-6>*{-webkit-box-flex:0;-ms-flex:0 0 16.6666666667%;flex:0 0 16.6666666667%;max-width:16.6666666667%}.col-md-auto{-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;width:auto;max-width:100%}.col-md-1{-webkit-box-flex:0;-ms-flex:0 0 8.3333333333%;flex:0 0 8.3333333333%;max-width:8.3333333333%}.col-md-2{-webkit-box-flex:0;-ms-flex:0 0 16.6666666667%;flex:0 0 16.6666666667%;max-width:16.6666666667%}.col-md-3{-webkit-box-flex:0;-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.col-md-4{-webkit-box-flex:0;-ms-flex:0 0 33.3333333333%;flex:0 0 33.3333333333%;max-width:33.3333333333%}.col-md-5{-webkit-box-flex:0;-ms-flex:0 0 41.6666666667%;flex:0 0 41.6666666667%;max-width:41.6666666667%}.col-md-6{-webkit-box-flex:0;-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.col-md-7{-webkit-box-flex:0;-ms-flex:0 0 58.3333333333%;flex:0 0 58.3333333333%;max-width:58.3333333333%}.col-md-8{-webkit-box-flex:0;-ms-flex:0 0 66.6666666667%;flex:0 0 66.6666666667%;max-width:66.6666666667%}.col-md-9{-webkit-box-flex:0;-ms-flex:0 0 75%;flex:0 0 75%;max-width:75%}.col-md-10{-webkit-box-flex:0;-ms-flex:0 0 83.3333333333%;flex:0 0 83.3333333333%;max-width:83.3333333333%}.col-md-11{-webkit-box-flex:0;-ms-flex:0 0 91.6666666667%;flex:0 0 91.6666666667%;max-width:91.6666666667%}.col-md-12{-webkit-box-flex:0;-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}.order-md-first{-webkit-box-ordinal-group:0;-ms-flex-order:-1;order:-1}.order-md-last{-webkit-box-ordinal-group:14;-ms-flex-order:13;order:13}.order-md-0{-webkit-box-ordinal-group:1;-ms-flex-order:0;order:0}.order-md-1{-webkit-box-ordinal-group:2;-ms-flex-order:1;order:1}.order-md-2{-webkit-box-ordinal-group:3;-ms-flex-order:2;order:2}.order-md-3{-webkit-box-ordinal-group:4;-ms-flex-order:3;order:3}.order-md-4{-webkit-box-ordinal-group:5;-ms-flex-order:4;order:4}.order-md-5{-webkit-box-ordinal-group:6;-ms-flex-order:5;order:5}.order-md-6{-webkit-box-ordinal-group:7;-ms-flex-order:6;order:6}.order-md-7{-webkit-box-ordinal-group:8;-ms-flex-order:7;order:7}.order-md-8{-webkit-box-ordinal-group:9;-ms-flex-order:8;order:8}.order-md-9{-webkit-box-ordinal-group:10;-ms-flex-order:9;order:9}.order-md-10{-webkit-box-ordinal-group:11;-ms-flex-order:10;order:10}.order-md-11{-webkit-box-ordinal-group:12;-ms-flex-order:11;order:11}.order-md-12{-webkit-box-ordinal-group:13;-ms-flex-order:12;order:12}.offset-md-0{margin-left:0}.offset-md-1{margin-left:8.3333333333%}.offset-md-2{margin-left:16.6666666667%}.offset-md-3{margin-left:25%}.offset-md-4{margin-left:33.3333333333%}.offset-md-5{margin-left:41.6666666667%}.offset-md-6{margin-left:50%}.offset-md-7{margin-left:58.3333333333%}.offset-md-8{margin-left:66.6666666667%}.offset-md-9{margin-left:75%}.offset-md-10{margin-left:83.3333333333%}.offset-md-11{margin-left:91.6666666667%}}@media (min-width: 992px){.col-lg{-ms-flex-preferred-size:0;flex-basis:0;-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;max-width:100%}.row-cols-lg-1>*{-webkit-box-flex:0;-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}.row-cols-lg-2>*{-webkit-box-flex:0;-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.row-cols-lg-3>*{-webkit-box-flex:0;-ms-flex:0 0 33.3333333333%;flex:0 0 33.3333333333%;max-width:33.3333333333%}.row-cols-lg-4>*{-webkit-box-flex:0;-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.row-cols-lg-5>*{-webkit-box-flex:0;-ms-flex:0 0 20%;flex:0 0 20%;max-width:20%}.row-cols-lg-6>*{-webkit-box-flex:0;-ms-flex:0 0 16.6666666667%;flex:0 0 16.6666666667%;max-width:16.6666666667%}.col-lg-auto{-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;width:auto;max-width:100%}.col-lg-1{-webkit-box-flex:0;-ms-flex:0 0 8.3333333333%;flex:0 0 8.3333333333%;max-width:8.3333333333%}.col-lg-2{-webkit-box-flex:0;-ms-flex:0 0 16.6666666667%;flex:0 0 16.6666666667%;max-width:16.6666666667%}.col-lg-3{-webkit-box-flex:0;-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.col-lg-4{-webkit-box-flex:0;-ms-flex:0 0 33.3333333333%;flex:0 0 33.3333333333%;max-width:33.3333333333%}.col-lg-5{-webkit-box-flex:0;-ms-flex:0 0 41.6666666667%;flex:0 0 41.6666666667%;max-width:41.6666666667%}.col-lg-6{-webkit-box-flex:0;-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.col-lg-7{-webkit-box-flex:0;-ms-flex:0 0 58.3333333333%;flex:0 0 58.3333333333%;max-width:58.3333333333%}.col-lg-8{-webkit-box-flex:0;-ms-flex:0 0 66.6666666667%;flex:0 0 66.6666666667%;max-width:66.6666666667%}.col-lg-9{-webkit-box-flex:0;-ms-flex:0 0 75%;flex:0 0 75%;max-width:75%}.col-lg-10{-webkit-box-flex:0;-ms-flex:0 0 83.3333333333%;flex:0 0 83.3333333333%;max-width:83.3333333333%}.col-lg-11{-webkit-box-flex:0;-ms-flex:0 0 91.6666666667%;flex:0 0 91.6666666667%;max-width:91.6666666667%}.col-lg-12{-webkit-box-flex:0;-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}.order-lg-first{-webkit-box-ordinal-group:0;-ms-flex-order:-1;order:-1}.order-lg-last{-webkit-box-ordinal-group:14;-ms-flex-order:13;order:13}.order-lg-0{-webkit-box-ordinal-group:1;-ms-flex-order:0;order:0}.order-lg-1{-webkit-box-ordinal-group:2;-ms-flex-order:1;order:1}.order-lg-2{-webkit-box-ordinal-group:3;-ms-flex-order:2;order:2}.order-lg-3{-webkit-box-ordinal-group:4;-ms-flex-order:3;order:3}.order-lg-4{-webkit-box-ordinal-group:5;-ms-flex-order:4;order:4}.order-lg-5{-webkit-box-ordinal-group:6;-ms-flex-order:5;order:5}.order-lg-6{-webkit-box-ordinal-group:7;-ms-flex-order:6;order:6}.order-lg-7{-webkit-box-ordinal-group:8;-ms-flex-order:7;order:7}.order-lg-8{-webkit-box-ordinal-group:9;-ms-flex-order:8;order:8}.order-lg-9{-webkit-box-ordinal-group:10;-ms-flex-order:9;order:9}.order-lg-10{-webkit-box-ordinal-group:11;-ms-flex-order:10;order:10}.order-lg-11{-webkit-box-ordinal-group:12;-ms-flex-order:11;order:11}.order-lg-12{-webkit-box-ordinal-group:13;-ms-flex-order:12;order:12}.offset-lg-0{margin-left:0}.offset-lg-1{margin-left:8.3333333333%}.offset-lg-2{margin-left:16.6666666667%}.offset-lg-3{margin-left:25%}.offset-lg-4{margin-left:33.3333333333%}.offset-lg-5{margin-left:41.6666666667%}.offset-lg-6{margin-left:50%}.offset-lg-7{margin-left:58.3333333333%}.offset-lg-8{margin-left:66.6666666667%}.offset-lg-9{margin-left:75%}.offset-lg-10{margin-left:83.3333333333%}.offset-lg-11{margin-left:91.6666666667%}}@media (min-width: 1200px){.col-xl{-ms-flex-preferred-size:0;flex-basis:0;-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;max-width:100%}.row-cols-xl-1>*{-webkit-box-flex:0;-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}.row-cols-xl-2>*{-webkit-box-flex:0;-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.row-cols-xl-3>*{-webkit-box-flex:0;-ms-flex:0 0 33.3333333333%;flex:0 0 33.3333333333%;max-width:33.3333333333%}.row-cols-xl-4>*{-webkit-box-flex:0;-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.row-cols-xl-5>*{-webkit-box-flex:0;-ms-flex:0 0 20%;flex:0 0 20%;max-width:20%}.row-cols-xl-6>*{-webkit-box-flex:0;-ms-flex:0 0 16.6666666667%;flex:0 0 16.6666666667%;max-width:16.6666666667%}.col-xl-auto{-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;width:auto;max-width:100%}.col-xl-1{-webkit-box-flex:0;-ms-flex:0 0 8.3333333333%;flex:0 0 8.3333333333%;max-width:8.3333333333%}.col-xl-2{-webkit-box-flex:0;-ms-flex:0 0 16.6666666667%;flex:0 0 16.6666666667%;max-width:16.6666666667%}.col-xl-3{-webkit-box-flex:0;-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.col-xl-4{-webkit-box-flex:0;-ms-flex:0 0 33.3333333333%;flex:0 0 33.3333333333%;max-width:33.3333333333%}.col-xl-5{-webkit-box-flex:0;-ms-flex:0 0 41.6666666667%;flex:0 0 41.6666666667%;max-width:41.6666666667%}.col-xl-6{-webkit-box-flex:0;-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.col-xl-7{-webkit-box-flex:0;-ms-flex:0 0 58.3333333333%;flex:0 0 58.3333333333%;max-width:58.3333333333%}.col-xl-8{-webkit-box-flex:0;-ms-flex:0 0 66.6666666667%;flex:0 0 66.6666666667%;max-width:66.6666666667%}.col-xl-9{-webkit-box-flex:0;-ms-flex:0 0 75%;flex:0 0 75%;max-width:75%}.col-xl-10{-webkit-box-flex:0;-ms-flex:0 0 83.3333333333%;flex:0 0 83.3333333333%;max-width:83.3333333333%}.col-xl-11{-webkit-box-flex:0;-ms-flex:0 0 91.6666666667%;flex:0 0 91.6666666667%;max-width:91.6666666667%}.col-xl-12{-webkit-box-flex:0;-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}.order-xl-first{-webkit-box-ordinal-group:0;-ms-flex-order:-1;order:-1}.order-xl-last{-webkit-box-ordinal-group:14;-ms-flex-order:13;order:13}.order-xl-0{-webkit-box-ordinal-group:1;-ms-flex-order:0;order:0}\`;


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.transformDataUnit = void 0;
const transformDataUnit = async (data, config) => {
    const attrTransformations = {};
    for (let i = 0; i < config.unitOverlays.length; i++) {
        const o = config.unitOverlays[i];
        const entries = Object.entries(o.attr_units);
        for (let j = 0; j < entries.length; j++) {
            const [attrName, unit] = entries[j];
            const control = config.structure.controls.find(c => c.name == attrName);
            if (!data[control.mapping || attrName]) {
                continue;
            }
            const source = \`\${control.metric_system}:\${control.unit}\`;
            const target = \`\${o.metric_system}:\${unit}\`;
            attrTransformations[attrName] = { source, target };
        }
    }
    const requests = [];
    Object.values(attrTransformations).forEach((t) => {
        requests.push(fetch(\`\${
          config.ocaRepoHostUrl
        }/api/v0.1/transformations/units?source=\${t.source}&target=\${
  t.target
}\`));
    });
    const responses = await Promise.all((await Promise.all(requests)).map(r => r.json()));
    const transformationsList = responses.reduce((total, item) => Object.assign(total, item.result), {});
    Object.entries(attrTransformations).forEach(([attrName, t]) => {
        const control = config.structure.controls.find(c => c.name == attrName);
        const transformations = transformationsList[\`\${t.source}->\${
  t.target
}\`];
        transformations.forEach(transformation => {
            let dataValue = Number(data[control.mapping || attrName]);
            switch (transformation.op) {
                case '+':
                    dataValue += transformation.value;
                    break;
                case '-':
                    dataValue -= transformation.value;
                    break;
                case '*':
                    dataValue *= transformation.value;
                    break;
                case '/':
                    dataValue /= transformation.value;
                    break;
            }
            data[control.mapping || attrName] = String(dataValue);
        });
    });
    return data;
};
exports.transformDataUnit = transformDataUnit;


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateOCAForm = void 0;
const transformDataUnit_1 = __webpack_require__(3);
let document;
if (typeof window === 'undefined') {
    const { JSDOM } = __webpack_require__(5); // eslint-disable-line
    const dom = new JSDOM();
    document = dom.window.document;
}
else {
    document = window.document;
}
const generateOCAForm = async (structure, data, config) => {
    const unitMappingOverlays = config.additionalOverlays
        ? config.additionalOverlays.filter(o => o.type.includes(\`/unit/\`))
        : [];
    data = await (0, transformDataUnit_1.transformDataUnit)(data, {
        structure,
        unitOverlays: unitMappingOverlays,
        ocaRepoHostUrl: config.ocaRepoHostUrl
    });
    const layout = config.formLayout || structure.formLayout;
    const availableLanguages = Object.keys(structure.translations);
    let defaultLanguage = availableLanguages[0];
    if (config.defaultLanguage) {
        if (availableLanguages.includes(config.defaultLanguage)) {
            defaultLanguage = config.defaultLanguage;
        }
        else if (availableLanguages.find(lang => lang.startsWith(config.defaultLanguage))) {
            defaultLanguage = availableLanguages.find(lang => lang.startsWith(config.defaultLanguage));
        }
    }
    const form = document.createElement('div');
    if (layout.config && layout.config.css && layout.config.css.style) {
        const layoutStyle = document.createElement('style');
        layoutStyle.innerHTML = layout.config.css.style;
        form.appendChild(layoutStyle);
    }
    const elements = [];
    layout.elements.forEach(element => {
        let cardinality = 1;
        if (element.type === 'attribute') {
            const attr = structure.controls.find(el => el.name == element.name);
            if (attr.cardinality) {
                cardinality = Number(attr.cardinality);
            }
        }
        for (let i = 0; i < cardinality; i++) {
            elements.push(element);
        }
    });
    (await Promise.all(elements.map(async (element) => {
        let elementEl = document.createElement('div');
        switch (element.type) {
            case 'meta':
                element.parts.forEach(part => {
                    let partEl;
                    switch (part.name) {
                        case 'name':
                            partEl = document.createElement('div');
                            partEl.innerHTML = '<slot name="meta-name"></slot>';
                            break;
                        case 'description':
                            partEl = document.createElement('div');
                            partEl.innerHTML = '<slot name="meta-description"></slot>';
                            break;
                        case 'language': {
                            partEl = document.createElement('select');
                            partEl.id = 'languageSelect';
                            availableLanguages.forEach(lang => {
                                const option = document.createElement('option');
                                option.setAttribute('value', lang);
                                option.innerText = lang;
                                if (lang === defaultLanguage) {
                                    option.setAttribute('selected', '');
                                }
                                partEl.appendChild(option);
                            });
                            break;
                        }
                    }
                    if (part.config && part.config.css) {
                        if (part.config.css.style) {
                            partEl.style.cssText = part.config.css.style;
                        }
                        if (part.config.css.classes) {
                            partEl.classList.add(...part.config.css.classes);
                        }
                    }
                    elementEl.appendChild(partEl);
                });
                break;
            case 'category': {
                const cat = structure.sections.find(el => el.id == element.id);
                elementEl = generateCategory(cat);
                elementEl.classList.add('_category');
                break;
            }
            case 'attribute': {
                const attr = structure.controls.find(el => el.name == element.name);
                elementEl.classList.add('_control');
                (await Promise.all(element.parts.map(async (part) => {
                    let partEl;
                    switch (part.name) {
                        case 'label':
                            partEl = document.createElement('label');
                            partEl.classList.add('_label');
                            partEl.setAttribute('for', attr.name);
                            partEl.innerHTML = \`<slot name="control" part="label" attr-name="\${
                              attr.name
                            }"></slot>\`;
                            break;
                        case 'input':
                            if (attr.type === 'Select' ||
                                attr.type === 'SelectMultiple') {
                                partEl = await generateControlInput(attr, data[attr.mapping || attr.name], {
                                    showFlagged: config.showFlagged,
                                    defaultLanguage: config.defaultLanguage,
                                    ocaRepoHostUrl: config.ocaRepoHostUrl
                                });
                            }
                            else {
                                let dataValue = data[attr.mapping || attr.name];
                                if (Array.isArray(dataValue)) {
                                    dataValue = data[attr.mapping || attr.name].shift();
                                }
                                partEl = document.createElement('div');
                                partEl.style.cssText +=
                                    'display: flex; align-items: center;';
                                const controlInputConfig = {
                                    showFlagged: config.showFlagged,
                                    defaultLanguage: config.defaultLanguage,
                                    ocaRepoHostUrl: config.ocaRepoHostUrl
                                };
                                if (part.layout) {
                                    controlInputConfig['formLayout'] =
                                        structure.formLayout.reference_layouts[part.layout];
                                }
                                const inputEl = await generateControlInput(attr, dataValue, controlInputConfig);
                                partEl.appendChild(inputEl);
                                if (attr.isFlagged) {
                                    inputEl.style.cssText += 'display: inline-block;';
                                    const showFlaggedEl = document.createElement('input');
                                    showFlaggedEl.type = 'checkbox';
                                    if (config.showFlagged) {
                                        showFlaggedEl.setAttribute('checked', '');
                                    }
                                    showFlaggedEl.style.cssText +=
                                        'display: inline-block;';
                                    showFlaggedEl.classList.add('flagged-toggle');
                                    partEl.appendChild(showFlaggedEl);
                                }
                            }
                            break;
                        case 'information':
                            partEl = document.createElement('div');
                            partEl.classList.add('_information');
                            partEl.innerHTML = \`<slot name="control" part="information" attr-name="\${
                              attr.name
                            }"></slot>\`;
                            break;
                    }
                    if (part.config && part.config.css) {
                        if (part.config.css.style) {
                            partEl.style.cssText = part.config.css.style;
                        }
                        if (part.config.css.classes) {
                            partEl.classList.add(...part.config.css.classes);
                        }
                    }
                    return partEl;
                }))).forEach(partEl => elementEl.appendChild(partEl));
                break;
            }
        }
        if (element.config && element.config.css) {
            if (element.config.css.style) {
                elementEl.style.cssText = element.config.css.style;
            }
            if (element.config.css.classes) {
                elementEl.classList.add(...element.config.css.classes);
            }
        }
        return elementEl;
    }))).forEach(elementEl => form.appendChild(elementEl));
    if (config.onSubmitHandler) {
        const submit = document.createElement('input');
        submit.id = 'submit';
        submit.type = 'submit';
        form.appendChild(submit);
    }
    class OCAForm extends HTMLElement {
        constructor() {
            super();
            this.structure = null;
            this.hiddenControls = new Set();
            const shadow = this.attachShadow({ mode: 'open' });
            const template = document.createElement('template');
            template.innerHTML = \`<form>\${form.outerHTML}</form>\`;
            const templateContent = template.content;
            shadow.appendChild(templateContent.cloneNode(true));
            const languageSelect = shadow.querySelector('#languageSelect');
            if (languageSelect) {
                languageSelect.onchange = () => this.setAttribute('language', languageSelect.value);
            }
            shadow.querySelectorAll('.flagged-toggle').forEach(el => {
                const toggle = (el) => {
                    const inputEl = el.parentElement.querySelector('._input');
                    const control = structure.controls.find(c => c.name === inputEl.name);
                    inputEl.type =
                        inputEl.type === 'password'
                            ? control.type === 'Binary'
                                ? 'file'
                                : control.type
                            : 'password';
                };
                if (!config.showFlagged) {
                    toggle(el);
                }
                /* eslint-disable */
                // @ts-ignore
                el.onchange = e => {
                    toggle(e.target);
                };
                /* eslint-enable */
            });
            this.form = shadow.querySelector('form');
            this.form.oninput = e => {
                /* eslint-disable */
                // @ts-ignore
                if (e.target.classList.contains('_input')) {
                    // @ts-ignore
                    this.controlInputChanged(e.target.getAttribute('name'));
                }
                /* eslint-enable */
            };
            this.form.onsubmit = () => {
                if (config.onSubmitHandler && this.validateForm()) {
                    const capturedData = this.captureFormData();
                    this.hiddenControls.forEach(controlName => delete capturedData[controlName]);
                    config.onSubmitHandler(capturedData);
                }
                return false;
            };
        }
        static get observedAttributes() {
            return ['language', 'structure'];
        }
        validateForm(form = this.form) {
            const formsValidation = Array.from(form.querySelectorAll('._reference')).map(refEl => {
                var _a;
                const refForm = (_a = refEl === null || refEl === void 0 ? void 0 : refEl.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('form');
                if (refForm) {
                    return refForm.reportValidity();
                }
            });
            return [form.reportValidity(), ...formsValidation].every(v => v);
        }
        controlInputChanged(controlName) {
            const capturedData = this.captureFormData();
            this.structure.controls.forEach(c => {
                var _a;
                if ((_a = c.dependencies) === null || _a === void 0 ? void 0 : _a.includes(controlName)) {
                    this.evaluateControlCondition(c, capturedData);
                }
            });
        }
        evaluateControlCondition(control, capturedData = {}) {
            const varPlaceholders = control.condition.match(/\\d+/g) || [];
            const placeholersValue = {};
            varPlaceholders.forEach(placeholder => {
                const index = parseInt(placeholder.match(/\\d+/)[0]);
                const dependencyName = control.dependencies[index];
                placeholersValue[placeholder] = capturedData[dependencyName];
            });
            let condition = control.condition
                .split('‘')
                .join("'")
                .split('’')
                .join("'");
            Object.entries(placeholersValue).forEach(([placeholder, value]) => {
                condition = condition.split(placeholder).join(\`'\${value}'\`);
            });
            let controlDiv;
            while (!controlDiv) {
                let node = this.form.querySelector(\`#\${control.name}\`);
                while (!node.classList.contains('_control')) {
                    node = node.parentElement;
                }
                controlDiv = node;
            }
            if (evaluateCondition(condition)) {
                this.hiddenControls.delete(control.name);
                controlDiv.style.display = null;
                if (control.reference) {
                    const refEl = this.form.querySelector(\`._reference#\${
                      control.name
                    }\`).shadowRoot;
                    control.reference.controls.forEach(nestedControl => {
                        if (nestedControl.conformance === 'M') {
                            refEl
                                .querySelector(\`#\${nestedControl.name}\`)
                                .setAttribute('required', '');
                        }
                    });
                }
                Array.from(controlDiv.getElementsByClassName('_input')).forEach(el => {
                    if (control.conformance === 'M') {
                        el.setAttribute('required', '');
                    }
                });
            }
            else {
                this.hiddenControls.add(control.name);
                if (control.reference) {
                    const refEl = this.form.querySelector(\`._reference#\${
                      control.name
                    }\`).shadowRoot;
                    control.reference.controls.forEach(nestedControl => {
                        refEl
                            .querySelector(\`#\${nestedControl.name}\`)
                            .removeAttribute('required');
                    });
                }
                controlDiv.style.display = 'none';
                Array.from(controlDiv.getElementsByClassName('_input')).forEach(el => {
                    el.removeAttribute('required');
                });
            }
        }
        captureFormData(form = this.form, structure = this.structure) {
            const capturedData = {};
            const formData = new FormData(form);
            structure.controls.forEach(c => {
                var _a, _b;
                switch (c.type) {
                    case 'SelectMultiple': {
                        capturedData[c.name] = formData.getAll(c.name);
                        break;
                    }
                    case 'Reference': {
                        if (c.cardinality) {
                            const refOCAForms = form.querySelectorAll(\`#\${
                              c.name
                            }\\\\[\\\\]\`);
                            capturedData[c.name] = [];
                            refOCAForms.forEach(refOCAForm => {
                                var _a;
                                const refForm = (_a = refOCAForm === null || refOCAForm === void 0 ? void 0 : refOCAForm.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('form');
                                if (refForm) {
                                    ;
                                    capturedData[c.name].push(this.captureFormData(refForm, c.reference));
                                }
                            });
                        }
                        else {
                            const refForm = (_b = (_a = form
                                .querySelector(\`#\${
                                  c.name
                                }\`)) === null || _a === void 0 ? void 0 : _a.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector('form');
                            if (refForm) {
                                capturedData[c.name] = this.captureFormData(refForm, c.reference);
                            }
                        }
                        break;
                    }
                    case 'Binary': {
                        const file = formData.get(c.name);
                        if (file.size > 0) {
                            const reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = () => {
                                capturedData[c.name] = reader.result;
                            };
                        }
                        break;
                    }
                    default:
                        if (c.cardinality) {
                            capturedData[c.name] = (formData.getAll(c.name + '[]') ||
                                []);
                        }
                        else {
                            capturedData[c.name] = (formData.get(c.name) || '');
                        }
                        break;
                }
                capturedData[c.name] = capturedData[c.name] || '';
            });
            return capturedData;
        }
        connectedCallback() {
            const capturedData = this.captureFormData();
            this.structure.controls.forEach(c => {
                if (c.condition) {
                    this.evaluateControlCondition(c, capturedData);
                }
            });
        }
        attributeChangedCallback(name, _oldValue, newValue) {
            if (name === 'language' && this.structure) {
                this.updateLang();
            }
            if (name === 'structure' && newValue) {
                this.structure = JSON.parse(newValue);
            }
        }
        updateLang() {
            const shadow = this.shadowRoot;
            const s = this.structure;
            const l = this.getAttribute('language');
            const fd = new FormData(shadow.querySelector('form'));
            shadow.querySelectorAll('slot').forEach(slot => {
                switch (slot.name) {
                    case 'meta-name': {
                        slot.textContent = s.translations[l].name;
                        break;
                    }
                    case 'meta-description': {
                        slot.textContent = s.translations[l].description;
                        break;
                    }
                    case 'category': {
                        const catId = slot.getAttribute('id');
                        const section = s.sections.find(cat => cat.id === catId);
                        slot.textContent = section.translations[l].label;
                        break;
                    }
                    case 'control': {
                        const attrName = slot.getAttribute('attr-name');
                        const control = s.controls.find(c => c.name === attrName);
                        switch (slot.getAttribute('part')) {
                            case 'label': {
                                slot.textContent = control.translations[l].label;
                                if (control.conformance === 'M') {
                                    slot.textContent += '*';
                                }
                                break;
                            }
                            case 'information': {
                                slot.textContent = control.translations[l].information;
                                break;
                            }
                        }
                        break;
                    }
                    case 'entry': {
                        const attrName = slot.getAttribute('attr-name');
                        const control = s.controls.find(c => c.name === attrName);
                        const entryCodesMapping = {};
                        if (control.entryCodesMapping) {
                            control.entryCodesMapping.forEach(mapping => {
                                const splitted = mapping.split(':');
                                entryCodesMapping[splitted[1]] = splitted[0];
                            });
                        }
                        const select = document.createElement('select');
                        select.setAttribute('name', control.name);
                        let currentValues = ((fd.has(attrName)
                            ? fd.getAll(attrName)
                            : data[control.mapping || attrName]) || []);
                        let currentValue = ((fd.has(attrName)
                            ? fd.get(attrName)
                            : data[control.mapping || attrName]) || '');
                        if (Array.isArray(currentValues)) {
                            currentValues = currentValues.map(v => entryCodesMapping[v] || v);
                        }
                        currentValue = entryCodesMapping[currentValue] || currentValue;
                        if (control.type === 'SelectMultiple') {
                            select.setAttribute('multiple', '');
                        }
                        if (control.conformance === 'M') {
                            select.setAttribute('required', '');
                        }
                        control.entryCodes.forEach(code => {
                            const opt = new Option(control.translations[l].entries[code], code);
                            if (control.type == 'SelectMultiple' &&
                                currentValues.includes(code)) {
                                opt.setAttribute('selected', '');
                            }
                            else if (control.type == 'Select' && currentValue === code) {
                                opt.setAttribute('selected', '');
                            }
                            select.options.add(opt);
                        });
                        if (currentValues.length === 0 && currentValue === '') {
                            select.value = null;
                        }
                        select.classList.add('_input');
                        if (control.isFlagged) {
                            select.classList.add('flagged');
                        }
                        slot.innerHTML = '';
                        slot.appendChild(select);
                        break;
                    }
                }
            });
        }
    }
    const randomNr = Math.random().toString(16).substring(2);
    customElements.define(\`oca-form-\${randomNr}\`, OCAForm);
    const ocaForm = document.createElement(\`oca-form-\${randomNr}\`);
    ocaForm.setAttribute('structure', \`{
    "translations": \${JSON.stringify(structure.translations)},
    "controls": \${JSON.stringify(structure.controls)},
    "sections": \${JSON.stringify(structure.sections)}
  }\`);
    ocaForm.setAttribute('language', defaultLanguage);
    return ocaForm;
};
exports.generateOCAForm = generateOCAForm;
const generateCategory = (section) => {
    const category = document.createElement('div');
    category.id = section.id;
    let level = (section.id.match(/-/g) || []).length;
    level = level > 6 ? 6 : level;
    const header = document.createElement(\`h\${level}\`);
    header.innerHTML = \`<slot name="category" id="\${category.id}"></slot>\`;
    category.appendChild(header);
    return category;
};
const generateControlInput = async (control, defaultInput, config) => {
    let input = document.createElement('input');
    switch (control.type) {
        case 'Text':
            input.classList.add('_input');
            input.setAttribute('type', 'text');
            break;
        case 'Numeric':
            input.classList.add('_input');
            input.setAttribute('type', 'number');
            break;
        case 'Checkbox':
            input.classList.add('_input');
            input.setAttribute('type', 'checkbox');
            break;
        case 'Date':
            input.classList.add('_input');
            input.setAttribute('type', 'date');
            input.setAttribute('placeholder', control.format);
            break;
        case 'Select':
        case 'SelectMultiple':
            input = document.createElement('div');
            input.innerHTML = \`<slot name="entry" attr-name="\${
              control.name
            }"></slot>\`;
            break;
        case 'Binary':
            input.classList.add('_input');
            input.setAttribute('type', 'file');
            if (control.format) {
                input.setAttribute('accept', control.format);
            }
            break;
        case 'Reference':
            input = await (0, exports.generateOCAForm)(control.reference, defaultInput || {}, config);
            input.classList.add('_reference');
            break;
    }
    if (defaultInput) {
        input.setAttribute('value', defaultInput);
    }
    if (control.conformance === 'M') {
        input.setAttribute('required', '');
    }
    if (control.cardinality) {
        input.id = control.name + '[]';
        input.setAttribute('name', control.name + '[]');
    }
    else {
        input.id = control.name;
        input.setAttribute('name', control.name);
    }
    if (control.isFlagged) {
        input.classList.add('flagged');
    }
    return input;
};
const evaluateCondition = (condition) => {
    return Function('"use strict";return (' + condition + ')')();
};


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("jsdom");

/***/ })
/******/ ]);
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ // Check if module is in cache
/******/ var cachedModule = __webpack_module_cache__[moduleId];
/******/ if (cachedModule !== undefined) {
/******/ return cachedModule.exports;
/******/ }
/******/ // Create a new module (and put it into the cache)
/******/ var module = __webpack_module_cache__[moduleId] = {
/******/ // no module.id needed
/******/ // no module.loaded needed
/******/ exports: {}
/******/ };
/******/
/******/ // Execute the module function
/******/ __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/
/******/ // Return the exports of the module
/******/ return module.exports;
/******/ }
/******/
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.renderOCACredential = exports.renderOCAForm = void 0;
const generateOCACredential_1 = __webpack_require__(1);
const generateOCAForm_1 = __webpack_require__(4);
const renderOCAForm = async (structure, data = {}, config = {}) => {
    return (await (0, generateOCAForm_1.generateOCAForm)(structure, data, config)).outerHTML;
};
exports.renderOCAForm = renderOCAForm;
const renderOCACredential = async (structure, data = {}, config = {}) => {
    const layout = structure.credentialLayout;
    const height = [
        { layout: structure.credentialLayout, cardinality: 1 },
        ...structure.controls
            .filter(c => c.type === 'Reference')
            .map(c => ({
            layout: layout.reference_layouts[c.reference.captureBaseSAI],
            cardinality: Number(c.cardinality) || 1
        }))
    ]
        .map(({ layout, cardinality }) => {
        return {
            height: parseInt(layout.config.css.height, 10),
            pageNumber: layout.pages.length,
            cardinality
        };
    })
        .reduce((result, item) => result + (item.height / item.pageNumber) * item.cardinality, 0);
    return {
        node: (await (0, generateOCACredential_1.generateOCACredential)(structure, data, config)).outerHTML,
        config: {
            width: layout.config.css.width,
            height: height + 'px'
        },
        pageNumber: layout.pages.length
    };
};
exports.renderOCACredential = renderOCACredential;

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
`;
