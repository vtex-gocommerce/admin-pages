import React, { Component } from 'react'
import { Query, QueryResult } from 'react-apollo'
import { injectIntl } from 'react-intl'
import { Helmet } from 'vtex.render-runtime'
import { Box, Pagination, ToastConsumer } from 'vtex.styleguide'

import {
  PAGINATION_START,
  PAGINATION_STEP,
  WRAPPER_PATH,
} from './components/admin/redirects/consts'
import List from './components/admin/redirects/List'
import UploadModal from './components/admin/redirects/UploadModal'
import {
  TargetPathContextProps,
  withTargetPath,
} from './components/admin/TargetPathContext'
import Loader from './components/Loader'
import Redirects from './queries/Redirects.graphql'

type Props = ReactIntl.InjectedIntlProps & TargetPathContextProps

interface State {
  paginationFrom: number
  paginationTo: number
  isModalOpen: boolean
}

interface RedirectListQueryResult {
  redirects: {
    redirects: Redirect[]
    total: number
  }
}

interface RedirectListVariables {
  from: number
  to: number
  fetchMoreResult?: RedirectListQueryResult
}

class RedirectList extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      isModalOpen: false,
      paginationFrom: PAGINATION_START,
      paginationTo: PAGINATION_START + PAGINATION_STEP,
    }
  }

  public componentDidMount() {
    const { setTargetPath } = this.props
    setTargetPath(WRAPPER_PATH)
  }

  public render() {
    const { intl } = this.props
    const { isModalOpen, paginationFrom, paginationTo } = this.state

    return (
      <>
        <Helmet>
          <title>
            {intl.formatMessage({ id: 'admin/pages.admin.redirects.title' })}
          </title>
        </Helmet>
        <Query<RedirectListQueryResult, RedirectListVariables>
          notifyOnNetworkStatusChange
          query={Redirects}
          variables={{
            from: PAGINATION_START,
            to: PAGINATION_STEP,
          }}
        >
          {({ data, fetchMore, loading, refetch, error }) => {
            const redirects =
              (data && data.redirects && data.redirects.redirects) || []
            const total = (data && data.redirects && data.redirects.total) || 0
            const hasRedirects = redirects.length > 0

            return (
              <>
                {loading ? (
                  <Loader />
                ) : !error ? (
                  <ToastConsumer>
                    {({ showToast }) => (
                      <Box>
                        <List
                          from={paginationFrom}
                          items={redirects.slice(paginationFrom, paginationTo)}
                          refetch={() => {
                            refetch({
                              from: PAGINATION_START,
                              to: PAGINATION_STEP,
                            })
                          }}
                          to={paginationTo}
                          showToast={showToast}
                          openModal={this.openModal}
                        />
                        {total > 0 && (
                          <Pagination
                            currentItemFrom={paginationFrom + 1}
                            currentItemTo={paginationTo}
                            onNextClick={this.getGoToNextPage(
                              redirects.length,
                              total,
                              fetchMore
                            )}
                            onPrevClick={this.goToPrevPage}
                            textOf={intl.formatMessage({
                              id: 'admin/pages.admin.redirects.pagination.of',
                            })}
                            textShowRows={intl.formatMessage({
                              id: 'admin/pages.admin.redirects.pagination.showRows',
                            })}
                            totalItems={total}
                          />
                        )}
                        <UploadModal
                          isOpen={isModalOpen}
                          hasRedirects={hasRedirects}
                          onClose={this.closeModal}
                          refetchRedirects={refetch}
                        />
                      </Box>
                    )}
                  </ToastConsumer>
                ) : (
                  <div> Something went wrong. </div>
                )}
              </>
            )
          }}
        </Query>
      </>
    )
  }

  private getGoToNextPage = (
    dataLength: number,
    total: number,
    fetchMore: QueryResult<
      RedirectListQueryResult,
      RedirectListVariables
    >['fetchMore']
  ) => async () => {
    const nextPaginationTo = this.getNextPaginationTo(
      this.state.paginationFrom + PAGINATION_STEP,
      total
    )

    if (nextPaginationTo > dataLength) {
      await fetchMore({
        updateQuery: (prevData, { fetchMoreResult }) =>
          fetchMoreResult
            ? {
                ...prevData,
                redirects: {
                  ...prevData.redirects,
                  redirects: [
                    ...prevData.redirects.redirects,
                    ...fetchMoreResult.redirects.redirects,
                  ],
                },
              }
            : prevData,
        variables: {
          from: this.state.paginationTo,
          to: nextPaginationTo,
        },
      })
    }

    this.setState(prevState => ({
      ...prevState,
      paginationFrom: prevState.paginationTo,
      paginationTo: nextPaginationTo,
    }))
  }

  private getNextPaginationTo = (paginationFrom: number, total: number) =>
    total > paginationFrom + PAGINATION_STEP
      ? paginationFrom + PAGINATION_STEP
      : total

  private goToPrevPage = () => {
    this.setState(prevState => ({
      ...prevState,
      paginationFrom: prevState.paginationFrom - PAGINATION_STEP,
      paginationTo: prevState.paginationFrom,
    }))
  }

  private openModal = () => this.setState({ isModalOpen: true })
  private closeModal = () => this.setState({ isModalOpen: false })
}

export default injectIntl(withTargetPath(RedirectList))
