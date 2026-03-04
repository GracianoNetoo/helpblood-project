<script setup>
const emit = defineEmits(['close']);
</script>

<template>
  <div class="bg-white rounded-[28px] shadow-2xl border border-white/20 overflow-hidden max-w-3xl w-full">
    <div class="p-6 md:p-8 border-b border-gray-100 bg-gray-50/60 flex justify-between items-center">
      <div>
        <h2 class="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">Central de Ajuda</h2>
        <p class="text-sm text-gray-500 mt-1">UniVida Angola</p>
      </div>
      <button @click="$emit('close')" class="w-10 h-10 bg-white border border-gray-200 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full flex items-center justify-center transition-colors shadow-sm">
        <span class="text-xl leading-none">×</span>
      </button>
    </div>

    <div class="p-6 md:p-8 max-h-[70vh] overflow-y-auto text-sm text-gray-700 space-y-5 leading-relaxed">
      <div class="text-xs text-gray-500 font-semibold uppercase tracking-widest">SUPORTE – UniVida</div>
      <p class="text-[13px] text-gray-500 font-medium">Estamos aqui para ajudar com doações, cadastros e segurança.</p>

      <div>
        <h3 class="text-[15px] font-bold text-gray-900 mb-2">1. Como faço um pedido de ajuda?</h3>
        <p>Na página inicial, clique em “Pedir Doação” e preencha o formulário com dados reais. O pedido aparecerá na aba “Pedidos de Ajuda”.</p>
      </div>

      <div>
        <h3 class="text-[15px] font-bold text-gray-900 mb-2">2. Onde ocorre a doação?</h3>
        <p>As doações devem ocorrer apenas em hospitais, clínicas ou centros de hemoterapia autorizados.</p>
      </div>

      <div>
        <h3 class="text-[15px] font-bold text-gray-900 mb-2">3. Preciso pagar para doar?</h3>
        <p>Não. Qualquer solicitação de pagamento por doação é proibida.</p>
      </div>

      <div>
        <h3 class="text-[15px] font-bold text-gray-900 mb-2">4. Contatos</h3>
        <p>Email: parcerias@univida.ao</p>
        <p>Telefone: +244 900 000 000</p>
      </div>
    </div>
  </div>
</template>
