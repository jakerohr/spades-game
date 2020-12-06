<template>
  <div>
    <green-room v-if="playerId" :players="players" :player-id="playerId" />
    <div v-if="gameStarted" class="game-wrapper cdr-align-text-center">
      <cdr-button v-on:click="resetPlayers">Reset Players</cdr-button>
      <cdr-text>Number of players: {{ players.length }}</cdr-text>
      <h2 v-show="shuffling">SHUFFLING!</h2>
      <cdr-button @click="shuffleDeck">Shuffle Deck</cdr-button>
      <card-area
        v-if="teamMate"
        class="card-area"
        :cards="teamMate.hand"
        :player-name="teamMate.name"
      />
      <p v-else>...waiting for teammate.</p>
      <div class="game-board">
        <cdr-img
          :src="backgroundImage"
          radius="rounded"
          alt="wood table top"
          ratio="16-9"
          cover
          crop="top"
        />
      </div>
      <card-area class="card-area" :cards="playerData.hand" :player-name="playerData.name" />
    </div>
  </div>
</template>

<script>
import { CdrButton, CdrText, CdrImg } from '@rei/cedar';
import CardArea from './CardArea.vue';
import GreenRoom from './GreenRoom.vue';
export default {
  name: 'SpadesGame',
  components: {
    CdrButton,
    CdrText,
    CdrImg,
    CardArea,
    GreenRoom,
  },
  data() {
    return {
      selectedBackground: 'dark-wood',
      gameStarted: false,
      playerId: null,
      initPlayer: {
        name: null,
        id: null,
        hand: [],
      },
      players: [],
      deck: [],
      shuffling: false,
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
    shuffleState(shuffling) {
      this.shuffling = shuffling;
    },
  },
  computed: {
    backgroundImage() {
      const fileName = this.selectedBackground.toLowerCase();
      return require(`../assets/background/${fileName}.jpg`); // the module request
    },
    teamMate() {
      return this.players.length > 1
        ? this.players.filter((player) => player.id !== this.playerData.id)[0]
        : null;
    },
    playerData() {
      return this.players.find((player) => player.id === this.playerId);
    },
  },
  methods: {
    resetPlayers() {
      this.$socket.client.emit('resetPlayers');
    },
    shuffleDeck() {
      this.$socket.client.emit('shuffleDeck');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import '~@rei/cdr-tokens/dist/scss/cdr-tokens.scss';
.game-wrapper {
  height: 100vh; //vh - viewport height
  display: flex;
  flex-direction: column;
  align-items: center;
}
.game-board {
  height: auto;
  width: 55%;
}
.card-area {
  margin-top: $cdr-space-two-x;
  margin-bottom: $cdr-space-two-x;
}
.heading-600 {
  @include cdr-text-heading-serif-600;
}
.heading-500 {
  @include cdr-text-heading-serif-500;
}
</style>
