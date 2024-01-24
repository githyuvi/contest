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
                <div id="mobileMenu" class="hidden absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg">
                    <!-- Add your mobile menu items here -->
                    <div class="cursor-pointer px-4 py-2 bg-black hover:bg-gray-700">Mobile Home</div>
                    <div class="cursor-pointer px-4 py-2 bg-black hover:bg-gray-700">Mobile Register</div>
                    <!-- ... (additional mobile menu items) ... -->
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