export default function maskEmail(email: string) {
  if (!email) {
    return email
  }
  const a = email.split('@')
  const b = a[0].split('')
  const c = b[0] + '****'
  return c + '@' + '****' + a[1][a[1].length - 1]
}
