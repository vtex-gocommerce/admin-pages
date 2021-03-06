import React, { Component } from 'react'
import { withRuntimeContext } from 'vtex.render-runtime'

class Settings extends Component<RenderContextProps> {
  public componentDidMount() {
    const {
      runtime: { navigate },
    } = this.props

    navigate({ to: '/admin/apps/vtex.store/setup' })
  }

  public render() {
    return null
  }
}

export default withRuntimeContext(Settings)
