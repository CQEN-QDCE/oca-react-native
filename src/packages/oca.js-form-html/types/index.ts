export { CredentialLayout } from './credentialLayout'
export { FormLayout } from './formLayout'

export type Data = {
  [key: string]: DataValue
}

export type DataValue = string | string[] | Data | Data[]