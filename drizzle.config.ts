import type { Config } from 'drizzle-kit';
import { config } from './src/config/index';

export default {
    schema: './src/models/*.schema.ts',
    out: './drizzle', // NOTE: Output folder (i.e. for migration files)
    dialect: 'postgresql',
    dbCredentials: {
        url: config.database.url,
    },
} satisfies Config;