import type { FiltersInstructions } from '@commercelayer/app-elements/dist/ui/resources/Filters/types'

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
