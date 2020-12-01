<template>
  <div class="card-border">
    <cdr-text tag="h2" class="heading-600">{{ playerName }} </cdr-text>
  </div>
</template>

<script>
import { CdrButton, CdrText, CdrImg } from '@rei/cedar';
export default {
  name: 'CardArea',
  components: {
    // CdrButton,
    CdrText,
    // CdrImg,
  },
  props: {
    playerName: {
      type: String,
      default: '',
    },
    cards: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss" scoped>
.card-border {
  border: black 1px solid;
}
</style>
