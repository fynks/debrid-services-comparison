import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  title: 'Debrid Services Comparison',
  description: 'Community-maintained, up-to-date comparison of leading debrid / multi-hoster services for pricing, host coverage, policies & tools.',
  ignoreDeadLinks: true,
  cleanUrls: true,
  lastUpdated: true,

  markdown: {
    lineNumbers: true
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/images/apple-touch-icon.png' }],
    ['meta', { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' }],
    ['meta', { name: 'theme-color', content: '#0b0b0c', media: '(prefers-color-scheme: dark)' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' }],
    ['meta', { name: 'author', content: 'Fynks' }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1' }],
    ['meta', { property: 'og:title', content: 'Debrid Services Comparison' }],
    ['meta', { property: 'og:description', content: 'Community-maintained, up-to-date comparison of leading debrid / multi-hoster services for pricing, host coverage, policies & tools.' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: '/images/og.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Debrid Services Comparison' }],
    ['meta', { name: 'twitter:description', content: 'Community-maintained, up-to-date comparison of leading debrid / multi-hoster services for pricing, host coverage, policies & tools.' }],
    ['meta', { name: 'twitter:image', content: '/images/og.png' }]
  ],

  themeConfig: {
    logo: {
      light: 'favicon.svg',
      dark: 'favicon.svg',
      alt: 'Debrid Services Comparison Logo'
    },
    
    search: {
      provider: 'local',
      options: {
        detailedView: true
      }
    },
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Pricing', link: '/pricing' },
      { text: 'Hosts', link: '/hosts' },
      { text: 'Adult Hosts', link: '/Adult-hosts' },
      { text: 'Policies', link: '/policies' },
      { text: 'Tools', link: '/tools' },
      {
        text: 'More',
        items: [
          { text: 'Interactive Comparison', link: 'https://debridcompare.pages.dev' },
          { text: 'GitHub', link: 'https://github.com/fynks/debrid-services-comparison' }
        ]
      }
    ],

    sidebar: {
      '/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'What are Debrid Services?', link: '/#what-are-debrid-services' },
            { text: 'Support This Project', link: '/#support-this-project' },
            { text: 'Interactive Comparison', link: 'https://debridcompare.pages.dev' }
          ]
        },
        {
          text: 'Service Comparison',
          items: [
            { text: 'Pricing Comparison', link: '/pricing' },
            { text: 'Available Hosts', link: '/hosts' },
            { text: 'Adult Hosts', link: '/Adult-hosts' },
            { text: 'Policies & Legal', link: '/policies' }
          ]
        },
        {
          text: 'Tools & Resources',
          items: [
            { text: 'Tools & Community', link: '/tools' },
            { text: 'Speed Testing', link: '/tools#speed-test' }
          ]
        },
        {
          text: 'Community',
          collapsed: true,
          items: [
            { text: 'Contributing', link: 'https://github.com/fynks/debrid-services-comparison/blob/main/CONTRIBUTING.md' },
            { text: 'Report Issues', link: 'https://github.com/fynks/debrid-services-comparison/issues' }
          ]
        }
      ],
      
      '/pricing': [
        {
          text: 'Pricing Information',
          items: [
            { text: 'Overview', link: '/pricing' },
            { text: 'Detailed Pricing Analysis', link: '/pricing#detailed-pricing-and-value-analysis' },
            { text: 'Official Pricing Pages', link: '/pricing#up-to-date-pricing' }
          ]
        }
      ],

      '/hosts': [
        {
          text: 'File Hosting Services',
          items: [
            { text: 'Complete Host List', link: '/hosts' },
            { text: 'Interactive Comparison', link: 'https://debridcompare.pages.dev' }
          ]
        }
      ],

      '/Adult-hosts': [
        {
          text: 'Adult Content Hosts',
          items: [
            { text: 'Supported Hosts', link: '/Adult-hosts' }
          ]
        }
      ],

      '/policies': [
        {
          text: 'Service Policies',
          items: [
            { text: 'Policies & Legal', link: '/policies' }
          ]
        }
      ],

      '/tools': [
        {
          text: 'Tools & Community',
          items: [
            { text: 'Recommended Tools', link: '/tools#recommended-tools' },
            { text: 'Communities', link: '/tools#communities' },
            { text: 'Speed Testing', link: '/tools#speed-test' }
          ]
        }
      ]
    },

    footer: {
      message: 'Made with ❤️ by Fynks',
      copyright: 'Copyright © 2025 Debrid Services Comparison'
    },

    outline: {
      level: [2, 3],
      label: 'On this page'
    },

    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/fynks/debrid-services-comparison' }
    ]
  }
})
