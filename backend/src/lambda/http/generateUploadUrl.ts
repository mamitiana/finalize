import 'source-map-support/register'

import * as uuid from 'uuid'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { generateUploadUrl, updateAttachment } from '../../logic/receipe'
import { getUserId } from '../utils'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

export const handler= middy( async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try{
  const receipeId = event.pathParameters.receipeId

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  
  const attachmentId = uuid.v4()
  const uploadUrl = await generateUploadUrl(attachmentId)
  const userId = getUserId(event)

  await updateAttachment(userId, receipeId, attachmentId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl
    })
  }
  }catch(_e){
    let er:Error= _e;
    const resultes = "error update attach  "+er.message;
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        resultes
      })
    }
  }
}
)

handler.use(
  cors({
    credentials: true
  })
)