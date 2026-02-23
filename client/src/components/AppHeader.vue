<script setup lang="ts">
import { useAuthStore } from '../stores/authStore';

const auth = useAuthStore();
</script>

<template>
  <div class="navbar bg-base-100 border-b border-base-200 px-4">
    <div class="flex-1">
      <span class="text-xl font-bold text-primary">✓ Tick</span>
      <span class="ml-2 text-sm text-base-content/60">Your personal task list</span>
    </div>
    <div class="flex-none gap-2">
      <span class="text-sm text-base-content/70 hidden sm:block">{{ auth.user?.email }}</span>
      <button class="btn btn-ghost btn-sm" @click="auth.logout()">
        Logout
      </button>
    </div>
  </div>
</template>
