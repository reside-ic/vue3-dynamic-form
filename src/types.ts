export type Dict<V> = { [k: string]: V }

export type DynamicControlSection = {
    label: string
    description?: string
    documentation?: string
    collapsible?: boolean
    collapsed?: boolean
    controlGroups: DynamicControlGroup[]
}

export type DynamicControlGroup = {
    label?: string
    controls: Control[]
}

export type Option = {
    id: string,
    label: string,
    children?: Option[]
}

export type DynamicControlType = "select" | "number"
export type Control = SelectControl | NumberControl

export type DynamicControl = {
    name: string,
    label?: string,
    type: DynamicControlType
    required: boolean
    helpText?: string
    value?: string | number | null
}

export type SelectControl = DynamicControl & {
    options: Option[]
    value?: string | null
    excludeNullOption?: boolean
}

export type NumberControl = DynamicControl & {
    min?: number
    max?: number
    value?: number | null
}

export type DynamicFormMeta = {
    controlSections: DynamicControlSection[]
}

export type DynamicFormData = Dict<string | number | null>
