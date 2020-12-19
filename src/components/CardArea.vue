<template>
  <div class="card-border" :class="{ vertical: displayVertical }">
    <cdr-text tag="h2" class="heading-500">{{ playerName }} ({{ tricks }}/{{ bid }})</cdr-text>
    <div class="card-container">
      <img
        class="card"
        v-for="(card, index) in sortedCards"
        :key="`${card.value}-${card.suit}`"
        :ref="`${card.value}-${card.suit}`"
        :style="getOffset(index + 1)"
        :src="cardImage(card)"
      />
    </div>
  </div>
</template>

<script>
import { CdrText } from '@rei/cedar';
export default {
  name: 'CardArea',
  components: {
    CdrText,
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
    bid: {
      type: Number,
      default: 0,
    },
    tricks: {
      type: Number,
      default: 0,
    },
    displayVertical: {
      type: Boolean,
      default: false,
    },
    isUser: {
      type: Boolean,
      default: false,
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
      const fileName = !this.isUser ? 'card-back' : `${card.value}-${card.suit}`;
      return require(`../assets/cards/${fileName}.png`); // the module request
    },
    getOffset(index) {
      const axis = this.displayVertical ? 'top' : 'left';
      // return `transform: translateX(${index * 30}px)`;
      return `${axis}: ${index * 30}px`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@rei/cdr-tokens/dist/scss/cdr-tokens.scss';

// .card-border {
//   border: black 1px solid;
// }
.card-container {
  // overflow: visible;
  position: relative;
}
.vertical .card {
  transform: rotate(90deg);
}
.vertical .card:hover {
  transform: rotate(90deg);
  transform: translateX(-0.2rem);
  transition: 0.2s;
}
img.card {
  position: absolute;
  left: 50%;
  max-height: 150px;
  z-index: 1;
  // box-shadow: 0 0.2rem 0.2rem 0 rgba(12, 11, 8, 0.2);
  // transition: box-shadow 0.2s cubic-bezier(0.15, 0, 0.15, 0);
  cursor: pointer;
}
img.card:hover {
  // box-shadow: 0 0.8rem 0.8rem 0 rgba(12, 11, 8, 0.2);
  transform: translateY(-0.8rem);
  transition: 0.2s;
}
.vertical .card {
  transform: rotate(90deg);
}
.vertical .card:hover {
  // transform: rotate(90deg);
  transform: rotate(90deg) translateY(-0.8rem);
  transition: 0.2s;
}
.heading-600 {
  @include cdr-text-heading-serif-600;
}
.heading-500 {
  @include cdr-text-heading-serif-500;
}
</style>
