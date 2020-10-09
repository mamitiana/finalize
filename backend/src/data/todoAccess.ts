import 'source-map-support/register'

import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as AWSXRay from 'aws-xray-sdk'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { createLogger } from '../utils/logger'

const logger = createLogger('todosAccess')

const XAWS = AWSXRay.captureAWS(AWS)


export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todosByUserIndex = process.env.TODOS_BY_USER_INDEX,
    private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly bucketName = process.env.S3_BUCKET,
    private readonly urlExpiration = 300) {
  }

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    logger.info('Get all todos for ${userId}')

    /*const result = await this.docClient.scan({
      TableName: this.groupsTable
    }).promise()
    */

    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: this.todosByUserIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()


    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(todoItem: TodoItem) {
    logger.info(`Create todo ${todoItem.todoId}`)

    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem,
    }).promise()
  }

  async getTodo(todoId: string,userId: string): Promise<TodoItem> {
    logger.info(`Get todo ${todoId} `)

    const result = await this.docClient.get({
      TableName: this.todosTable,
      Key: {
        userId,
        todoId
      }
    }).promise()

    const item = result.Item

    return item as TodoItem
  }

  async deleteTodo(todoId: string,userId: string) {
    logger.info(`Delete todo ${todoId}`)

    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        userId,
        todoId
      }
    }).promise()    
  }

  async updateTodo(todoId: string,userId: string , todoUpdate: TodoUpdate) {
    logger.info(`Update todo ${todoId} `)

    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        userId,
        todoId
      },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
        "#name": "name"
      },
      ExpressionAttributeValues: {
        ":name": todoUpdate.name,
        ":dueDate": todoUpdate.dueDate,
        ":done": todoUpdate.done
      }
    }).promise()   
  }

  async getAttachmentUrl(attachmentId: string): Promise<string> {
      const attachmentUrl = `https://${this.bucketName}.s3.amazonaws.com/${attachmentId}`
      return attachmentUrl
  }

  async updateAttachment(todoId: string,userId: string, attachmentUrl: string) {
    logger.info(`Update attachment for ${todoId} `)

    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        userId,
        todoId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      }
    }).promise()
  }

  async getUploadUrl(attachmentId: string): Promise<string> {
    const uploadUrl = this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: attachmentId,
      Expires: this.urlExpiration
    })
    return uploadUrl
  }


}



function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
