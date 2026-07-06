/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  generateRobotsTxt: false, 
  generateIndexSitemap: false,
  exclude: ['/admin/*', '/api/*', '/next/*'],
}