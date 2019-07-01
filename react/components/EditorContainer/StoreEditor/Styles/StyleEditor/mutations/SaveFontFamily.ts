import { DataProxy } from 'apollo-cache'
import { Mutation, MutationFn, QueryResult } from 'react-apollo'

import ListFonts from '../graphql/ListFonts.graphql'
import SaveFontFamilyMutation from '../graphql/SaveFontFamily.graphql'
import { FontFamily, ListFontsData } from '../queries/ListFontsQuery'

interface FontFamilyVariables {
  font: FontFamilyInput
}

export interface FontFamilyInput {
  id?: string
  fontFamily: string
  fontFiles: FontFileInput[]
}

export type FontFileInput = FontFileUpload | FontFile

export interface FontFileUpload {
  fontFile: File
  fontWeight?: string
  fontStyle?: string
}

export interface FontFile {
  filename: string
  fontWeight: string
  fontStyle: string
}

export interface FontFamilyData {
  saveFontFamily: FontFamily
}

type SaveFontFamilyResult = QueryResult<FontFamilyData>

export type SaveFontFamilyFn = MutationFn<FontFamilyData, FontFamilyVariables>

const updateFontsAfterSave = (
  cache: DataProxy,
  result: SaveFontFamilyResult
) => {
  const listData = cache.readQuery<ListFontsData>({ query: ListFonts })

  if (result.data == null || listData == null) {
    return
  }

  const { listFonts: families } = listData
  const savedFamily = result.data.saveFontFamily
  const familyIndex = families.findIndex(({ id }) => id === savedFamily.id)
  families.splice(
    familyIndex < 0 ? families.length : familyIndex,
    1,
    savedFamily
  )

  cache.writeQuery<ListFontsData>({
    data: {
      listFonts: families,
    },
    query: ListFonts,
  })
}

class SaveFontFamily extends Mutation<FontFamilyData, FontFamilyVariables> {
  public static defaultProps = {
    mutation: SaveFontFamilyMutation,
    update: updateFontsAfterSave,
  }
}

export default SaveFontFamily
