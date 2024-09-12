import dayjs from 'dayjs';

import TerserPlugin from 'terser-webpack-plugin';

const isDev = process.env.NODE_ENV === 'development';

export default {
  ssr: false,
  vue: {
    config: {
      productionTip: isDev,
      devtools: isDev,
    },
  },

  head: {
    title: '住宅智慧用電節能服務平台後台',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },

  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/assets/scss/all.scss',
  ],

  styleResources: {
    scss: [
      'assets/scss/global/variable.scss',
    ],
  },

  plugins: [
    '@/plugins/element-ui',
    '@/plugins/defineProperty',
  ],

  components: true,

  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
    [
      '@nuxtjs/dotenv',
      {
        filename: `.env.${process.env.BASE}`,
      },
    ],
  ],

  eslint: {
    cache: true,
  },

  modules: ['@nuxtjs/axios', '@nuxtjs/style-resources', '@nuxtjs/workbox'],

  build: {
    transpile: [/^element-ui/],

    postcss: {
      plugins: {
        'postcss-pxtorem': {
          rootValue: 16,
          propList: ['*'],
        },
      },
      preset: {
        autoprefixer: true,
      },
    },
    optimization: {
      usedExports: true,
      runtimeChunk: true,
      splitChunks: {
        chunks: 'all',
        minSize: 10000,
        maxSize: 250000,
        cacheGroups: {
          // 缓存组，将所有加载模块放在缓存里面一起分割打包
          vendors: {
            chunks: 'initial',
            // 提升权重，先抽离第三方模块，再抽离公共模块，要不然执行抽离公共模块就截止不会往下执行
            priority: 100,
            test: /[\\/]node_modules[\\/]/,
          },
          common: {
            chunks: 'all',
            priority: 10,
            // 文件最小字节
            minSize: 0,
            // 引用次数
            minChunks: 2,
            // 模块嵌套引入时，判断是否复用已经被打包的模块
            reuseExistingChunk: true,
          },
        },
      },
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: false,
          terserOptions: {
            warnings: false,
            compress: {
              // drop_console: true,
              drop_debugger: true,
            },
            output: {
              comments: false,
              beautify: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
    assetFilter(assetFilename) {
      return assetFilename.endsWith('.js');
    },
    filenames: {
      app: () => (isDev ? '[name].js' : '[contenthash:7].js'),
      chunk: () => (isDev ? '[name].js' : '[contenthash:7].js'),
      css: () => (isDev ? '[name].css' : '[contenthash:7].css'),
      img: () => (isDev ? '[path][name].[ext]' : '[contenthash:7].[ext]'),
    },
  },
  env: {
    baseUrl: process.env.BASE_URL,
    MODE: process.env.MODE,
    vueAppVersion: dayjs('2022/07/13 13:30').format('YYYYMMDDHHmm') || '<generated in compile time>',
  },
  router: {
    middleware: 'auth',
    scrollBehavior(to) {
      if (to.hash) {
        return window.scrollTo({
          top: document.querySelector(to.hash).offsetTop + window.innerHeight,
          behavior: 'smooth',
        });
      }
      return window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
};
