import 'source-map-support/register'

import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as AWSXRay from 'aws-xray-sdk'

import { ReceipeItem } from '../models/ReceipeItem'
import { ReceipeUpdate } from '../models/ReceipeUpdate'
import { createLogger } from '../utils/logger'

const logger = createLogger('receipesAccess')

const XAWS = AWSXRay.captureAWS(AWS)


export class ReceipeAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly receipesTable = process.env.RECEIPES_TABLE,
    private readonly receipesByUserIndex = process.env.RECEIPES_BY_USER_INDEX,
    private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly bucketName = process.env.S3_BUCKET,
    private readonly urlExpiration = 300) {
  }

  async getAllReceipes(userId: string): Promise<ReceipeItem[]> {
    logger.info('Get all receipes ')

    /*const result = await this.docClient.scan({
      TableName: this.groupsTable
    }).promise()
    */

    const result = await this.docClient.query({
      TableName: this.receipesTable,
      IndexName: this.receipesByUserIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()


    const items = result.Items
    return items as ReceipeItem[]
  }


  async getAllReceipesAll(): Promise<ReceipeItem[]> {
    logger.info('Get all receipes ')

    /*const result = await this.docClient.scan({
      TableName: this.groupsTable
    }).promise()
    */

    const result = await this.docClient.query({
      TableName: this.receipesTable,
      IndexName: this.receipesByUserIndex
    }).promise()


    const items = result.Items
    return items as ReceipeItem[]
  }

  async createReceipe(receipeItem: ReceipeItem) {
    logger.info(`Create receipe `)

    await this.docClient.put({
      TableName: this.receipesTable,
      Item: receipeItem,
    }).promise()
  }

  async getReceipe(receipeId: string,userId: string): Promise<ReceipeItem> {
    logger.info(`Get receipe `)

    const result = await this.docClient.get({
      TableName: this.receipesTable,
      Key: {
        userId,
        receipeId
      }
    }).promise()

    const item = result.Item

    return item as ReceipeItem
  }

  async deleteReceipe(receipeId: string,userId: string) {
    logger.info(`Delete receipe `)

    await this.docClient.delete({
      TableName: this.receipesTable,
      Key: {
        userId,
        receipeId
      }
    }).promise()    
  }

  async updateReceipe(receipeId: string,userId: string , receipeUpdate: ReceipeUpdate) {
    logger.info(`Update receipe `)

    await this.docClient.update({
      TableName: this.receipesTable,
      Key: {
        userId,
        receipeId
      },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done', // desciption = :desciption
      ExpressionAttributeNames: {
        "#name": "name"
      },
      ExpressionAttributeValues: {
        ":name": receipeUpdate.name,
        ":dueDate": receipeUpdate.dueDate,
        ":done": receipeUpdate.done,
        ":desciption": "" //receipeUpdate.description
      }
    }).promise()   
  }

  async getAttachmentUrl(attachmentId: string): Promise<string> {
      const attachmentUrl = `https://${this.bucketName}.s3.amazonaws.com/${attachmentId}`
      return attachmentUrl
  }

  async updateAttachment(receipeId: string,userId: string, attachmentUrl: string) {
    logger.info(`Update attachment `)

    await this.docClient.update({
      TableName: this.receipesTable,
      Key: {
        userId,
        receipeId
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
