import 'source-map-support/register'

import * as uuid from 'uuid'

import { TodoAccess } from '../data/todoAccess'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('todos')

const todoAccess = new TodoAccess()

export async function getTodo(todoId: string,userId: string): Promise<TodoItem> {

  return await todoAccess.getTodo(todoId,userId)
}

export async function getAllTodos(userId: string): Promise<TodoItem[]> {

  return await todoAccess.getAllTodos(userId)
}

export async function createTodo(userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
  const todoId = uuid.v4()

  const newItem: TodoItem = {
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: null,
    ...createTodoRequest
  }

  logger.info(`Create todo ${todoId}`)

  await todoAccess.createTodo(newItem)

  return newItem
}

export async function deleteTodo(todoId: string,userId: string,) {

  todoAccess.deleteTodo(todoId,userId)
}

export async function updateTodo(userId: string, todoId: string, updateTodoRequest: UpdateTodoRequest) {
  
  const item = await todoAccess.getTodo(todoId,userId)

  if (!item)
    throw new Error('Bad Todo')

  if (item.userId !== userId) 
    throw new Error('Bad User') 
  
  todoAccess.updateTodo(todoId, userId,updateTodoRequest as TodoUpdate)
}

export async function updateAttachment(userId: string, todoId: string, attachmentId: string) {

  const attachmentUrl = await todoAccess.getAttachmentUrl(attachmentId)

  const item = await todoAccess.getTodo(todoId,userId)
  if (!item)
    throw new Error('Bad Item') 

  if (item.userId !== userId)
    throw new Error('Bad User')
  

  await todoAccess.updateAttachment(todoId, userId,attachmentUrl)
}

export async function generateUploadUrl(attachmentId: string): Promise<string> {

  const uploadUrl = await todoAccess.getUploadUrl(attachmentId)

  return uploadUrl
}

