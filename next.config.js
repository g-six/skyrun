/** @type {import('next').NextConfig} */
const {
  API_ENDPOINT,
  RELEASE_VERSION,
  RELEASE_BUILD,
  RELEASE_SHA,
  RELEASE_DESC,
} = process.env

const nextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  publicRuntimeConfig: {
    API_ENDPOINT,
    RELEASE_VERSION,
    RELEASE_BUILD,
    RELEASE_SHA,
    RELEASE_DESC,
  },
}

module.exports = nextConfig
