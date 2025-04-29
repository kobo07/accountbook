<script setup lang="ts">
defineProps<{
  id: number
  title: string
  completed: boolean
}>()

defineEmits<{
  (e: 'toggle', id: number): void
  (e: 'delete', id: number): void
}>()
</script>

<template>
  <div class="todo-item" :class="{ 'completed': completed }">
    <label class="checkbox-container">
      <input type="checkbox" :checked="completed" @change="$emit('toggle', id)" />
      <span class="checkmark">
        <svg v-if="completed" class="check-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"
          stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </span>
    </label>
    <span class="title">{{ title }}</span>
    <button @click="$emit('delete', id)" class="delete-btn" aria-label="删除">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    </button>
    <div class="ripple-container"></div>
  </div>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: var(--item-background);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

.todo-item:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.07);
  transform: translateY(-2px);
}

.todo-item:active {
  transform: translateY(0);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.todo-item.completed {
  opacity: 0.85;
  background-color: rgba(var(--primary-rgb, 135, 116, 225), 0.05);
}

.todo-item.completed .title {
  text-decoration: line-through;
  color: var(--text-secondary);
}

.title {
  margin-left: 12px;
  flex-grow: 1;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
  transition: color 0.3s ease;
  word-break: break-word;
}

.delete-btn {
  background-color: transparent;
  color: var(--danger);
  border: none;
  border-radius: 8px;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.delete-btn:hover {
  background-color: rgba(var(--danger-rgb, 214, 48, 49), 0.1);
  opacity: 1;
  transform: scale(1.1);
}

.delete-btn:active {
  transform: scale(0.9);
}

/* 自定义复选框样式 */
.checkbox-container {
  display: block;
  position: relative;
  min-width: 22px;
  height: 22px;
  margin: 0;
  cursor: pointer;
  font-size: 22px;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 22px;
  width: 22px;
  background-color: var(--background);
  border-radius: 6px;
  border: 2px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.checkbox-container:hover input~.checkmark {
  border-color: var(--primary);
  background-color: rgba(var(--primary-rgb, 135, 116, 225), 0.1);
  transform: scale(1.05);
}

.checkbox-container input:checked~.checkmark {
  background-color: var(--primary);
  border-color: var(--primary);
  transform: scale(1.05);
}

.check-icon {
  opacity: 0;
  transform: scale(0);
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.checkbox-container input:checked~.checkmark .check-icon {
  opacity: 1;
  transform: scale(1);
}

/* 波纹效果 */
.ripple-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

@keyframes ripple {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.5;
  }

  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

.todo-item:active::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background-color: rgba(var(--primary-rgb, 135, 116, 225), 0.1);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  animation: ripple 0.6s ease-out;
}

/* 支持暗色模式 */
:global(.dark-mode) .todo-item {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

:global(.dark-mode) .todo-item:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

:global(.dark-mode) .checkbox-container:hover input~.checkmark {
  background-color: rgba(var(--primary-rgb, 135, 116, 225), 0.2);
}

@media (max-width: 480px) {
  .todo-item {
    padding: 12px;
  }
}
</style>
