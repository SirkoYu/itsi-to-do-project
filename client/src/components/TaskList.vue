<script setup lang="ts">
import TaskCard from './TaskCard.vue';
import type { Task } from '../types';

defineProps<{
  tasks: Task[];
  title: string;
  emptyMessage: string;
}>();
</script>

<template>
  <section>
    <h2 class="text-sm font-semibold text-base-content/60 uppercase tracking-wider mb-3">
      {{ title }}
      <span class="badge badge-sm ml-1">{{ tasks.length }}</span>
    </h2>

    <div v-if="tasks.length === 0" class="text-center py-8 text-base-content/40">
      {{ emptyMessage }}
    </div>

    <div v-else class="flex flex-col gap-2">
      <TaskCard v-for="task in tasks" :key="task.id" :task="task" />
    </div>
  </section>
</template>
