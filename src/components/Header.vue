<template>
    <header class="fixed top-0 left-0 w-full shadow-md z-50">
        <div class="navbar bg-neutral-100">
            <div class="ps-4">
                <a class="text-[31px] text-red-600 font-extrabold">UniVida</a>
            </div>
            <div class="flex grow justify-end">
                <div class="flex items-stretch">
                    <a class="btn btn-link text-decoration-none text-black hover:text-red-600">Home</a>
                    <a class="btn btn-link text-decoration-none text-black hover:text-red-600">Campanhas</a>
                    <a class="btn btn-link text-black text-decoration-none hover:text-red-600 rounded-field">Sobre</a>
                    <a
                        class="btn text-decoration-none mr-1 rounded-field hover:bg-red-600 duration-700">Entrar</a>
                    <div class="dropdown dropdown-end">
                        <div tabindex="0" role="button"
                            class="btn bg-white text-neutral-800 btn-transparent rounded-field">Cadastra-se</div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
</script>

<style scoped>
a {
    text-decoration: none;
}
</style>