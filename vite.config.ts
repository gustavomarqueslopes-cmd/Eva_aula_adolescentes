import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],base: process.env.GITHUB_PAGES==='true'?'/Eva_aula_adolescentes/':'/'});
