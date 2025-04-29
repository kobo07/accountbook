<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
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
  --primary-color: #8774e1;
  --primary-color-dark: #6a5acd;
  --background-color: #f5f7fa;
  --card-background: #fff;
  --text-color: #333;
  --text-light: #666;
  --text-lighter: #999;
  --border-color: rgba(0, 0, 0, 0.1);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --transition-fast: 0.2s;
}

html {
  font-size: 16px;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: var(--text-color);
  line-height: 1.6;
  background-color: var(--background-color);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

button,
input {
  font-family: inherit;
}

a {
  text-decoration: none;
  color: var(--primary-color);
}

@media (max-width: 480px) {
  html {
    font-size: 14px;
  }
}
</style>
