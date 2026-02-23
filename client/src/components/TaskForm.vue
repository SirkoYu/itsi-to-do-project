<script setup lang="ts">
import { ref } from 'vue';
import { useTaskStore } from '../stores/taskStore';

const store = useTaskStore();

const title = ref('');
const description = ref('');
const isSubmitting = ref(false);
const formError = ref('');

async function handleSubmit() {
  if (!title.value.trim()) {
    formError.value = 'Title is required';
    return;
  }

  isSubmitting.value = true;
  formError.value = '';

  try {
    await store.addTask({ title: title.value, description: description.value });
    title.value = '';
    description.value = '';
  } catch {
    formError.value = 'Failed to create task. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <form class="card bg-base-100 shadow-sm border border-base-200" @submit.prevent="handleSubmit">
    <div class="card-body gap-3 p-4">
      <h2 class="card-title text-base">Add a new task</h2>

      <div v-if="formError" class="alert alert-error py-2 text-sm">
        {{ formError }}
      </div>

      <input
        v-model="title"
        type="text"
        placeholder="Task title *"
        class="input input-bordered w-full"
        :disabled="isSubmitting"
      />

      <textarea
        v-model="description"
        placeholder="Description (optional)"
        class="textarea textarea-bordered w-full resize-none"
        rows="2"
        :disabled="isSubmitting"
      />

      <div class="card-actions justify-end">
        <button
          type="submit"
          class="btn btn-primary"
          :class="{ loading: isSubmitting }"
          :disabled="isSubmitting"
        >
          Add Task
        </button>
      </div>
    </div>
  </form>
</template>
