<template>
  <div id="spades-game">
    <!-- TODO: add green room back with 'else' statement -->
    <green-room v-if="!startGame" :teams="teams" :players="players" :player-id="playerId" />
    <div v-else class="game-wrapper cdr-align-text-center">
      <!-- <div>
        <cdr-button @click="shuffleDeck">Shuffle Deck</cdr-button>
      </div> -->
      <div class="game-board-wrapper">
        <div class="game-board">
          <cdr-img :src="backgroundImage" radius="rounded" responsive alt="wood table top" />
        </div>
        <transition name="card-one">
          <cdr-img
            v-if="cardDisplay['1']"
            responsive
            class="played-card zone-1"
            :src="cardImage(1)"
          />
        </transition>
        <transition name="card-two">
          <cdr-img
            v-if="cardDisplay['2']"
            responsive
            class="played-card zone-2"
            :src="cardImage(2)"
          />
        </transition>
        <transition name="card-three">
          <cdr-img
            v-if="cardDisplay['3']"
            responsive
            class="played-card zone-3"
            :src="cardImage(3)"
          />
        </transition>
        <transition name="card-four">
          <cdr-img
            v-if="cardDisplay['4']"
            responsive
            class="played-card zone-4"
            :src="cardImage(4)"
          />
        </transition>
      </div>
      <card-area
        v-for="(player, index) in playerOrder"
        :key="player.id"
        class="card-area"
        :class="`player-${index + 1}`"
        :displayVertical="displayConfig(index)"
        :cards="getHand(player.id)"
        :is-user="player.id === playerId"
        :player-name="player.name"
        :player-team="player.team"
        :this-players-turn="checkTurn(player.id)"
        :bid="getBid(player.id)"
        :tricks="getTricks(player.id)"
      />
      <cdr-select
        v-if="cardsDealt && !startRound"
        v-model="bid"
        @input="onBidChange($event)"
        class="bid-select"
        label="What's your bid?"
        prompt="No table talk!"
      >
        <option v-for="(num, index) in 14" :key="`bid-${index}`" :value="index">
          {{ index }}
        </option>
      </cdr-select>
      <game-info
        v-if="startRound"
        class="game-info"
        :current-turn="playersTurn.name"
        :your-turn="yourTurn"
      />
      <score-board class="score-board" :players="players"></score-board>
    </div>
    <cdr-modal
      label="Game Over!"
      :opened="winModalOpened"
      @closed="playAgain"
      class="cdr-align-text-center game-over-modal game-modal"
      aria-described-by="description"
    >
      <template slot="title">
        <cdr-text tag="h3" class="heading-600">Congratulations {{ winningTeam }}!</cdr-text>
        <cdr-text tag="h4" class="heading-500">You are victorious!</cdr-text>
        <cdr-button class="btn btn-play-again" @click="playAgain">Play Again?</cdr-button>
      </template>
    </cdr-modal>
    <cdr-modal
      label="Deal Cards"
      :opened="dealPrompt"
      @closed="dealPrompt = false"
      class="cdr-align-text-center deal-cards-modal game-modal"
      aria-described-by="description"
    >
      <template slot="title">
        <cdr-text tag="h3" class="heading-600">You are the dealer</cdr-text>
        <cdr-button class="btn btn-deal-cards" @click="shuffleDeck">Deal Cards</cdr-button>
      </template>
    </cdr-modal>
  </div>
</template>

<script>
import { CdrButton, CdrImg, CdrSelect, CdrModal, CdrText } from '@rei/cedar';
import CardArea from './CardArea.vue';
import GreenRoom from './GreenRoom.vue';
import GameInfo from './GameInfo.vue';
import ScoreBoard from './ScoreBoard.vue';

