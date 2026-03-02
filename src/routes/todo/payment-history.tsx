import MetaTag from '@/components/Meta'
import PaymentHistoryPage from '@/pages/todo/payment-history/PaymentHistoryPage'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/todo/payment-history')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  return (
    <>
      <MetaTag
        title={t('label.paymentHistory.title')}
        description={t('label.paymentHistory.title')}
      />
      <PaymentHistoryPage />
    </>
  )
}
