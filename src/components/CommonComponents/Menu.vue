<template>
    <div class="container mx-auto flex justify-between items-center">
        <!-- ... (existing header content) ... -->

        <!-- dropdown menu button visible if screen width less than 600px -->
        <div class="md:hidden relative">
            <nav>
                <!-- Dropdown Menu button -->
                <button
                    aria-expanded="false"
                    type="button"
                    class="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded"
                    @click="toggleMobileMenu"
                >
                    Menu
                </button>

                <!-- Mobile Dropdown Menu -->
                <div id="mobileMenu" class="hidden absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
                    
                    <router-link :to="`/register`"><div class="cursor-pointer bg-gray-700 pr-4 pl-4 pb-2">Register</div></router-link>
                    <router-link :to="`/admin`"><div class="cursor-pointer bg-gray-700 pr-4 pl-4">Admin Dashboard</div></router-link>
                    
                </div>
            </nav>
        </div>
    </div>
</template>

<script setup>
 function toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        mobileMenu.classList.toggle('hidden');
    }
</script>

<style lang="scss" scoped>

</style>