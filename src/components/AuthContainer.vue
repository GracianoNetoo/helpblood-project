<script setup>
import { ref, defineEmits } from 'vue'
import RegisterForm from './RegisterForm.vue'

const emit = defineEmits(['sucesso'])
const abaAtiva = ref('cadastro') 

const realizarLoginManual = () => {
    // Simula validação de login
    emit('sucesso')
}
</script>

<template>
    <div class="flex flex-col w-full md:flex-row min-h-[600px] max-w-10xl bg-white overflow-hidden shadow-2xl rounded-3xl">
        <div class="w-full md:w-1/3 bg-slate-900 p-8 flex flex-col justify-center gap-6">
            <h2 class="text-white text-xl font-bold mb-4 opacity-50 uppercase tracking-widest text-center">Opções</h2>
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
        </div>

        <div class="w-full md:w-2/3 p-10 bg-gray-50 flex items-center justify-center">
            <Transition name="fade" mode="out-in">
                <div :key="abaAtiva" class="w-full">
                    <div v-if="abaAtiva === 'cadastro'">
                        <RegisterForm @sucesso="$emit('sucesso')" />
                    </div>
                    <div v-else class="flex items-center justify-center h-full">
                        <div class="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                            <h2 class="text-3xl text-black font-bold mb-6 text-center">Bem-vindo de volta!</h2>
                            <div class="space-y-4">
                                <input type="email" placeholder="E-mail" class="input input-bordered w-full bg-gray-50 text-gray-800" />
                                <input type="password" placeholder="Palavra-passe" class="input input-bordered w-full bg-gray-50 text-gray-800" />
                                <button @click="realizarLoginManual" class="btn bg-red-600 hover:bg-red-700 w-full text-white border-none h-14 text-xl">
                                    Entrar
                                </button>
                                <p class="text-center"><a href="#" class="text-red-600 hover:underline text-sm">Esqueceu a senha?</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>