export default defineNuxtConfig({
  devtools: { enabled: true },

  ssr: false,

  app: {
    head: {
      titleTemplate: (titleChunk) => {
        return titleChunk
          ? `${titleChunk} | Legendart Crafts & Design`
          : "LegendArt Crafts & Design";
      },
    },
  },

  buildModules: ["@nuxtjs/dotenv"],

  css: ["@/assets/scss/index.scss", "@/assets/css/tailwind.css"],

  supabase: {
    redirect: false,
    url:
      process.env.NUXT_SUPABASE_URL ||
      "https://jmqaeeeahxkidxxkbtnj.supabase.co",
    key: process.env.NUXT_SUPABASE_ANON_KEY,
    serviceKey: process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY,
  },

  runtimeConfig: {
    public: {
      APP_URL: process.env.APP_URL,
      supabaseUrl:
        process.env.NUXT_SUPABASE_URL ||
        "https://jmqaeeeahxkidxxkbtnj.supabase.co",
      supabaseAnonKey: process.env.NUXT_SUPABASE_ANON_KEY,
      supabaseServiceRoleKey: process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY,
      port: process.env.NUXT_PORT,
      mapsApiKey: process.env.NUXT_PUBLIC_MAPS_API_KEY,
      analyticsId: process.env.NUXT_GOOGLE_ANALYTICS_ID,
    },
  },

  modules: [
    "@nuxt/ui",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
    "@nuxtjs/supabase",
    "nuxt-rating"
  ],

  compatibilityDate: "2025-03-08",
});
