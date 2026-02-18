<template>
    <header class="fixed position- top-0 left-0 w-full shadow-md z-10">
        <div class="navbar bg-neutral-100">
            <div class="ps-4">
                <a class="text-[31px] text-red-600 font-bold">UniVida</a>
            </div>
            <div class="flex grow justify-end">
                <div class="flex items-stretch">
                    <a class="btn btn-link text-decoration-none me-[-39] text-black">Campanhas</a>
                    <a class="btn btn-link text-black text-decoration-none rounded-field">Sobre</a>
                    <a class="btn btn-outline-primary text-decoration-none mr-1 rounded-field hover:bg-red-600 duration-700">Entrar</a>
                    <div class="dropdown dropdown-end">
                        <div tabindex="0" role="button" class="btn bg-white text-neutral-800 btn-transparent rounded-field">Cadastra-se</div>
                        <ul 
                        tabindex="0"
                        class="menu dropdown-content  bg-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm" >
                        <li><a href="#">Doador</a></li>
                        <li><a href="#">Receptor</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</header>
</template>

<script>
</script>

<style scoped>
a{
    text-decoration: none;
}
</style>