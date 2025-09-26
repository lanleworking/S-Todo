import MetaTag from '@/components/Meta'
import { ResetPassword } from '@/pages/auth/ResetPassword'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/reset-password')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <MetaTag
        title="Reset Password | S-Todo"
        description="Reset your S-Todo account password"
      />
      <ResetPassword />
    </>
  )
}
