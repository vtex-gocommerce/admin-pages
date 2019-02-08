import { equals } from 'ramda'
import React from 'react'
import JsonSchemaForm, { FormProps, Widget } from 'react-jsonschema-form'

import ArrayFieldTemplate from '../../../form/ArrayFieldTemplate'
import BaseInput from '../../../form/BaseInput'
import BrandSelector from '../../../form/BrandSelector/index'
import CategorySelector from '../../../form/CategorySelector/index'
import CollectionSelector from '../../../form/CollectionSelector/index'
import DepartmentSelector from '../../../form/DepartmentSelector/index'
import Dropdown from '../../../form/Dropdown'
import ErrorListTemplate from '../../../form/ErrorListTemplate'
import FieldTemplate from '../../../form/FieldTemplate'
import ImageUploader from '../../../form/ImageUploader'
import ObjectFieldTemplate from '../../../form/ObjectFieldTemplate'
import Radio from '../../../form/Radio'
import TextArea from '../../../form/TextArea'
import Toggle from '../../../form/Toggle'

export const widgets = {
  BaseInput: BaseInput as Widget,
  CheckboxWidget: Toggle as Widget,
  RadioWidget: Radio as Widget,
  SelectWidget: Dropdown as Widget,
  TextareaWidget: TextArea as Widget,
  'brand-selector': BrandSelector as Widget,
  'category-selector': CategorySelector as Widget,
  'collection-selector': CollectionSelector as Widget,
  'department-selector': DepartmentSelector as Widget,
  'image-uploader': ImageUploader as Widget,
}

export default class Form extends React.Component<FormProps<any>> {
  public shouldComponentUpdate(nextProps: FormProps<any>) {
    return (
      !equals(this.props.formContext, nextProps.formContext) ||
      !equals(this.props.formData, nextProps.formData)
    )
  }

  public render() {
    return (
      <JsonSchemaForm
        schema={this.props.schema}
        formData={this.props.formData}
        onChange={this.props.onChange}
        onSubmit={this.props.onSubmit}
        FieldTemplate={FieldTemplate}
        ArrayFieldTemplate={ArrayFieldTemplate}
        ObjectFieldTemplate={ObjectFieldTemplate}
        uiSchema={this.props.uiSchema}
        widgets={widgets}
        showErrorList
        ErrorList={ErrorListTemplate}
        formContext={this.props.formContext}
      >
        <button className="dn" type="submit" />
      </JsonSchemaForm>
    )
  }
}
