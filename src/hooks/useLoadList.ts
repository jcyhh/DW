import type { Api } from "@/config/http";
import { t } from "@/locale";
import { apiGet } from "@/utils/request";
import { nextTick, ref, computed, type ComputedRef, type Ref } from "vue";

export function useLoadList(api:Api, listName:string = 'list', params:Ref | ComputedRef | null = null, size:number = 10){
    let pageNo:number = 1
    let pageSize:number = size
    const list = ref<any[]>()
    const listData = ref()
    const loading = ref(false)
    const finished = ref(false)

    const load = (isFirst:boolean=false) => {
        let obj = {
            page_no: pageNo,
            page_size: pageSize
        }
        if(params)obj = { ...obj, ...params.value }
        apiGet(api, obj).then((res:any)=>{
            listData.value = res
            if(res[listName]){
                const data = listName ? res[listName] : res
                list.value = isFirst ? data : list.value?.concat(data)
                loading.value = false
                finished.value = data.length < pageSize
            }else{
                loading.value = false
                finished.value = true
            }
        })
    }

    const loadMore = () => {
        if(finished.value)return
        listData.value = true
        pageNo += 1
        load()
    }

    const loadList = async () => {
        await nextTick()
        finished.value = false;
        loading.value = true;
        pageNo = 1
        list.value = []
        load(true);
    }

    const props = computed(() => ({
        'loading-text': t('加载中...'),
        'finished-text': t('没有更多了'),
        'immediate-check': false,
        finished: finished.value,
        loading: loading.value,
        'onUpdate:loading': (value:boolean) => { loading.value = value },
        onLoad: loadMore
    }))

    return {
        list,
        listData,
        props,
        loading,
        finished,
        loadList,
        loadMore
    }
}