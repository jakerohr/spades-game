<template>
  <div class="card-border">
    <cdr-text tag="h2" class="heading-500">{{ playerName }} </cdr-text>
    <img
      class="card"
      v-for="card in sortedCards"
      :key="`${card.value}-${card.suit}`"
      :ref="`${card.value}-${card.suit}`"
      :src="cardImage(card)"
    />
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
  data() {
    return {
      suitRank: ['S', 'H', 'D', 'C'],
    };
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
  computed: {
    sortedCards() {
      const suitArray = this.suitRank.map((suit) => {
        return this.cards
          .filter((card) => card.suit === suit)
          .sort((a, b) => {
            return a.rank - b.rank;
          });
      });
      return suitArray.flatMap((arr) => arr);
    },
  },
  methods: {
    cardImage(card) {
      const fileName = `${card.value}-${card.suit}`;
      return require(`../assets/cards/${fileName}.png`); // the module request
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@rei/cdr-tokens/dist/scss/cdr-tokens.scss';

.card-border {
  border: black 1px solid;
}
img.card {
  max-height: 150px;
  box-shadow: 0 0.2rem 0.2rem 0 rgba(12, 11, 8, 0.2);
  transition: box-shadow 0.2s cubic-bezier(0.15, 0, 0.15, 0);
  cursor: pointer;
}
img.card:hover {
  box-shadow: 0 0.8rem 0.8rem 0 rgba(12, 11, 8, 0.2);
  transform: translateY(-0.2rem);
  transition: 0.2s;
}
.heading-600 {
  @include cdr-text-heading-serif-600;
}
.heading-500 {
  @include cdr-text-heading-serif-500;
}
</style>
