import { Flex, Image } from '@mantine/core'
import clsx from 'clsx'
import styles from './FullScreen.module.scss'

function FullScreenLoader() {
  return (
    <Flex
      h={'100vh'}
      display={'flex'}
      justify={'center'}
      align={'center'}
      style={{
        backgroundColor: 'white',
        overflow: 'hidden',
      }}
    >
      <Image
        className={clsx(styles.loaderImage)}
        src={'/App_Logo.png'}
        alt="Loading..."
      />
    </Flex>
  )
}

export default FullScreenLoader
