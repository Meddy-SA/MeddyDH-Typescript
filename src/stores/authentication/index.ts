// stores/authentication/index.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { LoginDto, UserData } from "../../services/authentication/types";
import { DefaultUser } from "../../services/authentication/types.ts";
import type { APIResponse } from "../../services/types";
import { API } from "../../services";
import { handleApiError } from "../../services/seviceHandler.ts";

export const useUserStore = defineStore("user", () => {
  const userData = ref<UserData>(DefaultUser);

  function setUserData(data: UserData): void {
    userData.value = data;
  }

  async function dispatchLogin(
    credentials: LoginDto
  ): Promise<APIResponse<string | null>> {
    try {
      const res = await API.authentication.login(credentials);
      if (res.status === 200) {
        setUserData(res.content);
        return { success: res.success, content: null };
      }
      throw new Error(`Unexpected status ${res.status}`);
    } catch (error) {
      return handleApiError(error);
    }
  }

  return {
    userData,
    dispatchLogin,
  };
});
