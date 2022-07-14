import type { Structure } from '../oca.js-form-core/entities/Structure'
import type { UnitOverlay } from 'oca.js'
import type { Data } from './types'

export const transformDataUnit = async (
  data: Data,
  config: {
    structure: Structure
    ocaRepoHostUrl: string
    unitOverlays: UnitOverlay[]
  }
): Promise<Data> => {
  const attrTransformations: {
    [attrName: string]: { source: string; target: string }
  } = {}
  for (let i = 0; i < config.unitOverlays.length; i++) {
    const o = config.unitOverlays[i]
    const entries = Object.entries(o.attr_units)
    for (let j = 0; j < entries.length; j++) {
      const [attrName, unit] = entries[j]
      const control = config.structure.controls.find(c => c!.name == attrName)
      if (!data[control!.mapping || attrName]) {
        continue
      }

      const source = `${control!.metric_system}:${control!.unit}`
      const target = `${o.metric_system}:${unit}`
      attrTransformations[attrName] = { source, target }
    }
  }

  const requests: Promise<Response>[] = []
  Object.values(attrTransformations).forEach(
    (t: { source: string; target: string }) => {
      requests.push(
        fetch(
          `${config.ocaRepoHostUrl}/api/v0.1/transformations/units?source=${t.source}&target=${t.target}`
        )
      )
    }
  )
  const responses = await Promise.all(
    (await Promise.all(requests)).map(r => r.json())
  )
  const transformationsList: {
    [units: string]: {
      op: string
      value: number
    }[]
  } = responses.reduce((total, item) => Object.assign(total, item.result), {})

  Object.entries(attrTransformations).forEach(
    ([attrName, t]: [string, { source: string; target: string }]) => {
      const control = config.structure.controls.find(c => c!.name == attrName)
      const transformations = transformationsList[`${t.source}->${t.target}`]
      transformations.forEach(transformation => {
        let dataValue = Number(data[control!.mapping || attrName])
        switch (transformation.op) {
          case '+':
            dataValue += transformation.value
            break
          case '-':
            dataValue -= transformation.value
            break
          case '*':
            dataValue *= transformation.value
            break
          case '/':
            dataValue /= transformation.value
            break
        }
        data[control!.mapping || attrName] = String(dataValue)
      })
    }
  )

  return data
}