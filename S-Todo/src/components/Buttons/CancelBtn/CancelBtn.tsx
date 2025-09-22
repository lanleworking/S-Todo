import { Button } from '@mantine/core'
import { useNavigate } from '@tanstack/react-router'

type CancelBtnProps = {
  text: string
}

function CancelBtn({ text }: CancelBtnProps) {
  const navigate = useNavigate()

  const onBack = () => {
    navigate({ to: '..' })
  }

  return (
    <Button onClick={onBack} variant="default">
      {text}
    </Button>
  )
}

export default CancelBtn
