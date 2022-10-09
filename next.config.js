/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')
const withPWA = require('next-pwa')({
  dest: 'public',
})
const nextConfig = withPWA({
  i18n,
  reactStrictMode: true,
  swcMinify: true,
})

module.exports = nextConfig
