<template>
  <footer class="bg-slate-900 text-gray-300 pt-16 pb-8">
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        <div class="col-span-1 md:col-span-1">
          <div class="flex items-center gap-2 mb-6">
            <span class="text-xl font-bold text-white tracking-tighter">UniVida</span>
          </div>
          <p class="text-sm leading-relaxed">
            A plataforma que une a vontade de ajudar com a necessidade de salvar vidas em Angola.
          </p>
        </div>

        <div>
          <h4 class="text-white font-bold mb-6">Plataforma</h4>
          <ul class="space-y-4 text-sm">
            <li><a href="#" class="hover:text-red-500 transition-colors">Como Doar</a></li>
            <li><a href="#" class="hover:text-red-500 transition-colors">Campanhas Ativas</a></li>
            <li><a href="#" class="hover:text-red-500 transition-colors">Hemocentros</a></li>
            <li><a href="#" class="hover:text-red-500 transition-colors">Requisitos</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-bold mb-6">Suporte</h4>
          <ul class="space-y-4 text-sm">
            <li><a href="#" class="hover:text-red-500 transition-colors">Dúvidas Frequentes</a></li>
            <li><a href="#" class="hover:text-red-500 transition-colors">Privacidade</a></li>
            <li><a href="#" class="hover:text-red-500 transition-colors">Contato</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-bold mb-6">Acompanhe a UniVida</h4>
          <div class="flex gap-4 mb-6">
            <a href="#" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-all text-white">
              <span class="sr-only">Facebook</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-all text-white">
              <span class="sr-only">Instagram</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
          </div>
          <p class="text-xs text-gray-500 italic">Receba notificações de estoques críticos no seu e-mail.</p>
        </div>
      </div>

      <div class="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p>&copy; 2024 UniVida Angola. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>