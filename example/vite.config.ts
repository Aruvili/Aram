import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
    resolve: {
        alias: {
            'aram': path.resolve(__dirname, '../package/src/index.ts')
        }
    }
})
