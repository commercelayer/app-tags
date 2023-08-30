import { ListEmptyState } from '#components/ListEmptyState'
import { ListItemTag } from '#components/ListItemTag'
import { instructions } from '#data/filters'
import { type ListType } from '#data/lists'
import { appRoutes } from '#data/routes'
import {
  Button,
  PageLayout,
  Spacer,
  useTokenProvider
} from '@commercelayer/app-elements'
import { useFilters } from '@commercelayer/app-elements-hook-form'
import { Link, useLocation } from 'wouter'
import { navigate, useSearch } from 'wouter/use-location'

interface Props {
  type: ListType
}

const pageTitle: Record<ListType, string> = {
  all: 'Tags'
}

export function TagList({ type }: Props): JSX.Element {
  const {
    dashboardUrl,
    settings: { mode },
    canUser
  } = useTokenProvider()

  const queryString = useSearch()
  const [, setLocation] = useLocation()

  const { SearchWithNav, FilteredList } = useFilters({
    instructions
  })

  const onGoBack =
    type === 'all'
      ? () => {
          window.location.href =
            dashboardUrl != null ? `${dashboardUrl}/hub` : '/'
        }
      : () => {
          setLocation(appRoutes.list.makePath())
        }

  return (
    <PageLayout
      title={pageTitle[type]}
      mode={mode}
      onGoBack={onGoBack}
      gap='only-top'
    >
      <SearchWithNav
        queryString={queryString}
        onUpdate={(qs) => {
          navigate(`?${qs}`, {
            replace: true
          })
        }}
        onFilterClick={(queryString) => {
          setLocation(appRoutes.list.makePath(queryString))
        }}
        hideFiltersNav
      />

      <Spacer bottom='14'>
        <FilteredList
          type='tags'
          Item={ListItemTag}
          query={{
            fields: {
              tags: ['id', 'name', 'created_at', 'updated_at']
            },
            pageSize: 25,
            sort: {
              updated_at: 'desc'
            }
          }}
          emptyState={<ListEmptyState />}
          actionButton={
            canUser('create', 'tags') ? (
              <Link href={appRoutes.new.makePath()}>
                <Button variant='link'>Add new</Button>
              </Link>
            ) : undefined
          }
        />
      </Spacer>
    </PageLayout>
  )
}