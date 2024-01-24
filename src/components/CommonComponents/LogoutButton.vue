<template>
    <div>
        <button @click="handleClick" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Sign Out
        </button>

    </div>
</template>

<script setup>
    import { signOut, getAuth } from '@firebase/auth';
    import { useRouter } from 'vue-router';

    const auth = getAuth()
    const router = useRouter()

    async function handleClick(){
        await signOut(auth).then(async () => {
        await router.push("/").then((result) => window.location.reload());
  
    });
        
    }
</script>

<style lang="scss" scoped>

</style>