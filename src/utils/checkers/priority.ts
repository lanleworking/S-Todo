import { ETodoPriority, ETodoStatus } from '@/constants/Data'

export const switchPriorityColor = (priority: string) => {
  if (!priority) return 'gray'
  const value = priority.toUpperCase()
  switch (value) {
    case ETodoPriority.HIGH:
      return 'red'
    case ETodoPriority.MEDIUM:
      return 'yellow'
    case ETodoPriority.LOW:
      return 'green'
    default:
      return 'gray'
  }
}

export const switchStatusColor = (status: string) => {
  if (!status) return 'gray'
  const value = status.toUpperCase()
  switch (value) {
    case ETodoStatus.NEW:
      return 'gray'
    case ETodoStatus.DOING:
      return 'orange'
    case ETodoStatus.DONE:
      return 'green'
    default:
      return 'gray'
  }
}
