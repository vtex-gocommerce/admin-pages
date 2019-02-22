import { InjectedIntl } from 'react-intl'

export const getTextFromContext = (
  intl: InjectedIntl,
  isSitewide: boolean,
  path: string,
  pageContext: PageContext
) => {
  if (isSitewide) {
    return intl.formatMessage({
      id: 'pages.editor.configuration.tag.sitewide',
    })
  }

  if (pageContext.id === '*') {
    return intl.formatMessage({
      id: 'pages.editor.configuration.tag.template',
    })
  }

  return intl.formatMessage(
    {
      id: `pages.editor.configuration.tag.${pageContext.type}`,
    },
    { id: pageContext.type === 'route' ? path : pageContext.id }
  )
}