export default {
  name: 'SpadesGame',
  components: {
    CdrButton,
    CdrSelect,
    CdrImg,
    CdrModal,
    CdrText,
    CardArea,
    GameInfo,
    ScoreBoard,
    GreenRoom,
  },
  data() {
    return {
      selectedBackground: 'dark-wood',
      gameStarted: false,
      startRound: false,
      playerId: null,
      initPlayer: {
        name: null,
        id: null,
        hand: [],
      },
      bid: '',
      players: [],
      playersTurn: {},
      teams: [
        {
          name: 'No Team',
          players: [],
        },
        {
          name: 'Team One',
          players: [],
        },
        {
          name: 'Team Two',
          players: [],
        },
      ],
      deck: [],
      cardDisplay: {},
      cardsDealt: false,
      winningTeam: '',
      dealPrompt: false,
    };
  },
  sockets: {
    connect() {
      console.log('vue socket connected!');
    },
    newPlayer(id, players) {
      this.playerId = id;
      this.players = players;
    },
    updatePlayers(players) {
      this.players = players;
    },
    cardsDealt(state) {
      this.cardsDealt = state;
    },
    updateTeams(teams) {
      this.teams = teams;
    },
    startRound(value) {
      this.startRound = value;
    },
    layCard(card, playerId) {
      const zone = this.playerOrder.findIndex((player) => player.id === playerId);
      const key = (zone + 1).toString();
      this.cardDisplay[key] = card;
      // animate a bonus
    },
    clearBoard() {
      this.cardDisplay = {};
    },
    nextTurn(index) {
      this.playersTurn = this.players[index];
    },
    gameOver(team) {
      this.winningTeam = team === 'teamOne' ? 'Team One' : 'Team Two';
    },
    dealPrompt() {
      this.dealPrompt = true;
    },
  },
  computed: {
    backgroundImage() {
      const fileName = this.selectedBackground.toLowerCase();
      return require(`../assets/background/${fileName}.jpg`);
    },
    playerData() {
      return this.players.find((player) => player.id === this.playerId);
    },
    startGame() {
      const readyArr = this.players.filter((player) => player.ready);
      return readyArr.length === 4;
    },
    yourTurn() {
      return this.playersTurn.id === this.playerId;
    },
    playerOrder() {
      const index = this.players.indexOf(this.playerData);
      let arrayStart = this.players.slice(index);
      let arrayEnd = this.players.slice(0, index);
      return [...arrayStart, ...arrayEnd];
    },
    winModalOpened() {
      return !!this.winningTeam;
    },
  },
  methods: {
    resetPlayers() {
      this.$socket.client.emit('resetPlayers');
    },
    shuffleDeck() {
      this.dealPrompt = false;
      this.$socket.client.emit('shuffleDeck');
    },
    onBidChange(bid) {
      this.$socket.client.emit('bidSelect', parseInt(bid.target.value));
    },
    displayConfig(index) {
      return (index + 1) % 2 === 0;
    },
    getHand(id) {
      return this.players.find((player) => player.id === id).hand;
    },
    getBid(id) {
      return this.players.find((player) => player.id === id).bid;
    },
    getTricks(id) {
      return this.players.find((player) => player.id === id).tricksTaken;
    },
    checkTurn(id) {
      return this.playersTurn.id === id && this.startRound;
    },
    cardImage(zone) {
      const card = this.cardDisplay[zone];
      if (!card) return;
      const fileName = `${card.value}-${card.suit}`;
      return require(`../assets/cards/${fileName}.png`);
    },
    playAgain() {
      this.winningTeam = '';
      this.$socket.client.emit('playAgain');
    },
  },
  watch: {
    startGame() {
      if (this.startGame) {
        // this.shuffleDeck();
        this.$socket.client.emit('setPlayOrder');
      }
      return;
    },
  },
};
</script>

<style lang="scss">
@import '~@rei/cdr-tokens/dist/scss/cdr-tokens.scss';
@import '~@rei/cedar/dist/cedar-compiled.css';
#spades-game .heading-700 {
  @include cdr-text-heading-serif-700;
}
#spades-game .heading-600 {
  @include cdr-text-heading-serif-600;
}
#spades-game .heading-500 {
  @include cdr-text-heading-serif-500;
}
.btn {
  margin-top: $cdr-space-half-x;
}
.game-wrapper {
  display: grid;
  grid-template-columns: 25% auto 25%;
  grid-template-rows: 25vh auto 25vh;
}
.card-area {
  padding-top: $cdr-space-half-x;
  padding-bottom: $cdr-space-one-x;
}
.bid-select {
  grid-column: 2 / span 1;
  grid-row: 2 / span 1;
  place-self: center;
  z-index: 2;
}
.bid-select label {
  color: $cdr-color-text-inverse;
}
.game-info {
  grid-column: 3 / span 1;
  grid-row: 1 / span 1;
}
.score-board {
  grid-column: 3 / span 1;
  grid-row: 3 / span 1;
  padding-left: $cdr-space-one-x;
  padding-right: $cdr-space-one-x;
}
.game-board-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 38% 1fr 38%;
  grid-column: 2 / span 1;
  grid-row: 2 / span 1;
  @include cdr-xs-mq-only {
    grid-column: 1 / span 3;
  }
}
.game-board {
  padding: $cdr-space-half-x;
  grid-column: 1 / span 3;
  grid-row: 1 / span 3;
}
img.played-card {
  max-width: 40%;
  margin: 0 auto;
}
.zone-1 {
  grid-column: 2 / span 1;
  grid-row: 3 / span 1;
}
.zone-2 {
  grid-column: 1 / span 1;
  grid-row: 2 / span 1;
  transform: rotate(90deg);
}
.zone-3 {
  grid-column: 2 / span 1;
  grid-row: 1 / span 1;
  align-self: end;
}
.zone-4 {
  grid-column: 3 / span 1;
  grid-row: 2 / span 1;
  transform: rotate(270deg);
}
.player-1 {
  grid-column: 2 / span 1;
  grid-row: 3 / span 1;
  @include cdr-xs-mq-only {
    grid-column: 1 / span 3;
  }
}
.player-2 {
  grid-column: 1 / span 1;
  grid-row: 2 / span 1;
  @include cdr-xs-mq-only {
    display: none;
  }
}
.player-3 {
  grid-column: 2 / span 1;
  grid-row: 1 / span 1;
  @include cdr-xs-mq-only {
    grid-column: 1 / span 3;
  }
}
.player-4 {
  grid-column: 3 / span 1;
  grid-row: 2 / span 1;
  @include cdr-xs-mq-only {
    display: none;
  }
}
.card-one-enter {
  transform: translateY(210px);
  // opacity: 0;
}
.card-two-enter {
  transform: translateX(-210px);
  // opacity: 0;
}
.card-three-enter {
  transform: translateY(-210px);
  // opacity: 0;
}
.card-four-enter {
  transform: translateX(210px);
  // opacity: 0;
}

.card-one-enter-active,
.fade-one-leave-active,
.card-two-enter-active,
.fade-two-leave-active,
.card-three-enter-active,
.fade-three-leave-active,
.card-four-enter-active,
.fade-four-leave-active {
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.fade-one-leave-to,
.fade-two-leave-to,
.fade-three-leave-to,
.fade-four-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
