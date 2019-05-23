import React from 'react'
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'

import ActionMenu from '../../../ComponentList/SortableList/SortableListItem/ActionMenu'
import Tag from './Tag'
import { getTextFromContext } from './utils'

interface Props {
  configuration: ExtensionConfiguration
  isDisabled?: boolean
  isSitewide: boolean
  isDefaultContent?: boolean
  onClick: (configuration: ExtensionConfiguration) => void
  onDelete: () => void
  path: string
}

function stopPropagation(e: React.MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
}

const messages = defineMessages({
  // Some of these messages are used in getTextFromContext
  brand: {
    defaultMessage: 'Brand: {id}',
    id: 'admin/pages.editor.configuration.tag.brand',
  },
  category: {
    defaultMessage: 'Category: {id}',
    id: 'admin/pages.editor.configuration.tag.category',
  },
  delete: {
    defaultMessage: 'Delete',
    id: 'admin/pages.editor.component-list.action-menu.delete',
  },
  department: {
    defaultMessage: 'Department: {id}',
    id: 'admin/pages.editor.configuration.tag.department',
  },
  product: {
    defaultMessage: 'Product: {id}',
    id: 'admin/pages.editor.configuration.tag.product',
  },
  reset: {
    defaultMessage: 'Reset',
    id: 'admin/pages.editor.component-list.action-menu.reset',
  },
  route: {
    defaultMessage: 'URL: {id}',
    id: 'admin/pages.editor.configuration.tag.route',
  },
  search: {
    defaultMessage: 'Search: {id}',
    id: 'admin/pages.editor.configuration.tag.search',
  },
  sitewide: {
    defaultMessage: 'Entire site',
    id: 'admin/pages.editor.configuration.tag.sitewide',
  },
  subcategory: {
    defaultMessage: 'Subcategory: {id}',
    id: 'admin/pages.editor.configuration.tag.subcategory',
  },
  template: {
    defaultMessage: 'This template',
    id: 'admin/pages.editor.configuration.tag.template',
  },
})

const Card = ({
  configuration,
  isDefaultContent = false,
  isDisabled = false,
  intl,
  isSitewide,
  onClick,
  onDelete,
  path,
}: Props & ReactIntl.InjectedIntlProps) => {
  const actionMenuOptions = [
    {
      label: intl.formatMessage(
        isDefaultContent ? messages.reset : messages.delete
      ),
      onClick: () => onDelete(),
    },
  ]

  return (
    <div
      className={`relative mh5 mt5 pa5 ba br3 b--light-gray hover-bg-light-silver ${
        !isDisabled ? 'pointer' : ''
      }`}
      onClick={() => {
        if (!isDisabled) {
          onClick(configuration)
        }
      }}
    >
      {configuration.label ? (
        <div>{configuration.label}</div>
      ) : (
        <FormattedMessage
          id="admin/pages.editor.components.configurations.defaultTitle"
          defaultMessage="Untitled"
        >
          {text => <div className="i gray">{text}</div>}
        </FormattedMessage>
      )}
      <div className="mt5">
        <Tag
          bgColor={isDisabled ? 'transparent' : 'light-gray'}
          borderColor="mid-gray"
          hasBorder={isDisabled}
          text={getTextFromContext({
            context: configuration.condition.pageContext,
            intl,
            isSitewide,
            path,
          })}
          textColor="mid-gray"
        />
      </div>
      <div className="absolute top-0 right-0 mt1" onClick={stopPropagation}>
        <ActionMenu options={actionMenuOptions} />
      </div>
    </div>
  )
}

export default injectIntl(Card)
