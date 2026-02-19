<template>
  <section class="py-24 bg-white">
    <div class="container mx-auto px-6">
      
      <div class="text-center max-w-2xl mx-auto mb-16">
        <h2 class="text-sm font-bold text-red-600 uppercase tracking-widest mb-3">Fluxo de Doação</h2>
        <p class="text-3xl md:text-4xl font-black text-slate-900">Como a UniVida pode ser útil para você</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
        
        <div class="hidden md:block absolute top-1/4 left-0 w-full h-0.5 bg-gray-100 -z-10"></div>

        <div class="group text-center">
          <div class="w-16 h-16 bg-white border-2 border-red-600 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-lg group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
            1
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-3">Encontre o Local</h3>
          <p class="text-gray-600 leading-relaxed">
            Localize o hemocentro mais próximo de você através do nosso mapa inteligente.
          </p>
        </div>

        <div class="group text-center">
          <div class="w-16 h-16 bg-white border-2 border-red-600 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-lg group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
            2
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-3">Verifique os Requisitos</h3>
          <p class="text-gray-600 leading-relaxed">
            Saiba instantaneamente se você está apto para doar. 
            Consulte as diretrizes de saúde, peso e intervalos necessários antes de sair de casa.
          </p>
        </div>

        <div class="group text-center">
          <div class="w-16 h-16 bg-white border-2 border-red-600 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-lg group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
            3
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-3">Doe e Salve Vidas</h3>
          <p class="text-gray-600 leading-relaxed">
            Realize sua doação e receba o selo de doador ativo, ajudando até 4 pessoas com um único gesto.
          </p>
        </div>

      </div>

      <div class="mt-20 text-center">
        <button class="bg-slate-900 hover:bg-slate-800 text-white px-10 py-4 rounded-full font-bold transition-all shadow-xl hover:-translate-y-1">
          Ver Hemocentros Próximos
        </button>
      </div>

    </div>
  </section>
</template>