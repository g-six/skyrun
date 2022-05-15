/** @type {import('next').NextConfig} */
const {
  API_ENDPOINT,
  RELEASE_VERSION,
  RELEASE_BUILD,
  RELEASE_SHA,
  ENVIRONMENT_NAME,
} = process.env

const nextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  publicRuntimeConfig: {
    API_ENDPOINT,
    RELEASE_VERSION,
    RELEASE_BUILD,
    RELEASE_SHA,
    ENVIRONMENT_NAME,
  },
}

module.exports = nextConfig
