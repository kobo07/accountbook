<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import TodoItem from './TodoItem.vue'

interface Todo {
  id: number
  title: string
  completed: boolean
}

const newTodo = ref('')
const todos = ref<Todo[]>([])
const filter = ref<'all' | 'active' | 'completed'>('all')

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
}

// 切换完成状态
const toggleTodo = (id: number) => {
  const todo = todos.value.find(todo => todo.id === id)
  if (todo) {
    todo.completed = !todo.completed
  }
}

// 删除待办事项
const deleteTodo = (id: number) => {
  todos.value = todos.value.filter(todo => todo.id !== id)
}

// 清除所有已完成
const clearCompleted = () => {
  todos.value = todos.value.filter(todo => !todo.completed)
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

// 页面加载时从本地存储获取数据
onMounted(() => {
  loadTodos()
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
      <div class="input-container">
        <input v-model="newTodo" @keyup.enter="addTodo" type="text" placeholder="添加新的待办事项..." />
        <button @click="addTodo" class="add-btn" title="添加待办事项">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
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
        <transition-group name="todo-list" tag="div" class="todos">
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
}

.header-container {
  padding: 3vh 5%;
  background: linear-gradient(135deg, #8774e1 0%, #6a5acd 100%);
  border-radius: 0 0 20px 20px;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(106, 90, 205, 0.2);
  position: relative;
}

.header-container h1 {
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  padding: 0;
}

.stats {
  margin-top: 1.2vh;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.stats span {
  font-weight: 600;
  color: white;
}

.card-container {
  background-color: #f8f9fa;
  border-radius: 20px;
  padding: 0;
  flex-grow: 1;
  margin: 0 5%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.input-container {
  display: flex;
  padding: 15px;
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.input-container input {
  flex-grow: 1;
  padding: 1.5vh;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: #f8f9fa;
}

.input-container input:focus {
  outline: none;
  border-color: #8774e1;
  box-shadow: 0 0 0 2px rgba(135, 116, 225, 0.2);
}

.add-btn {
  background-color: #8774e1;
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
  transition: all 0.2s ease;
}

.add-btn:hover {
  background-color: #7561d0;
  transform: scale(1.05);
}

.add-btn:active {
  transform: scale(0.95);
}

.filter-container {
  display: flex;
  padding: 10px 15px;
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.filter-container button {
  background: none;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s;
}

.filter-container button.active {
  background-color: rgba(135, 116, 225, 0.1);
  color: #8774e1;
  font-weight: 600;
}

.filter-container button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.filter-container button span {
  font-size: 0.8rem;
  color: #888;
}

.todo-list-container {
  padding: 10px 15px;
  flex-grow: 1;
  overflow-y: auto;
  max-height: 50vh;
}

.todo-list-container::-webkit-scrollbar {
  width: 6px;
}

.todo-list-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.03);
  border-radius: 3px;
}

.todo-list-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.empty-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #888;
  text-align: center;
}

.empty-list svg {
  color: #d1d1d1;
  margin-bottom: 15px;
}

.empty-list p {
  font-size: 1.2rem;
  margin: 0 0 8px 0;
  font-weight: 500;
  color: #666;
}

.empty-list span {
  font-size: 0.9rem;
  color: #888;
}

.todos {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.actions-container {
  padding: 15px;
  display: flex;
  justify-content: flex-end;
  background-color: white;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.clear-btn {
  background-color: rgba(214, 48, 49, 0.1);
  color: #d63031;
  border: none;
  padding: 8px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.clear-btn:hover {
  background-color: rgba(214, 48, 49, 0.2);
}

/* 动画效果 */
.todo-list-enter-active,
.todo-list-leave-active {
  transition: all 0.3s ease;
}

.todo-list-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.todo-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
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
  }

  .filter-container::-webkit-scrollbar {
    display: none;
  }

  .filter-container button {
    white-space: nowrap;
    padding: 8px 10px;
  }
}
</style>
