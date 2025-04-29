<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import TodoItem from './TodoItem.vue'
import ConfettiEffect from './ConfettiEffect.vue'
import SoundService from '@/services/SoundService'

interface Todo {
  id: number
  title: string
  completed: boolean
}

const newTodo = ref('')
const todos = ref<Todo[]>([])
const filter = ref<'all' | 'active' | 'completed'>('all')
const showConfetti = ref(false)
const successMessage = ref('')
const isNewTodoFocused = ref(false)
const isAddButtonHovered = ref(false)

// 过滤后的待办事项
const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'active':
      return todos.value.filter(todo => !todo.completed)
    case 'completed':
      return todos.value.filter(todo => todo.completed)
    default:
      return todos.value
  }
})

// 从本地存储加载数据
const loadTodos = () => {
  const savedTodos = localStorage.getItem('todos')
  if (savedTodos) {
    todos.value = JSON.parse(savedTodos)
  }
}

// 保存数据到本地存储
const saveTodos = () => {
  localStorage.setItem('todos', JSON.stringify(todos.value))
}

// 生成唯一ID
const generateId = () => {
  return Date.now()
}

// 添加待办事项
const addTodo = () => {
  if (newTodo.value.trim() === '') return

  const todo: Todo = {
    id: generateId(),
    title: newTodo.value.trim(),
    completed: false
  }

  todos.value.unshift(todo) // 添加到顶部
  newTodo.value = ''

  // 播放添加音效
  SoundService.playAddSound()
}

// 切换完成状态
const toggleTodo = (id: number) => {
  const todo = todos.value.find(todo => todo.id === id)
  if (todo) {
    todo.completed = !todo.completed

    // 如果标记为完成，播放完成音效并显示成就动画
    if (todo.completed) {
      SoundService.playCompleteSound()
      showConfetti.value = true

      // 根据待办事项的内容生成成就消息
      const messages = [
        '真棒！你完成了一项任务！',
        '继续保持！你的效率令人惊叹！',
        '任务完成！你离目标更近了一步！',
        '做得好！坚持就是胜利！',
        '你太厉害了！再接再厉！'
      ]
      successMessage.value = messages[Math.floor(Math.random() * messages.length)]

      // 3秒后隐藏动画和消息
      setTimeout(() => {
        showConfetti.value = false
        successMessage.value = ''
      }, 3000)
    }
  }
}

// 删除待办事项
const deleteTodo = (id: number) => {
  todos.value = todos.value.filter(todo => todo.id !== id)

  // 播放删除音效
  SoundService.playDeleteSound()
}

// 清除所有已完成
const clearCompleted = () => {
  todos.value = todos.value.filter(todo => !todo.completed)

  // 播放清除音效
  SoundService.playClearSound()
}

// 统计信息
const completedCount = computed(() => {
  return todos.value.filter(todo => todo.completed).length
})

const activeCount = computed(() => {
  return todos.value.length - completedCount.value
})

const totalCount = computed(() => {
  return todos.value.length
})

// 输入框聚焦状态
const setInputFocus = (focused: boolean) => {
  isNewTodoFocused.value = focused
}

// 页面加载时从本地存储获取数据
onMounted(() => {
  loadTodos()

  // 初始化音频上下文（用户首次交互时）
  document.addEventListener('click', () => {
    SoundService.init()
  }, { once: true })
})

// 监听todos变化，保存到本地存储
watch(todos, () => {
  saveTodos()
}, { deep: true })
</script>

