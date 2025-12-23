import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/checkout/success'], // Rahasiakan halaman admin & sukses
    },
    sitemap: 'http://localhost:3000/sitemap.xml',
  }
}