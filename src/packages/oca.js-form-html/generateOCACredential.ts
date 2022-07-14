// @ts-nocheck
import type { Structure } from '../oca.js-form-core/entities/Structure'
import type { Overlay, UnitOverlay } from 'oca.js'
import { gridCss } from './grid'
import { transformDataUnit } from './transformDataUnit'
import type { Data } from './types'

export async function generateOCACredential (
  structure: Structure,
  data: Data,
  config: {
    defaultLanguage?: string
    dataVaultUrl?: string
    ocaRepoHostUrl?: string
    additionalOverlays?: Overlay[]
    credentialLayout?: Structure['credentialLayout']
  }
): Promise<HTMLElement> {
  const unitMappingOverlays = config.additionalOverlays
    ? (config.additionalOverlays.filter(o =>
        o.type.includes(`/unit/`)
      ) as UnitOverlay[])
    : []
  data = await transformDataUnit(data, {
    structure,
    unitOverlays: unitMappingOverlays,
    ocaRepoHostUrl: config.ocaRepoHostUrl
  })

  const layout = config.credentialLayout || structure.credentialLayout
  const iframe = document.createElement('iframe')
  iframe.id = 'credential'
  iframe.style.cssText = 'width: 100%; height: 100%; border: none;'
  return iframe
  
  // iframe.scrolling =
  //   !layout.config?.css?.height || !layout.config?.css?.width ? 'yes' : 'no'
  const iframeHead = document.createElement('head')
  if (layout!.config && layout.config.css && layout.config.css.style) {
    const iframeStyle = document.createElement('style')
    iframeStyle.innerHTML = layout.config.css.style
    iframeHead.appendChild(iframeStyle)
  }
  const iframeGridStyle = document.createElement('style')
  iframeGridStyle.innerHTML = gridCss
  iframeHead.appendChild(iframeGridStyle)
  const iframeBody = document.createElement('body')

  const availableLanguages = Object.keys(structure.translations)
  let defaultLanguage = availableLanguages[0]
  if (config.defaultLanguage) {
    if (availableLanguages.includes(config.defaultLanguage)) {
      defaultLanguage = config.defaultLanguage
    } else if (
      availableLanguages.find(lang => lang.startsWith(config.defaultLanguage))
    ) {
      defaultLanguage = availableLanguages.find(lang =>
        lang.startsWith(config.defaultLanguage)
      )
    }
  }

  const languageSelect = document.createElement('select')
  languageSelect.id = 'language-select'
  languageSelect.className = 'language-select'
  availableLanguages.forEach(lang => {
    const option = document.createElement('option')
    option.setAttribute('value', lang)
    option.innerText = lang
    if (lang === defaultLanguage) {
      option.setAttribute('selected', '')
    }
    languageSelect.appendChild(option)
  })
  iframeBody.appendChild(languageSelect)

  const credentials: HTMLElement[] = []
  ;(
    await Promise.all(
      availableLanguages.map(async language => {
        const credential = document.createElement('div')
        credential.className = 'credential'
        credential.id = language
        if (language == defaultLanguage) {
          credential.style.display = 'block'
        } else {
          credential.style.display = 'none'
        }

        if (layout.pages.length > 1) {
          const pageSelect = document.createElement('select')
          pageSelect.className = 'page-select'
          layout.pages.forEach((page, i) => {
            const option = document.createElement('option')
            option.setAttribute('value', 'page-' + i)
            option.innerText = page.config.name
            pageSelect.appendChild(option)
          })
          credential.appendChild(pageSelect)
        }

        ;(
          await Promise.all(
            layout.pages.map(async (page, i) => {
              const pageDiv = document.createElement('div')
              pageDiv.className = 'page'
              pageDiv.classList.add('page-' + i)
              if (page.config && page.config.css) {
                if (page.config.css.style) {
                  pageDiv.style.cssText = page.config.css.style
                }

                if (page.config.css.background_image) {
                  const imageSAI = page.config.css.background_image.replace(
                    'SAI:',
                    ''
                  )
                  pageDiv.style.cssText += `background-image: url("${config.dataVaultUrl}/api/v1/files/${imageSAI}");`
                }
              }
              if (i != 0) {
                pageDiv.style.display = 'none'
              } else {
                pageDiv.style.display = 'block'
              }

              const renderElement = async (
                element: Structure['credentialLayout']['pages'][0]['elements'][0]
              ) => {
                const fragment = document.createDocumentFragment()
                let el: HTMLElement
                switch (element.type) {
                  case 'row':
                    el = document.createElement('div')
                    el.className = 'row'
                    if (element.elements) {
                      ;(
                        await Promise.all(
                          element.elements.map(
                            async e => await renderElement(e)
                          )
                        )
                      ).forEach(e => el.appendChild(e))
                    }
                    break
                  case 'col':
                    el = document.createElement('div')
                    el.className = element.size ? `col-${element.size}` : 'col'
                    if (element.elements && element.elements.length > 0) {
                      ;(
                        await Promise.all(
                          element.elements.map(
                            async e => await renderElement(e)
                          )
                        )
                      ).forEach(e => el.appendChild(e))
                    }
                    break
                  case 'layout-label':
                    el = document.createElement('div')
                    el.innerText = layout.labels[element.name][language]
                    break
                  case 'text':
                    el = document.createElement('div')
                    el.innerText = element.content
                    break
                  case 'oca-name':
                    el = document.createElement('div')
                    el.innerText = structure.translations[language].name
                    break
                  case 'oca-description':
                    el = document.createElement('div')
                    el.innerText = structure.translations[language].description
                    break
                  case 'category': {
                    const section = structure.sections.find(
                      el => el.id == element.name
                    )
                    el = document.createElement('div')
                    let level = (section.id.match(/-/g) || []).length
                    level = level > 6 ? 6 : level
                    const header = document.createElement(`h${level}`)
                    header.innerText = section.translations[language].label
                    el.appendChild(header)
                    break
                  }
                  case 'attribute': {
                    const attr = structure.controls.find(
                      el => el.name == element.name
                    )
                    const entryCodesMapping: { [_: string]: string } = {}
                    if (attr.entryCodesMapping) {
                      attr.entryCodesMapping.forEach(mapping => {
                        const splitted = mapping.split(':')
                        entryCodesMapping[splitted[1]] = splitted[0]
                      })
                    }

                    const attributeDatum = data[attr.mapping || attr.name]
                    if (attr.type == 'Binary') {
                      el = document.createElement('img')
                      if (attributeDatum) {
                        const imageEl = el as HTMLImageElement
                        imageEl.src = attributeDatum as string
                      }
                    } else if (attr.type == 'Select') {
                      el = document.createElement('div')
                      if (
                        attr.translations[language].entries &&
                        attributeDatum
                      ) {
                        el.innerText =
                          attr.translations[language].entries[
                            entryCodesMapping[attributeDatum as string] ||
                              (attributeDatum as string)
                          ]
                      }
                    } else {
                      el = document.createElement('div')
                      const attributeDatum = data[attr.mapping || attr.name]
                      if (attributeDatum) {
                        if (
                          Array.isArray(attributeDatum) &&
                          attributeDatum.length > 0
                        ) {
                          const s = document.createElement('select')
                          s.style.cssText =
                            'border: 0; background-color: rgba(0,0,0,0); margin: inherit; width: 100%;'
                          ;(attributeDatum as string[]).forEach(
                            (dataValue: string) => {
                              const op = document.createElement('option')
                              op.value =
                                entryCodesMapping[dataValue] || dataValue
                              op.text =
                                entryCodesMapping[dataValue] || dataValue
                              s.appendChild(op)
                            }
                          )
                          el.appendChild(s)
                        } else {
                          el.innerText = attributeDatum as string
                        }
                      }
                    }
                    break
                  }
                  case 'reference': {
                    const attr = structure.controls.find(
                      el => el.name == element.name
                    )
                    const referenceLayout =
                      structure.credentialLayout.reference_layouts[
                        element.layout
                      ]
                    const referenceData = data[attr.mapping || attr.name]
                    if (attr.type == 'Reference') {
                      ;(
                        await Promise.all(
                          [...Array(Number(attr.cardinality) || 1)].map(
                            async (_, i) => {
                              const referenceDatum = attr.multiple
                                ? (referenceData as Data[])[i]
                                : referenceData
                              const frame = await generateOCACredential(
                                attr.reference,
                                (referenceDatum || {}) as Data,
                                {
                                  credentialLayout: referenceLayout
                                }
                              )
                              frame.style.height =
                                referenceLayout.config.css.height
                              return frame
                            }
                          )
                        )
                      ).forEach(f => {
                        el = document.createElement('div')
                        el.style.height = referenceLayout.config.css.height
                        el.appendChild(f)
                        fragment.appendChild(el)
                      })
                    }
                    break
                  }
                  case 'code': {
                    const attr = structure.controls.find(
                      el => el.name == element.name
                    )
                    const attributeDatum = data[attr.mapping || attr.name]
                    el = document.createElement('div')
                    if (attributeDatum) {
                      el.innerText = attributeDatum as string
                    }
                    break
                  }
                  case 'label': {
                    const attr = structure.controls.find(
                      el => el.name == element.name
                    )
                    el = document.createElement('div')
                    el.innerText = attr.translations[language].label
                    break
                  }
                  case 'information': {
                    const attr = structure.controls.find(
                      el => el.name == element.name
                    )
                    el = document.createElement('div')
                    el.innerText = attr.translations[language].information || ''
                    break
                  }
                }

                if (el) {
                  if (element.config && element.config.css) {
                    if (element.config.css.style) {
                      el.style.cssText = element.config.css.style
                    }
                    if (element.config.css.classes) {
                      el.classList.add(...element.config.css.classes)
                    }
                  }
                  fragment.appendChild(el)
                }

                return fragment
              }

              ;(
                await Promise.all(
                  page.elements.map(
                    async element => await renderElement(element)
                  )
                )
              ).forEach(el => {
                if (pageDiv && el) {
                  pageDiv.appendChild(el)
                }
              })

              return pageDiv
            })
          )
        ).forEach(pageDiv => credential.appendChild(pageDiv))

        return credential
      })
    )
  ).forEach(credential => credentials.push(credential))

  credentials.forEach(credential => iframeBody.appendChild(credential))

  const languageScript = document.createElement('script')
  languageScript.innerText = `let currentPage = 'page-0'; document.getElementById('language-select').addEventListener('change', e => { [...document.getElementsByClassName('credential')].forEach(el => el.style.display = 'none'); document.getElementById(e.target.value).style.display = 'block'; [...document.getElementsByClassName('page-select')].forEach(s => s.value = currentPage )})`
  iframeBody.appendChild(languageScript)

  if (layout.pages.length > 1) {
    const pageScript = document.createElement('script')
    pageScript.innerText = `[...document.getElementsByClassName('page-select')].forEach(s => s.addEventListener('change', e => { currentPage = e.target.value; [...document.getElementsByClassName('page')].forEach(el => el.style.display = 'none'); [...document.getElementsByClassName(e.target.value)].forEach(el => el.style.display = 'block') } ))`
    iframeBody.appendChild(pageScript)
  }

  iframe.src =
    'data:text/html;charset=utf-8,' +
    encodeURI(iframeHead.outerHTML) +
    encodeURI(iframeBody.outerHTML)
  return iframe

}