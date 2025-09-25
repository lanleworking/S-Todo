import { Image, Switch } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { EAppLanguage } from '@/constants/App'
import VNIcon from '@/assets/icons/vn_icon.webp'
import USAIcon from '@/assets/icons/usa_icon.webp'

function LangSwitch({ size }: { size?: 'sm' | 'md' | 'lg' }) {
  const { i18n } = useTranslation()
  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
  }
  return (
    <Switch
      size={size || 'lg'}
      defaultChecked={i18n.language === EAppLanguage.VI}
      onLabel={<Image w={20} src={VNIcon} />}
      offLabel={<Image w={20} src={USAIcon} />}
      onChange={(e) =>
        handleChangeLanguage(
          e.currentTarget.checked ? EAppLanguage.VI : EAppLanguage.EN,
        )
      }
    />
  )
}

export default LangSwitch
