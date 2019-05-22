export interface FormMetaContext {
  addToI18nMapping: (newEntry: Record<string, string>) => void
  clearI18nMapping: () => void
  getI18nMapping: () => Record<string, string>
  getIsLoading: () => boolean
  getWasModified: () => boolean
  setWasModified: (newValue: boolean, callback?: () => void) => void
  toggleLoading: (callback?: () => void) => void
}

export interface ModalContext {
  actionHandler: () => void
  cancelHandler: () => void
  closeCallbackHandler?: () => void
  close: () => void
  isOpen: boolean
  open: () => void
  setHandlers: (
    handlers: {
      actionHandler?: ModalContext['actionHandler']
      cancelHandler?: ModalContext['cancelHandler']
      closeCallbackHandler?: ModalContext['closeCallbackHandler']
    }
  ) => void
}

export interface SidebarComponent {
  name: string
  treePath: string
}

export interface ComponentEditorFormContext {
  isLayoutMode: boolean
}
