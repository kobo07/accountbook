<script setup lang="ts">
import TodoList from '@/components/TodoList.vue'
</script>

<template>
    <div class="todo-view">
        <TodoList />
    </div>
</template>

<style>
.todo-view {
    min-height: 100vh;
    width: 100%;
    background-color: #f5f7fa;
    display: flex;
    flex-direction: column;
    padding: 0;
}

@media (min-width: 1024px) {
    .todo-view {
        padding: 0;
        display: flex;
        align-items: stretch;
        justify-content: center;
    }

    .todo-view>* {
        max-width: 600px;
        width: 100%;
    }
}

/* 移除Vue自带的默认样式 */
:root {
    --color-text: #333;
    --color-background: #f5f7fa;
    --section-gap: 0;
}

body {
    background-color: var(--color-background);
    color: var(--color-text);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    margin: 0;
    padding: 0;
    line-height: 1.5;
}

#app {
    width: 100%;
    height: 100vh;
    margin: 0;
    padding: 0;
}
</style>
