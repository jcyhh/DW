import { ref } from "vue";

export function usePopup() {
    const popups = ref<Record<string, boolean>>({})

    function openpop(name:string){
        Object.keys(popups.value).forEach(key=>popups.value[key]=false)
        popups.value[name] = true
    }

    function closepop(name:string){
        popups.value[name] = false
    }

    return {
        popups,
        openpop,
        closepop
    }
}