<script setup>
defineProps({
  totalRequests: { type: Number, required: true },
  requests: { type: Array, required: true },
  pendingRequests: { type: Array, required: true },
  approvedRequests: { type: Array, required: true },
  rejectedRequests: { type: Array, required: true }
});

defineEmits(['approve-request', 'reject-request', 'remove-request']);
</script>

<template>
  <section class="max-w-300 mx-auto pb-10">
    <div class="bg-white rounded-4xl border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 md:p-10">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight">Pedidos de Ajuda</h2>
          <p class="text-sm text-gray-500 mt-1">Aprovar antes de aparecer para os doadores.</p>
        </div>
        <div class="text-[12px] font-bold text-slate-600 bg-slate-50 border border-slate-100 px-4 py-2 rounded-full">Total: {{ totalRequests }}</div>
      </div>

      <div v-if="requests.length === 0" class="py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">
        Sem pedidos registados.
      </div>

      <div v-else class="space-y-6">
        <div>
          <h3 class="text-sm font-bold text-gray-900 mb-4">Pendentes</h3>
          <div v-if="pendingRequests.length === 0" class="py-8 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">
            Sem pedidos pendentes.
          </div>
          <div v-else class="space-y-4">
            <div v-for="request in pendingRequests" :key="request.id" class="border border-gray-100 rounded-3xl p-5 md:p-6 hover:shadow-md transition-all">
              <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <div class="text-sm font-bold text-gray-900">{{ request.nome || 'Anonimo' }}</div>
                  <div class="text-[12px] text-gray-500 mt-1">{{ request.localizacao || 'Localizacao nao informada' }}</div>
                  <div class="text-[12px] text-gray-500 mt-1">Sangue: {{ request.tipo_sanguineo || 'N/A' }} • Urgencia: {{ request.urgencia || 'Normal' }}</div>
                  <div class="text-[12px] text-gray-500 mt-1">Contacto: {{ request.contacto || 'Nao informado' }}</div>
                  <div class="text-[12px] text-gray-400 mt-2">{{ request.motivo || 'Motivo nao informado.' }}</div>
                </div>
                <div class="flex flex-col gap-2">
                  <button @click="$emit('approve-request', request.id)" class="self-start px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition-colors">Aprovar</button>
                  <button @click="$emit('reject-request', request.id)" class="self-start px-4 py-2 rounded-2xl bg-rose-50 text-rose-600 font-semibold hover:bg-rose-100 transition-colors">Rejeitar</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-bold text-gray-900 mb-4">Aprovados</h3>
          <div v-if="approvedRequests.length === 0" class="py-8 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">
            Sem pedidos aprovados.
          </div>
          <div v-else class="space-y-4">
            <div v-for="request in approvedRequests" :key="request.id" class="border border-gray-100 rounded-3xl p-5 md:p-6 hover:shadow-md transition-all">
              <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <div class="text-sm font-bold text-gray-900">{{ request.nome || 'Anonimo' }}</div>
                  <div class="text-[12px] text-gray-500 mt-1">{{ request.localizacao || 'Localizacao nao informada' }}</div>
                  <div class="text-[12px] text-gray-500 mt-1">Sangue: {{ request.tipo_sanguineo || 'N/A' }} • Urgencia: {{ request.urgencia || 'Normal' }}</div>
                  <div class="text-[12px] text-gray-500 mt-1">Contacto: {{ request.contacto || 'Nao informado' }}</div>
                </div>
                <button @click="$emit('remove-request', request.id)" class="self-start px-4 py-2 rounded-2xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors">Remover</button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="rejectedRequests.length > 0">
          <h3 class="text-sm font-bold text-gray-900 mb-4">Rejeitados</h3>
          <div class="space-y-4">
            <div v-for="request in rejectedRequests" :key="request.id" class="border border-gray-100 rounded-3xl p-5 md:p-6 hover:shadow-md transition-all">
              <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <div class="text-sm font-bold text-gray-900">{{ request.nome || 'Anonimo' }}</div>
                  <div class="text-[12px] text-gray-500 mt-1">{{ request.localizacao || 'Localizacao nao informada' }}</div>
                  <div class="text-[12px] text-gray-500 mt-1">Sangue: {{ request.tipo_sanguineo || 'N/A' }} • Urgencia: {{ request.urgencia || 'Normal' }}</div>
                </div>
                <button @click="$emit('remove-request', request.id)" class="self-start px-4 py-2 rounded-2xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors">Excluir</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
