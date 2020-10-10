import 'source-map-support/register'

import * as uuid from 'uuid'

import { ReceipeAccess } from '../data/receipeAccess'
import { ReceipeItem } from '../models/ReceipeItem'
import { ReceipeUpdate } from '../models/ReceipeUpdate'
import { CreateReceipeRequest } from '../requests/CreateReceipeRequest'
import { UpdateReceipeRequest } from '../requests/UpdateReceipeRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('receipes')

const receipeAccess = new ReceipeAccess()

export async function getReceipe(receipeId: string,userId: string): Promise<ReceipeItem> {

  return await receipeAccess.getReceipe(receipeId,userId)
}

export async function getAllReceipes(userId: string): Promise<ReceipeItem[]> {

  return await receipeAccess.getAllReceipes(userId)
}

export async function getAllReceipesAll(): Promise<ReceipeItem[]> {

  return await receipeAccess.getAllReceipesAll()
}

export async function createReceipe(userId: string, createReceipeRequest: CreateReceipeRequest): Promise<ReceipeItem> {
  const receipeId = uuid.v4()

  const newItem: ReceipeItem = {
    userId,
    receipeId,
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: null,
    ...createReceipeRequest
  }

  logger.info(`Create receipe`)

  await receipeAccess.createReceipe(newItem)

  return newItem
}

export async function deleteReceipe(receipeId: string,userId: string,) {

  receipeAccess.deleteReceipe(receipeId,userId)
}

export async function updateReceipe(userId: string, receipeId: string, updateReceipeRequest: UpdateReceipeRequest) {
  
  const item = await receipeAccess.getReceipe(receipeId,userId)

  if (!item)
    throw new Error('Bad receipe')

  if (item.userId !== userId) 
    throw new Error('Bad User') 
  
  receipeAccess.updateReceipe(receipeId, userId,updateReceipeRequest as ReceipeUpdate)
}

export async function updateAttachment(userId: string, receipeId: string, attachmentId: string) {

  const attachmentUrl = await receipeAccess.getAttachmentUrl(attachmentId)

  const item = await receipeAccess.getReceipe(receipeId,userId)
  if (!item)
    throw new Error('Bad Item') 

  if (item.userId !== userId)
    throw new Error('Bad User')
  

  await receipeAccess.updateAttachment(receipeId, userId,attachmentUrl)
}

export async function generateUploadUrl(attachmentId: string): Promise<string> {

  const uploadUrl = await receipeAccess.getUploadUrl(attachmentId)

  return uploadUrl
}

