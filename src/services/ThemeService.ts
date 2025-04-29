// 主题类型定义
export interface Theme {
  id: string
  name: string
  isDark: boolean
  colors: {
    primary: string
    primaryDark: string
    secondary: string
    background: string
    cardBackground: string
    itemBackground: string
    textPrimary: string
    textSecondary: string
    borderColor: string
    success: string
    danger: string
    warning: string
  }
}

// 预定义主题
const themes: Theme[] = [
  {
    id: 'purple-light',
    name: '紫色主题-浅色',
    isDark: false,
    colors: {
      primary: '#8774e1',
      primaryDark: '#6a5acd',
      secondary: '#54a0ff',
      background: '#f5f7fa',
      cardBackground: '#f8f9fa',
      itemBackground: '#ffffff',
      textPrimary: '#333333',
      textSecondary: '#666666',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      success: '#4cd137',
      danger: '#d63031',
      warning: '#ffbe76',
    },
  },
  {
    id: 'purple-dark',
    name: '紫色主题-深色',
    isDark: true,
    colors: {
      primary: '#9b7dff',
      primaryDark: '#8774e1',
      secondary: '#5aa3ff',
      background: '#121212',
      cardBackground: '#1e1e1e',
      itemBackground: '#2c2c2c',
      textPrimary: '#f1f1f1',
      textSecondary: '#c7c7c7',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      success: '#5adb4c',
      danger: '#ff5252',
      warning: '#ffc14d',
    },
  },
  {
    id: 'blue-light',
    name: '蓝色主题-浅色',
    isDark: false,
    colors: {
      primary: '#3498db',
      primaryDark: '#2980b9',
      secondary: '#67e8f9',
      background: '#f0f5fa',
      cardBackground: '#f5f9ff',
      itemBackground: '#ffffff',
      textPrimary: '#333333',
      textSecondary: '#666666',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      success: '#4cd137',
      danger: '#d63031',
      warning: '#ffbe76',
    },
  },
  {
    id: 'blue-dark',
    name: '蓝色主题-深色',
    isDark: true,
    colors: {
      primary: '#4fb3ff',
      primaryDark: '#3498db',
      secondary: '#67e8f9',
      background: '#121212',
      cardBackground: '#1e1e1e',
      itemBackground: '#2c2c2c',
      textPrimary: '#f1f1f1',
      textSecondary: '#c7c7c7',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      success: '#5adb4c',
      danger: '#ff5252',
      warning: '#ffc14d',
    },
  },
  {
    id: 'green-light',
    name: '绿色主题-浅色',
    isDark: false,
    colors: {
      primary: '#2ecc71',
      primaryDark: '#27ae60',
      secondary: '#6decb9',
      background: '#f0faf5',
      cardBackground: '#f5fff9',
      itemBackground: '#ffffff',
      textPrimary: '#333333',
      textSecondary: '#666666',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      success: '#4cd137',
      danger: '#d63031',
      warning: '#ffbe76',
    },
  },
  {
    id: 'green-dark',
    name: '绿色主题-深色',
    isDark: true,
    colors: {
      primary: '#42d77d',
      primaryDark: '#2ecc71',
      secondary: '#6decb9',
      background: '#121212',
      cardBackground: '#1e1e1e',
      itemBackground: '#2c2c2c',
      textPrimary: '#f1f1f1',
      textSecondary: '#c7c7c7',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      success: '#5adb4c',
      danger: '#ff5252',
      warning: '#ffc14d',
    },
  },
]

class ThemeService {
  private currentThemeId: string = 'purple-light'
  private readonly storageKey = 'todo-app-theme'

  constructor() {
    this.loadTheme()
  }

  // 获取所有可用主题
  getAllThemes(): Theme[] {
    return themes
  }

  // 获取当前主题
  getCurrentTheme(): Theme {
    return this.getThemeById(this.currentThemeId) || themes[0]
  }

  // 根据ID获取主题
  getThemeById(id: string): Theme | undefined {
    return themes.find((theme) => theme.id === id)
  }

  // 设置当前主题
  setTheme(themeId: string): void {
    const theme = this.getThemeById(themeId)
    if (!theme) return

    this.currentThemeId = themeId
    this.applyTheme(theme)
    this.saveTheme()
  }

  // 切换深色/浅色模式
  toggleDarkMode(): void {
    const currentTheme = this.getCurrentTheme()
    const currentBase = currentTheme.id.split('-')[0]

    // 找到当前颜色方案的另一个模式
    const newThemeId = `${currentBase}-${currentTheme.isDark ? 'light' : 'dark'}`
    this.setTheme(newThemeId)
  }

  // 应用主题到CSS变量
  private applyTheme(theme: Theme): void {
    const root = document.documentElement

    // 设置CSS变量
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${this.kebabCase(key)}`, value)
    })

    // 设置深色/浅色模式
    if (theme.isDark) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }

  // 保存主题到本地存储
  private saveTheme(): void {
    localStorage.setItem(this.storageKey, this.currentThemeId)
  }

  // 从本地存储加载主题
  private loadTheme(): void {
    const savedTheme = localStorage.getItem(this.storageKey)

    if (savedTheme && this.getThemeById(savedTheme)) {
      this.currentThemeId = savedTheme
    } else {
      // 检查系统首选颜色模式
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.currentThemeId = 'purple-dark'
      }
    }

    this.applyTheme(this.getCurrentTheme())
  }

  // 转换为kebab-case (驼峰转连字符)
  private kebabCase(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
  }
}

// 导出单例
export default new ThemeService()
