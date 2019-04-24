import React, { Component } from 'react'
import { Query, QueryResult } from 'react-apollo'
import { injectIntl } from 'react-intl'
import { Helmet } from 'vtex.render-runtime'
import { Box, Pagination } from 'vtex.styleguide'

import {
  PAGINATION_START,
  PAGINATION_STEP,
  WRAPPER_PATH,
} from './components/admin/redirects/consts'
import List from './components/admin/redirects/List'
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
    const { paginationFrom, paginationTo } = this.state

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
          {({ data, fetchMore, loading }) => (
            <>
              {loading ? (
                <Loader />
              ) : (
                <Box>
                  <List
                    from={paginationFrom}
                    items={
                      data
                        ? data.redirects.redirects.slice(
                            paginationFrom,
                            paginationTo
                          )
                        : []
                    }
                    to={paginationTo}
                  />
                  {data && data.redirects.total > 0 && (
                    <Pagination
                      currentItemFrom={paginationFrom + 1}
                      currentItemTo={paginationTo}
                      onNextClick={this.getGoToNextPage(
                        data.redirects.redirects.length,
                        data.redirects.total,
                        fetchMore
                      )}
                      onPrevClick={this.goToPrevPage}
                      textOf={intl.formatMessage({
                        id: 'admin/pages.admin.redirects.pagination.of',
                      })}
                      textShowRows={intl.formatMessage({
                        id: 'admin/pages.admin.redirects.pagination.showRows',
                      })}
                      totalItems={data.redirects.total}
                    />
                  )}
                </Box>
              )}
            </>
          )}
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
}

export default injectIntl(withTargetPath(RedirectList))
