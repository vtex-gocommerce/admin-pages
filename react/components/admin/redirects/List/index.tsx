import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { compose, graphql, MutationFn } from 'react-apollo'
import { FormattedMessage, injectIntl } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'
import {
  ButtonWithIcon,
  EmptyState,
  IconUpload,
  Table,
  Tag,
  ToastConsumerFunctions,
} from 'vtex.styleguide'

import { getFormattedLocalizedDate } from '../../../../utils/date'
import { BASE_URL, NEW_REDIRECT_ID } from '../consts'

import CreateButton from './CreateButton'

interface CustomProps {
  from: number
  items: Redirect[]
  to: number
  saveRedirectFromFile: MutationFn<{ file: any }>
  refetch: () => void
  showToast: ToastConsumerFunctions['showToast']
  loading: boolean
  openModal: () => void
}

export type Props = CustomProps &
  ReactIntl.InjectedIntlProps &
  RenderContextProps

interface State {
  schema: {
    items: Redirect[]
    properties: object
  }
  isSendingFile: boolean
}

class List extends Component<Props, State> {
  public static contextTypes = {
    culture: PropTypes.shape({ locale: PropTypes.string.isRequired })
      .isRequired,
    stopLoading: PropTypes.func.isRequired,
  }

  constructor(props: Props, context: RenderContext) {
    super(props)

    this.state = {
      isSendingFile: false,
      schema: this.getSchema(props.items, context.culture.locale),
    }
  }

  public componentDidMount() {
    this.context.stopLoading()
  }

  public componentDidUpdate(prevProps: Props) {
    const { locale } = this.context.culture
    const { from: currentFrom, items } = this.props

    if (prevProps.from !== currentFrom) {
      this.setState({ schema: this.getSchema(items, locale) })
    }
  }

  public render() {
    const { intl, loading, openModal } = this.props
    const { isSendingFile, schema } = this.state

    const items = schema.items

    return items.length === 0 ? (
      <EmptyState
        title={intl.formatMessage({
          id: 'admin/pages.admin.redirects.emptyState',
        })}
      >
        <div className="pt5 flex flex-column tc">
          <div>
            <CreateButton onClick={this.openNewItem} />
          </div>
          <p className="mv2">
            {intl.formatMessage({ id: 'admin/pages.admin.redirects.or.text' })}
          </p>
          <div>
            <ButtonWithIcon
              icon={<IconUpload />}
              variation="secondary"
              onClick={this.props.openModal}
              size="small"
            >
              {intl.formatMessage({
                id: 'admin/pages.admin.redirects.emptyState.upload',
              })}
            </ButtonWithIcon>
          </div>
        </div>
      </EmptyState>
    ) : (
      <>
        <Table
          fullWidth
          items={items}
          loading={isSendingFile || loading}
          onRowClick={this.viewItem}
          schema={schema}
          toolbar={{
            density: {
              buttonLabel: intl.formatMessage({
                id: 'admin/pages.admin.redirects.table.toolbar.line-density.label',
              }),
              highOptionLabel: intl.formatMessage({
                id: 'admin/pages.admin.redirects.table.toolbar.line-density.high',
              }),
              lowOptionLabel: intl.formatMessage({
                id: 'admin/pages.admin.redirects.table.toolbar.line-density.low',
              }),
              mediumOptionLabel: intl.formatMessage({
                id: 'admin/pages.admin.redirects.table.toolbar.line-density.medium',
              }),
            },
            download: {
              handleCallback: this.handleDownload,
              label: intl.formatMessage({
                id: 'admin/pages.admin.redirects.table.toolbar.export',
              }),
            },
            fields: {
              hideAllLabel: intl.formatMessage({
                id: 'admin/pages.admin.redirects.table.toolbar.fields.hide-all',
              }),
              label: intl.formatMessage({
                id: 'admin/pages.admin.redirects.table.toolbar.fields.label',
              }),
              showAllLabel: intl.formatMessage({
                id: 'admin/pages.admin.redirects.table.toolbar.fields.show-all',
              }),
            },
            newLine: {
              handleCallback: this.openNewItem,
              label: intl.formatMessage({
                id: 'admin/pages.admin.redirects.button.create',
              }),
            },
            upload: {
              handleCallback: this.handleUpload,
              label: intl.formatMessage({
                id: 'admin/pages.admin.redirects.table.toolbar.import',
              }),
            },
          }}
        />
      </>
    )
  }

  private getSchema = (items: Redirect[], locale: string) => {
    const { intl } = this.props

    return {
      items,
      properties: {
        // tslint:disable:object-literal-sort-keys
        from: {
          title: intl.formatMessage({
            id: 'admin/pages.admin.redirects.table.from',
          }),
          type: 'string',
        },
        to: {
          title: intl.formatMessage({
            id: 'admin/pages.admin.redirects.table.to',
          }),
          type: 'string',
        },
        type: {
          title: intl.formatMessage({
            id: 'admin/pages.admin.redirects.table.type',
          }),
          type: 'string',
          cellRenderer: (cell: { cellData: string }) =>
            cell.cellData ? (
              <FormattedMessage
                id={
                  cell.cellData === 'temporary'
                    ? 'admin/pages.admin.redirects.table.type.temporary'
                    : 'admin/pages.admin.redirects.table.type.permanent'
                }
              >
                {text => <span className="ph4">{text}</span>}
              </FormattedMessage>
            ) : (
              <FormattedMessage id="admin/pages.admin.redirects.table.type.permanent">
                {text => <span className="ph4 silver">{text}</span>}
              </FormattedMessage>
            ),
        },
        endDate: {
          cellRenderer: (cell: { cellData: string }) =>
            cell.cellData ? (
              <span className="ph4">
                {getFormattedLocalizedDate(cell.cellData, locale)}
              </span>
            ) : (
              <FormattedMessage id="admin/pages.admin.redirects.table.endDate.default">
                {text => <span className="ph4 silver">{text}</span>}
              </FormattedMessage>
            ),
          title: intl.formatMessage({
            id: 'admin/pages.admin.redirects.table.endDate.title',
          }),
          type: 'string',
        },
        // tslint:enable:object-literal-sort-keys
      },
    }
  }

  private openNewItem = () => {
    const { navigate } = this.props.runtime

    navigate({ to: `${BASE_URL}/${NEW_REDIRECT_ID}` })
  }

  private viewItem = (event: { rowData: Redirect }) => {
    const { navigate } = this.props.runtime

    const selectedItem = event.rowData

    navigate({ to: `${BASE_URL}/${selectedItem.id}` })
  }

  private handleUpload = () => this.props.openModal()

  private handleDownload() {
    window.open('/_v/private/pages/redirects.csv')
  }
}

export default compose(
  injectIntl,
  withRuntimeContext
)(List)
