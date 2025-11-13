<script setup lang="ts">
import { useRoute } from "vue-router";

const { resetPassword, resetPasswordFormState } = useAuthentication();
const emit = defineEmits(["save", "cancel"]);

const route = useRoute();

const parseHashParams = (hash: string) => {
  if (!hash) return {};
  return hash
    .substring(1)
    .split("&")
    .reduce((acc, part) => {
      const [key, value] = part.split("=");
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
};

const hashParams = parseHashParams(route.hash);
if (hashParams.access_token) {
  resetPasswordFormState.value.token = hashParams.access_token;
}

const handleSubmit = async () => {
  const response = await resetPassword();
};

const showPassword = ref(false);

const generatePassword = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
  let password = "";
  for (let i = 0; i < 25; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  resetPasswordFormState.value.password = password;

  // Copy to clipboard
  if (navigator.clipboard) {
    navigator.clipboard.writeText(password).then(() => {
      // Optional: show a toast or alert
      console.log("Password copied to clipboard!");
    });
  } else {
    console.warn("Clipboard API not supported");
  }
};
</script>

<template>
  <UForm @submit.prevent="handleSubmit" :state="resetPasswordFormState">
    <UFormGroup
      class="py-3 relative"
      label="Enter your new password to continue"
      name="password"
      type="password"
    >
      <div class="relative">
        <UInput
          class="py-4"
          :type="showPassword ? 'text' : 'password'"
          v-model="resetPasswordFormState.password"
          autocomplete="new-password"
          placeholder="Enter your new password"
        >
          <template #trailing>
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="p-1 text-gray-500 hover:text-gray-900 transition pointer-events-auto flex"
              style="align-items: center;"
            >
              <UIcon
                :name="showPassword ? 'mdi:eye-off' : 'mdi:eye'"
                class="w-5 h-5"
              />
            </button>
          </template>
        </UInput>
      </div>
      <div>
        <UButton
          @click="generatePassword"
          class="flex justify-end"
          color="gray"
        >
          Generate
        </UButton>
      </div>
    </UFormGroup>

    <div class="flex justify-center pb-10">
      <UButton color="primary" block type="submit">Submit</UButton>
    </div>
  </UForm>
</template>
