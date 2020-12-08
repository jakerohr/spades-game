<template>
  <div>
    <green-room v-if="!startGame" :teams="teams" :players="players" :player-id="playerId" />
    <div v-else class="game-wrapper cdr-align-text-center">
      <cdr-button @click="shuffleDeck">Shuffle Deck</cdr-button>
      <card-area
        v-if="teamMate"
        class="card-area"
        :cards="teamMate.hand"
        :player-name="teamMate.name"
      />
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
import { CdrButton, CdrImg } from '@rei/cedar';
import CardArea from './CardArea.vue';
import GreenRoom from './GreenRoom.vue';
export default {
  name: 'SpadesGame',
  components: {
    CdrButton,
    // CdrText,
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
    updateTeams(teams) {
      this.teams = teams;
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
    startGame() {
      const readyArr = this.players.filter((player) => player.ready);
      return readyArr.length === 4;
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
  // height: 100vh; //vh - viewport height
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  display: grid;
  grid-template-columns: 200px auto 50px 200px;
  grid-template-rows: 200px 100px 200px;
}
.game-board {
  height: auto;
  width: 55%;
}
.card-area {
  margin-top: $cdr-space-two-x;
  margin-bottom: $cdr-space-two-x;
}
</style>
