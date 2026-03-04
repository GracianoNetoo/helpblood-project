<script setup>
const emit = defineEmits(['close']);
</script>

<template>
  <div class="bg-white rounded-[28px] shadow-2xl border border-white/20 overflow-hidden max-w-3xl w-full">
    <div class="p-6 md:p-8 border-b border-gray-100 bg-gray-50/60 flex justify-between items-center">
      <div>
        <h2 class="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">Sobre Nós</h2>
        <p class="text-sm text-gray-500 mt-1">UniVida Angola</p>
      </div>
      <button @click="$emit('close')" class="w-10 h-10 bg-white border border-gray-200 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full flex items-center justify-center transition-colors shadow-sm">
        <span class="text-xl leading-none">×</span>
      </button>
    </div>

    <div class="p-6 md:p-8 max-h-[70vh] overflow-y-auto text-sm text-gray-700 space-y-5 leading-relaxed">
      <div class="text-xs text-gray-500 font-semibold uppercase tracking-widest">SOBRE A UNIVIDA</div>
      <p>A UniVida nasceu para reduzir a distância entre quem quer doar e quem precisa. Nosso foco é criar uma experiência segura, humana e eficiente, sempre com orientação para doações em ambientes hospitalares autorizados.</p>

      <div>
        <h3 class="text-[15px] font-bold text-gray-900 mb-2">Missão</h3>
        <p>Conectar doadores e solicitantes, promovendo doações responsáveis e ampliando o acesso a sangue seguro em Angola.</p>
      </div>

      <div>
        <h3 class="text-[15px] font-bold text-gray-900 mb-2">Visão</h3>
        <p>Ser a plataforma de referência em mobilização de doadores, com impacto real na saúde pública.</p>
      </div>

      <div>
        <h3 class="text-[15px] font-bold text-gray-900 mb-2">Valores</h3>
        <ul class="list-disc list-inside">
          <li>Transparência</li>
          <li>Segurança</li>
          <li>Empatia</li>
          <li>Responsabilidade social</li>
        </ul>
      </div>
    </div>
  </div>
</template>
