<script setup lang="ts">
import { ref } from 'vue';
import { useTaskStore } from '../stores/taskStore';
import type { Task } from '../types';

const props = defineProps<{ task: Task }>();

const store = useTaskStore();

const isEditing = ref(false);
const editTitle = ref('');
const editDescription = ref('');
const isSaving = ref(false);
const isDeleting = ref(false);

function startEdit() {
  editTitle.value = props.task.title;
  editDescription.value = props.task.description;
  isEditing.value = true;
}

function cancelEdit() {
  isEditing.value = false;
}

async function saveEdit() {
  if (!editTitle.value.trim()) return;

  isSaving.value = true;
  try {
    await store.updateTask(props.task.id, {
      title: editTitle.value,
      description: editDescription.value,
    });
    isEditing.value = false;
  } finally {
    isSaving.value = false;
  }
}

async function handleToggle() {
  await store.toggleTask(props.task.id);
}

async function handleDelete() {
  isDeleting.value = true;
  try {
    await store.deleteTask(props.task.id);
  } finally {
    isDeleting.value = false;
  }
}
</script>

<template>
  <div class="card bg-base-100 border border-base-200 shadow-sm group">
    <div class="card-body p-4 gap-2">
      <!-- View mode -->
      <template v-if="!isEditing">
        <div class="flex items-start gap-3">
          <input
            type="checkbox"
            class="checkbox checkbox-primary mt-0.5 shrink-0"
            :checked="task.completed === 1"
            @change="handleToggle"
          />
          <div class="flex-1 min-w-0">
            <p
              class="font-medium break-words"
              :class="{ 'line-through text-base-content/40': task.completed === 1 }"
            >
              {{ task.title }}
            </p>
            <p
              v-if="task.description"
              class="text-sm text-base-content/60 mt-0.5 break-words"
              :class="{ 'line-through': task.completed === 1 }"
            >
              {{ task.description }}
            </p>
          </div>

          <!-- Action buttons (visible on hover) -->
          <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              class="btn btn-ghost btn-xs"
              title="Edit"
              @click="startEdit"
            >
              ✎
            </button>
            <button
              class="btn btn-ghost btn-xs text-error"
              title="Delete"
              :class="{ loading: isDeleting }"
              :disabled="isDeleting"
              @click="handleDelete"
            >
              ✕
            </button>
          </div>
        </div>
      </template>

      <!-- Edit mode -->
      <template v-else>
        <input
          v-model="editTitle"
          type="text"
          class="input input-bordered input-sm w-full"
          placeholder="Task title"
          :disabled="isSaving"
          @keyup.enter="saveEdit"
          @keyup.escape="cancelEdit"
        />
        <textarea
          v-model="editDescription"
          class="textarea textarea-bordered textarea-sm w-full resize-none"
          placeholder="Description (optional)"
          rows="2"
          :disabled="isSaving"
        />
        <div class="flex justify-end gap-2">
          <button class="btn btn-ghost btn-sm" :disabled="isSaving" @click="cancelEdit">
            Cancel
          </button>
          <button
            class="btn btn-primary btn-sm"
            :class="{ loading: isSaving }"
            :disabled="isSaving"
            @click="saveEdit"
          >
            Save
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
