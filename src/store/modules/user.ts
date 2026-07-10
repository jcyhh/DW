import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {

    const inviteCode = ref('')

    const inviteLink = ref('')

    const isLoginIn = ref(false)

    return {
        inviteCode,
        inviteLink,
        isLoginIn
    }
})