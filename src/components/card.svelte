<script lang="ts">
    var value = 2;
    var suit = "heart"
</script>

<div class="card">

    <div class="face">
        <div class="badge-top">
            <div class="badge-value">{{value}}</div>
            <div class="badge-suit">{{suit}}</div>
        </div>
        <div class="badge-bottom">

        </div>

    </div>
    <div class="back">

    </div>
</div>

<style>
    .card{
        aspect-ratio: 3.5/2.5 auto;
        min-width: 150px;
    }
    .face,.back{
        width: 100%;
        height: 100%;
    }
</style>