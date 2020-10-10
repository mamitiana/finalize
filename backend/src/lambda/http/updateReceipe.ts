import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateReceipeRequest } from '../../requests/UpdateReceipeRequest'

import { updateReceipe } from '../../logic/receipe'

import { getUserId } from '../utils'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

export const handler= middy(  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try{
  const receipeId = event.pathParameters.receipeId
  const updatedReceipe: UpdateReceipeRequest = JSON.parse(event.body)

  // Receipe: Update a Receipe item with the provided id using values in the "updatedReceipe" object

  const userId = getUserId(event)
  await updateReceipe(userId, receipeId, updatedReceipe)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ''
  }	
  }catch(_e){
    let er:Error= _e;
    const resultes = er.message;
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