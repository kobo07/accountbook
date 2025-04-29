<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ThemeService from '@/services/ThemeService'
import type { Theme } from '@/services/ThemeService'

const isOpen = ref(false)
const themes = ref<Theme[]>([])
const currentTheme = ref<Theme>()

// 初始化
onMounted(() => {
    themes.value = ThemeService.getAllThemes()
    currentTheme.value = ThemeService.getCurrentTheme()
})

// 切换主题选择器显示状态
const toggleThemeSelector = () => {
    isOpen.value = !isOpen.value
}

// 选择主题
const selectTheme = (themeId: string) => {
    ThemeService.setTheme(themeId)
    currentTheme.value = ThemeService.getCurrentTheme()
    isOpen.value = false
}

// 切换深色/浅色模式
const toggleDarkMode = () => {
    ThemeService.toggleDarkMode()
    currentTheme.value = ThemeService.getCurrentTheme()
}
</script>

<template>
    <div class="theme-selector-container">
        <!-- 主题设置按钮 -->
        <button @click="toggleThemeSelector" class="theme-toggle-btn" title="主题设置">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path
                    d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z">
                </path>
            </svg>
        </button>

        <!-- 深色/浅色模式切换按钮 -->
        <button @click="toggleDarkMode" class="dark-mode-toggle" :title="currentTheme?.isDark ? '切换到浅色模式' : '切换到深色模式'">
            <svg v-if="currentTheme?.isDark" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        </button>

        <!-- 主题选择面板 -->
        <transition name="theme-panel">
            <div v-if="isOpen" class="theme-panel">
                <div class="panel-header">
                    <h3>选择主题</h3>
                    <button @click="toggleThemeSelector" class="close-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="theme-options">
                    <button v-for="theme in themes" :key="theme.id" @click="selectTheme(theme.id)" class="theme-option"
                        :class="{ active: currentTheme?.id === theme.id }">
                        <div class="theme-color" :style="{ backgroundColor: theme.colors.primary }"></div>
                        <span class="theme-name">{{ theme.name }}</span>
                        <svg v-if="currentTheme?.id === theme.id" xmlns="http://www.w3.org/2000/svg" width="18"
                            height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.theme-selector-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    display: flex;
    gap: 10px;
}

.theme-toggle-btn,
.dark-mode-toggle {
    background-color: var(--item-background);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
}

.theme-toggle-btn:hover,
.dark-mode-toggle:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.theme-toggle-btn:active,
.dark-mode-toggle:active {
    transform: scale(0.95);
}

.theme-panel {
    position: absolute;
    top: 50px;
    right: 0;
    width: 250px;
    background-color: var(--item-background);
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    border: 1px solid var(--border-color);
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid var(--border-color);
}

.panel-header h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
}

.close-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
}

.close-btn:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: var(--text-primary);
}

.theme-options {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 300px;
    overflow-y: auto;
}

.theme-option {
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 8px;
    border: none;
    background: none;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--text-primary);
}

.theme-option:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

.theme-option.active {
    background-color: rgba(0, 0, 0, 0.07);
}

.theme-color {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 10px;
    border: 2px solid var(--border-color);
}

.theme-name {
    flex-grow: 1;
    text-align: left;
    font-size: 0.9rem;
}

/* 动画效果 */
.theme-panel-enter-active,
.theme-panel-leave-active {
    transition: all 0.3s ease;
}

.theme-panel-enter-from,
.theme-panel-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

@media (max-width: 768px) {
    .theme-selector-container {
        top: 15px;
        right: 15px;
    }

    .theme-toggle-btn,
    .dark-mode-toggle {
        width: 36px;
        height: 36px;
    }

    .theme-panel {
        width: 220px;
    }
}
</style>
