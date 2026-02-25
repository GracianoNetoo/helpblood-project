<script setup>
import { Droplet, ArrowRight, Menu, X } from 'lucide-vue-next';
import { ref, onMounted, onUnmounted } from 'vue';

const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);
const activeLink = ref('home');

const handleScroll = () => {
    isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
    <header 
        class="fixed top-0 left-0 w-full z-50 transition-all duration-300 pointer-events-none"
        :class="isScrolled ? 'pt-4' : 'pt-6'"
    >
        <div class="container mx-auto px-4 md:px-6 flex justify-center pointer-events-auto">
            
            <!-- Navbar Pill Container -->
            <nav 
                class="flex items-center justify-between px-6 py-3 w-full max-w-[1200px] rounded-full transition-all duration-300"
                :class="isScrolled ? 'bg-white/80 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-200/50' : 'bg-white/60 backdrop-blur-xl border border-white shadow-[0_2px_10px_rgb(0,0,0,0.02)]'"
            >
                
                <!-- Logo -->
                <div class="flex items-center gap-2.5">
                    <Droplet class="w-[22px] h-[22px] text-rose-600 fill-rose-600/20" stroke-width="2.5" />
                    <span class="text-[20px] font-black text-gray-900 tracking-tight">UniVida</span>
                </div>

                <!-- Desktop Navigation Items -->
                <div class="hidden md:flex items-center gap-1 bg-gray-100/50 p-1 rounded-full border border-gray-200/50">
                    <a href="#home" @click="activeLink = 'home'" :class="activeLink === 'home' ? 'text-gray-900 bg-white shadow-sm border-gray-200/30' : 'text-gray-500 hover:text-gray-900 hover:bg-white/50 border-transparent'" class="px-5 py-2 rounded-full text-[14px] font-semibold border transition-all">Home</a>
                    <a href="#campanhas" @click="activeLink = 'campanhas'" :class="activeLink === 'campanhas' ? 'text-gray-900 bg-white shadow-sm border-gray-200/30' : 'text-gray-500 hover:text-gray-900 hover:bg-white/50 border-transparent'" class="px-5 py-2 rounded-full text-[14px] font-semibold border transition-all">Campanhas</a>
                    <a href="#missao" @click="activeLink = 'missao'" :class="activeLink === 'missao' ? 'text-gray-900 bg-white shadow-sm border-gray-200/30' : 'text-gray-500 hover:text-gray-900 hover:bg-white/50 border-transparent'" class="px-5 py-2 rounded-full text-[14px] font-semibold border transition-all">Missão</a>
                </div>

                <!-- Desktop CTA Actions -->
                <div class="hidden md:flex items-center gap-3">
                    <button 
                        @click="$emit('click-login')"
                        class="text-[14px] font-bold text-gray-500 hover:text-gray-900 px-3 py-2 transition-colors">
                        Iniciar Sessão
                    </button>
                    <!-- Trigger Event expected by App.vue -->
                    <button 
                        @click="$emit('click-cadastro')"
                        class="group bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-full text-[14px] font-bold shadow-md shadow-gray-900/10 transition-all hover:scale-105 flex items-center gap-2"
                    >
                        Criar Conta
                        <ArrowRight class="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" stroke-width="2.5" />
                    </button>
                </div>

                <!-- Mobile Menu Button -->
                <button 
                    @click="isMobileMenuOpen = !isMobileMenuOpen"
                    class="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <Menu v-if="!isMobileMenuOpen" class="w-6 h-6" />
                    <X v-else class="w-6 h-6" />
                </button>

            </nav>
        </div>

        <!-- Mobile Menu Dropdown -->
        <div 
            v-if="isMobileMenuOpen" 
            class="absolute top-[80px] left-0 right-0 bg-white/95 backdrop-blur-3xl shadow-xl border-t border-gray-100 p-6 flex flex-col gap-4 pointer-events-auto md:hidden"
        >
            <a href="#home" @click="isMobileMenuOpen = false; activeLink = 'home'" :class="activeLink === 'home' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'" class="text-[16px] font-bold py-2 border-b border-gray-100 transition-colors">Home</a>
            <a href="#campanhas" @click="isMobileMenuOpen = false; activeLink = 'campanhas'" :class="activeLink === 'campanhas' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'" class="text-[16px] font-bold py-2 border-b border-gray-100 transition-colors">Campanhas</a>
            <a href="#missao" @click="isMobileMenuOpen = false; activeLink = 'missao'" :class="activeLink === 'missao' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'" class="text-[16px] font-bold py-2 border-b border-gray-100 transition-colors">Missão</a>
            
            <div class="flex flex-col gap-3 mt-4">
                <button 
                    @click="$emit('click-login'); isMobileMenuOpen = false"
                    class="w-full text-center text-[15px] font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 py-3.5 rounded-[16px] transition-colors border border-gray-200">
                    Iniciar Sessão
                </button>
                <button 
                    @click="$emit('click-cadastro'); isMobileMenuOpen = false"
                    class="w-full text-center bg-gray-900 hover:bg-black text-white py-3.5 rounded-[16px] text-[15px] font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                    Criar Conta <ArrowRight class="w-4 h-4" />
                </button>
            </div>
        </div>
    </header>
</template>