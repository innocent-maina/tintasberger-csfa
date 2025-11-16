export default defineNuxtConfig({
  devtools: { enabled: true },

  ssr: false,

  app: {
    head: {
      titleTemplate: (titleChunk) => {
        return titleChunk ? `${titleChunk} | Robbialac` : "Robbialac";
      },
    },
  },

  buildModules: ["@nuxtjs/dotenv"],

  css: ["@/assets/scss/index.scss", "@/assets/css/tailwind.css"],

  supabase: {
    redirect: false,
    url: process.env.NUXT_SUPABASE_URL,
    key: process.env.NUXT_SUPABASE_ANON_KEY,
    serviceKey: process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY,
  },

  runtimeConfig: {
    supabaseServiceRoleKey: process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY,
    supabaseUrl: process.env.NUXT_SUPABASE_URL,

    public: {
      supabaseUrl: process.env.NUXT_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_SUPABASE_ANON_KEY,
    },
  },

  modules: [
    "@nuxt/ui",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
    "@nuxtjs/supabase",
    "nuxt-rating",
  ],

  compatibilityDate: "2025-03-08",
});
