<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useAlertStore, useAuthStore } from "../../stores";
import { useUserStore } from "../../stores/authentication";
import { useNomenclaturaStore } from "../../stores/nomenclaturas";
import { storeToRefs } from "pinia";
import { useImageCompressor } from "../../composables/useImageCompressor";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
import {
  ensureBase64Format,
  isValidBase64Image,
} from "../../composables/useImage.ts";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import FileUpload from "primevue/fileupload";
import MultiSelect from "primevue/multiselect";
import ToggleSwitch from "primevue/toggleswitch";
import BlockUI from "primevue/blockui";
import ProgressSpinner from "primevue/progressspinner";
import Image from "primevue/image";
import Avatar from "primevue/avatar";
import {
  DefaultProfile,
  type PersonalDataDTO,
} from "../../services/authentication/types";

// Composables
const alertStore = useAlertStore();
const userStore = useUserStore();
const authStore = useAuthStore();
const nomenclaturaStore = useNomenclaturaStore();
const { personalData, isLoading } = storeToRefs(userStore);
const { roles: rolesList } = storeToRefs(nomenclaturaStore);
const { compressImage } = useImageCompressor();

// Computed Properties
const userProfile = computed({
  get: () => (personalData.value as PersonalDataDTO) || DefaultProfile,
  set: (value) => userStore.setPersonalData(value),
});

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

// Validation rules
const rules = {
  firstName: { required, minLength: minLength(2), maxLength: maxLength(50) },
  lastName: { required, minLength: minLength(2), maxLength: maxLength(50) },
};

const v$ = useVuelidate(rules, userProfile);

// Lifecycle Hooks
onMounted(async () => {
  await fetchUserProfile();
  await fetchRoles();
});

// Methods
const fetchUserProfile = async () => {
  isLoading.value = true;
  try {
    const { success } = await userStore.fetchUserProfile();
    if (success) {
      userProfile.value = personalData.value as PersonalDataDTO;
      if (userProfile.value.avatar) {
        userProfile.value.avatar = ensureBase64Format(userProfile.value.avatar);
      }
    } else {
      alertStore.toastAlert("Error al cargar el perfil", "error", 5, "Error");
    }
  } catch (error) {
    alertStore.exception(error, 10);
  } finally {
    isLoading.value = false;
  }
};

const fetchRoles = async () => {
  try {
    const { success } = await nomenclaturaStore.fetchRoles();
    if (!success) {
      alertStore.toastAlert("Error al cargar los roles", "error", 5, "Error");
    }
  } catch (error) {
    alertStore.exception(error, 10);
  }
};

const updateProfile = async () => {
  const isFormCorrect = await v$.value.$validate();

  if (!isFormCorrect) {
    alertStore.toastAlert(
      "Por favor, corrija los campos obligatorios",
      "error",
      5,
      "Error"
    );
    return;
  }

  isLoading.value = true;
  try {
    const response = await userStore.updateUserProfile(userProfile.value);
    if (response.success) {
      alertStore.toastAlert(
        "Perfil actualizado exitosamente",
        "success",
        5,
        "Éxito"
      );
      if (userProfile.value.avatar) {
        userProfile.value.avatar = ensureBase64Format(userProfile.value.avatar);
        authStore.updateAvatar(userProfile.value.avatar);
      }
    } else {
      throw new Error(response.error || "Error al actualizar el perfil");
    }
  } catch (error) {
    alertStore.exception(error, 10);
  } finally {
    isLoading.value = false;
  }
};

