import MetaTag from '@/components/Meta'
import { Login } from '@/pages/auth/Login'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <MetaTag
        title="Login | S-Todo"
        description="Login to your S-Todo account"
      />
      <Login />
    </>
  )
}
