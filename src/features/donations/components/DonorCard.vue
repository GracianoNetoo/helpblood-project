<script setup>
import { computed } from 'vue';

const props = defineProps({
  nome: { type: String, default: 'Doador Exemplo' },
  tipo: { type: String, default: 'O+' },
  bi: { type: String, default: '000000000LA000' },
  emissao: { type: String, default: '22/02/2026' }
});

const nomeExibicao = computed(() => props.nome || 'Doador Exemplo');
const tipoExibicao = computed(() => props.tipo || 'O+');
const biExibicao = computed(() => props.bi || '000000000LA000');
const validadeExibicao = computed(() => {
  if (!props.emissao) return '--/--';

  const partes = props.emissao.split('/');
  if (partes.length !== 3) return props.emissao;

  const [, mes, ano] = partes;
  return `${mes}/${String(ano).slice(-2)}`;
});
</script>

<template>
  <a href="#" class="hover-3d my-12 mx-2 cursor-pointer">
    <div class="card w-96 bg-red-900 text-white bg-[radial-gradient(circle_at_bottom_left,#ffffff04_35%,transparent_36%),radial-gradient(circle_at_top_right,#ffffff04_35%,transparent_36%)] bg-size-[4.95em_4.95em]">
      <div class="card-body">
        <div class="flex justify-between mb-10">
          <div class="text-[20px] text-slate-100 font-bold">UniVida</div>
          <div class="text-5xl opacity-10">*</div>
        </div>

        <div class="text-lg mb-4 opacity-40">{{ biExibicao }}</div>

        <div class="flex justify-between gap-6">
          <div>
            <div class="text-xs opacity-20">CARTAO DE DOADOR</div>
            <div class="font-semibold">{{ nomeExibicao }}</div>
          </div>

          <div class="text-right">
            <div class="text-xs opacity-20">EXPIRA</div>
            <div>{{ validadeExibicao }}</div>
          </div>
        </div>

        <div class="mt-4 text-sm font-semibold text-rose-100/80">
          Tipo Sanguineo: {{ tipoExibicao }}
        </div>
      </div>
    </div>

    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </a>
</template>
