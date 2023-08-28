import { appRoutes } from '#data/routes'
import { isMock, makeTag } from '#mocks'
import {
  Button,
  ContextMenu,
  DropdownMenuDivider,
  DropdownMenuItem,
  ListItem,
  Overlay,
  PageLayout,
  Text,
  useCoreSdkProvider,
  useTokenProvider,
  withSkeletonTemplate
} from '@commercelayer/app-elements'
import type { Tag } from '@commercelayer/sdk'
import { DotsThree } from '@phosphor-icons/react'
import { useState } from 'react'
import { useLocation } from 'wouter'

interface Props {
  resource?: Tag
}

function ListItemTagComponent({ resource = makeTag() }: Props): JSX.Element {
  const [, setLocation] = useLocation()
  const { canUser } = useTokenProvider()
  const { sdkClient } = useCoreSdkProvider()

  const [showDeleteOverlay, setShowDeleteOverlay] = useState(false)
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
        setShowDeleteOverlay(true)
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
      {showDeleteOverlay && canUser('destroy', 'tags') && (
        <Overlay>
          <PageLayout
            title={`Confirm that you want to cancel the ${resource.name} tag.`}
            description='This action cannot be undone, proceed with caution.'
            minHeight={false}
            onGoBack={() => {
              setShowDeleteOverlay(false)
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
                    setShowDeleteOverlay(false)
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

export const ListItemTag = withSkeletonTemplate(ListItemTagComponent)
