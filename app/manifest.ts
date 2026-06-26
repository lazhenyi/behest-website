import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'behest',
    short_name: 'behest',
    description: 'Rust-native building blocks for production AI agent runtimes',
    start_url: '/en',
    display: 'standalone',
    background_color: '#0A0A0A',
    theme_color: '#7C3AED',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
