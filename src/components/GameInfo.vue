<template>
  <div>
    <h2 v-if="currentTurn" class="heading-500">{{ message }}</h2>
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
  computed: {
    message() {
      return this.yourTurn ? "It's your turn!" : `${this.currentTurn}'s turn!`;
    },
  },
};
</script>

<style lang="scss" scoped></style>
