import { createTheme, MantineProvider } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { MOBILE_MEDIAQUERY } from '@/constants/MediaQuery'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'

function AppMantimeProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery(MOBILE_MEDIAQUERY)
  const inputDefaultProps = {
    size: isMobile ? 'md' : 'sm',
  }
  const colors = {
    'snow-light': [
      '#E0F7FD', // 50 - very light
      '#B8EBF7', // 100
      '#8EDFF1', // 200
      '#66D3EB', // 300
      '#56C6E2', // 400
      '#49B8D8', // 500 - base
      '#3EA6C4', // 600
      '#3493AF', // 700
      '#2A7F99', // 800
      '#206B82', // 900 - darkest
    ] as const,
  }
  const theme = createTheme({
    fontFamily: 'SourceCodePro, monospace',
    colors: colors,
    primaryColor: 'snow-light',
    components: {
      Input: {
        defaultProps: inputDefaultProps,
      },
      TextInput: {
        defaultProps: inputDefaultProps,
      },
    },
  })

  return <MantineProvider theme={theme}>{children}</MantineProvider>
}

export default AppMantimeProvider
