import { EUserRole } from '@/constants/App'
import { MOBILE_MEDIAQUERY } from '@/constants/MediaQuery'
import { AuthContext } from '@/providers/Context/AuthContext'
import { ActionIcon, Affix, Tooltip } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useNavigate } from '@tanstack/react-router'
import { useContext } from 'react'
import { FaPlus } from 'react-icons/fa6'

function CreateNewTodoBtn() {
  const isMobile = useMediaQuery(MOBILE_MEDIAQUERY)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  if (user?.role !== EUserRole.ADMIN || isMobile) return null
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
