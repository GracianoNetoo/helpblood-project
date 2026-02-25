<script setup>
import { ref, defineEmits } from 'vue'
import RegisterForm from './RegisterForm.vue'
import { LogIn, UserPlus, Droplet, ArrowRight, ShieldCheck } from 'lucide-vue-next';

const emit = defineEmits(['sucesso'])
const abaAtiva = ref('cadastro') 

const realizarLoginManual = () => {
    // Simula validação de login
    emit('sucesso')
}
</script>

<template>
    <div class="flex flex-col md:flex-row w-full max-w-[1100px] min-h-auto md:min-h-[600px] bg-white overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-gray-100/50 rounded-[32px] md:rounded-[40px] relative z-20 m-auto">
        
        <!-- Sidebar Navigation (Auth Modes) -->
        <div class="w-full md:w-[320px] bg-linear-to-br from-[#0F172A] to-[#1E293B] p-8 md:p-10 flex flex-col justify-between gap-6 relative overflow-hidden shrink-0 group">
            <!-- Glow Effects -->
            <div class="absolute top-0 right-0 w-[300px] h-[300px] bg-rose-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none transition-all duration-700 group-hover:bg-rose-500/20"></div>
            
            <div class="relative z-10">
                <div class="flex items-center gap-2.5 mb-12">
                    <Droplet class="w-6 h-6 text-rose-500" stroke-width="2.5" />
                    <span class="text-xl font-black text-white tracking-tight">UniVida</span>
                </div>
                
                <h2 class="text-white text-[11px] font-bold mb-6 opacity-50 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span class="w-4 h-px bg-white/30"></span> Acesso Segurado
                </h2>
                
                <div class="flex flex-row md:flex-col gap-3">
                    <button @click="abaAtiva = 'cadastro'"
                        :class="abaAtiva === 'cadastro' 
                            ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/20 border-rose-500 ring-1 ring-white/20' 
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border-transparent'"
                        class="flex-1 md:w-full p-4 rounded-[20px] font-bold text-[15px] transition-all duration-300 text-left flex items-center gap-3 border backdrop-blur-sm group/btn">
                        <div :class="abaAtiva === 'cadastro' ? 'bg-white/20' : 'bg-gray-800'" class="w-10 h-10 rounded-[12px] flex items-center justify-center transition-colors">
                           <UserPlus class="w-5 h-5" :class="abaAtiva === 'cadastro' ? 'text-white' : 'text-gray-400 group-hover/btn:text-white'" stroke-width="2" />
                        </div>
                        <span class="hidden sm:block">Criar Conta</span>
                    </button>
                    
                    <button @click="abaAtiva = 'login'"
                        :class="abaAtiva === 'login' 
                            ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/20 border-rose-500 ring-1 ring-white/20' 
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border-transparent'"
                        class="flex-1 md:w-full p-4 rounded-[20px] font-bold text-[15px] transition-all duration-300 text-left flex items-center gap-3 border backdrop-blur-sm group/btn">
                        <div :class="abaAtiva === 'login' ? 'bg-white/20' : 'bg-gray-800'" class="w-10 h-10 rounded-[12px] flex items-center justify-center transition-colors">
                           <LogIn class="w-5 h-5" :class="abaAtiva === 'login' ? 'text-white' : 'text-gray-400 group-hover/btn:text-white'" stroke-width="2" />
                        </div>
                        <span class="hidden sm:block">Fazer Login</span>
                    </button>
                </div>
            </div>

            <div class="relative z-10 mt-auto pt-8 border-t border-white/10 hidden md:flex items-start gap-3 text-[13px] text-gray-400 font-medium">
                <ShieldCheck class="w-5 h-5 shrink-0 text-emerald-400" stroke-width="2" />
                <p>Os seus dados médicos são encriptados ponto-a-ponto e partilhados apenas com hospitais autorizados.</p>
            </div>
        </div>

        <!-- Main Content Area -->
        <div class="w-full md:flex-1 p-6 md:p-12 bg-white flex flex-col justify-center relative min-h-auto md:min-h-[500px]">
            <!-- Abstract background pattern -->
            <div class="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] bg-size-[24px_24px] opacity-30 mix-blend-multiply pointer-events-none"></div>

            <Transition name="fade" mode="out-in">
                <div :key="abaAtiva" class="w-full relative z-10 h-full flex flex-col justify-center">
                    
                    <!-- Cadastro -->
                    <div v-if="abaAtiva === 'cadastro'" class="w-full max-w-2xl mx-auto animation-slide-up">
                        <div class="mb-8">
                            <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Junte-se à Rede</h2>
                            <p class="text-[15px] text-gray-500 font-medium">Complete os seus dados básicos para integrar o banco nacional de doadores.</p>
                        </div>
                        <RegisterForm @sucesso="$emit('sucesso')" />
                    </div>
                    
                    <!-- Login -->
                    <div v-else-if="abaAtiva === 'login'" class="w-full max-w-md mx-auto animation-slide-up">
                        <div class="mb-10 text-center">
                            <div class="w-16 h-16 bg-rose-50 text-rose-600 rounded-[20px] flex items-center justify-center mx-auto mb-6 border border-rose-100">
                                <Droplet class="w-8 h-8 fill-rose-600/20" stroke-width="2" />
                            </div>
                            <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Bem-vindo de volta</h2>
                            <p class="text-[15px] text-gray-500 font-medium">Há vidas esperando por si hoje.</p>
                        </div>
                        
                        <div class="space-y-5">
                            <div>
                                <label class="block text-[13px] font-bold text-gray-700 mb-1.5 ml-1">E-mail</label>
                                <input type="email" placeholder="nome@exemplo.com" class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[15px] rounded-[16px] px-5 py-4 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all placeholder:text-gray-400 font-medium" />
                            </div>
                            <div>
                                <div class="flex justify-between items-center mb-1.5 ml-1 mr-1">
                                    <label class="text-[13px] font-bold text-gray-700">Palavra-passe</label>
                                    <button @click="abaAtiva = 'recuperar'" class="text-[12px] font-bold text-rose-600 hover:text-rose-700 transition-colors">Esqueceu a senha?</button>
                                </div>
                                <input type="password" placeholder="••••••••" class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[15px] rounded-[16px] px-5 py-4 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium placeholder:text-gray-400" />
                            </div>
                            
                            <button @click="realizarLoginManual" class="w-full bg-gray-900 hover:bg-black text-white px-6 py-4 rounded-[16px] font-bold text-[15px] shadow-[0_4px_14px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-0.5 mt-4 flex justify-center items-center gap-2 group">
                                Acessar Painel
                                <ArrowRight class="w-4 h-4 text-gray-400 group-hover:text-white transition-colors group-hover:translate-x-1" stroke-width="2.5" />
                            </button>
                        </div>
                        
                        <p class="text-center text-[14px] text-gray-500 font-medium mt-8">
                            Não tem uma conta? <button @click="abaAtiva = 'cadastro'" class="text-rose-600 font-bold hover:underline">Registe-se agora</button>
                        </p>
                    </div>

                    <!-- Recuperar Senha -->
                    <div v-else-if="abaAtiva === 'recuperar'" class="w-full max-w-md mx-auto animation-slide-up">
                        <div class="mb-10 text-center">
                            <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-[20px] flex items-center justify-center mx-auto mb-6 border border-blue-100">
                                <ShieldCheck class="w-8 h-8 fill-blue-600/20" stroke-width="2" />
                            </div>
                            <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">Recuperar Acesso</h2>
                            <p class="text-[15px] text-gray-500 font-medium">Insira o seu email para receber um link de recuperação rápido e seguro.</p>
                        </div>
                        
                        <div class="space-y-5">
                            <div>
                                <label class="block text-[13px] font-bold text-gray-700 mb-1.5 ml-1">E-mail Registado</label>
                                <input type="email" placeholder="nome@exemplo.com" class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[15px] rounded-[16px] px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 font-medium" />
                            </div>
                            
                            <button @click="abaAtiva = 'login'" class="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-[16px] font-bold text-[15px] shadow-[0_4px_14px_rgba(37,99,235,0.2)] transition-all hover:-translate-y-0.5 mt-4 flex justify-center items-center gap-2">
                                Enviar Email de Recuperação
                            </button>
                        </div>
                        
                        <p class="text-center text-[14px] text-gray-500 font-medium mt-8">
                            Lembrou-se da senha? <button @click="abaAtiva = 'login'" class="text-gray-900 font-bold hover:underline">Faça login</button>
                        </p>
                    </div>

                </div>
            </Transition>
        </div>
    </div>
    
    <!-- Abstract Page Background (When visible in modal) -->
    <div class="fixed inset-0 pointer-events-none z-0 hidden lg:block">
        <div class="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-rose-200/20 rounded-full blur-[120px]"></div>
        <div class="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[120px]"></div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.animation-slide-up {
    animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>