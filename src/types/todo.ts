export interface Tag {
  id: number
  name: string
  color: string
}

export interface Todo {
  id: number
  title: string
  completed: boolean
  createdAt: number
  completedAt?: number
  dueDate?: number
  description?: string
  priority: 'low' | 'medium' | 'high'
  tags: number[] // 标签ID列表
  category?: string
}

export interface TodoCategory {
  id: string
  name: string
  icon?: string
}

// 默认分类
export const defaultCategories: TodoCategory[] = [
  { id: 'all', name: '全部', icon: 'list' },
  { id: 'work', name: '工作', icon: 'briefcase' },
  { id: 'personal', name: '个人', icon: 'user' },
  { id: 'shopping', name: '购物', icon: 'shopping-bag' },
  { id: 'study', name: '学习', icon: 'book' },
  { id: 'health', name: '健康', icon: 'heart' },
]

// 默认标签颜色
export const tagColors = [
  '#8774e1', // 紫色
  '#3498db', // 蓝色
  '#2ecc71', // 绿色
  '#e74c3c', // 红色
  '#f39c12', // 橙色
  '#9b59b6', // 深紫色
  '#1abc9c', // 青绿色
  '#34495e', // 深灰色
  '#e67e22', // 橙棕色
  '#d35400', // 深橙色
  '#27ae60', // 深绿色
  '#16a085', // 靛青色
  '#f1c40f', // 黄色
]
