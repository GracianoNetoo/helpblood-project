<script setup>
// Importamos a imagem para que o Vite processe o caminho corretamente
import fundoBanner from '../assets/fundovermelho.jpg';
</script>

<template>
  <div 
    class="w-full h-170 mt-10 bg-cover bg-center shadow-lg" 
    :style="{ backgroundImage: `url(${fundoBanner})` }"
  >
  <div class="p-4 pt-43 items-center justify-content-center">
    <p class="text-white text-3xl font-bold leading-relaxed text-center">
      Lorem ipsum dolor sit amet consectetur adipisicing
        <br>elit. Maiores, impedit. Similique velit itaque<br>porro iusto repellat sapiente amet doloribus tenetur dolorem earum <br>ex accusantium quibusdam<br>ipsum dicta, voluptas, cum voluptate.
    </p>
    <section class="flex justify-center mt-6">
      <button class="btn bg-white text-black hover:text-neutral-300 mr-4">Saiba Mais</button>
      <button class="btn bg-red-600 border-none text-white hover:bg-red-400">Contato</button>
    </section>
  </div>
  </div>
</template>