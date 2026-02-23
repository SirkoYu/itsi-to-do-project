<script setup lang="ts">
import { onMounted } from 'vue';
import { useTaskStore } from '../stores/taskStore';
import AppHeader from '../components/AppHeader.vue';
import TaskForm from '../components/TaskForm.vue';
import TaskList from '../components/TaskList.vue';

const store = useTaskStore();

onMounted(() => {
  store.fetchTasks();
});
</script>

<template>
  <div class="min-h-screen bg-base-200 flex flex-col">
    <AppHeader />

    <main class="flex-1 max-w-2xl w-full mx-auto px-4 py-6 flex flex-col gap-6">
      <!-- Loading state -->
      <div v-if="store.isLoading" class="flex justify-center py-12">
        <span class="loading loading-spinner loading-lg text-primary" />
      </div>

      <!-- Error state -->
      <div v-else-if="store.error" class="alert alert-error">
        {{ store.error }}
        <button class="btn btn-ghost btn-sm ml-2" @click="store.fetchTasks()">Retry</button>
      </div>

      <!-- Content -->
      <template v-else>
        <TaskForm />

        <div class="divider my-0" />

        <TaskList
          :tasks="store.activeTasks"
          title="Active"
          empty-message="No active tasks — add one above!"
        />

        <TaskList
          v-if="store.completedTasks.length > 0"
          :tasks="store.completedTasks"
          title="Completed"
          empty-message=""
        />
      </template>
    </main>
  </div>
</template>
