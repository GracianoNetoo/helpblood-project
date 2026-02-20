<script setup>
import { ref } from 'vue'
import RegisterForm from './RegisterForm.vue' // O formulário que já fizemos

const abaAtiva = ref('cadastro') 
</script>

<template>
    <div class="flex flex-col w-full md:flex-row min-h-150 max-w-10xl bg-white overflow-hidden shadow-2xl">

        <div class="w-full md:w-1/3 bg-slate-900 p-8 flex flex-col justify-center gap-6">
            <h2 class="text-white text-xl font-bold mb-4 opacity-50 uppercase tracking-widest">Opções</h2>

            <button @click="abaAtiva = 'cadastro'"
                :class="abaAtiva === 'cadastro' ? 'bg-red-600 text-white shadow-lg scale-105' : 'bg-slate-800 text-gray-400 hover:bg-slate-700'"
                class="p-6 rounded-2xl font-black text-2xl transition-all duration-300 text-center">
                CADASTRO
            </button>

            <button @click="abaAtiva = 'login'"
                :class="abaAtiva === 'login' ? 'bg-red-600 text-white shadow-lg scale-105' : 'bg-slate-800 text-gray-400 hover:bg-slate-700'"
                class="p-6 rounded-2xl font-black text-2xl transition-all duration-300 text-center">
                LOGIN
            </button>

            <p class="mt-8 text-gray-500 text-sm text-center italic">
                "Escolha uma opção para continuar sua jornada no UniVida."
            </p>
        </div>

        <div class="w-full md:w-2/3 p-10 bg-gray-50 flex items-center justify-center">

            <Transition name="fade" mode="out-in">
                <div :key="abaAtiva" class="w-full">

                    <div v-if="abaAtiva === 'cadastro'">
                        <RegisterForm />
                    </div>

                    <div v-else class="flex items-center justify-center h-full">
                        <div class="w-200 h-100 p-8 bg-white rounded-2xl shadow-lg">
                            <h2 class="text-5xl text-black font-bold mb-9">Bem-vindo de volta!</h2>
                            <input type="email" placeholder="E-mail" class="input input-bordered w-full mb-9" />
                            <input type="password" placeholder="Palavra-passe"
                            class="input input-bordered w-full mb-9" />
                            <button class="btn text-2xl bg-red-600 w-full text-white mb-2">Entrar</button>
                            <a href="#" class="text-red-600 hover:underline">Esqueceu a senha?</a>
                        </div>
                    </div>
                </div>
            </Transition>

        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>