<template>
  <div class="todo-app">
    <div class="header-container">
      <h1>我的待办</h1>
      <div class="stats">
        已完成 <span>{{ completedCount }}/{{ totalCount }}</span>
      </div>
    </div>

    <div class="card-container">
      <div class="input-container" :class="{ 'focused': isNewTodoFocused }">
        <input v-model="newTodo" @keyup.enter="addTodo" @focus="setInputFocus(true)" @blur="setInputFocus(false)"
          type="text" placeholder="添加新的待办事项..." />
        <button @click="addTodo" @mouseenter="isAddButtonHovered = true" @mouseleave="isAddButtonHovered = false"
          class="add-btn" title="添加待办事项">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" :class="{ 'vertical-line': true, 'active': isAddButtonHovered }">
            </line>
            <line x1="5" y1="12" x2="19" y2="12" :class="{ 'horizontal-line': true, 'active': isAddButtonHovered }">
            </line>
          </svg>
        </button>
      </div>

      <div class="filter-container">
        <button :class="{ active: filter === 'all' }" @click="filter = 'all'">
          全部 <span v-if="totalCount > 0">({{ totalCount }})</span>
        </button>
        <button :class="{ active: filter === 'active' }" @click="filter = 'active'">
          未完成 <span v-if="activeCount > 0">({{ activeCount }})</span>
        </button>
        <button :class="{ active: filter === 'completed' }" @click="filter = 'completed'">
          已完成 <span v-if="completedCount > 0">({{ completedCount }})</span>
        </button>
      </div>

      <div class="todo-list-container">
        <div v-if="todos.length === 0" class="empty-list">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <p>暂无待办事项</p>
          <span>添加一些任务开始你的计划吧</span>
        </div>
        <div v-else-if="filteredTodos.length === 0" class="empty-list">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>没有{{ filter === 'active' ? '未完成' : '已完成' }}的待办事项</p>
        </div>
        <transition-group name="todo-list" tag="div" class="todos" mode="out-in">
          <TodoItem v-for="todo in filteredTodos" :key="todo.id" :id="todo.id" :title="todo.title"
            :completed="todo.completed" @toggle="toggleTodo" @delete="deleteTodo" />
        </transition-group>
      </div>

      <div v-if="completedCount > 0" class="actions-container">
        <button @click="clearCompleted" class="clear-btn">
          清除已完成 ({{ completedCount }})
        </button>
      </div>
    </div>

    <!-- 五彩纸屑特效 -->
    <ConfettiEffect :active="showConfetti" />

    <!-- 成就感消息 -->
    <transition name="success-message">
      <div v-if="successMessage" class="success-message">
        <div class="success-icon">✓</div>
        <div class="success-text">{{ successMessage }}</div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.todo-app {
  max-width: 100%;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  position: relative;
}

.header-container {
  padding: 3vh 5%;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border-radius: 0 0 20px 20px;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(var(--primary-rgb, 135, 116, 225), 0.2);
  position: relative;
  overflow: hidden;
}

/* 给标题区域添加微妙动态背景 */
.header-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 70%);
  animation: rotate 15s linear infinite;
  z-index: 0;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.header-container h1 {
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  padding: 0;
  position: relative;
  z-index: 1;
}

.stats {
  margin-top: 1.2vh;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  position: relative;
  z-index: 1;
}

.stats span {
  font-weight: 600;
  color: white;
}

.card-container {
  background-color: var(--card-background);
  border-radius: 20px;
  padding: 0;
  flex-grow: 1;
  margin: 0 5%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.input-container {
  display: flex;
  padding: 15px;
  background-color: var(--item-background);
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.input-container.focused {
  background-color: rgba(var(--primary-rgb, 135, 116, 225), 0.03);
}

.input-container input {
  flex-grow: 1;
  padding: 1.5vh;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  background-color: var(--background);
  color: var(--text-primary);
}

.input-container input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(var(--primary-rgb, 135, 116, 225), 0.15);
  transform: translateY(-1px);
}

.input-container input::placeholder {
  color: var(--text-secondary);
  opacity: 0.7;
}

.add-btn {
  background-color: var(--primary);
  color: white;
  border: none;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.add-btn:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(var(--primary-rgb, 135, 116, 225), 0.2);
}

.add-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(var(--primary-rgb, 135, 116, 225), 0.15);
}

/* 动画十字图标 */
.vertical-line,
.horizontal-line {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform-origin: center;
}

.vertical-line.active {
  animation: pulse 1.5s ease-in-out infinite;
}

.horizontal-line.active {
  animation: pulse 1.5s ease-in-out infinite 0.2s;
}

