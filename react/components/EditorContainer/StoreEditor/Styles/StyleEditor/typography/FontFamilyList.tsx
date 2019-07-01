import React from 'react'
import { FormattedMessage } from 'react-intl'
import { RouteComponentProps, withRouter } from 'react-router'

import { Button, Spinner } from 'vtex.styleguide'
import { ListFontsQueryResult } from '../queries/ListFontsQuery'
import ListFontsQuery from '../queries/ListFontsQuery'
import StyleEditorHeader from '../StyleEditorHeader'
import { EditorPath, IdParam } from '../StyleEditorRouter'
import FontFamilyEntry from './FontFamilyEntry'

interface Props extends RouteComponentProps, ListFontsQueryResult {}

const FontFamilyList: React.FunctionComponent<Props> = ({
  data,
  error,
  history,
  loading,
}) => {
  const title = (
    <FormattedMessage
      id="admin/pages.editor.styles.edit.font-family.title"
      defaultMessage="Font Family"
    />
  )

  if (loading) {
    return (
      <>
        <StyleEditorHeader title={title} />
        <div className="pv8 flex justify-center">
          <Spinner />
        </div>
      </>
    )
  }

  if (error != null || data == null) {
    // TODO: add error state
    return <div />
  }

  const addFontLabel = (
    <FormattedMessage
      id="admin/pages.editor.styles.edit.font-family.add-font"
      defaultMessage="Add Custom Font"
    />
  )

  const addFontOnClick = () =>
    history.push(EditorPath.customFontFile.replace(IdParam, ''))

  const addFontButton = (
    <Button collapseLeft variation="tertiary" onClick={addFontOnClick}>
      {addFontLabel}
    </Button>
  )

  const { listFonts } = data

  if (listFonts.length === 0) {
    return (
      <>
        <StyleEditorHeader title={title} />
        <div className="ph6 lh-copy">
          <p>
            <FormattedMessage
              id="admin/pages.editor.styles.edit.font-family.add-font-description"
              defaultMessage="You can add custom font families to your store, let’s add some?"
            />
          </p>
          {addFontButton}
        </div>
      </>
    )
  }

  return (
    <>
      <StyleEditorHeader
        title={title}
        buttonLabel={addFontLabel}
        onButtonClick={addFontOnClick}
      />
      <div className="ph6">
        {listFonts.map(fontFamily => (
          <FontFamilyEntry font={fontFamily} key={fontFamily.id} />
        ))}
      </div>
    </>
  )
}

const FontFamilyListWithRouter = withRouter(FontFamilyList)

const FontFamilyListWrapper: React.FunctionComponent = () => {
  return (
    <ListFontsQuery>
      {queryResult => <FontFamilyListWithRouter {...queryResult} />}
    </ListFontsQuery>
  )
}

export default FontFamilyListWrapper
