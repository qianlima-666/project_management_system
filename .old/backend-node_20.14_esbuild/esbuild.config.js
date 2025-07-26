const esbuild = require('esbuild');
const { copy } = require('esbuild-plugin-copy');

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  outfile: 'dist/index.js',
  plugins: [
    copy({
      assets: [{
        from: './node_modules/.prisma/client/*',
        to: './dist'
      }]
    })
  ]
}).catch(() => process.exit(1));