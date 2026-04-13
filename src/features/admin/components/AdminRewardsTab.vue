<script setup>
import { computed, reactive, watch } from 'vue';
import { Gift, Sparkles, Trophy, TicketPercent } from 'lucide-vue-next';

const props = defineProps({
  rewardCatalog: {
    type: Array,
    default: () => []
  },
  adminRewardAttempts: {
    type: Array,
    default: () => []
  },
  isSavingReward: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['save-reward']);

const rewardDraft = reactive({
  id: null,
  title: '',
  description: '',
  rewardType: 'cupom',
  rarity: 'comum',
  quantityAvailable: 1,
  weight: 1,
  guaranteedAfterFailures: '',
  expiresAt: '',
  isActive: true
});

const resetDraft = () => {
  rewardDraft.id = null;
  rewardDraft.title = '';
  rewardDraft.description = '';
  rewardDraft.rewardType = 'cupom';
  rewardDraft.rarity = 'comum';
  rewardDraft.quantityAvailable = 1;
  rewardDraft.weight = 1;
  rewardDraft.guaranteedAfterFailures = '';
  rewardDraft.expiresAt = '';
  rewardDraft.isActive = true;
};

const loadReward = (reward) => {
  rewardDraft.id = reward.id;
  rewardDraft.title = reward.title;
  rewardDraft.description = reward.description || '';
  rewardDraft.rewardType = reward.rewardType;
  rewardDraft.rarity = reward.rarity;
  rewardDraft.quantityAvailable = reward.quantityAvailable;
  rewardDraft.weight = reward.weight;
  rewardDraft.guaranteedAfterFailures = reward.guaranteedAfterFailures ?? '';
  rewardDraft.expiresAt = reward.expiresAt ? String(reward.expiresAt).slice(0, 16) : '';
  rewardDraft.isActive = reward.isActive;
};

const submitDraft = () => {
  emit('save-reward', {
    id: rewardDraft.id,
    title: rewardDraft.title.trim(),
    description: rewardDraft.description.trim(),
    rewardType: rewardDraft.rewardType,
    rarity: rewardDraft.rarity,
    quantityAvailable: Number(rewardDraft.quantityAvailable || 0),
    weight: Number(rewardDraft.weight || 1),
    guaranteedAfterFailures: rewardDraft.guaranteedAfterFailures,
    expiresAt: rewardDraft.expiresAt ? new Date(rewardDraft.expiresAt).toISOString() : null,
    isActive: rewardDraft.isActive
  });
};

const totalStock = computed(() => props.rewardCatalog.reduce((sum, reward) => sum + Number(reward.quantityAvailable || 0), 0));
const activeRewardsCount = computed(() => props.rewardCatalog.filter((reward) => reward.isActive).length);
const wonAttemptsCount = computed(() => props.adminRewardAttempts.filter((attempt) => attempt.status === 'ganhou').length);
const failedAttemptsCount = computed(() => props.adminRewardAttempts.filter((attempt) => attempt.status === 'falhou').length);

const rarityLabel = (rarity) => {
  if (rarity === 'epico') return 'Épico';
  if (rarity === 'raro') return 'Raro';
  return 'Comum';
};

const rewardTypeLabel = (rewardType) => {
  if (rewardType === 'consulta_gratuita') return 'Consulta gratuita';
  if (rewardType === 'agradecimento') return 'Agradecimento';
  return 'Cupom';
};

const formatDateTime = (value) => {
  if (!value) return 'Sem validade';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(parsed);
};

watch(
  () => props.rewardCatalog.length,
  (count) => {
    if (count === 0) resetDraft();
  },
  { immediate: true }
);
</script>

<template>
  <div class="max-w-300 mx-auto space-y-8">
    <section class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <div class="rounded-4xl bg-white border border-gray-200/70 p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-[11px] uppercase tracking-widest text-violet-600 font-bold">Catálogo</div>
            <div class="text-3xl font-black text-gray-900 mt-2">{{ rewardCatalog.length }}</div>
          </div>
          <div class="w-11 h-11 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100">
            <Gift class="w-5 h-5" />
          </div>
        </div>
      </div>

      <div class="rounded-4xl bg-white border border-gray-200/70 p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-[11px] uppercase tracking-widest text-emerald-600 font-bold">Ativas</div>
            <div class="text-3xl font-black text-gray-900 mt-2">{{ activeRewardsCount }}</div>
          </div>
          <div class="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Sparkles class="w-5 h-5" />
          </div>
        </div>
      </div>

      <div class="rounded-4xl bg-white border border-gray-200/70 p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-[11px] uppercase tracking-widest text-amber-600 font-bold">Stock Total</div>
            <div class="text-3xl font-black text-gray-900 mt-2">{{ totalStock }}</div>
          </div>
          <div class="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <TicketPercent class="w-5 h-5" />
          </div>
        </div>
      </div>

      <div class="rounded-4xl bg-white border border-gray-200/70 p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-[11px] uppercase tracking-widest text-rose-600 font-bold">Tentativas</div>
            <div class="text-3xl font-black text-gray-900 mt-2">{{ wonAttemptsCount }} / {{ failedAttemptsCount }}</div>
            <div class="text-xs text-gray-500 mt-1">Ganhos / falhas</div>
          </div>
          <div class="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
            <Trophy class="w-5 h-5" />
          </div>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-1 xl:grid-cols-[1.05fr_1.35fr] gap-6">
      <div class="rounded-4xl bg-white border border-gray-200/70 p-6 md:p-7 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        <div class="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 class="text-xl font-extrabold text-gray-900 tracking-tight">Gerir recompensas</h2>
            <p class="text-sm text-gray-500 mt-1">Crie ou atualize prémios sem perder o histórico das tentativas.</p>
          </div>
          <button
            type="button"
            class="px-4 py-2 rounded-2xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
            @click="resetDraft"
          >
            Nova recompensa
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="text-[12px] font-bold text-gray-600">Título</label>
            <input
              v-model="rewardDraft.title"
              type="text"
              class="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              placeholder="Ex.: Cupom de desconto em farmácia"
            >
          </div>

          <div>
            <label class="text-[12px] font-bold text-gray-600">Descrição</label>
            <textarea
              v-model="rewardDraft.description"
              rows="3"
              class="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none"
              placeholder="Detalhes de uso, validade ou observações."
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-[12px] font-bold text-gray-600">Tipo</label>
              <select v-model="rewardDraft.rewardType" class="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500">
                <option value="cupom">Cupom</option>
                <option value="consulta_gratuita">Consulta gratuita</option>
                <option value="agradecimento">Agradecimento</option>
              </select>
            </div>

            <div>
              <label class="text-[12px] font-bold text-gray-600">Raridade</label>
              <select v-model="rewardDraft.rarity" class="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500">
                <option value="comum">Comum</option>
                <option value="raro">Raro</option>
                <option value="epico">Épico</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="text-[12px] font-bold text-gray-600">Quantidade</label>
              <input v-model.number="rewardDraft.quantityAvailable" min="0" type="number" class="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500">
            </div>
            <div>
              <label class="text-[12px] font-bold text-gray-600">Peso</label>
              <input v-model.number="rewardDraft.weight" min="1" type="number" class="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500">
            </div>
            <div>
              <label class="text-[12px] font-bold text-gray-600">Garantida após</label>
              <input v-model="rewardDraft.guaranteedAfterFailures" min="1" type="number" class="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" placeholder="Opcional">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-end">
            <div>
              <label class="text-[12px] font-bold text-gray-600">Validade</label>
              <input v-model="rewardDraft.expiresAt" type="datetime-local" class="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500">
            </div>

            <label class="inline-flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">
              <input v-model="rewardDraft.isActive" type="checkbox" class="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500">
              Ativa
            </label>
          </div>

          <button
            type="button"
            class="w-full rounded-2xl bg-violet-600 text-white font-bold py-3.5 hover:bg-violet-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="!rewardDraft.title.trim() || rewardDraft.quantityAvailable < 0 || rewardDraft.weight < 1 || isSavingReward"
            @click="submitDraft"
          >
            {{ isSavingReward ? 'A guardar...' : rewardDraft.id ? 'Atualizar recompensa' : 'Guardar recompensa' }}
          </button>
        </div>
      </div>

      <div class="space-y-6">
        <div class="rounded-4xl bg-white border border-gray-200/70 p-6 md:p-7 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
          <div class="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 class="text-xl font-extrabold text-gray-900 tracking-tight">Catálogo atual</h2>
              <p class="text-sm text-gray-500 mt-1">Clique em qualquer recompensa para editar sem apagar o histórico.</p>
            </div>
          </div>

          <div class="space-y-4 max-h-[520px] overflow-y-auto custom-scrollbar pr-1">
            <button
              v-for="reward in rewardCatalog"
              :key="reward.id"
              type="button"
              class="w-full rounded-3xl border border-gray-200 bg-gray-50/70 p-4 text-left hover:bg-white hover:border-violet-200 transition-all"
              @click="loadReward(reward)"
            >
              <div class="flex items-start justify-between gap-4">
                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="text-base font-extrabold text-gray-900">{{ reward.title }}</h3>
                    <span class="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide" :class="reward.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-200 text-gray-600'">
                      {{ reward.isActive ? 'Ativa' : 'Inativa' }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-500 mt-1">{{ reward.description || 'Sem descrição adicional.' }}</p>
                </div>
                <div class="text-right">
                  <div class="text-sm font-black text-gray-900">{{ reward.quantityAvailable }}</div>
                  <div class="text-[11px] font-bold uppercase tracking-wide text-gray-400">Disponível</div>
                </div>
              </div>

              <div class="mt-4 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wide text-gray-500">
                <span class="px-2.5 py-1 rounded-full bg-violet-50 text-violet-700">{{ rewardTypeLabel(reward.rewardType) }}</span>
                <span class="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">{{ rarityLabel(reward.rarity) }}</span>
                <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">Peso {{ reward.weight }}</span>
                <span v-if="reward.guaranteedAfterFailures" class="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700">Garantida após {{ reward.guaranteedAfterFailures }}</span>
                <span class="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">{{ formatDateTime(reward.expiresAt) }}</span>
              </div>
            </button>

            <div v-if="rewardCatalog.length === 0" class="rounded-3xl border border-dashed border-gray-200 bg-gray-50/70 px-5 py-10 text-center text-sm font-medium text-gray-500">
              Ainda não existem recompensas cadastradas.
            </div>
          </div>
        </div>

        <div class="rounded-4xl bg-white border border-gray-200/70 p-6 md:p-7 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
          <div class="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 class="text-xl font-extrabold text-gray-900 tracking-tight">Últimas tentativas</h2>
              <p class="text-sm text-gray-500 mt-1">Auditoria rápida de quem ganhou e quem falhou.</p>
            </div>
          </div>

          <div class="space-y-3 max-h-[320px] overflow-y-auto custom-scrollbar pr-1">
            <div
              v-for="attempt in adminRewardAttempts.slice(0, 10)"
              :key="attempt.id"
              class="rounded-3xl border border-gray-200 bg-white px-4 py-3"
            >
              <div class="flex items-center justify-between gap-4">
                <div>
                  <div class="text-sm font-extrabold text-gray-900">
                    {{ attempt.status === 'ganhou' ? attempt.rewardTitle || 'Recompensa' : 'Tentativa sem prémio' }}
                  </div>
                  <div class="text-[12px] text-gray-500 mt-1">Utilizador {{ attempt.donorId || 'desconhecido' }}</div>
                </div>
                <div class="text-right">
                  <div class="text-[11px] font-bold uppercase tracking-wide" :class="attempt.status === 'ganhou' ? 'text-emerald-700' : 'text-amber-700'">
                    {{ attempt.status === 'ganhou' ? 'Ganhou' : 'Falhou' }}
                  </div>
                  <div class="text-[12px] text-gray-500 mt-1">{{ formatDateTime(attempt.attemptedAt) }}</div>
                </div>
              </div>
            </div>

            <div v-if="adminRewardAttempts.length === 0" class="rounded-3xl border border-dashed border-gray-200 bg-gray-50/70 px-5 py-8 text-center text-sm font-medium text-gray-500">
              Ainda não existem tentativas de recompensa registadas.
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 999px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}
</style>
