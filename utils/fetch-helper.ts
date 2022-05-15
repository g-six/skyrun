import { useCallback, useEffect, useState } from 'react'
import getConfig from 'next/config'
import { FetchMethods } from 'data-types/fetch-methods'
import { getSessionTokens } from './session'

export interface RequestPayload {
  method: FetchMethods
  mode: 'cors'
  headers: Record<string, string>
}

export interface GetPayload extends RequestPayload {
  query?: string
}
export interface PostPayload extends RequestPayload {
  body?: string
}
export interface GenericPayload extends RequestPayload {
  body?: string
  query?: string
}

export function fetchPath(path: string) {
  const { API_ENDPOINT } = getConfig().publicRuntimeConfig
  let append = ''
  if (path.split('/').length <= 2 && path.indexOf('?') === -1) {
    append = '/'
  }
  return (API_ENDPOINT || '/api') + path + append
}

function getAuthHeaderToken() {
  if (typeof window !== 'undefined') {
    const raw_data = getSessionTokens()
    const tokens = JSON.parse(raw_data)

    if (tokens && tokens?.token && tokens?.refresh_token) {
      return {
        Authorization: `Bearer ${tokens.token}`,
        refresh_token: tokens.refresh_token,
      }
    }
  }
  return ''
}

export function buildRequestHeaders(
  headers = {}
): Record<string, string> {
  let request_headers: Record<string, string> = {
    ...headers,
    'Content-Type': 'application/json',
  }
  const Authorization = getAuthHeaderToken()
  if (Authorization)
    request_headers = {
      ...request_headers,
      ...Authorization,
    }

  return request_headers
}

export async function getApiRequest(
  path: string,
  headers: Record<string, string> = {}
) {
  const req_init: GetPayload = {
    method: FetchMethods.GET,
    mode: 'cors',
    headers: buildRequestHeaders(headers),
  }

  try {
    const response = await fetch(fetchPath(path), req_init)

    if (response.ok === false && response.status === 401) {
      return { type: 'SessionExpired' }
    }
    if (response.status > 400) {
      return { type: 'NotPermitted' }
    }

    try {
      return await response.json()
    } catch (e) {
      return { error: 'API error' }
    }
  } catch (e) {
    console.error('doFetch:', (e as unknown as Error).message)
  }
}

export async function postApiRequest(
  path: string,
  body: unknown = {},
  headers: Record<string, string> = {}
) {
  const req_init: PostPayload = {
    body: JSON.stringify(body),
    method: FetchMethods.POST,
    mode: 'cors',
    headers: buildRequestHeaders(headers),
  }

  try {
    const response = await fetch(fetchPath(path), req_init)

    try {
      const results = await response.json()
      results.status = response.status
      results.ok = response.ok

      return results
    } catch (e) {
      return { error: 'API error' }
    }
  } catch (e) {
    console.error('doFetch:', (e as unknown as Error).message)
  }
}

export async function putApiRequest(
  path: string,
  body: unknown = {},
  headers: Record<string, string> = {}
) {
  const req_init: PostPayload = {
    body: JSON.stringify(body),
    method: FetchMethods.PUT,
    mode: 'cors',
    headers: buildRequestHeaders(headers),
  }

  try {
    const response = await fetch(fetchPath(path), req_init)
    if (response.ok === false && response.status === 401) {
      return { type: 'SessionExpired' }
    }
    if (response.status > 400) {
      return { type: 'NotPermitted' }
    }

    try {
      const results = await response.json()
      results.status = response.status
      results.ok = response.ok
      return results
    } catch (e) {
      return { error: 'API error' }
    }
  } catch (e) {
    console.error('doFetch:', (e as unknown as Error).message)
  }
}

export async function patchApiRequest(
  path: string,
  body: unknown = {},
  headers: Record<string, string> = {}
) {
  const req_init: PostPayload = {
    body: JSON.stringify(body),
    method: FetchMethods.PATCH,
    mode: 'cors',
    headers: buildRequestHeaders(headers),
  }

  try {
    const response = await fetch(fetchPath(path), req_init)
    if (response.ok === false && response.status === 401) {
      return { type: 'SessionExpired' }
    }
    if (response.status > 400) {
      return { type: 'NotPermitted' }
    }

    try {
      const results = await response.json()
      results.status = response.status
      results.ok = response.ok
      return results
    } catch (e) {
      return { error: 'API error' }
    }
  } catch (e) {
    console.error('doFetch:', (e as unknown as Error).message)
  }
}

export async function deleteApiRequest(
  path: string,
  body?: unknown,
  headers?: Record<string, string>
) {
  const req_init: GenericPayload = {
    method: FetchMethods.DELETE,
    mode: 'cors',
    headers: buildRequestHeaders(headers),
  }

  if (body) {
    req_init.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(fetchPath(path), req_init)
    if (response.ok === false && response.status === 401) {
      return { type: 'SessionExpired' }
    }
    if (response.status > 400) {
      return { type: 'NotPermitted' }
    }

    const ok = response.ok as boolean
    const status = response.status as number
    try {
      return {
        ...(await response.json()),
        ok,
        status,
      }
    } catch (e) {
      return { error: 'API response parsing error', e, ok }
    }
  } catch (e) {
    console.error('doFetch:', (e as unknown as Error).message)
  }
}

export function useFetch<Body = any, Result = any>(
  path: string,
  method: FetchMethods = FetchMethods.GET,
  fetch_on_mount: boolean = true,
  expects_json: boolean = true
) {
  const [is_loading, setLoading] = useState(fetch_on_mount)
  const [data, setData] = useState<Result>({} as Result)
  const [status, setStatus] = useState(0)

  const doFetch = useCallback(
    async (body?: Body, query: string = '') => {
      const req_init: GenericPayload = {
        method,
        mode: 'cors',
        headers: buildRequestHeaders(),
      }
      if (body) {
        req_init.body = JSON.stringify(body)
      }

      setLoading(true)

      try {
        const response = await fetch(fetchPath(path) + query, req_init)

        if (expects_json) {
          try {
            setData((await response.json()) as Result)
          } catch (e) {
            setData({ error: 'API error' } as unknown as Result)
          }
        }

        setLoading(false)
        setStatus(response.status)
        return response
      } catch (e) {
        console.error('doFetch:', (e as unknown as Error).message)
      }
    },
    [method, path, expects_json]
  )

  useEffect(() => {
    fetch_on_mount && doFetch()
  }, [doFetch, fetch_on_mount])

  return {
    is_loading,
    data,
    status,
    doFetch,
    setData,
  }
}
