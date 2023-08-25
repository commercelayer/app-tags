import type { FiltersInstructions } from '@commercelayer/app-elements-hook-form/dist/filters/methods/types'

export const instructions: FiltersInstructions = [
  {
    label: 'Search',
    type: 'textSearch',
    sdk: {
      predicate: ['name'].join('_or_') + '_cont'
    },
    render: {
      component: 'searchBar'
    }
  }
]
