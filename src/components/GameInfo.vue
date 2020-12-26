<template>
  <div>
    <div v-if="currentTurn">
      <cdr-alert v-if="yourTurn" class="turn-alert" type="success" aria-live="polite">
        It's your turn!
      </cdr-alert>
      <h2 v-else class="heading-500">It's {{ currentTurn }}'s turn!</h2>
    </div>
    <h2 v-if="winner" class="winner heading-500">{{ winner }} won the hand!!!</h2>
  </div>
</template>
<script>
import { CdrAlert } from '@rei/cedar';

export default {
  components: {
    CdrAlert,
  },
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

<style lang="scss">
@import '~@rei/cdr-tokens/dist/scss/cdr-tokens.scss';
.turn-alert {
  margin: $cdr-space-one-x;
}
.winner {
  color: $cdr-color-text-sale;
}
</style>
