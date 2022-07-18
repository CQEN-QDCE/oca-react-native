export type CredentialLayout = {
    version: string
    config: {
      css?: {
        width?: string
        height?: string
        style?: string
      }
    }
    pages: {
      config?: {
        css?: {
          background_image?: string
          style?: string
          classes?: string[]
        }
        name?: string
      }
      elements: ElementLayout[]
    }[]
    labels?: {
      [name: string]: {
        [language: string]: string
      }
    }
  }
  
  type ElementLayout = BaseElementLayout &
    (
      | RowLayout
      | ColLayout
      | MetaLayout
      | TextLayout
      | LayoutLabelLayout
      | AttributeLayout
    )
  
  type BaseElementLayout = {
    config?: {
      css?: {
        style?: string
        classes?: string
      }
    }
  }
  
  type RowLayout = {
    type: 'row'
    elements?: ElementLayout[]
  }
  
  type ColLayout = {
    type: 'col'
    size?: number
    elements?: ElementLayout[]
  }
  
  type MetaLayout = {
    type: 'meta'
    part: 'name' | 'description'
  }
  
  type TextLayout = {
    type: 'text'
    content: string
  }
  type LayoutLabelLayout = {
    type: 'layout-label'
    name: string
  }
  
  type AttributeLayout = {
    type: 'attribute' | 'code' | 'label' | 'information'
    name: string
  }