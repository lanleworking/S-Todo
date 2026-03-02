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

export interface ITodo {
  id: number
  shortDescription: string
  title: string
  description: string
  status: ETodoStatus
  priority: ETodoPriority
  type: string
  endDate: string
  shared: boolean
  notify: boolean
  createdBy: string
  createdAt: string
}

export interface ITodoList
  extends Omit<ITodo, 'createdAt'>,
    Omit<IUser, 'createdAt'> {
  createdAt: string
  totalParticipants: number
}

export interface ITodoData extends ITodo {
  users?: ITodoItemUser[]
  updatedAt?: string
  startDate?: string
  expectedAmount?: number
  paymentLogs: IPaymentLogData[]
  totalAmount: number
}

export interface ITodoItemUser {
  userId: string
  fullName?: string
  email?: string
  avatarUrl?: string
}

export interface ISelectOption {
  label: string
  value: string
}

export interface IPaymentLogData {
  id: number
  todoId: number
  paymentLinkId: string
  amount: number
  status: string
  note: string | null
  qrCode: string | null
  createdBy: string
  createdAt: string | null
  updatedAt: string | null
  fullName: string | null
  userId: string
  avatarUrl: string | null
}

export interface ITodoPaymentPayload {
  todoId: number
  limit: number
  page: number
}

export interface ITodoPaymentResponse {
  data: IPaymentLogData[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPage: number
  }
}

export interface IChartData {
  status: string
  amount: number
}

export interface IPaymentHistoryItem {
  id: number
  todoId: number
  todoTitle: string | null
  paymentLinkId: string
  amount: number
  status: string
  note: string | null
  qrCode: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface IPaymentHistoryResponse {
  data: IPaymentHistoryItem[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPage: number
  }
}
