<script setup>
import { History, CalendarDays, Droplet, CheckCircle, Clock } from 'lucide-vue-next';

// Dados fictícios simulando o histórico de doações
const donations = [
  {
    id: 'D-8472',
    date: '12 de Outubro, 2023',
    location: 'Instituto Nacional de Sangue',
    volume: '450 ml',
    type: 'Sangue Total',
    status: 'concluido'
  },
  {
    id: 'D-5921',
    date: '05 de Junho, 2023',
    location: 'Clínica Sagrada Esperança',
    volume: '450 ml',
    type: 'Sangue Total',
    status: 'concluido'
  },
  {
    id: 'D-3184',
    date: '18 Janeiro, 2023',
    location: 'Hospital Geral de Luanda',
    volume: '450 ml',
    type: 'Plaquetas',
    status: 'concluido'
  },
  {
    id: 'D-9033',
    date: '11 de Agosto, 2022',
    location: 'Instituto Nacional de Sangue',
    volume: '450 ml',
    type: 'Sangue Total',
    status: 'concluido'
  }
];
</script>

<template>
  <div class="max-w-[1200px] mx-auto pb-10">
    <div class="bg-white rounded-[32px] border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 md:p-10 overflow-hidden">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight">Histórico de Doações</h2>
          <p class="text-sm text-gray-500 mt-1">Registo das suas contribuições para a comunidade.</p>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="hidden md:flex bg-gray-50 border border-gray-100 rounded-2xl p-1.5 gap-1 shadow-inner">
            <div class="px-4 py-2 bg-white rounded-xl shadow-sm text-sm font-bold text-rose-600">Todas</div>
            <div class="px-4 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 cursor-pointer transition-colors">Este Ano</div>
          </div>
          <button class="bg-gray-100 hover:bg-gray-200 text-gray-900 px-5 py-3 md:py-2.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-sm w-full md:w-auto">
            <History class="w-4 h-4" />
            Filtrar
          </button>
        </div>
      </div>

      <!-- Sumário rápido (Cards) -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-rose-50/50 p-4 rounded-[20px] border border-rose-100/50">
          <div class="text-[11px] uppercase tracking-widest text-rose-600 font-bold mb-1">Total Doado</div>
          <div class="text-2xl font-black text-gray-900 tracking-tight">1.8 <span class="text-sm text-gray-500 font-semibold">Litros</span></div>
        </div>
        <div class="bg-blue-50/50 p-4 rounded-[20px] border border-blue-100/50">
          <div class="text-[11px] uppercase tracking-widest text-blue-600 font-bold mb-1">Doações</div>
          <div class="text-2xl font-black text-gray-900 tracking-tight">04</div>
        </div>
        <div class="bg-emerald-50/50 p-4 rounded-[20px] border border-emerald-100/50">
          <div class="text-[11px] uppercase tracking-widest text-emerald-600 font-bold mb-1">Vidas Salvas</div>
          <div class="text-2xl font-black text-gray-900 tracking-tight">04</div>
        </div>
        <div class="bg-amber-50/50 p-4 rounded-[20px] border border-amber-100/50">
          <div class="text-[11px] uppercase tracking-widest text-amber-600 font-bold mb-1">Última Visita</div>
          <div class="text-lg font-black text-gray-900 tracking-tight mt-1">12 Out, 2023</div>
        </div>
      </div>

      <!-- Tabela Funcional -->
      <div class="overflow-x-auto pb-4 custom-scrollbar">
        <table class="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr class="bg-gray-50/80 border-y border-gray-100">
              <th class="py-4 px-5 text-[12px] font-bold text-gray-400 uppercase tracking-widest rounded-tl-[16px]">ID Doação</th>
              <th class="py-4 px-5 text-[12px] font-bold text-gray-400 uppercase tracking-widest">Data & Local</th>
              <th class="py-4 px-5 text-[12px] font-bold text-gray-400 uppercase tracking-widest">Detalhes</th>
              <th class="py-4 px-5 text-[12px] font-bold text-gray-400 uppercase tracking-widest rounded-tr-[16px] text-right">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100/80">
            
            <tr v-for="donation in donations" :key="donation.id" class="hover:bg-gray-50/50 transition-colors group">
              <td class="py-5 px-5">
                <span class="font-mono text-sm font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">{{ donation.id }}</span>
              </td>
              <td class="py-5 px-5">
                <div class="font-bold text-gray-900">{{ donation.date }}</div>
                <div class="text-sm text-gray-500 font-medium mt-0.5">{{ donation.location }}</div>
              </td>
              <td class="py-5 px-5">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100">
                    <Droplet class="w-4 h-4" stroke-width="2.5" />
                  </div>
                  <div>
                    <div class="font-bold text-gray-900 text-sm">{{ donation.volume }}</div>
                    <div class="text-[12px] text-gray-500 font-medium">{{ donation.type }}</div>
                  </div>
                </div>
              </td>
              <td class="py-5 px-5 text-right">
                <div v-if="donation.status === 'concluido'" class="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-[12px] font-bold shadow-sm">
                  <CheckCircle class="w-3.5 h-3.5" /> Concluído
                </div>
                <!-- Exemplo para um status PENDENTE (caso usassem futuramente) -->
                <div v-else-if="donation.status === 'agendado'" class="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-700 px-3 py-1.5 rounded-full text-[12px] font-bold shadow-sm">
                  <Clock class="w-3.5 h-3.5" /> Próximo
                </div>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>
