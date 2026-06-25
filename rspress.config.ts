import { defineConfig } from '@rspress/core';

export default defineConfig({
  root: 'docs',
  lang: 'en',
  title: 'behest',
  description: 'Rust-native building blocks for production AI agent runtimes',
  icon: '/icon.svg',
  logo: '/icon.svg',
  locales: [
    {
      lang: 'en',
      label: 'English',
      title: 'behest',
      description: 'Rust-native building blocks for production AI agent runtimes',
    },
    {
      lang: 'zh',
      label: '简体中文',
      title: 'behest',
      description: '用于生产级 AI Agent 运行时的 Rust 原生构建块',
    },
  ],
  themeConfig: {
    enableScrollToTop: true,
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/lazhenyi/behest',
      },
    ],
    sidebar: {
      '/en/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/en/' },
            { text: 'Quick Start', link: '/en/getting-started' },
            { text: 'Examples', link: '/en/examples' },
          ],
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Providers', link: '/en/providers' },
            { text: 'Tools', link: '/en/tools' },
            { text: 'Sessions', link: '/en/sessions' },
            { text: 'Storage', link: '/en/storage' },
            { text: 'Configuration', link: '/en/configuration' },
            { text: 'Error Handling', link: '/en/error-handling' },
          ],
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Architecture', link: '/en/architecture' },
            { text: 'RAG', link: '/en/rag' },
            { text: 'Events', link: '/en/events' },
            { text: 'Feature Flags', link: '/en/features' },
            { text: 'API Reference', link: '/en/api-reference' },
          ],
        },
        {
          text: 'Development',
          items: [
            { text: 'Development Guide', link: '/en/development' },
          ],
        },
      ],
      '/zh/': [
        {
          text: '快速开始',
          items: [
            { text: '介绍', link: '/zh/' },
            { text: '快速入门', link: '/zh/getting-started' },
            { text: '示例', link: '/zh/examples' },
          ],
        },
        {
          text: '核心概念',
          items: [
            { text: '提供商', link: '/zh/providers' },
            { text: '工具', link: '/zh/tools' },
            { text: '会话', link: '/zh/sessions' },
            { text: '存储', link: '/zh/storage' },
            { text: '配置', link: '/zh/configuration' },
            { text: '错误处理', link: '/zh/error-handling' },
          ],
        },
        {
          text: '高级特性',
          items: [
            { text: '架构', link: '/zh/architecture' },
            { text: 'RAG', link: '/zh/rag' },
            { text: '事件系统', link: '/zh/events' },
            { text: '特性标志', link: '/zh/features' },
            { text: 'API 参考', link: '/zh/api-reference' },
          ],
        },
        {
          text: '开发',
          items: [
            { text: '开发指南', link: '/zh/development' },
          ],
        },
      ],
    },
  },
  markdown: {
    mermaid: true,
  },
});
