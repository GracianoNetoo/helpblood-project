<script setup>
import { ref, computed, defineEmits } from 'vue';
import { Eye, EyeOff } from 'lucide-vue-next';
import { useDonorsStore } from '../stores/donorsStore';

const emit = defineEmits(['sucesso']);
const donorsStore = useDonorsStore();

const mostrarSenha = ref(false);
const mostrarSenhaConfirmacao = ref(false);
const submitted = ref(false);
const touched = ref({
    nome: false,
    tipo_sanguineo: false,
    rh: false,
    doacao_sangue: false,
    provincia: false,
    municipio: false,
    telefone: false,
    email: false,
    senha: false,
    confirmar_senha: false
});

const localizacaoAngola = {
    "Luanda": ["Belas", "Cacuaco", "Cazenga", "Kilamba Kiaxi", "Talatona", "Viana"],
    "Benguela": ["Baía Farta", "Benguela", "Catumbela", "Lobito"],
    "Huambo": ["Caála", "Huambo", "Mungo"]
};

const form = ref({
    nome: '',
    tipo_sanguineo: '',
    rh: '',
    provincia: '',
    telefone: '',
    email: '',
    doacao_sangue: '',
    senha: '',
    confirmar_senha: ''
});

const provinciaSelecionada = ref("");
const municipioSelecionado = ref("");

const municipiosDisponiveis = computed(() => {
    return provinciaSelecionada.value ? localizacaoAngola[provinciaSelecionada.value] : []
});

const aoMudarProvincia = () => {
    municipioSelecionado.value = ""
};

const telefoneInvalido = computed(() => {
    const tel = form.value.telefone.replace(/\s/g, '')
    if (tel.length === 0) return false
    return !(/^9[1-59]\d{7}$/.test(tel)) 
});

const emailInvalido = computed(() => {
    const email = form.value.email.trim();
    if (!email) return false;
    return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
});

const senhaCurta = computed(() => form.value.senha.length > 0 && form.value.senha.length < 8);
const senhaNaoCoincide = computed(() => form.value.confirmar_senha.length > 0 && form.value.senha !== form.value.confirmar_senha);

const isFormInvalid = computed(() => {
    if (!form.value.nome) return true;
    if (!form.value.tipo_sanguineo) return true;
    if (!form.value.rh) return true;
    if (!form.value.doacao_sangue) return true;
    if (!provinciaSelecionada.value) return true;
    if (!municipioSelecionado.value) return true;
    if (!form.value.telefone) return true;
    if (!form.value.senha || !form.value.confirmar_senha) return true;
    if (telefoneInvalido.value || emailInvalido.value || senhaCurta.value || senhaNaoCoincide.value) return true;
    return false;
});

const shouldShowError = (field) => submitted.value || touched.value[field];

const handleSubmit = () => {
    submitted.value = true;
    if (isFormInvalid.value) return;

    donorsStore.addDonor({
        nome: form.value.nome,
        tipo_sanguineo: form.value.tipo_sanguineo,
        rh: form.value.rh,
        provincia: provinciaSelecionada.value,
        municipio: municipioSelecionado.value,
        telefone: form.value.telefone.replace(/\\s/g, ''),
        email: form.value.email,
        doacao_sangue: form.value.doacao_sangue
    });

    alert("Cadastro realizado com sucesso!");
    emit('sucesso'); 
}
</script>

