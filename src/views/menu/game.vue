<template>
    <div class="chatPage">
        <iframe :src="url" class="chat" @load="isLoading=false" v-if="url"></iframe>
        <div class="load flex col jc ac" v-if="isLoading">
            <CusEmpty></CusEmpty>
            <van-loading>{{ $t('加载中...') }}</van-loading>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getAddress, getLang, getToken } from '@/config/storage';
import { routerReplace } from '@/router';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import CusEmpty from '@/components/CusEmpty/index.vue'

const isLoading = ref(true)

const url = computed(()=>{
    const wsUrl = `${window.origin.replace(/^http/, 'ws')}/ws`

    const data = {
        token: getToken(),
        address: getAddress(),
        lang: getLang(),
        apiUrl: window.origin,
        wsUrl,
        hostEnv: 'h5'
    }

    const searchParams = new URLSearchParams(data)

    console.log(data);
    
    return `${window.origin}/h5/battle/?${searchParams.toString()}`
    // return `${window.origin}/h5/battle/index.html?${searchParams.toString()}`
})

function parseCocosMessage(data: unknown) {
    if (typeof data === 'string') {
        const query = data.startsWith('?') ? data.slice(1) : data
        const params = new URLSearchParams(query)
        return {
            type: params.get('type') || '',
            action: params.get('action') || '',
            data: params.get('data') || ''
        }
    }

    if (data && typeof data === 'object') {
        return data as { type?: string; action?: string; data?: unknown }
    }

    return null
}

const onMessage = (e:MessageEvent) => {
    const message = parseCocosMessage(e.data)
    const type = message?.type || message?.action
  	if(type === "back" || type === "navBack"){
        routerReplace('/home/index')
    }

    if(type === "onLoading"){
        console.log('111');
        
        isLoading.value = false
    }
}

onMounted(()=>{
    window.addEventListener("message", onMessage)
})

onUnmounted(()=>{
    window.removeEventListener("message", onMessage)
})
</script>

<style lang="scss" scoped>
.chatPage{
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    position: fixed;
    inset: 0;
    z-index: 1000;
    overflow: hidden;
}
.chat{
    display: block;
    width: 100%;
    height: 100%;
    border: none;
}
.load{
    position: absolute;
    inset: 0;
    z-index: 10;
}
</style>
