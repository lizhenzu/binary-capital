// @ts-check
import { defineConfig } from 'astro/config';
import remarkGfm from 'remark-gfm';

// 정적 사이트. Cloudflare Pages가 site/ 폴더에서 `npm run build` 후 dist/를 배포한다.
export default defineConfig({
  output: 'static',
  trailingSlash: 'ignore',
  markdown: {
    syntaxHighlight: false,
    // 리포트는 "5,498~5,838"처럼 물결표(~)로 범위를 쓴다. 한 개짜리 ~가 취소선이 되지 않게 한다.
    gfm: false,
    remarkPlugins: [[remarkGfm, { singleTilde: false }]],
  },
});
