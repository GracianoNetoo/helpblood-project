<script setup>
import { MapPin, CalendarDays, ArrowRight } from 'lucide-vue-next';

const campaigns = [
  {
    id: 'camp-1',
    title: 'Mutirão Nacional: Universidade Agostinho Neto',
    location: 'Luanda',
    date: 'Hoje, 10h - 15h',
    tags: ['O-', 'A+'],
    highlight: 'Crítico'
  },
  {
    id: 'camp-2',
    title: 'Ação Comunitária Praia Morena',
    location: 'Benguela',
    date: 'Próx Sáb, 08h',
    tags: ['Todos'],
    highlight: 'Aberto'
  },
  {
    id: 'camp-3',
    title: 'Campanha Solidária Kilamba',
    location: 'Luanda',
    date: 'Dom, 09h',
    tags: ['O+', 'B+'],
    highlight: 'Disponível'
  }
];
</script>

<template>
  <div class="max-w-[1200px] mx-auto pb-10">
    <div class="bg-white rounded-[32px] border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 md:p-10">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight">Campanhas Ativas</h2>
          <p class="text-sm text-gray-500 mt-1">Escolha um local e agende a sua próxima doação.</p>
        </div>
        <button class="bg-gray-900 hover:bg-black text-white px-5 py-3 md:py-2.5 rounded-2xl font-bold shadow-md transition-all text-sm">
          Ver Mapa
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="camp in campaigns" :key="camp.id" class="group border border-gray-200 rounded-[24px] p-6 bg-white hover:shadow-lg hover:border-rose-200 transition-all">
          <div class="flex items-center justify-between mb-4">
            <span class="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
              :class="camp.highlight === 'Crítico' ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-700'">
              {{ camp.highlight }}
            </span>
            <div class="flex gap-1">
              <span v-for="tag in camp.tags" :key="tag" class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                {{ tag }}
              </span>
            </div>
          </div>

          <h3 class="font-bold text-gray-900 text-lg leading-tight mb-4 group-hover:text-rose-700 transition-colors">
            {{ camp.title }}
          </h3>

          <div class="space-y-3 text-[14px] text-gray-600 font-medium">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                <MapPin class="w-4 h-4" />
              </div>
              {{ camp.location }}
            </div>
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                <CalendarDays class="w-4 h-4" />
              </div>
              {{ camp.date }}
            </div>
          </div>

          <button class="mt-6 w-full bg-white border border-gray-200 text-gray-900 font-bold rounded-[16px] py-3 hover:bg-gray-900 hover:text-white transition-all flex items-center justify-center gap-2">
            Agendar Horário
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
