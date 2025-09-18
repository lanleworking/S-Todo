import { ActionIcon, Group, Title } from '@mantine/core'
import { useNavigate } from '@tanstack/react-router'
import { FaAngleLeft } from 'react-icons/fa6'

type TitleWithReturnProps = {
  title: string
}

function TitleWithReturn({ title }: TitleWithReturnProps) {
  const navigate = useNavigate()
  return (
    <Group>
      <ActionIcon
        onClick={() =>
          navigate({
            to: '..',
          })
        }
        variant="subtle"
      >
        <FaAngleLeft />
      </ActionIcon>
      <Title order={3}>{title}</Title>
    </Group>
  )
}

export default TitleWithReturn
