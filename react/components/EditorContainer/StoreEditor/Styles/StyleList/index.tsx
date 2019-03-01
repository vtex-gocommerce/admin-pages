import { randomBytes } from 'crypto'
import { find, zip } from 'ramda'
import React, { Fragment, useState } from 'react'
import { ButtonWithIcon, Spinner, ToastConsumer } from 'vtex.styleguide'

import Operations from './Operations'

import CreateNewIcon from './icons/CreateNewIcon'
import StyleCard from './StyleCard'

import DummyCard from './StyleCard/DummyCard'

interface Props {
  startEditing: (style: Style) => void
  setStyleAsset: (asset: StyleAssetInfo) => void
  setLoading: (loading: boolean) => void
}

const dummyStyle = (name: string): Style => {
  return {
    app: 'user',
    config: {} as TachyonsConfig,
    editable: true,
    id: randomBytes(16).toString('hex'),
    name,
    path: '',
    selected: false,
  }
}

const compareStyles = (a: Style, b: Style) => {
  const toArray = ({ selected, editable, app, name, id }: Style) => {
    return [selected ? 0 : 1, editable ? 0 : 1, app, name, id]
  }
  return zip(toArray(a), toArray(b)).reduce((acc, [value1, value2]) => {
    if (acc !== 0) {
      return acc
    }
    if (value1 < value2) {
      return -1
    }
    if (value1 > value2) {
      return 1
    }
    return acc
  }, 0)
}

const StyleList: React.SFC<Props> = ({
  startEditing,
  setStyleAsset,
  setLoading,
}) => {
  const [dummies, setDummies] = useState<Style[]>([])

  return (
    <Operations>
      {({
        listStyles: { data, loading },
        saveSelectedStyle,
        createStyle,
        deleteStyle,
      }) => {
        const unsortedStyles =
          data && data.listStyles && data.listStyles.concat(dummies)
        const listStyles = unsortedStyles && unsortedStyles.sort(compareStyles)

        const selected = listStyles && find(style => style.selected, listStyles)
        if (selected && !loading) {
          setStyleAsset({
            selected: true,
            type: 'path',
            value: selected.path,
          })
        }

        return loading ? (
          <div className="pt7 flex justify-around">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-column ph3 h-100">
            <div className="flex justify-between mv5 ml5 items-center">
              <span className="f3">Styles</span>
              <ButtonWithIcon
                icon={<CreateNewIcon />}
                variation="tertiary"
                onClick={() => {
                  const dummy = dummyStyle('Untitled')
                  setDummies(dummies.concat(dummy))
                  createStyle({ variables: { name: 'Untitled' } }).finally(
                    () => {
                      setDummies(dummies.filter(({ id }) => id !== dummy.id))
                    }
                  )
                }}
              >
                New
              </ButtonWithIcon>
            </div>
            <div className="flex flex-column flex-grow-1 overflow-scroll">
              <ToastConsumer>
                {({ showToast }) => (
                  <Fragment>
                    {listStyles &&
                      listStyles.map(style =>
                        style.path === '' ? (
                          <DummyCard />
                        ) : (
                          <StyleCard
                            key={style.id}
                            style={style}
                            selectStyle={({ id, name }: Style) => {
                              setLoading(true)
                              saveSelectedStyle({ variables: { id } }).then(
                                () => {
                                  showToast({
                                    horizontalPosition: 'right',
                                    message: `Style '${name}' was selected.`,
                                  })
                                  setLoading(false)
                                }
                              )
                            }}
                            deleteStyle={({ config, name, id }: Style) => {
                              deleteStyle({ variables: { id } }).then(() => {
                                showToast({
                                  action: {
                                    label: 'Undo',
                                    onClick: () => {
                                      const dummy = dummyStyle('Untitled')
                                      setDummies(dummies.concat(dummy))
                                      createStyle({
                                        variables: { name, config },
                                      }).finally(() => {
                                        setDummies(
                                          dummies.filter(
                                            ({ id: dummyID }) =>
                                              dummyID !== dummy.id
                                          )
                                        )
                                      })
                                    },
                                  },
                                  duration: Infinity,
                                  horizontalPosition: 'right',
                                  message: `Style '${name}' was deleted.`,
                                })
                              })
                            }}
                            duplicateStyle={({ name, config }: Style) => {
                              const dummy = dummyStyle('Untitled')
                              setDummies(dummies.concat(dummy))
                              createStyle({
                                variables: { name: `Copy of ${name}`, config },
                              }).finally(() => {
                                setDummies(
                                  dummies.filter(({ id }) => id !== dummy.id)
                                )
                              })
                            }}
                            startEditing={startEditing}
                          />
                        )
                      )}
                  </Fragment>
                )}
              </ToastConsumer>
            </div>
          </div>
        )
      }}
    </Operations>
  )
}

export default StyleList
