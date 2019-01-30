import { SidebarComponent } from '../typings'

import { NormalizedComponent } from './typings'
import {
  // getIsParentComponent,
  // getIsParentComponentVariable,
  getParentTreePath,
  normalizeComponents
} from './utils'

describe('getParentTreePath', () => {
  it('returns parent treePath', () => {
    expect(getParentTreePath('store.home/shelf#home')).toBe('store.home')
  })

  it('handles strings with no delimiter', () => {
    expect(getParentTreePath('store')).toBe('store')
  })
})

// xdescribe('getIsParentComponent', () => {
//   it(`returns true when called with 'store.home/$before_0'`, () => {
//     const input: SidebarComponent = {
//       name: 'header',
//       treePath: 'store.home/$before_0'
//     }

//     const expectedOutput = true

//     expect(getIsParentComponent(input)).toBe(expectedOutput)
//   })

//   it(`returns true when called with 'store.home/$after_0'`, () => {
//     const input: SidebarComponent = {
//       name: 'footer',
//       treePath: 'store.home/$after_0'
//     }

//     const expectedOutput = true

//     expect(getIsParentComponent(input)).toBe(expectedOutput)
//   })

//   it(`returns true when called with 'store.home/test'`, () => {
//     const input: SidebarComponent = {
//       name: 'test',
//       treePath: 'store.home/test'
//     }

//     const expectedOutput = true

//     expect(getIsParentComponent(input)).toBe(expectedOutput)
//   })

//   it(`returns false when called with 'store.home/header/login'`, () => {
//     const input: SidebarComponent = {
//       name: 'login',
//       treePath: 'store.home/header.full/login'
//     }

//     const expectedOutput = false

//     expect(getIsParentComponent(input)).toBe(expectedOutput)
//   })

//   it(`returns false when called with 'store.home/shelf#home/product-summary'`, () => {
//     const input: SidebarComponent = {
//       name: 'product-summary',
//       treePath: 'store.home/shelf#home/product-summary'
//     }

//     const expectedOutput = false

//     expect(getIsParentComponent(input)).toBe(expectedOutput)
//   })
// })

// xdescribe('getIsParentComponentVariable', () => {
//   xit('' => {})
// }

