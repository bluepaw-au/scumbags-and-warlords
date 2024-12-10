<script lang="ts">
    import { page } from '$app/stores';
    import type { PageData } from './$types';


    let { data }: { data: PageData } = $props();

    let username = data.username;

</script>

<div class="w-full min-h-screen bg-background text-foreground flex flex-col justify-center">
    <div class="container mx-auto text-center">

        <!-- MAIN CONTENT -->
        <div class="flex flex-col bg-muted/20 y-8 p-16 items-start text-left mx-auto bg-felt-800 w-full rounded-2xl">

            <div class="flex flex-col mb-12">
                <h1 class="text-4xl font-semibold">User: {username}</h1>
                <p class="py-3">A cool guy who does stuff.</p>
            </div>
            
            <!-- GAME HISTORY -->
            

            <!-- GAME HISTORY TABLE -->
            <h1 class="text-xl font-semibold mb-4">History</h1>
            <div class="flex flex-col w-full rounded-lg border border-muted-foreground/40 overflow-hidden">

                <!-- TABLE HEADER -->
                <div class="flex flex-row justify-between text-sm text-foreground/65 tracking-wider font-bold py-2 px-4 bg-muted/40">
                    <span class="w-1/3"> PLACEMENT </span>
                    <span class="w-1/3"> PLAYERS </span>
                    <span class="w-1/3"> DATE </span>
                </div>

                <!-- TABLE ROW -->
                <div class="flex flex-row justify-between text-lg font-semibold py-2 px-4 bg-muted/80">
                    <span class="w-1/3"> #1 </span>
                    <span class="w-1/3"> 5 </span>
                    <span class="w-1/3"> 10th Dec 2024 </span>
                </div>

            </div>


        </div>

    </div>
</div>