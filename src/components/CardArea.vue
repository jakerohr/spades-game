<template>
  <div
    class="card-border"
    :style="cssVars"
    :class="{ vertical: displayVertical, 'is-user': isUser, active: thisPlayersTurn }"
  >
    <cdr-text tag="h2" class="heading-500 player-name"
      >{{ playerName }} ({{ tricks }}/{{ bid }})</cdr-text
    >
    <div class="card-container">
      <img
        class="card"
        :class="{ playable: playableCard(card) }"
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
      openingHand: false,
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
    spadesBroken: {
      type: Boolean,
      default: false,
    },
    suitPlayed: {
      type: String,
      default: '',
    },
  },
  sockets: {
    openingHand(value) {
      this.openingHand = value;
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
    lowestClub() {
      const clubs = this.sortedCards.filter((card) => card.suit === 'C');
      if (clubs.length === 0) return;
      const cardRank = clubs.reduce(
        (min, card) => (card.rank < min ? card.rank : min),
        clubs[0].rank
      );
      return clubs.find((card) => card.rank === cardRank);
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
      return require(`../assets/cards/${fileName}.png`);
    },
    getOffset(index) {
      const axis = this.displayVertical ? 'top' : 'left';
      const value = axis === 'top' ? index * 2 - 2 : index * 2;
      // return `transform: translateX(${index * 30}px)`;
      return `${axis}: ${value}rem`;
    },
    playCard(card) {
      if (this.isUser && this.thisPlayersTurn) {
        this.selectedCard = card;
        this.$socket.client.emit('playCard', card);
      }
    },
    firstTrickCard(card) {
      if (this.lowestClub) {
        return this.lowestClub.id === card.id;
      }
      return true;
    },
    checkSuit(card) {
      if (this.suitPlayed) {
        return this.suitPlayed === card.suit;
      } else if (!this.spadesBroken) {
        return card.suit !== 'S';
      } else {
        return true;
      }
    },
    playableCard(card) {
      if (this.openingHand) {
        return this.firstTrickCard(card);
      }
      return this.checkSuit(card);
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
  position: absolute;
  top: calc(50% - var(--container-size) / 2);
  left: calc(50% - 75px);
  width: 150px;
}
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 50%;
  height: 100px;
  margin-top: -50px; /* account for padding and border if not using box-sizing: border-box; */
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
.is-user.active img.card.playable:hover {
  // box-shadow: 0 0.8rem 0.8rem 0 rgba(12, 11, 8, 0.2);
  cursor: pointer;
  transform: translateY(-0.8rem);
  transition: 0.2s;
}
// .is-user img.card.playable {
//   border: $cdr-color-text-success solid 1px;
//   border-radius: 4px;
//   box-shadow: inset 0 0 10px $cdr-color-text-success
// }
.vertical {
  @include cdr-xs-mq-only {
    display: none;
  }
}
.card-border {
  position: relative;
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
.active .player-name {
  color: $cdr-color-text-success;
}
</style>