@keyframes pulse {

  0%,
  100% {
    transform: scaleY(1);
  }

  50% {
    transform: scaleY(1.1);
  }
}

/* 按钮波纹效果 */
.add-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
}

.add-btn:active::after {
  animation: rippleEffect 0.6s ease-out;
}

@keyframes rippleEffect {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.3;
  }

  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

.filter-container {
  display: flex;
  padding: 10px 15px;
  background-color: var(--item-background);
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.filter-container button {
  background: none;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
}

.filter-container button.active {
  background-color: rgba(var(--primary-rgb, 135, 116, 225), 0.1);
  color: var(--primary);
  font-weight: 600;
}

.filter-container button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.filter-container button:active {
  transform: translateY(0);
}

.filter-container button::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: var(--primary);
  transform: translateX(-50%);
  transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.filter-container button.active::after {
  width: 60%;
}

.filter-container button span {
  font-size: 0.75rem;
  color: var(--text-secondary);
  opacity: 0.8;
  margin-left: 3px;
}

.todo-list-container {
  padding: 10px 15px;
  flex-grow: 1;
  overflow-y: auto;
  max-height: 50vh;
  transition: all 0.3s ease;
}

.empty-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: var(--text-secondary);
  text-align: center;
  transition: all 0.3s ease;
}

.empty-list svg {
  color: var(--text-secondary);
  opacity: 0.5;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.empty-list p {
  font-size: 1.2rem;
  margin: 0 0 8px 0;
  font-weight: 500;
  color: var(--text-primary);
}

.empty-list span {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.todos {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.actions-container {
  padding: 15px;
  display: flex;
  justify-content: flex-end;
  background-color: var(--item-background);
  border-top: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.clear-btn {
  background-color: rgba(var(--danger-rgb, 214, 48, 49), 0.1);
  color: var(--danger);
  border: none;
  padding: 8px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
}

.clear-btn:hover {
  background-color: rgba(var(--danger-rgb, 214, 48, 49), 0.15);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(var(--danger-rgb, 214, 48, 49), 0.1);
}

.clear-btn:active {
  transform: scale(0.97);
}

.clear-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background-color: rgba(var(--danger-rgb, 214, 48, 49), 0.1);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
}

.clear-btn:active::after {
  animation: rippleEffect 0.6s ease-out;
}

/* 成就感消息样式 */
.success-message {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--item-background);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 15px 20px;
  display: flex;
  align-items: center;
  z-index: 1001;
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.success-icon {
  background-color: var(--success);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-right: 12px;
  animation: successPulse 1s ease-in-out infinite;
}

@keyframes successPulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

.success-text {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 1rem;
}

/* 成就感消息动画 */
.success-message-enter-active,
.success-message-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.success-message-enter-from {
  opacity: 0;
  transform: translate(-50%, -40px);
}

.success-message-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}

/* 列表动画效果 */
.todo-list-enter-active,
.todo-list-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
}

.todo-list-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.todo-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 支持暗色模式 */
:global(.dark-mode) .card-container {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

:global(.dark-mode) .input-container input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

:global(.dark-mode) .filter-container button:hover {
  background-color: rgba(255, 255, 255, 0.07);
}

@media (max-width: 768px) {
  .todo-app {
    padding: 0;
  }

  .header-container {
    padding: 2vh 5%;
  }

  .header-container h1 {
    font-size: 1.8rem;
  }

  .input-container input {
    font-size: 0.9rem;
  }

  .filter-container {
    overflow-x: auto;
    padding: 10px 10px;
    justify-content: space-between;
  }

  .filter-container::-webkit-scrollbar {
    display: none;
  }

  .filter-container button {
    white-space: nowrap;
    padding: 8px 10px;
    flex: 1;
    text-align: center;
  }

  .success-message {
    width: 85%;
    padding: 12px 15px;
  }
}

@media (max-width: 480px) {
  .header-container h1 {
    font-size: 1.5rem;
  }

  .input-container {
    padding: 10px;
  }

  .add-btn {
    width: 42px;
    height: 42px;
  }
}
</style>
