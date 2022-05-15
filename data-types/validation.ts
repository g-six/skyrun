export type GenericObject = { [key: string]: any }
export type FieldsObject = { [key: string]: string[] }

export interface ValidationOptionType {
  base_key: string
  fields_validations?: FieldsObject
  limiter?: GenericObject
}
