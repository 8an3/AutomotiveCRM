import { useMatches } from '@remix-run/react'

export const useEnv = () => {
  const matches = useMatches()
  const { ENV } = (matches.find((route) => {
    return route.id === 'root'
  })?.data || {})
  return ENV || {}
}

/**
 *     cloudinary.config({
      cloud_name: 'dtsisjrm8',
      api_key: '235619112513633',
      api_secret: 'lQn9Vh8V4ncOL8xwB14oJqUdTB0'
    });
 */
