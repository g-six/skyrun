import base64url from 'base64url'
import { getApiRequest } from './fetch-helper'
/**
 * Create a new credential for the requesting client
 * @param   {string} email of the user
 * @return  {Object} JSON encoded public key credential
 */
async function generateCredential(email: string) {
    // Retrieve random string from server
    const challenge = await getApiRequest('/auth/challenge')
}