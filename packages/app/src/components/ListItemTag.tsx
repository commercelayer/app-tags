import { appRoutes } from '#data/routes'
import { isMock, makeTag } from '#mocks'
import {
  Button,
  ContextMenu,
  DropdownMenuDivider,
  DropdownMenuItem,
  ListItem,
  PageLayout,
  Text,
  useCoreSdkProvider,
  useOverlay,
  useTokenProvider,
  withSkeletonTemplate
} from '@commercelayer/app-elements'
import type { ResourceListItemProps } from '@commercelayer/app-elements/dist/ui/resources/ResourceList'
import { DotsThree } from '@phosphor-icons/react'
import { useState } from 'react'
import { useLocation } from 'wouter'

export const ListItemTag = withSkeletonTemplate<ResourceListItemProps<'tags'>>(
  ({ resource = makeTag(), remove }) => {
    const [, setLocation] = useLocation()
    const { canUser } = useTokenProvider()
    const { sdkClient } = useCoreSdkProvider()

    const { Overlay, open, close } = useOverlay()

    const [isDeleteting, setIsDeleting] = useState(false)

    const contextMenuEdit = canUser('update', 'tags') && !isMock(resource) && (
      <DropdownMenuItem
        label='Edit'
        onClick={() => {
          setLocation(appRoutes.edit.makePath(resource.id))
        }}
      />
    )

    const contextMenuDivider = canUser('update', 'tags') &&
      canUser('destroy', 'tags') && <DropdownMenuDivider />

    const contextMenuDelete = canUser('destroy', 'tags') && (
      <DropdownMenuItem
        label='Delete'
        onClick={() => {
          open()
        }}
      />
    )

    const contextMenu = (
      <ContextMenu
        menuLabel={<DotsThree size={24} />}
        menuItems={
          <>
            {contextMenuEdit}
            {contextMenuDivider}
            {contextMenuDelete}
          </>
        }
      />
    )

    return (
      <>
        <ListItem tag='div'>
          <div>
            <Text tag='span' weight='semibold'>
              {resource.name}
            </Text>
          </div>
          {contextMenu}
        </ListItem>
        {canUser('destroy', 'tags') && (
          <Overlay>
            <PageLayout
              title={`Confirm that you want to cancel the ${resource.name} tag.`}
              description='This action cannot be undone, proceed with caution.'
              minHeight={false}
              onGoBack={() => {
                close()
              }}
            >
              <Button
                variant='danger'
                size='small'
                disabled={isDeleteting}
                onClick={(e) => {
                  setIsDeleting(true)
                  e.stopPropagation()
                  void sdkClient.tags
                    .delete(resource.id)
                    .then(() => {
                      remove?.()
                      close()
                    })
                    .catch(() => {})
                }}
              >
                Delete tag
              </Button>
            </PageLayout>
          </Overlay>
        )}
      </>
    )
  }
)
