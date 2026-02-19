<template>
    <section class="py-20 bg-gray-50">
        <div class="container mx-auto px-6">

            <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div class="max-w-xl">
                    <h2 class="text-sm font-bold text-red-600 uppercase tracking-widest mb-3">Mobilização</h2>
                    <p class="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                        Campanhas de Arrecadação Ativas
                    </p>
                </div>
                <button class="text-red-600 border border-red-600 rounded-full p-2 font-bold flex items-center gap-2 hover:bg-red-600 hover:text-white transition-colors">
                    Ver todas as campanhas
                    <span>→</span>
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                <div
                    class="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                    <div class="h-48 overflow-hidden relative">
                        <div
                            class="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                            Urgente
                        </div>
                        <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
                            alt="Campanha Luanda"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    </div>
                    <div class="p-6">
                        <div class="flex items-center gap-2 text-gray-500 text-sm mb-3">
                            <span
                                class="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md font-medium text-slate-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                                    stroke-linejoin="round" class="text-red-600">
                                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                Benguela
                            </span>

                            <span class="text-gray-300">•</span>

                            <span class="flex items-center gap-1.5 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                                    <line x1="16" x2="16" y1="2" y2="6" />
                                    <line x1="8" x2="8" y1="2" y2="6" />
                                    <line x1="3" x2="21" y1="10" y2="10" />
                                </svg>
                                Próximo Sábado
                            </span>
                        </div>
                        <h3 class="text-xl font-bold text-slate-900 mb-2">Doe Sangue na Universidade Agostinho Neto</h3>
                        <p class="text-gray-600 text-sm mb-6">
                            Estamos em frente à Faculdade de Engenharia. Venha ajudar a repor o estoque crítico de tipo
                            A e O.
                        </p>
                        <button
                            class="w-full py-3 border-2 border-red-600 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white text-decoration-none transition-colors">
                            Participar da Campanha
                        </button>
                    </div>
                </div>

                <div
                    class="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                    <div class="h-48 overflow-hidden relative">
                        <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
                            alt="Campanha Benguela"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    </div>
                    <div class="p-6">
                        <div class="flex items-center gap-2 text-gray-500 text-sm mb-3">
                            <span
                                class="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md font-medium text-slate-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                                    stroke-linejoin="round" class="text-red-600">
                                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                Benguela
                            </span>

                            <span class="text-gray-300">•</span>

                            <span class="flex items-center gap-1.5 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                                    <line x1="16" x2="16" y1="2" y2="6" />
                                    <line x1="8" x2="8" y1="2" y2="6" />
                                    <line x1="3" x2="21" y1="10" y2="10" />
                                </svg>
                                Próximo Sábado
                            </span>
                        </div>
                        <h3 class="text-xl font-bold text-slate-900 mb-2">Unidade Móvel: Praia Morena</h3>
                        <p class="text-gray-600 text-sm mb-6">
                            A unidade móvel de coleta estará estacionada para atender todos os doadores da região de
                            Benguela.
                        </p>
                        <button
                            class="w-full py-3 border-2 border-red-600 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-colors">
                            Participar da Campanha
                        </button>
                    </div>
                </div>

                <div
                    class="bg-neutral-800 rounded-3xl p-8 flex flex-col justify-center text-white relative overflow-hidden">
                    <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
                    <h3 class="text-2xl font-bold mb-4">Quer criar uma campanha?</h3>
                    <p class="mb-8 text-slate-300">
                        É uma empresa ou instituição de ensino e quer organizar uma coleta coletiva?
                    </p>
                    <button class="bg-white text-red-600 px-6 py-3 rounded-xl font-black text-sm uppercase hover:bg-black hover:text-white transition-colors">
                        Saber Mais
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>