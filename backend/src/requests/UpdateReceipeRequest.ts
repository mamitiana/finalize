/**
 * Fields in a request to update a single item.
 */
export interface UpdateReceipeRequest {
  name: string
  dueDate: string
  done: boolean
  description: string
}