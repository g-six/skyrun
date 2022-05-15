jest.mock('next/config', () => () => ({
    publicRuntimeConfig: {
        API_ENDPOINT: 'https://dev-armada.50stacksofgrey.com',
        RELEASE_VERSION: 0,
        RELEASE_BUILD: 'X',
        RELEASE_SHA: 'abcxyz',
        ENVIRONMENT_NAME: 'test',
    }
  }))
  