export default function sitemap() {
  const baseUrl = 'https://pranora-health-quv2.vercel.app'
  const routes = ['', '/about', '/blog', '/products', '/community', '/contact']
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }))
}
