module.exports = {
  apps: [
    {
      name: 'Tintasberger-CSFA-Frontend',
      port: '4000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}
