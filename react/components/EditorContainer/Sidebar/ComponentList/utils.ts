import { partition } from 'ramda'

import { GenericComponent, NormalizedComponent } from './typings'

export const getParentTreePath = (treePath: string): string => {
  const splitTreePath = treePath.split('/')
  if (splitTreePath.length === 1) {
    return splitTreePath.join('')
  }
  return splitTreePath.slice(0, splitTreePath.length - 1).join('/')
}

export const getIsParentComponent = (level: number) => (
  component: GenericComponent
) => {
  const splittedTreePath = component.treePath.split('/')

  return (
    splittedTreePath.length === level + 1 ||
    (!!splittedTreePath[level + 2] &&
      splittedTreePath[level + 2].startsWith('$'))
  )
}

export const getIsParentComponentVariable = (level: number) => (
  parentComponent: GenericComponent
) => parentComponent.treePath.split('/')[level].startsWith('$')

// when reordering the middle items, check for persisted order and repeat it,
// leaving the remaining new components as is, but setting as modified,
// so the user will have to save it, updating the order

// blocks with 'around' should be nested if the 'around' block has a schema,
// otherwise should be at the same level as their 'before's and 'after's

// TODO: fix typings
export const normalizeComponents = (
  components: GenericComponent[],
  level: number = 1
) => {
  const [parents, children] = partition(
    getIsParentComponent(level),
    components
  )

  const [variableParents, nonVariableParents] = partition(
    getIsParentComponentVariable(level),
    parents
  )

  const normalizedVariableParents = variableParents.reduce(
    (acc, currRoot) => {
      const treePathTail = currRoot.treePath.split('/')[level]

      const blockTypeMatch = treePathTail.match(/\$(after|around|before)_/)

      if (!blockTypeMatch) {
        return acc
      }

      const blockType = blockTypeMatch[1] as 'after' | 'around' | 'before'

      return {
        ...acc,
        [blockType]: [...acc[blockType], { ...currRoot, isSortable: false }]
      }
    },
    { after: [], around: [], before: [] }
  )

  const normalizedNonVariableParents = nonVariableParents.map(
    parentComponent => ({
      ...parentComponent,
      isSortable: level === 1 ? true : false
    })
  )

  // TODO: around as parent if schema or getSchema
  const sortedParents = [
    ...normalizedVariableParents.before,
    ...normalizedVariableParents.around,
    ...normalizedNonVariableParents,
    ...normalizedVariableParents.after
  ]

  const normalizedComponents = children.reduce<NormalizedComponent[]>(
    (acc, currChildComponent) =>
      acc.map(parentComponent => {
        const normalizedComponent = {
          ...currChildComponent,
          isSortable: false
        }

        return currChildComponent.treePath.startsWith(parentComponent.treePath)
          ? {
            ...parentComponent,
            components: parentComponent.components
              ? [...parentComponent.components, normalizedComponent]
              : [normalizedComponent]
          }
          : parentComponent
      }),
    sortedParents
  )

  return normalizedComponents.map(item => ({
    ...item,
    ...(item.components && {
      components: normalizeComponents(item.components, level + 1)
    })
  }))
}
