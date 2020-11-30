<template>
  <div class="home">
    <SpadesGame />
  </div>
</template>

<script>
// @ is an alias to /src
import SpadesGame from '@/components/SpadesGame.vue';

export default {
  name: 'Home',
  components: {
    SpadesGame,
  },
};
</script>
