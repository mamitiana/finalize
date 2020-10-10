import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { CreateReceipeRequest } from '../../requests/CreateReceipeRequest'
import { getUserId } from '../utils'

import { createReceipe } from '../../logic/receipe'


import * as middy from 'middy'
import { cors } from 'middy/middlewares'



/*export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newreceipe: CreatereceipeRequest = JSON.parse(event.body)

  // receipe: Implement creating a new receipe item

  const userId = getUserId(event)
  const newItem = await createreceipe(userId, newreceipe)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}
*/

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try{
  const newReceipe: CreateReceipeRequest = JSON.parse(event.body)

  // Receipe: Implement creating a new Receipe item

  const userId = getUserId(event)
  const newItem = await createReceipe(userId, newReceipe)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
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