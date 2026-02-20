<script setup>
import { ref, computed } from 'vue'


const localizacaoAngola = {
    "Luanda": ["Belas", "Cacuaco", "Cazenga", "Kilamba Kiaxi", "Talatona", "Viana"],
    "Benguela": ["Baía Farta", "Benguela", "Catumbela", "Lobito"],
    "Huambo": ["Caála", "Huambo", "Mungo"]
}


const form = ref({
    nome: '',
    tipo_sanguineo: '',
    rh: '',
    provincia: '',
    municipio: '',
    telefone: ''
})

const provinciaSelecionada = ref("")
const municipioSelecionado = ref("")

const municipiosDisponiveis = computed(() => {
    return provinciaSelecionada.value ? localizacaoAngola[provinciaSelecionada.value] : []
})

const aoMudarProvincia = () => {
    municipioSelecionado.value = ""
}


const telefoneInvalido = computed(() => {
    const tel = form.value.telefone.replace(/\s/g, '')
    if (tel.length === 0) return false
    const regexAngola = /^9[1-59]\d{8}$/
    return !regexAngola.test(tel)
})

const handleSubmit = () => {
    if (!form.value.nome || !form.value.tipo_sanguineo || !form.value.rh || !provinciaSelecionada.value || !municipioSelecionado.value || !form.value.telefone) {
        alert("Por favor, preencha todos os campos obrigatórios.")
        return
    }
    if (telefoneInvalido.value) {
        alert("Por favor, insira um número de telemóvel válido de Angola.")
        return
    }
    console.log("Dados prontos para o banco:", {
        ...form.value,
        provincia: provinciaSelecionada.value,
        municipio: municipioSelecionado.value
    })
    alert("Cadastro realizado com sucesso!")
}
</script>

<template>
    <form @submit.prevent="handleSubmit"
        class="h-auto justify-content-center items-center w-full space-y-6 bg-slate-800 p-8 rounded-3xl shadow-lg border border-gray-00">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-control w-full">
                <label class="label font-bold text-slate-400">Nome Completo: </label>
                <input v-model="form.nome" type="text" placeholder="Seu nome completo"
                    class="input input-bordered w-full bg-gray-50 focus:border-red-500" />
            </div>

            <div class="form-control w-full">
                <label class="label font-bold text-slate-400">Tipo Sanguíneo: </label>
                <select v-model="form.tipo_sanguineo"
                    class="select select-bordered focus:border-red-500 bg-gray-50 text-gray-800 w-full">
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
            <div class="form-control w-full">
                <label class="label font-bold text-slate-400">Tipo Sanguíneo: </label>
                <select v-model="form.tipo_sanguineo"
                    class="select select-bordered focus:border-red-500 bg-gray-50 text-gray-800 w-full">
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

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-control w-full">
                <label class="label font-bold text-slate-400">RH:</label>
                <select v-model="form.rh"
                    class="select select-bordered bg-gray-50 focus:border-red-500 text-gray-800 w-full">
                    <option value="" disabled>Selecione</option>
                    <option>Positivo</option>
                    <option>Negativo</option>
                </select>
            </div>
            <div class="form-control w-full">
                <label class="label font-bold text-slate-400">Já doou sangue:</label>
                <select v-model="form.doacao_sangue"
                    class="select select-bordered bg-gray-50 focus:border-red-500 text-gray-800 w-full">
                    <option value="" disabled>Selecione</option>
                    <option>SIM</option>
                    <option>NÃO</option>
                </select>
            </div>

            <div class="form-control w-full">
                <label class="label font-bold text-slate-400">Província:</label>
                <select v-model="provinciaSelecionada" @change="aoMudarProvincia"
                    class="select select-bordered focus:border-red-500 bg-gray-50 text-gray-800 w-full">
                    <option value="" disabled>Selecione</option>
                    <option v-for="prov in Object.keys(localizacaoAngola)" :key="prov">{{ prov }}</option>
                </select>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-control w-full">
                <label class="label font-bold text-slate-400">Município: </label>
                <select v-model="municipioSelecionado" :disabled="!provinciaSelecionada"
                    class="select select-bordered focus:border-red-500 bg-gray-50 text-gray-400 w-full">
                    <option value="" disabled>Selecione a província primeiro</option>
                    <option v-for="mun in municipiosDisponiveis" :key="mun">{{ mun }}</option>
                </select>
            </div>
        </div>
        <div class="form-control w-full">
            <label class="label font-bold text-slate-400">Telemóvel(Whatsapp): </label>
            <div class="relative text-black">
                <input v-model="form.telefone" type="tel" placeholder="923 000 000" maxlength="9"
                    class="input input-bordered w-full pl-16 bg-gray-50 focus:border-red-500"
                    :class="{ 'border-error': telefoneInvalido }" />
            </div>
            <p v-if="telefoneInvalido" class="text-error text-xs mt-1">O número deve começar com 9 e ter 9 dígitos.</p>
        </div>
        <div class="form-control w-full">
            <label class="label font-bold text-slate-400">E-mail: </label>
            <div class="relative text-black">
                <input v-model="form.email" type="email" placeholder="seunome@gmail.com"
                    class="input input-bordered w-full pl-16 bg-gray-50 focus:border-red-500" />
            </div>
        </div>
        <button type="submit" class="btn text-2xl border-none mt-4 bg-red-500 w-full text-white font-black">Finalizar
            Cadastro</button>
    </form>
</template>