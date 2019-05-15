import { JSONSchema6 } from 'json-schema'
import React, { Fragment } from 'react'
import { injectIntl } from 'react-intl'
import { IChangeEvent } from 'react-jsonschema-form'

import {
  getComponentSchema,
  getExtension,
  getIframeImplementation,
} from '../../../../utils/components'
import { useEditorContext } from '../../../EditorContext'
import EditorHeader from '../EditorHeader'

import Form from './Form'
import { getUiSchema } from './utils'

interface CustomProps {
  after?: JSX.Element
  contentSchema?: JSONSchema6
  data: object
  iframeRuntime: RenderContext
  isContent?: boolean
  isLoading: boolean
  onChange: (event: IChangeEvent) => void
  onClose: () => void
  onSave: () => void
  shouldDisableSaveButton: boolean
  title?: ComponentSchema['title']
}

type Props = CustomProps & ReactIntl.InjectedIntlProps

const ComponentEditor: React.FunctionComponent<Props> = ({
  after,
  contentSchema,
  data,
  iframeRuntime,
  isContent,
  isLoading,
  onChange,
  onClose,
  onSave,
  shouldDisableSaveButton,
  title,
}) => {
  const { editTreePath, mode } = useEditorContext()

  const extension = getExtension(editTreePath, iframeRuntime.extensions)

  const componentImplementation = getIframeImplementation(extension.component)

  const componentUiSchema =
    componentImplementation && componentImplementation.uiSchema
      ? componentImplementation.uiSchema
      : null

  const componentSchema = getComponentSchema({
    component: componentImplementation,
    contentSchema,
    propsOrContent: extension[isContent ? 'content' : 'props'],
    runtime: iframeRuntime,
  })

  const schema = {
    ...componentSchema,
    properties: {
      ...componentSchema.properties,
    },
    title: undefined,
  }

  return (
    <Fragment>
      <EditorHeader
        isLoading={isLoading}
        onClose={onClose}
        onSave={onSave}
        shouldDisableSaveButton={shouldDisableSaveButton}
        title={title || componentSchema.title}
      />
      <div className="h-100 overflow-y-auto overflow-x-hidden">
        <div className="relative bg-white flex flex-column justify-between size-editor w-100 pb3 ph5">
          <Form
            formContext={{
              isLayoutMode: mode === 'layout',
            }}
            formData={data}
            onChange={onChange}
            onSubmit={onSave}
            schema={schema as JSONSchema6}
            uiSchema={getUiSchema(componentUiSchema, componentSchema)}
          />
          <div id="form__error-list-template___alert" />
        </div>
        {after}
      </div>
    </Fragment>
  )
}

export default injectIntl(ComponentEditor)
