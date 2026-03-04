<script setup>
const emit = defineEmits(['close']);
</script>

<template>
  <div class="bg-white rounded-[28px] shadow-2xl border border-white/20 overflow-hidden max-w-3xl w-full">
    <div class="p-6 md:p-8 border-b border-gray-100 bg-gray-50/60 flex justify-between items-center">
      <div>
        <h2 class="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">Termos de Uso</h2>
        <p class="text-sm text-gray-500 mt-1">UniVida Angola</p>
      </div>
      <button @click="$emit('close')" class="w-10 h-10 bg-white border border-gray-200 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full flex items-center justify-center transition-colors shadow-sm">
        <span class="text-xl leading-none">×</span>
      </button>
    </div>

    <div class="p-6 md:p-8 max-h-[70vh] overflow-y-auto text-sm text-gray-700 space-y-5 leading-relaxed">
      <div class="text-xs text-gray-500 font-semibold uppercase tracking-widest">TERMOS DE USO – UniVida</div>
      <p class="text-[13px] text-gray-500 font-medium">Última atualização: 4 de março de 2026</p>

      <div>
        <h3 class="text-[15px] font-bold text-gray-900 mb-2">1. SOBRE A PLATAFORMA</h3>
        <p>A UniVida é uma plataforma digital destinada exclusivamente a conectar voluntários interessados em doar sangue com pessoas que necessitam de doação, sempre com a orientação de que todo o processo de doação seja realizado em ambiente hospitalar autorizado e conforme a legislação vigente.</p>
        <p class="mt-3">A plataforma NÃO realiza coleta, armazenamento, transporte ou intermediação direta de sangue.</p>
      </div>

      <div>
        <h3 class="text-[15px] font-bold text-gray-900 mb-2">2. NATUREZA DO SERVIÇO</h3>
        <p>2.1. A plataforma atua apenas como meio de conexão entre usuários.</p>
        <p>2.2. A doação de sangue deverá ocorrer exclusivamente em hospitais, clínicas ou centros de hemoterapia oficialmente autorizados.</p>
        <p>2.3. A UniVida não garante:</p>
        <ul class="list-disc list-inside">
          <li>Disponibilidade de doadores;</li>
          <li>Compatibilidade sanguínea;</li>
          <li>Elegibilidade médica;</li>
          <li>Sucesso da doação.</li>
        </ul>
        <p class="mt-3">2.4. Todos os exames, avaliações médicas e procedimentos são de responsabilidade exclusiva das instituições de saúde competentes.</p>
      </div>

      <div>
        <h3 class="text-[15px] font-bold text-gray-900 mb-2">3. CADASTRO DE USUÁRIOS</h3>
        <p>3.1. Para utilizar a plataforma, o usuário deve fornecer informações verdadeiras, completas e atualizadas.</p>
        <p>3.2. O usuário declara:</p>
        <ul class="list-disc list-inside">
          <li>Ser maior de 18 anos ou possuir autorização legal.</li>
          <li>Estar ciente de que exames médicos serão obrigatórios antes de qualquer doação;</li>
          <li>Compreender que poderá ser considerado inapto por decisão médica.</li>
        </ul>
        <p class="mt-3">3.3. É proibido:</p>
        <ul class="list-disc list-inside">
          <li>Fornecer informações falsas;</li>
          <li>Utilizar a plataforma para fins comerciais;</li>
          <li>Solicitar ou oferecer pagamento por doação de sangue.</li>
          <li>Utilizar a plataforma para qualquer prática ilegal.</li>
        </ul>
      </div>

      <div>
        <h3 class="text-[15px] font-bold text-gray-900 mb-2">4. RESPONSABILIDADE</h3>
        <p>4.1. A UniVida não se responsabiliza por:</p>
        <ul class="list-disc list-inside">
          <li>Decisões médicas;</li>
          <li>Condições de saúde dos usuários.</li>
          <li>Cancelamentos de doação;</li>
          <li>Danos decorrentes de informações incorretas fornecidas pelos usuários;</li>
          <li>Atos realizados fora do ambiente hospitalar.</li>
        </ul>
        <p class="mt-3">4.2. A responsabilidade sobre exames, triagem, coleta e segurança do procedimento é exclusivamente do hospital ou centro médico escolhido.</p>
      </div>

      <div>
        <h3 class="text-[15px] font-bold text-gray-900 mb-2">5. PROIBIÇÃO DE VENDA DE SANGUE</h3>
        <p>5.1. É expressamente proibido solicitar, oferecer ou negociar qualquer tipo de pagamento ou compensação financeira pela doação de sangue.</p>
        <p>5.2. Caso seja identificada tentativa de comercialização, a conta poderá ser imediatamente suspensa ou removida.</p>
      </div>

      <div>
        <h3 class="text-[15px] font-bold text-gray-900 mb-2">6. PRIVACIDADE E DADOS PESSOAIS</h3>
        <p>6.1. A plataforma coleta apenas dados necessários para a conexão entre usuários.</p>
        <p>6.2. Os dados poderão incluir:</p>
        <ul class="list-disc list-inside">
          <li>Nome;</li>
          <li>Tipo sanguíneo (quando informado);</li>
          <li>Localização;</li>
          <li>Informações de contato.</li>
        </ul>
        <p class="mt-3">6.3. A UniVida compromete-se a:</p>
        <ul class="list-disc list-inside">
          <li>Não vender dados pessoais;</li>
          <li>Utilizar medidas razoáveis de segurança;</li>
          <li>Compartilhar informações apenas quando necessário para o funcionamento da plataforma ou por obrigação legal.</li>
        </ul>
        <p class="mt-3">6.4. O usuário é responsável por manter seus dados de acesso seguros.</p>
      </div>

      <div>
        <h3 class="text-[15px] font-bold text-gray-900 mb-2">7. CONDUTA DOS USUÁRIOS</h3>
        <p>O usuário compromete-se a:</p>
        <ul class="list-disc list-inside">
          <li>Agir com respeito.</li>
          <li>Não assediar outros usuários;</li>
          <li>Não utilizar linguagem ofensiva.</li>
          <li>Não solicitar encontros fora do contexto hospitalar para fins relacionados à doação.</li>
        </ul>
        <p class="mt-3">O descumprimento poderá resultar em suspensão ou exclusão da conta.</p>
      </div>

      <div>
        <h3 class="text-[15px] font-bold text-gray-900 mb-2">8. LIMITAÇÃO DE RESPONSABILIDADE</h3>
        <p>A UniVida não será responsável por quaisquer danos diretos ou indiretos decorrentes:</p>
        <ul class="list-disc list-inside">
          <li>Do uso ou impossibilidade de uso da plataforma;</li>
          <li>De falhas técnicas;</li>
          <li>De interações entre usuários.</li>
        </ul>
      </div>

      <div>
        <h3 class="text-[15px] font-bold text-gray-900 mb-2">9. MODIFICAÇÕES DOS TERMOS</h3>
        <p>A plataforma poderá alterar estes Termos de Uso a qualquer momento. O uso contínuo do serviço após alterações implica aceitação das novas condições.</p>
      </div>

      <div>
        <h3 class="text-[15px] font-bold text-gray-900 mb-2">10. LEGISLAÇÃO APLICÁVEL</h3>
        <p>Estes Termos serão regidos pelas leis vigentes na República de Angola.</p>
        <p class="mt-2">Eventuais disputas deverão ser resolvidas nos tribunais competentes do país.</p>
      </div>

      <div>
        <h3 class="text-[15px] font-bold text-gray-900 mb-2">11. CONTATO</h3>
        <p>Para dúvidas ou solicitações relacionadas a estes Termos, o usuário poderá entrar em contato através de:</p>
        <p class="mt-2">Email: parcerias@univida.ao</p>
        <p>Telefone: +244 900 000 000</p>
      </div>

      <div class="text-[13px] text-gray-600 font-medium border-t border-gray-100 pt-4">
        Ao utilizar a plataforma, o usuário declara que leu, compreendeu e concorda integralmente com estes Termos de Uso.
      </div>
    </div>
  </div>
</template>
