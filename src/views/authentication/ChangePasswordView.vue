<script setup lang="ts">
import { ref } from "vue";
import { useAlertStore, useAuthStore } from "../../stores";
import { useUserStore } from "../../stores/authentication";
import Password from "primevue/password";
import Button from "primevue/button";
import type { UpdatePassword } from "../../services/authentication/types";

const alertStore = useAlertStore();
const userStore = useUserStore();
const authStore = useAuthStore();

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const isLoading = ref(false);

const changePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    alertStore.toastAlert(
      "Las contraseñas nuevas no coinciden",
      "error",
      5,
      "Error"
    );
    return;
  }

  isLoading.value = true;
  try {
    const updatePass: UpdatePassword = {
      user: authStore.userName,
      email: authStore.email,
      oldPassword: currentPassword.value,
      newPassword: newPassword.value,
    };
    const response = await userStore.changePassword(updatePass);
    if (response.success) {
      alertStore.toastAlert(
        "Contraseña cambiada exitosamente",
        "success",
        5,
        "Éxito"
      );
      currentPassword.value = "";
      newPassword.value = "";
      confirmPassword.value = "";
    } else {
      console.log("Change Password View: ", response);
      alertStore.toastAlert(
        response.content || "Error al cambiar la contraseña",
        "error",
        5,
        "Error"
      );
    }
  } catch (error) {
    alertStore.exception(error, 10);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="change-password-container">
    <h2 class="text-2xl font-bold mb-4 text-gray-700">Cambiar Contraseña</h2>
    <form @submit.prevent="changePassword" class="space-y-4">
      <div>
        <label for="currentPassword" class="labelInput">Contraseña Actual</label>
        <Password id="currentPassword" v-model="currentPassword" :feedback="false" toggleMask inputClass="w-full" />
      </div>
      <div>
        <label for="newPassword" class="labelInput">Nueva Contraseña</label>
        <Password id="newPassword" v-model="newPassword" toggleMask inputClass="w-full" />
      </div>
      <div>
        <label for="confirmPassword" class="labelInput">Confirmar Nueva Contraseña</label>
        <Password id="confirmPassword" v-model="confirmPassword" :feedback="false" toggleMask inputClass="w-full" />
      </div>
      <Button type="submit" label="Cambiar Contraseña" :loading="isLoading" class="w-full" />
    </form>
  </div>
</template>

<style scoped>
.change-password-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}
</style>
