import type { MetadataRoute } from 'next';

/** Makes the dashboard installable as an app on desktop (Chrome/Edge), Android and iPhone. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/app',
    name: 'Conversa AI — Dating Assistant',
    short_name: 'Conversa AI',
    description: 'AI dating assistant: matches, openers, replies and translation in 89 languages.',
    start_url: '/app',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0f0d17',
    theme_color: '#0f0d17',
    categories: ['lifestyle', 'social'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'AI Reply Assistant', url: '/app/assistant', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
      { name: 'Conversations', url: '/app/conversations', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
    ],
    // Android: "Share" a conversation from a dating app straight into the reply assistant.
    share_target: { action: '/app/assistant', method: 'GET', params: { title: 'title', text: 'text', url: 'url' } },
  } as MetadataRoute.Manifest;
}
