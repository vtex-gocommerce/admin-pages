import { State } from '../index'
import newPage from './__fixtures__/newPage'
import { getChangeTemplateConditionalTemplateState } from './getChangeTemplateConditionalTemplateState'

describe('getChangeTemplateConditionalTemplateState', () => {
  it('should modify template given a unique ID', () => {
    const mockState = {
      data: {
        pages: [
          {
            ...newPage,
            uniqueId: 10,
          },
          {
            ...newPage,
            uniqueId: 3,
          },
          {
            ...newPage,
            uniqueId: 5,
          },
        ] as any[],
      },
    } as State

    expect(
      getChangeTemplateConditionalTemplateState(3, 'store/test')(mockState)
    ).toEqual(
      expect.objectContaining({
        data: {
          pages: [
            {
              ...newPage,
              uniqueId: 10,
            },
            {
              ...newPage,
              template: 'store/test',
              uniqueId: 3,
            },
            {
              ...newPage,
              uniqueId: 5,
            },
          ],
        },
      })
    )
  })

  it('should clear formError', () => {
    const mockState = ({
      data: {
        pages: [
          {
            ...newPage,
            uniqueId: 10,
          },
          {
            ...newPage,
            uniqueId: 3,
          },
          {
            ...newPage,
            uniqueId: 5,
          },
        ] as any[],
      },
      formErrors: {
        title: 'oi',
      },
    } as unknown) as State

    expect(
      getChangeTemplateConditionalTemplateState(3, 'store/test')(mockState)
    ).toEqual(
      expect.objectContaining({
        formErrors: {},
      })
    )
  })
})
