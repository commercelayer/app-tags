import { appRoutes } from '#data/routes'
import { isMock, makeTag } from '#mocks'
import {
  ContextMenu,
  DropdownMenuDivider,
  DropdownMenuItem,
  ListItem,
  Text,
  useTokenProvider,
  withSkeletonTemplate
} from '@commercelayer/app-elements'
import type { Tag } from '@commercelayer/sdk'
import { DotsThree } from '@phosphor-icons/react'
import { useLocation } from 'wouter'

interface Props {
  resource?: Tag
}

function ListItemTagComponent({ resource = makeTag() }: Props): JSX.Element {
  const [, setLocation] = useLocation()
  const { canUser } = useTokenProvider()

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
        setLocation(appRoutes.delete.makePath(resource.id))
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
    <ListItem tag='div'>
      <div>
        <Text tag='div' weight='semibold'>
          {resource.name}
        </Text>
      </div>
      {contextMenu}
    </ListItem>
  )
}

export const ListItemTag = withSkeletonTemplate(ListItemTagComponent)
