/** @type {import('next').NextConfig} */
const {
  API_ENDPOINT,
  BITBUCKET_DEPLOYMENT_ENVIRONMENT,
  CHARGEBEE_API_KEY,
  CHARGEBEE_PLAN_A,
  CHARGEBEE_PLAN_B,
  CHARGEBEE_SITE,
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
    BITBUCKET_DEPLOYMENT_ENVIRONMENT,
    CHARGEBEE_API_KEY,
    CHARGEBEE_PLAN_A,
    CHARGEBEE_PLAN_B,
    CHARGEBEE_SITE,
    RELEASE_VERSION,
    RELEASE_BUILD,
    RELEASE_SHA,
    RELEASE_DESC,
  },
}

module.exports = nextConfig
