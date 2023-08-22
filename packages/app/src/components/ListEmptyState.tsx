import {
  Button,
  EmptyState,
  useTokenProvider
} from '@commercelayer/app-elements'
import { Link } from 'wouter'

import { appRoutes } from '#data/routes'

export function ListEmptyState(): JSX.Element {
  const { canUser } = useTokenProvider()

  if (canUser('create', 'tags')) {
    return (
      <EmptyState
        title='No tags yet!'
        description={canUser('create', 'tags') && 'Create your first tag'}
        action={
          canUser('create', 'tags') && (
            <Link href={appRoutes.new.makePath()}>
              <Button variant='primary'>New tag</Button>
            </Link>
          )
        }
      />
    )
  }

  return (
    <EmptyState
      title='No tags found!'
      description={
        <div>
          <p>We didn't find any tags matching the current filters selection.</p>
        </div>
      }
    />
  )
}
