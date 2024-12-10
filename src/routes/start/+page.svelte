<script lang="ts">

    let joinCode: Number;
    let lobbyCode: Number;

    let generateLobbyCode = function(){
        lobbyCode = Math.floor(1000 + Math.random() * 9000);
    }

</script>

<div class="w-full h-full flex flex-col justify-center">
<div class="container mx-auto text-center">

	<div class="flex flex-col gap-8 my-8 p-16 justify-center mx-auto bg-felt-800 w-1/2 rounded-2xl">
        <h1 class="text-4xl text-white">Scumbags & Warlords</h1>

        <div class="flex flex-row gap-8 justify-center">

            <a href={(lobbyCode) ? '/' + lobbyCode : ''} onclick={() => generateLobbyCode()} class="group transition-colors inline-flex border-4 p-1 border-sun-500/25 hover:border-sun-500 rounded-lg disabled:opacity-50">
                <div class="transition-colors btn-inner rounded py-3 px-4 bg-sun-500 group-hover:bg-sun-400">
                    <span class="transition-colors text-xl text-sun-950 group-hover:text-sun-800 font-serif font-bold">
                        Create New Lobby
                    </span>
                </div>
            </a>
        </div>

        <div class="flex flex-row gap-8 justify-center items-center">

            <input name="roomcode" bind:value={joinCode} type="text" placeholder="CODE" maxlength=4 class="text-xl tracking-[0.5rem] w-36 text-center h-12 p-8"/>

            <a href="/{joinCode}" class="group transition-colors inline-flex border-4 p-1 border-gray-300/25 hover:border-gray-200 rounded-lg disabled:opacity-50">
                <div class="transition-colors btn-inner rounded py-3 px-4 bg-gray-300/90 group-hover:bg-gray-200">
                    <span class="transition-colors text-xl text-gray-950 group-hover:text-gray-700 font-serif font-bold">
                        Join Lobby
                    </span>
                </div>
            </a>

        </div>

    </div>

</div>
</div>