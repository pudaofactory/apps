import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  manifest_version: 3,
  name: 'ClipWedge – AI Cut Finder',
  version: '0.0.1',
  action: {
    default_popup: 'index.html'
  },
  permissions: ['tabs'],
  host_permissions: ['https://www.youtube.com/*'],
  content_scripts: [
    {
      matches: ['https://www.youtube.com/*'],
      js: ['src/content.ts'],
      run_at: 'document_idle'
    }
  ]
})
