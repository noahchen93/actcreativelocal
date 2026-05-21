
  import { defineConfig, loadEnv, type Plugin } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import fs from 'node:fs/promises';
  import path from 'path';

  const escapeHtmlAttribute = (value: string) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const googleSiteVerificationPlugin = (token?: string): Plugin => ({
    name: 'google-site-verification',
    transformIndexHtml(html) {
      const marker = '<!-- GOOGLE_SITE_VERIFICATION -->';

      if (!token) {
        return html.replace(marker, '');
      }

      return html.replace(
        marker,
        `<meta name="google-site-verification" content="${escapeHtmlAttribute(token)}" />`
      );
    },
  });

  const getGoogleSiteVerificationToken = (mode: string) => {
    const env = loadEnv(mode, process.cwd(), '');
    return env.GOOGLE_SITE_VERIFICATION || env.VITE_GOOGLE_SITE_VERIFICATION;
  };

  const localizedHomepagePlugin = (): Plugin => ({
    name: 'localized-homepage',
    async closeBundle() {
      const outDir = path.resolve(__dirname, 'build');
      const indexPath = path.join(outDir, 'index.html');
      const zhDir = path.join(outDir, 'zh');
      const zhIndexPath = path.join(zhDir, 'index.html');
      const zhTitle = '及物创意 ACT Creative | 新加坡跨境活动制作与中国生产支持伙伴';
      const zhDescription =
        '及物创意 ACT Creative 为活动机构、品牌团队与艺术项目提供定制道具、展陈装置、活动搭建与中国端生产支持，服务新加坡、东南亚、香港、澳门与中国市场。';
      const zhKeywords =
        '新加坡活动制作, 新加坡道具定制, 中国端生产支持, 活动搭建, 展会展台制作, FRP雕塑制作, 活动周边采购, 东南亚活动制作';

      const replaceMeta = (html: string, name: string, content: string) =>
        html.replace(
          new RegExp(`(<meta\\s+name="${name}"\\s+content=")[^"]*("\\s*/?>)`, 'i'),
          `$1${escapeHtmlAttribute(content)}$2`
        );

      const replaceProperty = (html: string, property: string, content: string) =>
        html.replace(
          new RegExp(`(<meta\\s+property="${property}"\\s+content=")[^"]*("\\s*/?>)`, 'i'),
          `$1${escapeHtmlAttribute(content)}$2`
        );

      let html = await fs.readFile(indexPath, 'utf8');
      html = html
        .replace('<html lang="en">', '<html lang="zh-Hans-SG">')
        .replace(/<title>.*?<\/title>/i, `<title>${escapeHtmlAttribute(zhTitle)}</title>`)
        .replace(
          /(<link\s+rel="canonical"\s+href=")[^"]*("\s*\/>)/i,
          '$1https://actcreative.net/zh/$2'
        );
      html = replaceMeta(html, 'description', zhDescription);
      html = replaceMeta(html, 'keywords', zhKeywords);
      html = replaceProperty(html, 'og:title', zhTitle);
      html = replaceProperty(html, 'og:description', zhDescription);
      html = replaceProperty(html, 'og:url', 'https://actcreative.net/zh/');
      html = replaceProperty(html, 'og:locale', 'zh_CN');
      html = replaceMeta(html, 'twitter:title', zhTitle);
      html = replaceMeta(html, 'twitter:description', zhDescription);

      await fs.mkdir(zhDir, { recursive: true });
      await fs.writeFile(zhIndexPath, html, 'utf8');
    },
  });

  export default defineConfig(({ mode }) => ({
    plugins: [
      react(),
      googleSiteVerificationPlugin(getGoogleSiteVerificationToken(mode)),
      localizedHomepagePlugin(),
    ],
    define: mode === 'production'
      ? {
          'process.env.NODE_ENV': JSON.stringify('production'),
        }
      : undefined,
    esbuild: mode === 'production'
      ? {
          jsxDev: false,
        }
      : undefined,
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'vaul@1.1.2': 'vaul',
        'sonner@2.0.3': 'sonner',
        'recharts@2.15.2': 'recharts',
        'react-resizable-panels@2.1.7': 'react-resizable-panels',
        'react-hook-form@7.55.0': 'react-hook-form',
        'react-day-picker@8.10.1': 'react-day-picker',
        'next-themes@0.4.6': 'next-themes',
        'lucide-react@0.487.0': 'lucide-react',
        'input-otp@1.4.2': 'input-otp',
        'figma:asset/fca4d851468974aed832ca8c37591973f036a4d7.png': path.resolve(__dirname, './src/assets/fca4d851468974aed832ca8c37591973f036a4d7.webp'),
        'figma:asset/f8ae069f17a75c4bb35568fc55aa9c42b28b80e6.png': path.resolve(__dirname, './src/assets/f8ae069f17a75c4bb35568fc55aa9c42b28b80e6.webp'),
        'figma:asset/f60bebcbcb0f95e82cfd56ae7974a5af64351275.png': path.resolve(__dirname, './src/assets/f60bebcbcb0f95e82cfd56ae7974a5af64351275.webp'),
        'figma:asset/f03d52731a85bf6a927dcf21ae7cdc5f4209373b.png': path.resolve(__dirname, './src/assets/f03d52731a85bf6a927dcf21ae7cdc5f4209373b.webp'),
        'figma:asset/ce1fae3f9d7c9c86cee5a57f78785bd01887f88b.png': path.resolve(__dirname, './src/assets/ce1fae3f9d7c9c86cee5a57f78785bd01887f88b.webp'),
        'figma:asset/cd8d22454703fb7138abd251f5d7e528160024c7.png': path.resolve(__dirname, './src/assets/cd8d22454703fb7138abd251f5d7e528160024c7.webp'),
        'figma:asset/b24cf62a1dacab87d8adfc51e494355881e2ebd8.png': path.resolve(__dirname, './src/assets/b24cf62a1dacab87d8adfc51e494355881e2ebd8.webp'),
        'figma:asset/9f81ed77f1d1b1fce6de57ec26fc06cd89a9a112.png': path.resolve(__dirname, './src/assets/9f81ed77f1d1b1fce6de57ec26fc06cd89a9a112.webp'),
        'figma:asset/9d25bfe44e81512703910c57ed786148c93dcb9b.png': path.resolve(__dirname, './src/assets/9d25bfe44e81512703910c57ed786148c93dcb9b.webp'),
        'figma:asset/9895e54c650c91e8620205b506be0a07797290ab.png': path.resolve(__dirname, './src/assets/9895e54c650c91e8620205b506be0a07797290ab.webp'),
        'figma:asset/7582ec62f07c47830049bf1681f8cfcd9e219d4e.png': path.resolve(__dirname, './src/assets/7582ec62f07c47830049bf1681f8cfcd9e219d4e.webp'),
        'figma:asset/6c4b2d9ca5b30a77b60b7dc9631b8f412b2e0bc7.png': path.resolve(__dirname, './src/assets/6c4b2d9ca5b30a77b60b7dc9631b8f412b2e0bc7.webp'),
        'figma:asset/598844c2d12f583dd14c291d98d5ddcf2dac2377.png': path.resolve(__dirname, './src/assets/598844c2d12f583dd14c291d98d5ddcf2dac2377.webp'),
        'figma:asset/50a15c0d86a008b03137d5f66091522ea2e22af0.png': path.resolve(__dirname, './src/assets/50a15c0d86a008b03137d5f66091522ea2e22af0.webp'),
        'figma:asset/3e129be199284d33c3116c2686b339ca71d8eff7.png': path.resolve(__dirname, './src/assets/3e129be199284d33c3116c2686b339ca71d8eff7.webp'),
        'figma:asset/31c3a94b1e29c068a2f34e21f880665e070fc631.png': path.resolve(__dirname, './src/assets/31c3a94b1e29c068a2f34e21f880665e070fc631.webp'),
        'figma:asset/26e483ed6154d773d2210e3142c24d5a30471e92.png': path.resolve(__dirname, './src/assets/26e483ed6154d773d2210e3142c24d5a30471e92.webp'),
        'figma:asset/1caf9ac9a9d0d7f9cad8ed51a98bb55b8d03990a.png': path.resolve(__dirname, './src/assets/1caf9ac9a9d0d7f9cad8ed51a98bb55b8d03990a.webp'),
        'figma:asset/1bf01d4da8788bfd1129355bf925b5c99a7cd40b.png': path.resolve(__dirname, './src/assets/1bf01d4da8788bfd1129355bf925b5c99a7cd40b.webp'),
        'figma:asset/1449ca57ce695e4226352bc8bf40476eeb2a6063.png': path.resolve(__dirname, './src/assets/1449ca57ce695e4226352bc8bf40476eeb2a6063.webp'),
        'figma:asset/1436808f505f19492ee82879766d0c80dc0901a9.png': path.resolve(__dirname, './src/assets/1436808f505f19492ee82879766d0c80dc0901a9.webp'),
        'embla-carousel-react@8.6.0': 'embla-carousel-react',
        'cmdk@1.1.1': 'cmdk',
        'class-variance-authority@0.7.1': 'class-variance-authority',
        '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
        '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
        '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
        '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
        '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
        '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
        '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
        '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
        '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
        '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
        '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
        '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
        '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
        '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
        '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
        '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
        '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
        '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
        '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
        '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
        '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
        '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
        '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
        '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
        '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
      rollupOptions: {
        output: {
          manualChunks(id) {
            const normalizedId = id.replace(/\\/g, '/');

            if (
              normalizedId.includes('/node_modules/react/') ||
              normalizedId.includes('/node_modules/react-dom/') ||
              normalizedId.includes('/node_modules/scheduler/')
            ) {
              return 'react-vendor';
            }

            if (normalizedId.includes('/node_modules/motion/')) {
              return 'motion-vendor';
            }

            if (normalizedId.includes('/node_modules/lucide-react/')) {
              return 'icons-vendor';
            }

            if (normalizedId.includes('/node_modules/@radix-ui/')) {
              return 'radix-vendor';
            }

            if (
              normalizedId.includes('/node_modules/sonner/') ||
              normalizedId.includes('/node_modules/next-themes/')
            ) {
              return 'feedback-vendor';
            }
          },
        },
      },
    },
    server: {
      port: 3000,
      open: true,
    },
  }));
