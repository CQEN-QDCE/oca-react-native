export type FormLayout = {
    config?: {
      css?: {
        style?: string
      }
    }
    elements: ElementLayout[]
  }
  
  type ElementLayout = BaseElementLayout &
    (MetaLayout | ContentLayout | CategoryLayout | AttributeLayout)
  
  type BaseElementLayout = {
    config?: Config
  }
  
  type Config = {
    css?: {
      style?: string
      classes?: string[]
    }
  }
  
  type MetaLayout = {
    type: 'meta'
    parts: {
      name: 'name' | 'description' | 'language'
      config?: Config
    }[]
  }
  
  type ContentLayout = {
    type: 'content'
    text: string
    image?: string
  }
  
  type CategoryLayout = {
    type: 'category'
    id: string
  }
  
  type AttributeLayout = {
    type: 'attribute'
    name: string
    parts: {
      name: 'input' | 'label' | 'information'
      config?: Config
    }[]
  }