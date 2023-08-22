/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { ScrollToTop } from '#components/ScrollToTop'
import { appRoutes } from '#data/routes'
import { useTagDetails } from '#hooks/useTagDetails'
import {
  Button,
  EmptyState,
  PageLayout,
  SkeletonTemplate,
  useCoreSdkProvider,
  useTokenProvider
} from '@commercelayer/app-elements'
import { useState } from 'react'
import { Link, useLocation, useRoute } from 'wouter'

export function TagDelete(): JSX.Element {
  const { canUser } = useTokenProvider()
  const { sdkClient } = useCoreSdkProvider()
  const [, setLocation] = useLocation()
  const [, params] = useRoute<{ tagId: string }>(appRoutes.delete.path)
  const tagId = params?.tagId ?? ''

  const { tag, isLoading } = useTagDetails(tagId)
  const [isDeleteting, setIsDeleting] = useState(false)

  const goBackUrl = appRoutes.list.makePath()

  if (!canUser('update', 'tags')) {
    return (
      <PageLayout
        title='Edit tag'
        onGoBack={() => {
          setLocation(goBackUrl)
        }}
      >
        <EmptyState
          title='Not found'
          description='Tag is invalid or you are not authorized to access this page.'
          action={
            <Link href={goBackUrl}>
              <Button variant='primary'>Go back</Button>
            </Link>
          }
        />
      </PageLayout>
    )
  }

  return (
    <PageLayout
      title={
        <SkeletonTemplate isLoading={isLoading}>
          Confirm that you want to cancel the {tag.name} tag.
        </SkeletonTemplate>
      }
      description='This action cannot be undone, proceed with caution.'
      onGoBack={() => {
        setLocation(goBackUrl)
      }}
    >
      <ScrollToTop />
      <Button
        variant='danger'
        size='small'
        disabled={isDeleteting}
        onClick={(e) => {
          setIsDeleting(true)
          e.stopPropagation()
          void sdkClient.tags
            .delete(tag.id)
            .then(() => {
              setLocation(appRoutes.list.makePath())
            })
            .catch(() => {})
        }}
      >
        Delete tag
      </Button>
    </PageLayout>
  )
}
