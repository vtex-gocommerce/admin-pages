import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import Draggable from 'react-draggable'
import { FormattedMessage } from 'react-intl'
import { Spinner } from 'vtex.styleguide'

import ComponentEditor from './ComponentEditor'

import ComponentsList from './ComponentsList'
import DeviceSwitcher from './DeviceSwitcher'
import PageInfo from './PageInfo'

import '../editbar.global.css'

export const APP_CONTENT_ELEMENT_ID = 'app-content-editor'

const getContainerProps = (layout: Viewport) => {
  switch (layout) {
    case 'mobile':
      return {
        className: 'mobile-preview center',
        style: {
          animationDuration: '0.2s',
          transition: `width 660ms`,
        },
      }
    case 'tablet':
      return {
        className: 'tablet-preview center',
        style: {
          animationDuration: '0.2s',
          transition: `width 660ms`,
        },
      }
    default:
      return {
        className: 'w-100 calc--height center',
        style: {
          animationDuration: '0.2s',
          transition: `width 660ms`,
        },
      }
  }
}

interface Props {
  runtime: RenderContext | null
  toggleShowAdminControls: () => void
  viewports: Viewport[]
  visible: boolean
}

interface State {
  highlightTreePath: string | null
}

export default class EditorContainer extends Component<
  Props & EditorContextProps,
  State
> {
  public static propTypes = {
    children: PropTypes.node,
    editor: PropTypes.object,
    runtime: PropTypes.object,
    visible: PropTypes.bool,
  }

  constructor(props: Props & EditorContextProps) {
    super(props)

    this.state = {
      highlightTreePath: null,
    }
  }

  public componentDidMount() {
    window.postMessage({ action: { type: 'STOP_LOADING' } }, '*')
  }

  public getSnapshotBeforeUpdate(prevProps: Props & RenderContextProps & EditorContextProps) {
    const { runtime, editor: { editMode, editExtensionPoint } } = this.props
    if (!prevProps.runtime && runtime) {
      runtime.updateExtension('store/__overlay', {
        component: 'vtex.admin-pages@2.0.0/HighlightOverlay',
        props: {
          editExtensionPoint,
          editMode,
          highlightExtensionPoint: this.highlightExtensionPoint
        }
      })
    }
  }

  public highlightExtensionPoint = (highlightTreePath: string | null) => {
    const { runtime, editor: { editMode, editExtensionPoint } } = this.props
    console.log(runtime.components)
    this.setState({ highlightTreePath }, () => {
      if (runtime) {
        runtime.updateExtension('store/__overlay', {
          component: 'vtex.admin-pages@2.0.0/HighlightOverlay',
          props: {
            editExtensionPoint,
            editMode,
            highlightExtensionPoint: this.highlightExtensionPoint,
            highlightTreePath
          }
        })
      }

      console.log(runtime.components)
    })
  }

  public renderSideBarContent() {
    const {
      editor: { editTreePath },
      editor,
      runtime,
    } = this.props

    return (
      runtime
      ? editTreePath === null ? (
          <Fragment>
            <PageInfo editor={editor} runtime={runtime} />
            <h3 className="near-black mv0 bt bw1 b--light-silver pa5">
              <FormattedMessage id="pages.editor.components.title" />
            </h3>
            <ComponentsList
              editor={editor}
              runtime={runtime}
              highlightExtensionPoint={this.highlightExtensionPoint}
            />
          </Fragment>
        ) : (
          <ComponentEditor editor={editor} runtime={runtime} />
        )
      : <div className="mt5 flex justify-center">
          <Spinner />
        </div>
    )
  }

  public renderSideBar() {
    const { visible } = this.props

    return (
      <div
        id="sidebar-vtex-editor"
        className="right-0-ns z-1 h-100 top-3em-ns calc--height-ns w-18em-ns fixed w-100 w-auto-ns"
        style={{
          animationDuration: '0.333s',
          transform: `translate(${visible ? '0%' : '+100%'}, 0)`,
          transition: `transform 300ms ease-in-out ${visible ? '300ms' : ''}`,
        }}
      >
        <nav
          id="admin-sidebar"
          className="transition animated fadeIn b--light-silver bw1 z-2 h-100 pt8 pt0-ns calc--height-ns overflow-x-hidden fixed absolute-m w-100 font-display bg-white shadow-solid-x w-18em-ns admin-sidebar"
        >
          <div className="h-100 overflow-y-scroll">
            {this.renderSideBarContent()}
          </div>
        </nav>
      </div>
    )
  }

  public render() {
    const {
      editor,
      editor: { viewport },
      toggleShowAdminControls,
      viewports,
      visible,
    } = this.props
    return (
      <div className="w-100 flex flex-column flex-row-l flex-wrap-l bg-white bb bw1 b--light-silver">
        {this.renderSideBar()}
        <div
          id={APP_CONTENT_ELEMENT_ID}
          className={`top-0 bg-light-silver z-0 center-m left-0-m absolute-m overflow-x-auto-m ${
            visible
              ? 'calc--height calc--height-ns calc--width-ns calc--width-m calc--width-l'
              : 'w-100'
          }`}
          style={{
            transition: `width 300ms ease-in-out ${
              visible ? '300ms' : ''
            }, top 300ms ease-in-out ${!visible ? '300ms' : ''}`,
          }}
        >
          <Draggable
            bounds="parent"
            onStart={() => {
              const iframe = document.getElementById('store-iframe')
              if (iframe !== null) {
                iframe.classList.add('iframe-pointer-none')
              }
            }}
            onStop={() => {
              const iframe = document.getElementById('store-iframe')
              if (iframe !== null) {
                iframe.classList.remove('iframe-pointer-none')
              }
            }}
          >
            <div className="animated br2 bg-white bn shadow-1 flex items-center justify-center z-max absolute bottom-1 bottom-2-ns left-1 left-2-ns">
              <DeviceSwitcher toggleEditMode={toggleShowAdminControls} editor={editor} viewports={viewports} inPreview={!visible}/>
            </div>
          </Draggable>
          <main {...getContainerProps(viewport)} role="main">
            {this.props.children}
          </main>
        </div>
      </div>
    )
  }
}
