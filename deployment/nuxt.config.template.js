module.exports = {
  mode: 'universal',
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Apps Riskobs',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css', integrity: "sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T", crossorigin: "anonymous"},
      { rel: 'stylesheet', href: 'https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css'},
      { rel: 'stylesheet', href: 'https://unpkg.com/vue-select@3.10.7/dist/vue-select.css'}
    ],
    script: [
      { src: "https://code.jquery.com/jquery-3.3.1.min.js" },
      { src: "https://code.jquery.com/ui/1.12.1/jquery-ui.js" },
      { src: "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" },
      { src: "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" },
      { src: "https://cdnjs.cloudflare.com/ajax/libs/jquery.nicescroll/3.7.6/jquery.nicescroll.min.js" },
      { src: "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js" },
      { src: "/js/stisla.js" },
      { src: "/js/all.js" }
    ]
  },
  env: {
    SSO_API: "{{SSO_API}}",
    SSO_DOMAIN: "{{SSO_DOMAIN}}",
    SSO_APP_CLIENT_ID: "{{SSO_APP_CLIENT_ID}}",
    COPYRIGHT_COMPANY: "{{COPYRIGHT_COMPANY}}",
    DOMAIN_ORIGIN: "{{DOMAIN_ORIGIN}}",
    POOL_REGION: "{{POOL_REGION}}",
    ACCESS_KEY: "{{SERVERLESS_ACCESS_KEY}}",
    SECRET_KEY: "{{SERVERLESS_SECRET_KEY}}",
    COGNITO_USER_POOL_ID: "{{COGNITO_USER_POOL_ID}}",
    COGNITO_CLIENT_ID: "{{COGNITO_CLIENT_ID}}",
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/all.css',
    '@/assets/css/style.css',
    '@/assets/css/custom.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src:'@/plugins/vue-select', ssr: false },
    { src:'@/plugins/vue-advanced-cropper', ssr: false },
    { src:'@/plugins/file-saver', ssr: false },
    { src:'@/plugins/cognito', ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    'cookie-universal-nuxt',
    'bootstrap-vue/nuxt',
    '@nuxtjs/dotenv',
    '@nuxtjs/axios'
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },
  
  server: {
    port: 8001
  }
}
