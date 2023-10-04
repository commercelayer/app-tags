import type { FiltersInstructions } from '@commercelayer/app-elements/dist/src/ui/resources/useResourceFilters/types'

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
