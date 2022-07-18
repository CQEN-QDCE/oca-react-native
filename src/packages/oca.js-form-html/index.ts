// @ts-nocheck
import type { Structure } from '../oca.js-form-core/entities/Structure'
import type { Overlay } from 'oca.js'
import { generateOCACredential } from './generateOCACredential'

export const renderOCACredential = async (
  structure: Structure,
  data = {},
  config: {
    defaultLanguage?: string
    dataVaultUrl?: string
    ocaRepoHostUrl?: string
    additionalOverlays?: Overlay[]
  } = {}
): Promise<{
  node: string
  config: { width: string; height: string }
  pageNumber: number
}> => {
  const layout = structure.credentialLayout
  const height = [
    { layout: structure.credentialLayout, cardinality: 1 },
    ...structure.controls
      .filter(c => c!.type === 'Reference')
      .map(c => ({
        layout: layout!.reference_layouts![c!.reference!.captureBaseSAI],
        cardinality: Number(c!.cardinality) || 1
      }))
  ]
    .map(({ layout, cardinality }) => {
      return {
        height: parseInt(layout!.config!.css!.height as string, 10),
        pageNumber: layout!.pages.length,
        cardinality
      }
    })
    .reduce(
      (result, item) =>
        result + (item.height / item.pageNumber) * item.cardinality,
      0
    )

  return {
    node: (await generateOCACredential(structure, data, config)).outerHTML,
    config: {
      width: layout.config.css.width,
      height: height + 'px'
    },
    pageNumber: layout.pages.length
  }
}