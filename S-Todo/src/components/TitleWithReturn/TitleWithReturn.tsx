import { ActionIcon, Group, Title, type TitleProps } from '@mantine/core'
import { useNavigate } from '@tanstack/react-router'
import { FaAngleLeft } from 'react-icons/fa6'

type TitleWithReturnProps = {
  title: string
  to?: string
  titleProps?: TitleProps
}

function TitleWithReturn({ title, to, titleProps }: TitleWithReturnProps) {
  const navigate = useNavigate()
  return (
    <Group>
      <ActionIcon
        onClick={() =>
          navigate({
            to: to || '..',
          })
        }
        variant="subtle"
      >
        <FaAngleLeft />
      </ActionIcon>
      <Title {...titleProps}>{title}</Title>
    </Group>
  )
}

export default TitleWithReturn
