<script>
  export let count = 0
  function handleClick() {
    count += 1
  }
</script>

{count}
<button on:click={handleClick}>increment</button>
