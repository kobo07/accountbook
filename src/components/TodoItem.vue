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
      <span class="checkmark"></span>
    </label>
    <span class="title">{{ title }}</span>
    <button @click="$emit('delete', id)" class="delete-btn" aria-label="删除">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.todo-item:hover {
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.todo-item.completed {
  opacity: 0.8;
  background-color: #f9f9f9;
}

.todo-item.completed .title {
  text-decoration: line-through;
  color: #999;
}

.title {
  margin-left: 12px;
  flex-grow: 1;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  transition: color 0.2s ease;
  word-break: break-word;
}

.delete-btn {
  background-color: transparent;
  color: #d63031;
  border: none;
  border-radius: 8px;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  background-color: rgba(214, 48, 49, 0.1);
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
  background-color: #f1f1f1;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.checkbox-container:hover input~.checkmark {
  background-color: #e9e9e9;
}

.checkbox-container input:checked~.checkmark {
  background-color: #8774e1;
  border-color: #8774e1;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked~.checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 7px;
  top: 3px;
  width: 6px;
  height: 11px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
</style>
