import MetaTag from '@/components/Meta'
import { Register } from '@/pages/auth/Register'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <MetaTag
        title="Register | S-Todo"
        description="Create a new account for S-Todo"
      />
      <Register />
    </>
  )
}
