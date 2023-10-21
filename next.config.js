/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})
const getGitCommitInfo = require('./utils/getGitCommitInfo')

module.exports = async () => {
  const nextConfig = getGitCommitInfo(
    withPWA({
      experimental: {
        newNextLinkBehavior: true,
      },
      i18n,
      reactStrictMode: true,
      swcMinify: true,
      output: 'standalone',
    })
  )
  return nextConfig
}
