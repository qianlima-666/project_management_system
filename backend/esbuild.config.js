/**
 * esbuild 构建配置
 * 
 * 定义项目的打包和构建规则
 * 配置 TypeScript 编译、依赖打包、文件复制等
 * 用于生产环境的代码构建和部署
 */
const esbuild = require('esbuild');
const { copy } = require('esbuild-plugin-copy');

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  outdir: 'dist',
  plugins: [
    copy({
      assets: [{
        from: './node_modules/.prisma/client/*',
        to: './.prisma/client',
      },
      {
        from: './prisma/*',
        to: './prisma/',
      }
    ]
    })
  ]
}).catch(() => process.exit(1));