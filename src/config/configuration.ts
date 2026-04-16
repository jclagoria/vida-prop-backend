import type { ConfigModuleOptions } from '@nestjs/config'

export default (): ConfigModuleOptions =>
  ({
    isGlobal: true,
    load: [],
    envFilePath: '.env',
    validate: (config) => {
      const requiredVars = ['PORT', 'NODE_ENV']
      const missing = requiredVars.filter((v) => !config[v])

      if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
      }

      return config
    },
  }) satisfies ConfigModuleOptions
