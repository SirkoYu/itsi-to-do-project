<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const auth = useAuthStore();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const error = ref('');

async function handleSubmit() {
  if (!email.value || !password.value || !confirmPassword.value) {
    error.value = 'Please fill in all fields';
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    return;
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters';
    return;
  }

  isLoading.value = true;
  error.value = '';

  try {
    await auth.register(email.value, password.value);
    router.push('/');
  } catch (err: unknown) {
    const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
    error.value = message ?? 'Registration failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
    <div class="card w-full max-w-sm bg-base-100 shadow-lg">
      <div class="card-body">
        <div class="text-center mb-2">
          <h1 class="text-3xl font-bold text-primary">✓ Tick</h1>
          <p class="text-base-content/60 text-sm mt-1">Create your account</p>
        </div>

        <div v-if="error" class="alert alert-error text-sm py-2">
          {{ error }}
        </div>

        <form class="flex flex-col gap-3" @submit.prevent="handleSubmit">
          <div class="form-control">
            <label class="label pb-1">
              <span class="label-text">Email</span>
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="you@example.com"
              class="input input-bordered"
              autocomplete="email"
              :disabled="isLoading"
              required
            />
          </div>

          <div class="form-control">
            <label class="label pb-1">
              <span class="label-text">Password</span>
            </label>
            <input
              v-model="password"
              type="password"
              placeholder="Min. 6 characters"
              class="input input-bordered"
              autocomplete="new-password"
              :disabled="isLoading"
              required
            />
          </div>

          <div class="form-control">
            <label class="label pb-1">
              <span class="label-text">Confirm Password</span>
            </label>
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              class="input input-bordered"
              autocomplete="new-password"
              :disabled="isLoading"
              required
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary mt-2"
            :class="{ loading: isLoading }"
            :disabled="isLoading"
          >
            Create Account
          </button>
        </form>

        <p class="text-center text-sm text-base-content/60 mt-2">
          Already have an account?
          <router-link to="/login" class="link link-primary">Sign In</router-link>
        </p>
      </div>
    </div>
  </div>
</template>
