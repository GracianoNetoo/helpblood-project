<template>
  <main class="pt-10"> <section class="relative w-full h-125 flex items-center justify-center overflow-hidden">
      <img 
        src="../assests/fundovermelho.jpg" 
        alt="Background" 
        class="absolute inset-0 w-full h-full object-cover opacity-70">
      <div class="relative z-10 text-center px-4 max-w-4xl mx-auto">        
        <h1 class="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
          Um simples gesto seu pode <span class="text-neutral-100">salvar até 4 vidas.</span>
        </h1>
        
        <p class="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          A UniVida une doadores voluntários a hospitais e receptores. Torne-se um herói hoje mesmo.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-lg shadow-lg shadow-red-600/30 transition-all hover:-translate-y-1">
            Quero ser Doador
          </button>
          <button class="px-8 py-4 bg-transparent border-2 border-gray-500 text-gray-300 rounded-full font-bold text-lg hover:border-white hover:text-white transition-all">
            Preciso de Doação
          </button>
        </div>
      </div>

    </section>

    <section class="py-12 bg-white flex justify-center gap-12 text-center border-b border-gray-100">
       <div>
         <p class="text-3xl font-black text-slate-800">1.2k+</p>
         <p class="text-sm text-gray-400 font-medium uppercase tracking-widest">Vidas Salvas</p>
       </div>
       <div class="w-px h-12 bg-gray-200"></div>
       <div>
         <p class="text-3xl font-black text-slate-800">850</p>
         <p class="text-sm text-gray-400 font-medium uppercase tracking-widest">Doadores Ativos</p>
       </div>
       <div class="w-px h-12 bg-gray-200"></div>
       <div>
         <p class="text-3xl font-black text-red-600">Crítico</p>
         <p class="text-sm text-gray-400 font-medium uppercase tracking-widest">Tipo O- hoje</p>
       </div>
       <div class="w-px h-12 bg-gray-200"></div>
       <div>
         <p class="text-3xl font-black text-slate-800">Campanhas</p>
         <p class="text-sm text-gray-400 font-medium uppercase tracking-widest">4 de doações ativas</p>
       </div>
    </section>

  </main>
</template>