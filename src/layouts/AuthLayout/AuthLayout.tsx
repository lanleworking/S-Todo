import STodoLogo from '@/assets/logos/Web_Logo.png'

import { Box, Flex, Center } from '@mantine/core'
import styles from './AuthLayout.module.scss'
import clsx from 'clsx'
import LangSwitch from '@/components/Switch/LangSwitch'

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box className={clsx(styles.authLayout)}>
      <Box miw={380} px={4}>
        <Flex justify={'flex-end'}>
          <LangSwitch />
        </Flex>
        <Center mb={'20px'}>
          <Box
            component={'img'}
            src={STodoLogo}
            alt="S-Todo Logo"
            width={200}
          />
        </Center>
        {children}
      </Box>
    </Box>
  )
}

export default AuthLayout
