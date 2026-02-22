<script setup>
import { ref, computed, defineEmits } from 'vue';

const emit = defineEmits(['sucesso']);

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
    municipio: '',
    telefone: '',
    email: '',
    doacao_sangue: ''
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

const handleSubmit = () => {
    if (!form.value.nome || !form.value.tipo_sanguineo || !provinciaSelecionada.value || !form.value.telefone) {
        alert("Por favor, preencha os campos obrigatórios.");
        return;
    }
    if (telefoneInvalido.value) {
        alert("Número de telemóvel inválido.");
        return;
    }

    alert("Cadastro realizado com sucesso!");
    emit('sucesso'); 
}
</script>

<template>
    <form @submit.prevent="handleSubmit"
        class="w-full space-y-6 bg-white p-0 relative z-20">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="form-control w-full space-y-1.5">
                <label class="label font-bold text-[13px] text-gray-700 ml-1">Nome Completo</label>
                <input v-model="form.nome" type="text" placeholder="António João Silva"
                    class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-[16px] px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium placeholder:text-gray-400" />
            </div>

            <div class="form-control w-full space-y-1.5">
                <label class="label font-bold text-[13px] text-gray-700 ml-1">Tipo Sanguíneo</label>
                <select v-model="form.tipo_sanguineo"
                    class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-[16px] px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium appearance-none select-arrow">
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
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="form-control w-full space-y-1.5">
                <label class="label font-bold text-[13px] text-gray-700 ml-1">Fator RH</label>
                <select v-model="form.rh"
                    class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-[16px] px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium appearance-none select-arrow">
                    <option value="" disabled>Selecione</option>
                    <option>Positivo (+)</option>
                    <option>Negativo (-)</option>
                </select>
            </div>
            
            <div class="form-control w-full space-y-1.5">
                <label class="label font-bold text-[13px] text-gray-700 ml-1">Já doou sangue?</label>
                <select v-model="form.doacao_sangue"
                    class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-[16px] px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium appearance-none select-arrow">
                    <option value="" disabled>Selecione</option>
                    <option>Sim, já doei</option>
                    <option>Não, será a 1ª vez</option>
                </select>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="form-control w-full space-y-1.5">
                <label class="label font-bold text-[13px] text-gray-700 ml-1">Província</label>
                <select v-model="provinciaSelecionada" @change="aoMudarProvincia"
                    class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-[16px] px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium appearance-none select-arrow">
                    <option value="" disabled>Selecione a região</option>
                    <option v-for="prov in Object.keys(localizacaoAngola)" :key="prov">{{ prov }}</option>
                </select>
            </div>
            
            <div class="form-control w-full space-y-1.5">
                <label class="label font-bold text-[13px] text-gray-700 ml-1">Município</label>
                <select v-model="municipioSelecionado" :disabled="!provinciaSelecionada"
                    class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-[16px] px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium appearance-none select-arrow disabled:opacity-50 disabled:cursor-not-allowed">
                    <option value="" disabled>Defina a província antes</option>
                    <option v-for="mun in municipiosDisponiveis" :key="mun">{{ mun }}</option>
                </select>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="form-control w-full space-y-1.5 relative">
                <label class="label font-bold text-[13px] text-gray-700 ml-1">Telemóvel (WhatsApp)</label>
                <span class="absolute left-4 top-[35px] text-gray-400 font-bold text-[14px]">+244</span>
                <input v-model="form.telefone" type="tel" placeholder="923 000 000" maxlength="9"
                    class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-[16px] pl-16 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium placeholder:text-gray-400"
                    :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50': telefoneInvalido }" />
                <p v-if="telefoneInvalido" class="absolute -bottom-5 text-red-500 text-[11px] ml-1 font-bold">Número inválido.</p>
            </div>
            
            <div class="form-control w-full space-y-1.5">
                <label class="label font-bold text-[13px] text-gray-700 ml-1">E-mail (Opcional)</label>
                <input v-model="form.email" type="email" placeholder="nome@exemplo.com"
                    class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-[16px] px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium placeholder:text-gray-400" />
            </div>
        </div>

        <div class="pt-4">
            <button type="submit" 
                class="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-[16px] px-6 py-4 font-extrabold text-[15px] shadow-[0_8px_20px_rgba(225,29,72,0.2)] transition-all hover:-translate-y-0.5 mt-2 flex justify-center items-center gap-2 group tracking-wide">
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
</style>