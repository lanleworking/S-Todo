import type { ITodoData, ITodoItemUser } from '@/constants/Data'
import useTodo from '@/hooks/useTodo'
import { fetchError } from '@/utils/toast/fetchError'
import {
  ActionIcon,
  Avatar,
  Button,
  Combobox,
  Divider,
  Flex,
  Group,
  InputBase,
  Loader,
  Modal,
  Stack,
  Text,
  Tooltip,
  useCombobox,
} from '@mantine/core'
import { useEffect, useMemo, useState } from 'react'
import { FaUserMinus } from 'react-icons/fa'
import { LuUserSearch } from 'react-icons/lu'
import toast from 'react-hot-toast'

type ManageUsersModalProps = {
  opened: boolean
  onClose: () => void
  data: ITodoData
  currentUserId: string
  serverUrl: string
  onSuccess: (updated: ITodoData) => void
}

function ManageUsersModal({
  opened,
  onClose,
  data,
  currentUserId,
  serverUrl,
  onSuccess,
}: ManageUsersModalProps) {
  const { getUserOptions, addUserToTodo, removeUserFromTodo } = useTodo()
  const {
    data: allUsers,
    refetch: refetchUsers,
    isFetching: isLoadingUsers,
  } = getUserOptions
  const { mutate: addUser } = addUserToTodo
  const { mutate: removeUser, isPending: isRemoving } = removeUserFromTodo

  const [searchValue, setSearchValue] = useState('')
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption()
      setSearchValue('')
    },
  })

  useEffect(() => {
    if (opened) refetchUsers()
  }, [opened])

  const currentMemberIds = useMemo(
    () => new Set((data.users || []).map((u) => u.userId)),
    [data.users],
  )

  const availableToAdd = useMemo(() => {
    if (!allUsers) return []
    return allUsers.filter(
      (u) =>
        !currentMemberIds.has(u.value) &&
        u.label.toLowerCase().includes(searchValue.toLowerCase()),
    )
  }, [allUsers, currentMemberIds, searchValue])

  const handleAdd = (userId: string) => {
    addUser(
      { todoId: data.id, userId },
      {
        onSuccess: (updated) => {
          toast.success('User added!')
          onSuccess(updated)
        },
        onError: (e) => fetchError(e),
      },
    )
    combobox.closeDropdown()
    setSearchValue('')
  }

  const handleRemove = (userId: string) => {
    removeUser(
      { todoId: data.id, userId },
      {
        onSuccess: (updated) => {
          toast.success('User removed!')
          onSuccess(updated)
        },
        onError: (e) => fetchError(e),
      },
    )
  }

  return (
    <Modal
      size="md"
      centered
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={600} size="lg">
          Manage Members
        </Text>
      }
    >
      <Stack gap="md">
        {/* Add user combobox */}
        <Combobox store={combobox} onOptionSubmit={handleAdd}>
          <Combobox.Target>
            <InputBase
              leftSection={
                isLoadingUsers ? <Loader size={14} /> : <LuUserSearch />
              }
              rightSection={<Combobox.Chevron />}
              rightSectionPointerEvents="none"
              placeholder="Search user to add..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.currentTarget.value)
                combobox.openDropdown()
              }}
              onClick={() => combobox.openDropdown()}
              onFocus={() => combobox.openDropdown()}
              onBlur={() => combobox.closeDropdown()}
            />
          </Combobox.Target>

          <Combobox.Dropdown>
            <Combobox.Options>
              {availableToAdd.length === 0 ? (
                <Combobox.Empty>No users found</Combobox.Empty>
              ) : (
                availableToAdd.map((u) => (
                  <Combobox.Option key={u.value} value={u.value}>
                    <Flex align="center" gap={8}>
                      <Avatar size="sm" name={u.label} color="initials" />
                      <Text size="sm">{u.label}</Text>
                    </Flex>
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>

        <Divider
          label={`Members (${data.users?.length || 0})`}
          labelPosition="left"
        />

        {/* Current members list */}
        <Stack gap="xs">
          {(data.users || []).map((u: ITodoItemUser) => {
            const isOwner = u.userId === data.createdBy
            const isMe = u.userId === currentUserId
            return (
              <Flex
                key={u.userId}
                align="center"
                justify="space-between"
                p={8}
                style={{
                  borderRadius: 8,
                  backgroundColor: '#80808012',
                }}
              >
                <Flex align="center" gap={10}>
                  <Avatar
                    size="sm"
                    src={
                      u.avatarUrl ? `${serverUrl}/${u.avatarUrl}` : undefined
                    }
                    name={u.fullName || u.userId}
                    color="initials"
                    bd="1px solid var(--border-color)"
                  />
                  <Stack gap={0}>
                    <Text size="sm" fw={isOwner ? 600 : 400}>
                      {u.fullName || u.userId}
                      {isMe && (
                        <Text span size="xs" c="dimmed">
                          {' '}
                          (you)
                        </Text>
                      )}
                    </Text>
                    {isOwner && (
                      <Text size="xs" c="grape">
                        Owner
                      </Text>
                    )}
                  </Stack>
                </Flex>

                {!isOwner && (
                  <Tooltip label="Remove from todo">
                    <ActionIcon
                      color="red"
                      variant="light"
                      size="sm"
                      loading={isRemoving}
                      onClick={() => handleRemove(u.userId)}
                    >
                      <FaUserMinus size={12} />
                    </ActionIcon>
                  </Tooltip>
                )}
              </Flex>
            )
          })}
        </Stack>

        <Group justify="end" mt={4}>
          <Button variant="subtle" onClick={onClose}>
            Close
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default ManageUsersModal
