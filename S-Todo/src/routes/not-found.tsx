import NotFound from '@/pages/not-found'
import Box from '@mui/material/Box'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/not-found')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Box
      height={'100vh'}
      overflow={'hidden'}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <NotFound />
    </Box>
  )
}
