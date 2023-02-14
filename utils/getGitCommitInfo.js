/* eslint-disable @typescript-eslint/no-var-requires */
const cp = require('node:child_process')

module.exports = async (nextConfig) => {
  const nextEnv = {
    NEXT_PUBLIC_GIT_LASTCOMMIT_DATE: '',
    NEXT_PUBLIC_GIT_LASTCOMMIT_SHORTHASH: '',
  }
  try {
    nextEnv.NEXT_PUBLIC_GIT_LASTCOMMIT_DATE = cp
      .execSync('git --no-pager log -1 --format="%ai"')
      .toString()
      .trim()
    nextEnv.NEXT_PUBLIC_GIT_LASTCOMMIT_SHORTHASH = cp
      .execSync('git rev-parse --short HEAD')
      .toString()
      .trim()
  } catch {
    console.error(`[GetGitCommitInfo] fail!`)
  }
  return Object.assign(nextConfig, { env: nextEnv })
}
