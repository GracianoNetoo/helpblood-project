<script setup>
defineProps({
  nome: { type: String, default: "Doador Exemplo" },
  tipo: { type: String, default: "O+" },
  bi: { type: String, default: "000000000LA000" },
  emissao: { type: String, default: "22/02/2026" }
})
</script>

<template>
<a href="#" class="hover-3d my-12 mx-2 cursor-pointer">
  
  <!-- content -->
  <div class="card w-96 bg-red-900 text-white bg-[radial-gradient(circle_at_bottom_left,#ffffff04_35%,transparent_36%),radial-gradient(circle_at_top_right,#ffffff04_35%,transparent_36%)] bg-size-[4.95em_4.95em]">
    <div class="card-body">
      <div class="flex justify-between mb-10">
        <div class="text-[20px] text-slate-100 font-bold">UniVida</div>
        <div class="text-5xl opacity-10">❁</div>
      </div>
      <div class="text-lg mb-4 opacity-40">0210 8820 1150 0222</div>
      <div class="flex justify-between">
        <div>
          <div class="text-xs opacity-20">CARTÃO DE DOADOR</div>
          <div>GRACIANO NETO</div>
        </div>
        <div>
          <div class="text-xs opacity-20">EXPIRA</div>
          <div>29/08</div>
        </div>
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