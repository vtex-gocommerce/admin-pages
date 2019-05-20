import { JSONSchema6 } from 'json-schema'
import React from 'react'
import { FormProps } from 'react-jsonschema-form'

import ComponentEditor from '../ComponentEditor'

interface Props {
  componentTitle?: ComponentSchema['title']
  condition: ExtensionConfiguration['condition']
  configuration?: ExtensionConfiguration
  contentSchema?: JSONSchema6
  data?: object
  iframeRuntime: RenderContext
  isDefault: boolean
  isSitewide: boolean
  label?: string
  onClose: () => void
  onConditionChange: (
    changes: Partial<ExtensionConfiguration['condition']>
  ) => void
  onFormChange: FormProps<{ formData: object }>['onChange']
  onLabelChange: (e: Event) => void
  onSave: () => void
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const ContentEditor: React.FunctionComponent<Props> = ({
  componentTitle,
  condition,
  contentSchema,
  data = {},
  iframeRuntime,
  isDefault,
  isSitewide,
  label,
  onClose,
  onConditionChange,
  onFormChange,
  onLabelChange,
  onSave,
  onTitleChange,
}) => (
  <ComponentEditor
    condition={condition}
    contentSchema={contentSchema}
    data={data}
    iframeRuntime={iframeRuntime}
    isSitewide={isSitewide}
    isDefault={isDefault}
    label={label}
    onConditionChange={onConditionChange}
    onChange={onFormChange}
    onClose={onClose}
    onLabelChange={onLabelChange}
    onSave={onSave}
    onTitleChange={onTitleChange}
    title={componentTitle}
  />
)

export default ContentEditor
