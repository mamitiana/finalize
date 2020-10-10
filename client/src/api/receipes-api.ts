import { apiEndpoint } from '../config'
import { Receipe } from '../types/Receipe';
import { CreateReceipeRequest } from '../types/CreateReceipeRequest';
import Axios from 'axios'
import { UpdateReceipeRequest } from '../types/UpdateReceipeRequest';

export async function getReceipes(idToken: string): Promise<Receipe[]> {
  console.log('Fetching Receipes')

  const response = await Axios.get(`${apiEndpoint}/receipes`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Receipes:', response.data)
  return response.data.items
}

export async function getReceipesAll(idToken: string): Promise<Receipe[]> {
  console.log('Fetching all Receipes')

  const response = await Axios.get(`${apiEndpoint}/receipesall`, {
    headers: {
      'Content-Type': 'application/json'
    },
  })
  console.log('Receipes:', response.data)
  return response.data.items
}

export async function createReceipe(
  idToken: string,
  newReceipe: CreateReceipeRequest
): Promise<Receipe> {
  const response = await Axios.post(`${apiEndpoint}/receipes`,  JSON.stringify(newReceipe), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchReceipe(
  idToken: string,
  receipeId: string,
  updatedReceipe: UpdateReceipeRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/receipes/${receipeId}`, JSON.stringify(updatedReceipe), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteReceipe(
  idToken: string,
  receipeId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/receipes/${receipeId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  receipeId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/receipes/${receipeId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