describe('normalizeComponents', () => {
  it('handles empty array inputs', () => {
    const input: SidebarComponent[] = []

    const expectedOutput: NormalizedComponent[] = []

    expect(normalizeComponents(input)).toEqual(
      expectedOutput
    )
  })

  it('nests store.home/ level components', () => {
    const input: SidebarComponent[] = [
      { name: 'editor.footer.title', treePath: 'store.home/$after_0' },
      { name: 'editor.header.title', treePath: 'store.home/$before_0' },
      {
        name: 'editor.category-menu.title',
        treePath: 'store.home/$before_0/category-menu'
      },
      { name: 'editor.login.title', treePath: 'store.home/$before_0/login' },
      { name: 'editor.menu', treePath: 'store.home/$before_0/menu-link' },
      {
        name: 'editor.minicart.title',
        treePath: 'store.home/$before_0/minicart'
      },
      { name: 'editor.carousel.title', treePath: 'store.home/carousel#home' },
      { name: 'editor.shelf.title', treePath: 'store.home/shelf#home' }
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        components: [
          {
            isSortable: false,
            name: 'editor.category-menu.title',
            treePath: 'store.home/$before_0/category-menu'
          },
          {
            isSortable: false,
            name: 'editor.login.title',
            treePath: 'store.home/$before_0/login'
          },
          {
            isSortable: false,
            name: 'editor.menu',
            treePath: 'store.home/$before_0/menu-link'
          },
          {
            isSortable: false,
            name: 'editor.minicart.title',
            treePath: 'store.home/$before_0/minicart'
          }
        ],
        isSortable: false,
        name: 'editor.header.title',
        treePath: 'store.home/$before_0'
      },
      {
        isSortable: true,
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home'
      },
      {
        isSortable: true,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home'
      },
      {
        isSortable: false,
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0'
      }
    ]

    expect(normalizeComponents(input)).toEqual(
      expectedOutput
    )
  })

  it('handles multilevel nesting', () => {
    const input: SidebarComponent[] = [
      {
        name: 'editor.header.title',
        treePath: 'store.home/$before_0'
      },
      {
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home'
      },
      {
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home'
      },
      {
        name: 'editor.product-summary.title',
        treePath: 'store.home/shelf#home/product-summary'
      },
      {
        name: 'editor.product-rating.title',
        treePath: 'store.home/shelf#home/product-summary/product-rating'
      },
      {
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0'
      }
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        isSortable: false,
        name: 'editor.header.title',
        treePath: 'store.home/$before_0'
      },
      {
        isSortable: true,
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home'
      },
      {
        components: [
          {
            components: [
              {
                isSortable: false,
                name: 'editor.product-rating.title',
                treePath: 'store.home/shelf#home/product-summary/product-rating'
              }
            ],
            isSortable: false,
            name: 'editor.product-summary.title',
            treePath: 'store.home/shelf#home/product-summary'
          }
        ],
        isSortable: true,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home'
      },
      {
        isSortable: false,
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0'
      }
    ]

    expect(normalizeComponents(input)).toEqual(
      expectedOutput
    )
  })

  it('handles unordered components', () => {
    const input: SidebarComponent[] = [
      {
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0'
      },
      {
        name: 'editor.product-summary.title',
        treePath: 'store.home/shelf#home/product-summary'
      },
      {
        name: 'editor.header.title',
        treePath: 'store.home/$before_0'
      },
      {
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home'
      },
      {
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home'
      }
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        isSortable: false,
        name: 'editor.header.title',
        treePath: 'store.home/$before_0'
      },
      {
        isSortable: true,
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home'
      },
      {
        components: [
          {
            isSortable: false,
            name: 'editor.product-summary.title',
            treePath: 'store.home/shelf#home/product-summary'
          }
        ],
        isSortable: true,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home'
      },
      {
        isSortable: false,
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0'
      }
    ]

    expect(normalizeComponents(input)).toEqual(
      expectedOutput
    )
  })

  it(`handles components with 'around' blocks`, () => {
    const input: SidebarComponent[] = [
      {
        name: 'editor.header.title',
        treePath: 'store.home/$before_0'
      },
      {
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home'
      },
      {
        name: 'editor.product-summary.title',
        treePath: 'store.home/shelf#home/product-summary'
      },
      {
        name: 'editor.around-shelf.title',
        treePath: 'store.home/shelf#home/$around_0'
      },
      {
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home'
      },
      {
        name: 'editor.around-carousel.title',
        treePath: 'store.home/carousel#home/$around_0'
      },
      {
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0'
      }
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        isSortable: false,
        name: 'editor.header.title',
        treePath: 'store.home/$before_0'
      },
      {
        isSortable: false,
        name: 'editor.around-carousel.title',
        treePath: 'store.home/carousel#home/$around_0'
      },
      {
        isSortable: true,
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home'
      },
      {
        isSortable: false,
        name: 'editor.around-shelf.title',
        treePath: 'store.home/shelf#home/$around_0'
      },
      {
        components: [
          {
            isSortable: false,
            name: 'editor.product-summary.title',
            treePath: 'store.home/shelf#home/product-summary'
          }
        ],
        isSortable: true,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home'
      },
      {
        isSortable: false,
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0'
      }
    ]

    expect(normalizeComponents(input)).toEqual(
      expectedOutput
    )
  })

  xit(`handles components with nesting and multiple 'before', 'around' and 'after' blocks`, () => {
    const input: SidebarComponent[] = [
      {
        name: 'editor.header.title',
        treePath: 'store.home/$before_0'
      },
      {
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home'
      },
      {
        name: 'editor.product-summary.title',
        treePath: 'store.home/shelf#home/product-summary'
      },
      {
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home'
      },
      {
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0'
      }
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        isSortable: true,
        name: 'editor.header.title',
        treePath: 'store.home/$before_0'
      },
      {
        isSortable: true,
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home'
      },
      {
        components: [
          {
            isSortable: false,
            name: 'editor.product-summary.title',
            treePath: 'store.home/shelf#home/product-summary'
          }
        ],
        isSortable: true,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home'
      },
      {
        isSortable: true,
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0'
      }
    ]

    expect(normalizeComponents(input)).toEqual(
      expectedOutput
    )
  })
})
