<script setup lang="ts">
import { RouterView } from 'vue-router'
import ThemeSelector from '@/components/ThemeSelector.vue'
</script>

<template>
  <ThemeSelector />
  <RouterView />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  /* 主题颜色，这些变量会被ThemeService动态替换 */
  --primary: #8774e1;
  --primary-dark: #6a5acd;
  --secondary: #54a0ff;
  --background: #f5f7fa;
  --card-background: #f8f9fa;
  --item-background: #ffffff;
  --text-primary: #333333;
  --text-secondary: #666666;
  --border-color: rgba(0, 0, 0, 0.1);
  --success: #4cd137;
  --danger: #d63031;
  --warning: #ffbe76;
}

html {
  font-size: 16px;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: var(--text-primary);
  line-height: 1.6;
  background-color: var(--background);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s ease, color 0.3s ease;
}

button,
input {
  font-family: inherit;
}

a {
  text-decoration: none;
  color: var(--primary);
}

/* 添加滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.03);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

body.dark-mode ::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

body.dark-mode ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
}

/* 添加全局动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

@media (max-width: 480px) {
  html {
    font-size: 14px;
  }
}
</style>