const onPhotoSelect = async (event: { files: File[] }) => {
  const file = event.files[0];
  if (file) {
    isLoading.value = true;
    try {
      const compressedFile = await compressImage(file, {
        maxWidth: 300,
        maxHeight: 300,
        quality: 0.7,
        mimeType: "image/jpeg",
      });

      if (compressedFile.size > MAX_FILE_SIZE) {
        alertStore.toastAlert(
          `El archivo es demasiado grande. El tamaño máximo es ${MAX_FILE_SIZE / 1024
          }KB.`,
          "error",
          5,
          "Seleccione otra imagen"
        );
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        userProfile.value!.avatar = reader.result as string;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alertStore.toastAlert(
        "Error al procesar la imagen. Por favor, intente con otra imagen.",
        "error",
        5,
        "Error"
      );
    } finally {
      isLoading.value = false;
    }
  }
};

const removeUploadedFile = () => {
  userProfile.value!.avatar = "";
};
</script>

<template>
  <div class="user-profile-edit-container">
    <h2 class="text-2xl text-gray-800 font-bold mb-4">
      Editar Perfil de Usuario
    </h2>
    <BlockUI :blocked="isLoading">
      <ProgressSpinner v-show="isLoading" />
      <form @submit.prevent="updateProfile" class="card w-full">
        <div class="grid grid-cols-6 gap-4">
          <div class="col-span-6 sm:col-span-3">
            <label for="firstName" class="labelInput">Nombre <span class="text-red-500">*</span></label>
            <InputText id="firstName" v-model="userProfile.firstName" maxlength="50" class="w-full" />
            <p class="mt-0 text-sm text-red-600 dark:text-red-500">
              <span v-if="v$.firstName.$error">{{
                v$.firstName.$errors[0].$message
                }}</span>
            </p>
          </div>

          <div class="col-span-6 sm:col-span-3">
            <label for="middleName" class="labelInput">Segundo Nombre</label>
            <InputText id="middleName" v-model="userProfile.middleName" maxlength="50" class="w-full" />
          </div>

          <div class="col-span-6 sm:col-span-3">
            <label for="lastName" class="labelInput">Apellido <span class="text-red-500">*</span></label>
            <InputText id="lastName" v-model="userProfile.lastName" maxlength="50" class="w-full" />
            <p class="mt-0 text-sm text-red-600 dark:text-red-500">
              <span v-if="v$.lastName.$error">{{
                v$.lastName.$errors[0].$message
                }}</span>
            </p>
          </div>

          <div class="col-span-6 sm:col-span-3">
            <label for="secondSurName" class="labelInput">Segundo Apellido</label>
            <InputText id="secondSurName" v-model="userProfile.secondSurName" maxlength="50" class="w-full" />
          </div>

          <div class="col-span-6">
            <label for="roles" class="labelInput">Roles</label>
            <MultiSelect id="roles" v-model="userProfile.roles" :options="rolesList" optionLabel="nombre" display="chip"
              filter class="w-full" />
          </div>

          <div class="col-span-6">
            <label for="photo" class="labelInput">Foto de Perfil</label>
            <div class="grid grid-cols-6 gap-4">
              <div class="col-span-3">
                <FileUpload mode="basic" accept="image/*" :maxFileSize="2000000" @select="onPhotoSelect" class="w-full"
                  :custom-upload="true" :auto="true" choose-label="Seleccionar Imagen" />
              </div>
              <div v-if="
                userProfile.avatar && isValidBase64Image(userProfile.avatar)
              " class="col-span-3 flex items-center gap-2">
                <Image width="50" preview>
                  <template #image>
                    <Avatar :image="userProfile.avatar" size="xlarge" shape="circle" />
                  </template>
                  <template #preview="slotProps">
                    <img :src="userProfile.avatar" alt="Avatar" :style="slotProps.style" @click="slotProps.onClick" />
                  </template>
                </Image>
                <Button icon="pi pi-times" @click="removeUploadedFile" severity="danger" text raised rounded
                  aria-label="Borrar"></Button>
              </div>
            </div>
          </div>

          <div class="col-span-6">
            <label for="2fa" class="labelInput">Autenticación de dos factores</label>
            <ToggleSwitch v-model="userProfile.enable2FA" class="w-full" />
          </div>

          <div class="col-span-6 mt-4">
            <div class="flex justify-center gap-4">
              <Button type="submit" label="Actualizar Perfil" icon="pi pi-check" :loading="isLoading" severity="info" />
            </div>
          </div>
        </div>
      </form>
    </BlockUI>
  </div>
</template>

<style scoped>
.user-profile-edit-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
</style>
