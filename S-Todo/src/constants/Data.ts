export interface IUser {
  userId: string
  email?: string
  fullName?: string
  role?: number
  createdAt?: Date
  updatedAt?: Date
  avatarUrl?: string
}

export enum ETodoPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum ETodoStatus {
  NEW = 'NEW',
  DOING = 'DOING',
  DONE = 'DONE',
}

export interface IManageTodo {
  id: number
  title: string
  description: string
  status: ETodoStatus
  priority: ETodoPriority
  endDate: string
  order: number
  type: string
}

export interface IManageTodoData {
  manageTodoData: Record<string, IManageTodo>
}
