import STodoLogo from '@/assets/logos/Web_Logo.png'
import VNIcon from '@/assets/icons/vn_icon.webp'
import USAIcon from '@/assets/icons/usa_icon.webp'
import MuiBox from '@mui/material/Box'
import { EAppLanguage } from '@/constants/App'
import { useTranslation } from 'react-i18next'
import { Image, Switch, Box } from '@mantine/core'
import styles from './AuthLayout.module.scss'
import clsx from 'clsx'

function AuthLayout({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation()

  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
  }
  return (
    <Box className={clsx(styles.authLayout)}>
      <MuiBox minWidth={380} px={4}>
        <MuiBox display={'flex'} justifyContent={'flex-end'}>
          <Switch
            size="lg"
            defaultChecked={i18n.language === EAppLanguage.VI}
            onLabel={<Image w={20} src={VNIcon} />}
            offLabel={<Image w={20} src={USAIcon} />}
            onChange={(e) =>
              handleChangeLanguage(
                e.currentTarget.checked ? EAppLanguage.VI : EAppLanguage.EN,
              )
            }
          />
        </MuiBox>
        <MuiBox textAlign={'center'} mb={'20px'}>
          <Box
            component={'img'}
            src={STodoLogo}
            alt="S-Todo Logo"
            width={200}
          />
        </MuiBox>
        {children}
      </MuiBox>
    </Box>
  )
}

export default AuthLayout
