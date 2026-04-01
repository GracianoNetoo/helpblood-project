<script setup>
defineProps({
  totalCampaigns: { type: Number, required: true },
  newCampaign: { type: Object, required: true },
  campaignTouched: { type: Object, required: true },
  todayISO: { type: String, required: true },
  isDateInPast: { type: Boolean, required: true },
  isCampaignInvalid: { type: Boolean, required: true },
  campaigns: { type: Array, required: true },
  shouldShowCampaignError: { type: Function, required: true }
});

defineEmits(['add-campaign', 'reset-campaign-form', 'remove-campaign']);
</script>

<template>
  <section class="max-w-300 mx-auto pb-10">
    <div class="bg-white rounded-4xl border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 md:p-10">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight">Campanhas</h2>
          <p class="text-sm text-gray-500 mt-1">Crie campanhas para os utilizadores.</p>
        </div>
        <div class="text-[12px] font-bold text-sky-600 bg-sky-50 border border-sky-100 px-4 py-2 rounded-full">Total: {{ totalCampaigns }}</div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="space-y-4">
          <div>
            <label class="text-[12px] font-bold text-gray-600">Titulo</label>
            <input v-model="newCampaign.title" @blur="campaignTouched.title = true" type="text" placeholder="Ex: Campanha Central" class="mt-2 w-full bg-gray-50 border text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all font-medium" :class="shouldShowCampaignError('title') && !newCampaign.title ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500' : 'border-gray-200 focus:ring-sky-500/20 focus:border-sky-500'" />
            <p v-if="shouldShowCampaignError('title') && !newCampaign.title" class="text-[11px] text-rose-600 font-bold mt-1">Titulo e obrigatorio.</p>
          </div>
          <div>
            <label class="text-[12px] font-bold text-gray-600">Localizacao</label>
            <input v-model="newCampaign.location" @blur="campaignTouched.location = true" type="text" placeholder="Ex: Luanda" class="mt-2 w-full bg-gray-50 border text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all font-medium" :class="shouldShowCampaignError('location') && !newCampaign.location ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500' : 'border-gray-200 focus:ring-sky-500/20 focus:border-sky-500'" />
            <p v-if="shouldShowCampaignError('location') && !newCampaign.location" class="text-[11px] text-rose-600 font-bold mt-1">Localizacao e obrigatoria.</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-[12px] font-bold text-gray-600">Data</label>
              <input v-model="newCampaign.dateISO" @blur="campaignTouched.dateISO = true" type="date" :min="todayISO" class="mt-2 w-full bg-gray-200 border text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all font-medium" :class="(shouldShowCampaignError('dateISO') && !newCampaign.dateISO) || isDateInPast ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500' : 'border-gray-200 focus:ring-sky-500/20 focus:border-sky-500'" />
              <p v-if="shouldShowCampaignError('dateISO') && !newCampaign.dateISO" class="text-[11px] text-rose-600 font-bold mt-1">Data e obrigatoria.</p>
              <p v-else-if="isDateInPast" class="text-[11px] text-rose-600 font-bold mt-1">Escolha uma data a partir de hoje.</p>
            </div>
            <div>
              <label class="text-[12px] font-bold text-gray-600">Hora</label>
              <input v-model="newCampaign.time" @blur="campaignTouched.time = true" type="time" step="900" class="mt-2 w-full bg-gray-200 border text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all font-medium" :class="shouldShowCampaignError('time') && !newCampaign.time ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500' : 'border-gray-200 focus:ring-sky-500/20 focus:border-sky-500'" />
              <p v-if="shouldShowCampaignError('time') && !newCampaign.time" class="text-[11px] text-rose-600 font-bold mt-1">Hora e obrigatoria.</p>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="text-[12px] font-bold text-gray-600">Descricao</label>
            <textarea v-model="newCampaign.description" rows="5" placeholder="Descreva a campanha." class="mt-2 w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium resize-none"></textarea>
          </div>
          <div>
            <label class="text-[12px] font-bold text-gray-600">Tags (separadas por virgula)</label>
            <input v-model="newCampaign.tags" type="text" placeholder="Ex: O+, O-" class="mt-2 w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium" />
          </div>
          <div>
            <label class="text-[12px] font-bold text-gray-600">Destaque</label>
            <select v-model="newCampaign.highlight" class="mt-2 w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium">
              <option>Aberto</option>
              <option>Critico</option>
            </select>
          </div>
          <button @click="$emit('add-campaign')" :disabled="isCampaignInvalid" class="w-full bg-sky-600 hover:bg-sky-700 text-white rounded-2xl px-6 py-3.5 font-extrabold text-[14px] shadow-[0_8px_20px_rgba(14,165,233,0.2)] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-sky-600">Criar campanha</button>
          <button @click="$emit('reset-campaign-form')" class="w-full mt-2 bg-white text-gray-700 border border-gray-200 rounded-2xl px-6 py-3 font-semibold text-[13px] hover:bg-gray-50 transition-all">Limpar campos</button>
        </div>
      </div>

      <div v-if="campaigns.length === 0" class="py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">
        Sem campanhas registadas.
      </div>

      <div v-else class="space-y-4">
        <div v-for="camp in campaigns" :key="camp.id" class="border border-gray-100 rounded-3xl p-5 md:p-6 hover:shadow-md transition-all">
          <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div class="text-sm font-bold text-gray-900">{{ camp.title || 'Campanha' }}</div>
              <div class="text-[12px] text-gray-500 mt-1">Local: {{ camp.location || 'Local' }} • Data: {{ camp.dateISO || 'Data' }} • {{ camp.time || 'Horario' }}</div>
              <div class="text-[12px] text-gray-500 mt-1">Tags: {{ (camp.tags || []).join(', ') }}</div>
              <div class="text-[12px] text-gray-400 mt-2">Status: {{ camp.status || 'ativo' }}</div>
            </div>
            <div class="flex flex-col gap-2">
              <button @click="$emit('remove-campaign', camp.id)" class="px-4 py-2 rounded-2xl bg-rose-50 text-rose-600 font-semibold hover:bg-rose-100 transition-colors">Remover</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
