import { SidebarComponent } from '../typings'

export type GenericComponent = NormalizedComponent | SidebarComponent

export interface NormalizedComponent extends SidebarComponent {
  components?: NormalizedComponent[]
  isSortable: boolean
}

export interface ReorderChange {
  target: string
  order: string[]
}
