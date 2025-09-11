import { Button, Flex } from '@mantine/core'
import { useNavigate } from '@tanstack/react-router'
import { Result } from 'antd'
import { useTranslation } from 'react-i18next'

function NotFound() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Flex
      h={'100vh'}
      justify={'center'}
      align={'center'}
      style={{
        overflow: 'hidden',
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle={t('notfound')}
        extra={
          <Button onClick={() => navigate({ to: '/' })}>{t('goHome')}</Button>
        }
      />
    </Flex>
  )
}

export default NotFound
