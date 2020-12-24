<template>
  <div
    class="card-border"
    :style="cssVars"
    :class="{ vertical: displayVertical, 'is-user': isUser, active: thisPlayersTurn }"
  >
    <cdr-text modifier="eyebrow-100">{{ playerTeam }}</cdr-text>
    <cdr-text tag="h2" class="heading-500 player-name"
      >{{ playerName }} <span v-if="bid">({{ tricks }}/{{ bid }})</span></cdr-text
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
      openingHand: false,
      spadesBroken: false,
      suitPlayed: '',
    };
  },
  props: {
    playerName: {
      type: String,
      default: '',
    },
    playerTeam: {
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
  sockets: {
    openingHand(value) {
      this.openingHand = value;
    },
    spadesBroken(value) {
      this.spadesBroken = value;
    },
    setSuit(suit) {
      this.suitPlayed = suit;
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
    cardsMatchingSuit() {
      return this.sortedCards.some((card) => card.suit === this.suitPlayed);
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
      return `${axis}: ${value}rem`;
    },
    playCard(card) {
      if (this.isUser && this.thisPlayersTurn && this.playableCard(card)) {
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
      if (this.suitPlayed && this.cardsMatchingSuit) {
        return this.suitPlayed === card.suit;
      } else if (!this.spadesBroken && !this.suitPlayed) {
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
.vertical .card {
  transform: rotate(90deg);
}
img.card {
  position: absolute;
  left: 50%;
  max-height: 150px;
  z-index: 1;
}
.is-user.active img.card.playable:hover {
  cursor: pointer;
  transform: translateY(-0.8rem);
  transition: 0.2s;
}
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
