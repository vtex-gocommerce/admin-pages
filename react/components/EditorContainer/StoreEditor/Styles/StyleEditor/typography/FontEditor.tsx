import React, { useContext, useReducer, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { matchPath, RouteComponentProps } from 'react-router'
import { Button, Spinner, Tab, Tabs, ToastContext } from 'vtex.styleguide'

import { ApolloError } from 'apollo-client'
import DeleteFontFamily, {
  DeleteFontFamilyFn,
} from '../mutations/DeleteFontFamily'
import SaveFontFamily, {
  FontFileInput,
  SaveFontFamilyFn,
} from '../mutations/SaveFontFamily'
import ListFontsQuery, { ListFontsQueryResult } from '../queries/ListFontsQuery'
import StyleEditorHeader from '../StyleEditorHeader'
import { EditorPath, IdParam } from '../StyleEditorRouter'
import { FontFlavour } from '../utils/typography'
import FileFontEditor from './FileFontEditor'

interface FontFileAppend {
  type: 'append'
  files: FontFileInput[]
}

interface FontFileRemove {
  type: 'remove'
  index: number
}

interface FontFileUpdate {
  type: 'update'
  style: FontFlavour
  index: number
}

export type FontFileAction = FontFileAppend | FontFileRemove | FontFileUpdate

function reducer(
  prevState: FontFileInput[],
  action: FontFileAction
): FontFileInput[] {
  switch (action.type) {
    case 'append':
      return [...prevState, ...action.files]
    case 'remove':
      prevState.splice(action.index, 1)
      return [...prevState]
    case 'update':
      const {
        style: [fontStyle, fontWeight],
        index,
      } = action
      prevState[index] = { ...prevState[index], fontWeight, fontStyle }
      return [...prevState]
  }
}

function canSave(family: string, files: FontFileInput[]) {
  return (
    family &&
    files.length > 0 &&
    files.every(
      ({ fontStyle, fontWeight }) => fontStyle != null && fontWeight != null
    )
  )
}

const FontEditorWrapper: React.FunctionComponent<
  RouteComponentProps<CustomFontParams>
> = props => {
  return (
    <ListFontsQuery>
      {queryResult => (
        <DeleteFontFamily>
          {(deleteFont, { loading: deleteLoading, error: deleteError }) => (
            <SaveFontFamily>
              {(saveFont, { loading: saveLoading, error: saveError }) => (
                <CustomFont
                  {...props}
                  {...queryResult}
                  saveFont={saveFont}
                  deleteFont={deleteFont}
                  loadingSave={saveLoading}
                  loadingDelete={deleteLoading}
                  mutationError={deleteError || saveError}
                />
              )}
            </SaveFontFamily>
          )}
        </DeleteFontFamily>
      )}
    </ListFontsQuery>
  )
}

interface Props
  extends RouteComponentProps<CustomFontParams>,
    ListFontsQueryResult {
  deleteFont: DeleteFontFamilyFn
  saveFont: SaveFontFamilyFn
  mutationError: ApolloError | undefined
  loadingSave: boolean
  loadingDelete: boolean
}

const CustomFont: React.FunctionComponent<Props> = ({
  data,
  deleteFont,
  error,
  loading,
  loadingDelete,
  loadingSave,
  history,
  saveFont,
}) => {
  const { customFontFile, customFontLink } = EditorPath
  const { pathname } = history.location

  const match = matchPath<CustomFontParams>(pathname, customFontFile)
  const paramId = match ? match.params.id : undefined

  const fonts = (data && data.listFonts) || []
  const editFamily = fonts.find(family => family.id === paramId) || {
    fontFamily: '',
    fonts: [],
    id: undefined,
  }

  const filesReducer = useReducer(reducer, editFamily.fonts)
  const familyState = useState(editFamily.fontFamily)
  const [id] = useState<string | undefined>(editFamily.id)
  const { showToast } = useContext(ToastContext)

  const [fontFamily] = familyState
  const [fontFiles] = filesReducer

  const title = (
    <FormattedMessage
      id="admin/pages.editor.styles.edit.custom-font.title"
      defaultMessage="Custom Font"
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

  const disableSave =
    !canSave(fontFamily, fontFiles) || loadingSave || loadingDelete

  const onSave = () => {
    saveFont({
      variables: { font: { fontFamily, fontFiles, id } },
    }).then(result => {
      if (result == null || result.data == null) {
        // TODO: treat errors on delete
        return
      }
      showToast('Font family saved succesfully.')
      history.goBack()
    })
  }

  const disableDelete = loadingSave || loadingDelete
  const onDelete = () => {
    deleteFont({ variables: { id: id as string } }).then(result => {
      if (
        result == null ||
        (result.errors != null && result.errors.length > 0)
      ) {
        // TODO: treat erros on delete
        return
      }
      showToast('Font family removed succesfully.')
      history.goBack()
    })
  }

  const fontFileTabProps = {
    active:
      matchPath(pathname, customFontFile) != null ||
      matchPath(pathname, EditorPath.customFont.replace(IdParam, '')) != null,
    key: 0,
    label: (
      <FormattedMessage
        id="admin/pages.editor.styles.edit.custom-font.file-upload"
        defaultMessage="Upload a file"
      />
    ),
    onClick: () =>
      history.replace(EditorPath.customFontFile.replace(IdParam, id || '')),
  }

  const fontLinkTabProps = {
    active: matchPath(pathname, customFontLink) != null,
    disabled: true,
    key: 1,
    label: (
      <FormattedMessage
        id="admin/pages.editor.styles.edit.custom-font.file-link"
        defaultMessage="File link"
      />
    ),
    onClick: () => history.replace(EditorPath.customFontLink),
  }

  return (
    <>
      <StyleEditorHeader title={title}>
        <div>
          {id != null && (
            <Button
              variation="tertiary"
              size="small"
              isLoading={loadingDelete}
              onClick={onDelete}
              disabled={disableDelete}
            >
              <FormattedMessage
                id="admin/pages.admin.pages.form.button.delete"
                defaultMessage="Delete"
              />
            </Button>
          )}
          <Button
            variation="tertiary"
            size="small"
            isLoading={loadingSave}
            onClick={onSave}
            disabled={disableSave}
          >
            <FormattedMessage
              id="admin/pages.admin.pages.form.button.save"
              defaultMessage="Save"
            />
          </Button>
        </div>
      </StyleEditorHeader>
      <div className="pa7 h-100 overflow-y-auto flex flex-column">
        <Tabs>
          <Tab {...fontFileTabProps}>
            <FileFontEditor {...{ familyState, filesReducer, showToast }} />
          </Tab>
          <Tab {...fontLinkTabProps} />
        </Tabs>
      </div>
    </>
  )
}

export default FontEditorWrapper
