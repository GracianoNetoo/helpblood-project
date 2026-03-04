<script setup>
const emit = defineEmits(['close']);
</script>

<template>
  <div class="bg-white rounded-[28px] shadow-2xl border border-white/20 overflow-hidden max-w-3xl w-full">
    <div class="p-6 md:p-8 border-b border-gray-100 bg-gray-50/60 flex justify-between items-center">
      <div>
        <h2 class="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">Termos de Privacidade</h2>
        <p class="text-sm text-gray-500 mt-1">UniVida Angola</p>
      </div>
      <button @click="$emit('close')" class="w-10 h-10 bg-white border border-gray-200 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full flex items-center justify-center transition-colors shadow-sm">
        <span class="text-xl leading-none">×</span>
      </button>
    </div>

    <div class="p-6 md:p-8 max-h-[70vh] overflow-y-auto text-sm text-gray-700 space-y-5 leading-relaxed">
      <div class="text-xs text-gray-500 font-semibold uppercase tracking-widest">POLÍTICA DE PRIVACIDADE – UniVida</div>
      <p class="text-[13px] text-gray-500 font-medium">Última atualização: 4 de março de 2026</p>

      <div>
        <h3 class="text-[15px] font-bold text-gray-900 mb-2">1. DADOS COLETADOS</h3>
        <p>Coletamos apenas dados necessários para conectar doadores e solicitantes, como nome, tipo sanguíneo (quando informado), localização e contato.</p>
      </div>

      <div>
        <h3 class="text-[15px] font-bold text-gray-900 mb-2">2. FINALIDADE DO USO</h3>
        <p>Os dados são usados exclusivamente para viabilizar a comunicação entre usuários e facilitar o acesso a doações em ambiente hospitalar autorizado.</p>
      </div>

      <div>
        <h3 class="text-[15px] font-bold text-gray-900 mb-2">3. COMPARTILHAMENTO</h3>
        <p>Não vendemos dados pessoais. Compartilhamos informações somente quando necessário para o funcionamento da plataforma ou por obrigação legal.</p>
      </div>

      <div>
        <h3 class="text-[15px] font-bold text-gray-900 mb-2">4. SEGURANÇA</h3>
        <p>Aplicamos medidas razoáveis de segurança para proteger os dados contra acesso não autorizado, perda ou alteração.</p>
      </div>

      <div>
        <h3 class="text-[15px] font-bold text-gray-900 mb-2">5. DIREITOS DO USUÁRIO</h3>
        <p>O usuário pode solicitar atualização ou remoção dos seus dados a qualquer momento, mediante verificação de identidade.</p>
      </div>

      <div>
        <h3 class="text-[15px] font-bold text-gray-900 mb-2">6. CONTATO</h3>
        <p>Para dúvidas sobre privacidade, entre em contato via:</p>
        <p class="mt-2">Email: parcerias@univida.ao</p>
        <p>Telefone: +244 900 000 000</p>
      </div>
    </div>
  </div>
</template>
