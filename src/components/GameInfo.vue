<template>
  <div>
    <h2 v-if="currentTurn" class="heading-500">{{ message }}</h2>
    <h2 v-if="winner" class="winner heading-500">{{ winner }} won the hand!!!</h2>
  </div>
</template>

<script>
export default {
  name: 'GameInfo',
  props: {
    currentTurn: {
      type: String,
      default: '',
    },
    yourTurn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      winner: '',
    };
  },
  sockets: {
    winningPlayer(winner) {
      this.winner = winner;
    },
  },
  computed: {
    message() {
      return this.yourTurn ? "It's your turn!" : `${this.currentTurn}'s turn!`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@rei/cdr-tokens/dist/scss/cdr-tokens.scss';

.winner {
  color: $cdr-color-text-sale;
}
</style>
