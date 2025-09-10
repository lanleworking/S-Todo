import { Image } from '@mantine/core'
import Box from '@mui/material/Box'
import clsx from 'clsx'
import styles from './FullScreen.module.scss'

function FullScreenLoader() {
  return (
    <Box
      height={'100vh'}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      overflow={'hidden'}
      bgcolor={'white'}
    >
      <Image
        className={clsx(styles.loaderImage)}
        src={'/App_Logo.png'}
        alt="Loading..."
      />
    </Box>
  )
}

export default FullScreenLoader
