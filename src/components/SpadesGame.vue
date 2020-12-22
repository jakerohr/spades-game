<template>
  <div>
    <!-- TODO: add green room back with 'else' statement -->
    <!-- <green-room v-if="!startGame" :teams="teams" :players="players" :player-id="playerId" /> -->
    <div v-if="startGame" class="game-wrapper cdr-align-text-center">
      <div>
        <cdr-button @click="shuffleDeck">Shuffle Deck</cdr-button>
      </div>
      <div class="game-board-wrapper">
        <div class="game-board">
          <cdr-img :src="backgroundImage" radius="rounded" responsive alt="wood table top" />
        </div>
        <cdr-img
          v-if="cardDisplay['1']"
          responsive
          class="played-card zone-1"
          :src="cardImage(1)"
        />
        <cdr-img
          v-if="cardDisplay['2']"
          responsive
          class="played-card zone-2"
          :src="cardImage(2)"
        />
        <cdr-img
          v-if="cardDisplay['3']"
          responsive
          class="played-card zone-3"
          :src="cardImage(3)"
        />
        <cdr-img
          v-if="cardDisplay['4']"
          responsive
          class="played-card zone-4"
          :src="cardImage(4)"
        />
      </div>
      <card-area
        v-for="(player, index) in playerOrder"
        :key="player.id"
        class="card-area"
        :class="`player-${index + 1}`"
        :displayVertical="displayConfig(index)"
        :cards="getHand(player.id)"
        :is-user="player.id === playerId"
        :spades-broken="spadesBroken"
        :suit-played="suitPlayed"
        :player-name="player.name"
        :this-players-turn="checkTurn(player.id)"
        :bid="getBid(player.id)"
        :tricks="getTricks(player.id)"
      />
      <cdr-select
        v-if="cardsDealt && !startRound"
        v-model="bid"
        @change="onBidChange($event)"
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
      ></game-info>
    </div>
  </div>
</template>

<script>
import { CdrButton, CdrImg, CdrSelect } from '@rei/cedar';
import CardArea from './CardArea.vue';
import GreenRoom from './GreenRoom.vue';
import GameInfo from './GameInfo.vue';

export default {
  name: 'SpadesGame',
  components: {
    CdrButton,
    CdrSelect,
    CdrImg,
    CardArea,
    GameInfo,
    // GreenRoom,
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
      // playerOrder: [],
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
      spadesBroken: false,
      suitPlayed: '',
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
      // find table zone for player
      const zone = this.playerOrder.findIndex((player) => player.id === playerId); //0
      const key = (zone + 1).toString();
      this.cardDisplay[key] = card;
      // animate a bonus
    },
    clearBoard() {
      this.cardsDisplay = {};
    },
    setSuit(suit) {
      this.suitPlayed = suit;
    },
    nextTurn(index) {
      this.playersTurn = this.players[index];
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
  },
  methods: {
    resetPlayers() {
      this.$socket.client.emit('resetPlayers');
    },
    shuffleDeck() {
      this.$socket.client.emit('shuffleDeck');
    },
    onBidChange(bid) {
      this.$socket.client.emit('bidSelect', parseInt(bid));
    },
    displayConfig(index) {
      return (index + 1) % 2 === 0;
    },
    // setPlayerOrder() {
    //   const index = this.players.indexOf(this.playerData);
    //   let arrayStart = this.players.slice(index);
    //   let arrayEnd = this.players.slice(0, index);
    //   this.playerOrder = [...arrayStart, ...arrayEnd];
    // },
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
  },
  watch: {
    startGame() {
      if (this.startGame) {
        this.$socket.client.emit('setPlayOrder');
        // this.setPlayerOrder();
      }
      return;
    },
  },
};
</script>

<style lang="scss">
@import '~@rei/cdr-tokens/dist/scss/cdr-tokens.scss';
@import '~@rei/cedar/dist/cedar-compiled.css';
.heading-700 {
  @include cdr-text-heading-serif-700;
}
.heading-600 {
  @include cdr-text-heading-serif-600;
}
.heading-500 {
  @include cdr-text-heading-serif-500;
}

.game-wrapper {
  display: grid;
  grid-template-columns: 25% auto 25%;
  grid-template-rows: 25vh auto 25vh;
}
.card-area {
  padding-top: $cdr-space-one-x;
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
</style>
