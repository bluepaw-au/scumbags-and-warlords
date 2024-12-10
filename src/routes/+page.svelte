<script lang="ts">
	import { goto } from "$app/navigation";
	import Button from "$lib/components/ui/button/button.svelte";


    let joinCode: Number;
    let lobbyCode: Number;

    let generateLobbyCode = function(){
        lobbyCode = Math.floor(1000 + Math.random() * 9000);
    }

</script>

<div class="w-full min-h-screen bg-background text-foreground flex flex-col justify-center">
    <div class="container mx-auto text-center">

        <div class="flex flex-col y-8 p-32 justify-center mx-auto bg-felt-800 w-1/2 rounded-2xl">

            <h1 class="text-4xl font-semibold">Scumbags & Warlords</h1>
            <p class="py-6">
                Create an account to play Scumbags with your friends.
            </p>
            <Button href="/login" class="font-semibold">Create Account</Button>

        </div>

    </div>
</div>