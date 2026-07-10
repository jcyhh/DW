import { t } from "@/locale"
import { ref, computed } from "vue"

export function usePullRefresh(callback:Function) {
    const loading = ref(false)

    const refresh = async () => {
        await callback()
        loading.value = false
    }

    const props = computed(() => ({
        'pulling-text': t('下拉即可刷新...'),
        'loosing-text': t('释放即可刷新...'),
        'loading-text': t('加载中...'),
        modelValue: loading.value,
        'onUpdate:modelValue': (value:boolean) => { loading.value = value },
        onRefresh: refresh
    }))

    return {
        loading,
        props,
        refresh
    }
}