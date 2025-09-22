import { ActionIcon, Affix, Tooltip } from '@mantine/core'
import { useNavigate } from '@tanstack/react-router'
import { FaPlus } from 'react-icons/fa6'

function CreateNewTodoBtn() {
  const navigate = useNavigate()

  return (
    <Affix position={{ bottom: 20, right: 20 }}>
      <Tooltip label="Add New Todo" withArrow>
        <ActionIcon
          onClick={() =>
            navigate({
              to: '/manage/create',
            })
          }
          radius={'lg'}
          size={'lg'}
        >
          <FaPlus />
        </ActionIcon>
      </Tooltip>
    </Affix>
  )
}

export default CreateNewTodoBtn
