import React, { Fragment, PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import SelectionIcon from '../../../images/SelectionIcon'

import ComponentList from './ComponentList'
import { SidebarComponent } from './typings'

interface Props {
  components: SidebarComponent[]
  editor: EditorContext
  highlightHandler: (treePath: string | null) => void
}

class ComponentSelector extends PureComponent<Props> {
  public render() {
    const { components, editor, highlightHandler } = this.props

    return (
      <Fragment>
        <div className="flex justify-between items-center">
          <h3 className="near-black f5 mv0 pa5">
            <FormattedMessage id="pages.editor.components.title" />
          </h3>
          <div
            onClick={editor.toggleEditMode}
            className="bg-white bn link pl3 pv3 dn flex-ns items-center justify-center self-right z-max pointer animated fadeIn"
          >
            <span className="pr5 b--light-gray flex items-center">
              <SelectionIcon stroke={editor.editMode ? '#368df7' : '#979899'} />
            </span>
          </div>
        </div>
        <ComponentList
          components={components}
          editor={editor}
          highlightExtensionPoint={highlightHandler}
          onMouseEnterComponent={this.handleMouseEnter}
          onMouseLeaveComponent={this.handleMouseLeave}
        />
      </Fragment>
    )
  }

  private handleMouseEnter = (event: any) => {
    const treePath = event.currentTarget.getAttribute('data-tree-path')

    this.props.highlightHandler(treePath as string)
  }

  private handleMouseLeave = () => {
    this.props.highlightHandler(null)
  }
}

export default ComponentSelector