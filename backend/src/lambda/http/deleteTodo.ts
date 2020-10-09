import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import { getUserId } from '../utils'
import { deleteTodo } from '../../logic/todo'
import { getTodo } from '../../logic/todo'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'


/*export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  // TODO: Remove a TODO item by id
  const userId = getUserId(event)

  const item = await getTodo(todoId)

  if (!item){
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: 'Bad Item'
    }
  }
    

  if (item.userId !== userId){
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: 'Bad USer'
    }
  }
  
  await deleteTodo(todoId)

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
 
}*/

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  try{
  const todoId = event.pathParameters.todoId

  // TODO: Remove a TODO item by id
  const userId = getUserId(event)
  if(!userId){
    return {
      statusCode: 403,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: 'Bad User Authentication'
    }
  }

  const item = await getTodo(todoId,userId)

  if (!item){
    return {
      statusCode: 403,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: 'Bad Item'
    }
  }
    

  if (item.userId !== userId){
    return {
      statusCode: 403,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: 'Bad USer'
    }
  }
  
  await deleteTodo(todoId,userId)

  return {
    statusCode: 204,
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


