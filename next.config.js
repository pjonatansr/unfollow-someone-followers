/** @type {import('next').NextConfig} */
const webpack = require('webpack')

const { parsed: env } = require('dotenv').config({
})

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(env))
    return config
  }
}

module.exports = nextConfig