<template>
    <form @submit.prevent="handleSubmit"
        class="w-full space-y-6 bg-white p-0 relative z-20 max-h-95 md:max-h-[65vh] overflow-y-auto px-2 pb-6 custom-scrollbar">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="form-control w-full space-y-1.5">
                <label class="label font-bold text-[13px] text-gray-700 ml-1">Nome Completo</label>
                <input v-model="form.nome" @blur="touched.nome = true" type="text" placeholder="António João Silva"
                    class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium placeholder:text-gray-400" />
                <p v-if="shouldShowError('nome') && !form.nome" class="text-[11px] text-rose-600 font-bold">Nome é obrigatório.</p>
            </div>

            <div class="form-control w-full space-y-1.5">
                <label class="label font-bold text-[13px] text-gray-700 ml-1">Tipo Sanguíneo</label>
                <select v-model="form.tipo_sanguineo" @blur="touched.tipo_sanguineo = true"
                    class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium appearance-none select-arrow">
                    <option value="" disabled>Selecione</option>
                    <option>O+</option>
                    <option>O-</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                </select>
                <p v-if="shouldShowError('tipo_sanguineo') && !form.tipo_sanguineo" class="text-[11px] text-rose-600 font-bold">Selecione o tipo sanguíneo.</p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="form-control w-full space-y-1.5">
                <label class="label font-bold text-[13px] text-gray-700 ml-1">Fator RH</label>
                <select v-model="form.rh" @blur="touched.rh = true"
                    class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium appearance-none select-arrow">
                    <option value="" disabled>Selecione</option>
                    <option>Positivo (+)</option>
                    <option>Negativo (-)</option>
                </select>
                <p v-if="shouldShowError('rh') && !form.rh" class="text-[11px] text-rose-600 font-bold">Selecione o fator RH.</p>
            </div>
            
            <div class="form-control w-full space-y-1.5">
                <label class="label font-bold text-[13px] text-gray-700 ml-1">Já doou sangue?</label>
                <select v-model="form.doacao_sangue" @blur="touched.doacao_sangue = true"
                    class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium appearance-none select-arrow">
                    <option value="" disabled>Selecione</option>
                    <option>Sim, já doei</option>
                    <option>Não, será a 1ª vez</option>
                </select>
                <p v-if="shouldShowError('doacao_sangue') && !form.doacao_sangue" class="text-[11px] text-rose-600 font-bold">Indique se já doou sangue.</p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="form-control w-full space-y-1.5">
                <label class="label font-bold text-[13px] text-gray-700 ml-1">Província</label>
                <select v-model="provinciaSelecionada" @change="aoMudarProvincia" @blur="touched.provincia = true"
                    class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium appearance-none select-arrow">
                    <option value="" disabled>Selecione a região</option>
                    <option v-for="prov in Object.keys(localizacaoAngola)" :key="prov">{{ prov }}</option>
                </select>
                <p v-if="shouldShowError('provincia') && !provinciaSelecionada" class="text-[11px] text-rose-600 font-bold">Selecione a província.</p>
            </div>
            
            <div class="form-control w-full space-y-1.5">
                <label class="label font-bold text-[13px] text-gray-700 ml-1">Município</label>
                <select v-model="municipioSelecionado" @blur="touched.municipio = true" :disabled="!provinciaSelecionada"
                    class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium appearance-none select-arrow disabled:opacity-50 disabled:cursor-not-allowed">
                    <option value="" disabled>Defina a província antes</option>
                    <option v-for="mun in municipiosDisponiveis" :key="mun">{{ mun }}</option>
                </select>
                <p v-if="shouldShowError('municipio') && !municipioSelecionado" class="text-[11px] text-rose-600 font-bold">Selecione o município.</p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="form-control w-full space-y-1.5 relative">
                <label class="label font-bold text-[13px] text-gray-700 ml-1">Telemóvel (WhatsApp)</label>
                <span class="absolute left-4 top-8.75 text-gray-400 item-center pt-2 font-bold text-[14px]">+244</span>
                <input v-model="form.telefone" @blur="touched.telefone = true" type="tel" placeholder="923 000 000" maxlength="9"
                    class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl pl-16 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium placeholder:text-gray-400"
                    :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50': telefoneInvalido }" />
                <p v-if="shouldShowError('telefone') && !form.telefone" class="absolute -bottom-5 text-rose-600 text-[11px] ml-1 font-bold">Informe o telemóvel.</p>
                <p v-else-if="telefoneInvalido" class="absolute -bottom-5 text-red-500 text-[11px] ml-1 font-bold">Número inválido.</p>
            </div>
            
            <div class="form-control w-full space-y-1.5">
                <label class="label font-bold text-[13px] text-gray-700 ml-1">E-mail (Opcional)</label>
                <input v-model="form.email" @blur="touched.email = true" type="email" placeholder="nome@exemplo.com"
                    class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium placeholder:text-gray-400" />
                <p v-if="emailInvalido" class="text-[11px] text-rose-600 font-bold">E-mail inválido.</p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
             <div class="form-control w-full space-y-1.5 relative">
                <label class="label font-bold text-[13px] text-gray-700 ml-1">Palavra-passe</label>
                <input v-model="form.senha" @blur="touched.senha = true" :type="mostrarSenha ? 'text' : 'password'" placeholder="Mínimo 8 caracteres"
                    class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium placeholder:text-gray-400" />
                <button type="button" @click="mostrarSenha = !mostrarSenha" class="absolute right-4 top-8.75 text-gray-400 hover:text-gray-600 transition-colors">
                    <component :is="mostrarSenha ? EyeOff : Eye" class="w-5 h-5" />
                </button>
                <p v-if="shouldShowError('senha') && !form.senha" class="text-[11px] text-rose-600 font-bold">Informe a palavra-passe.</p>
                <p v-else-if="senhaCurta" class="text-[11px] text-rose-600 font-bold">Mínimo 8 caracteres.</p>
            </div>
            
            <div class="form-control w-full space-y-1.5 relative">
                <label class="label font-bold text-[13px] text-gray-700 ml-1">Confirmar Palavra-passe</label>
                <input v-model="form.confirmar_senha" @blur="touched.confirmar_senha = true" :type="mostrarSenhaConfirmacao ? 'text' : 'password'" placeholder="Repita a palavra-passe"
                    class="w-full bg-gray-50 border text-gray-900 text-[14px] rounded-2xl pl-4 pr-12 py-3.5 focus:outline-none transition-all font-medium placeholder:text-gray-400" 
                    :class="[form.confirmar_senha && form.senha !== form.confirmar_senha ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50' : 'border-gray-200 bg-gray-50 focus:border-rose-500 focus:ring-rose-500/20 focus:ring-2']"/>
                <button type="button" @click="mostrarSenhaConfirmacao = !mostrarSenhaConfirmacao" class="absolute right-4 top-8.75 text-gray-400 hover:text-gray-600 transition-colors">
                    <component :is="mostrarSenhaConfirmacao ? EyeOff : Eye" class="w-5 h-5" />
                </button>
                <p v-if="shouldShowError('confirmar_senha') && !form.confirmar_senha" class="text-[11px] text-rose-600 font-bold">Confirme a palavra-passe.</p>
                <p v-else-if="senhaNaoCoincide" class="text-[11px] text-rose-600 font-bold">As palavras-passe não coincidem.</p>
            </div>
        </div>

        <div class="pt-4">
            <button type="submit" :disabled="isFormInvalid" 
                class="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-2xl px-6 py-4 font-extrabold text-[15px] shadow-[0_8px_20px_rgba(225,29,72,0.2)] transition-all hover:-translate-y-0.5 mt-2 flex justify-center items-center gap-2 group tracking-wide disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                Finalizar Registo Seguro
            </button>
            <p class="text-center text-[12px] text-gray-500 font-medium mt-4">
                Ao registrar-se, concorda com as <a href="#" class="text-rose-600 hover:underline">Políticas de Privacidade Médica.</a>
            </p>
        </div>
    </form>
</template>

<style scoped>
.select-arrow {
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1em;
}

/* Custom Scrollbar for better UX */
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #e5e7eb;
    border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #d1d5db;
}
</style>
