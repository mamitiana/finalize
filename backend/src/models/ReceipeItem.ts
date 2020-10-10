export interface ReceipeItem {
  userId: string
  receipeId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
  description: string
}
