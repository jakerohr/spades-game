<template>
  <div
    class="card-border"
    :style="cssVars"
    :class="{ vertical: displayVertical, 'is-user': isUser }"
  >
    <cdr-text tag="h2" class="heading-500 player-name" :class="{ active: thisPlayersTurn }"
      >{{ playerName }} ({{ tricks }}/{{ bid }})</cdr-text
    >
    <div class="card-container">
      <img
        class="card"
        @click="playCard(card)"
        v-for="(card, index) in sortedCards"
        :key="`${card.value}-${card.suit}`"
        :ref="`${card.value}-${card.suit}`"
        :style="getOffset(index)"
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
      selectedCard: {},
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
    thisPlayersTurn: {
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
    containerWidth() {
      return 107 + 20 * (this.cards.length - 1);
    },
    cssVars() {
      return {
        '--container-size': `${this.containerWidth}px`,
      };
    },
  },
  methods: {
    cardImage(card) {
      const fileName = !this.isUser ? 'card-back' : `${card.value}-${card.suit}`;
      return require(`../assets/cards/${fileName}.png`); // the module request
    },
    getOffset(index) {
      const axis = this.displayVertical ? 'top' : 'left';
      const value = axis === 'top' ? index * 2 - 2 : index * 2;
      // return `transform: translateX(${index * 30}px)`;
      return `${axis}: ${value}rem`;
    },
    playCard(card) {
      if (!this.isUser) return;
      this.selectedCard = card;
      this.$socket.client.emit('playCard', card);
      // emit event that card was played.
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@rei/cdr-tokens/dist/scss/cdr-tokens.scss';
.player-name {
  margin-bottom: $cdr-space-half-x;
}
.card-container {
  // border: black 1px solid;
  width: var(--container-size);
  height: 150px;
  margin: 0 auto;
  position: relative;
}
.vertical .card-container {
  height: var(--container-size);
  width: 150px;
}
.vertical .card {
  transform: rotate(90deg);
}
// .vertical .card:hover {
//   transform: rotate(90deg);
//   transform: translateX(-0.2rem);
//   transition: 0.2s;
// }
img.card {
  position: absolute;
  left: 50%;
  max-height: 150px;
  z-index: 1;
  // box-shadow: 0 0.2rem 0.2rem 0 rgba(12, 11, 8, 0.2);
  // transition: box-shadow 0.2s cubic-bezier(0.15, 0, 0.15, 0);
}
.is-user img.card:hover {
  // box-shadow: 0 0.8rem 0.8rem 0 rgba(12, 11, 8, 0.2);
  cursor: pointer;
  transform: translateY(-0.8rem);
  transition: 0.2s;
}
.vertical {
  @include cdr-xs-mq-only {
    display: none;
  }
}
.vertical .card {
  transform: rotate(90deg);
  left: 14%;
}
// .vertical .card:hover {
//   // transform: rotate(90deg);
//   transform: rotate(90deg) translateY(-0.8rem);
//   transition: 0.2s;
// }
.heading-600 {
  @include cdr-text-heading-serif-600;
}
.heading-500 {
  @include cdr-text-heading-serif-500;
}
.active {
  color: $cdr-color-text-success;
}
</style>
