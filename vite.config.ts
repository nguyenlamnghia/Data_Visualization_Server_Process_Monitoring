import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

declare const process: {
  env: {
    BASE_PATH?: string;
    GITHUB_REPOSITORY?: string;
  };
};

function githubPagesBase(): string {
  const repository = process.env.GITHUB_REPOSITORY?.split('/').at(1);
  if (!repository || repository.endsWith('.github.io')) {
    return '/';
  }

  return `/${repository}/`;
}

export default defineConfig({
  base: process.env.BASE_PATH ?? githubPagesBase(),
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/testSetup.ts',
  },
});
