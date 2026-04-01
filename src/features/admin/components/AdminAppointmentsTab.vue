<script setup>
defineProps({
  totalAppointments: { type: Number, required: true },
  scheduledAppointments: { type: Array, required: true },
  donorNameById: { type: Function, required: true }
});

defineEmits(['cancel-appointment']);
</script>

<template>
  <section class="max-w-300 mx-auto pb-10">
    <div class="bg-white rounded-4xl border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 md:p-10">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight">Agendamentos</h2>
          <p class="text-sm text-gray-500 mt-1">Acompanhe todos os agendamentos registados.</p>
        </div>
        <div class="text-[12px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">Total: {{ totalAppointments }}</div>
      </div>

      <div v-if="scheduledAppointments.length === 0" class="py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">
        Sem campanhas marcados.
      </div>

      <div v-else class="space-y-4">
        <div v-for="apt in scheduledAppointments" :key="apt.id" class="border border-gray-100 rounded-3xl p-5 md:p-6 hover:shadow-md transition-all">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div class="text-sm font-bold text-gray-900">{{ apt.hospital || 'Hospital' }}</div>
              <div class="text-[12px] text-gray-500 mt-1">{{ donorNameById(apt.donorId) }}</div>
              <div class="text-[12px] text-gray-500 mt-1">{{ apt.date }} • {{ apt.time || 'Horario' }}</div>
              <div class="text-[12px] text-gray-400 mt-1">Status: {{ apt.status || 'confirmado' }}</div>
            </div>
            <button @click="$emit('cancel-appointment', apt.id)" class="self-start px-4 py-2 rounded-2xl bg-slate-50 text-slate-700 font-semibold hover:bg-slate-100 transition-colors">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
