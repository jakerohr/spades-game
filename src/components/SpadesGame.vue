<template>
  <div>
    <div v-if="playerData" class="game-wrapper cdr-align-text-center">
      <cdr-button v-on:click="resetPlayers">Reset Players</cdr-button>
      <p>Number of players: {{ players.length }}</p>
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

    <cdr-modal
      label="Enter Name"
      :opened="modalOpened"
      @closed="modalOpened = false"
      aria-described-by="description"
    >
      <template slot="title">
        <cdr-text tag="h3" class="heading-600">Welcome!</cdr-text>
        <cdr-text tag="h4" class="heading-500">Please enter your name to join the game!</cdr-text>
      </template>
      <form v-on:submit.prevent="submitName">
        <cdr-input v-model="initPlayer.name" label="Name" placeholder="Who are you?" />
        <cdr-button type="submit">Enter</cdr-button>
      </form>
    </cdr-modal>
  </div>
</template>

<script>
import { io } from 'socket.io-client';
import { CdrButton, CdrModal, CdrText, CdrInput, CdrImg } from '@rei/cedar';
import CardArea from './CardArea.vue';
export default {
  name: 'SpadesGame',
  components: {
    CdrButton,
    CdrModal,
    CdrText,
    CdrInput,
    CdrImg,
    CardArea,
  },
  data() {
    return {
      socket: {},
      modalOpened: true,
      selectedBackground: 'dark-wood',
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
  created() {
    this.socket = io('http://localhost:3000');
  },
  mounted() {
    // this.context = this.$refs.game.getContext('2d');
    // this.socket.on('position', (data) => {
    //   this.position = data;
    //   this.context.clearRect(0, 0, this.$refs.game.width, this.$refs.game.height);
    //   this.context.fillRect(this.position.x, this.position.y, 20, 20);
    // });
    this.socket.on('new-player', (id) => {
      this.initPlayer.id = id;
    });
    this.socket.on('update-players', (players) => {
      this.players = players;
      const player = this.players.find((player) => player.id === this.playerData.id);
      console.log(player);
      this.playdData = player;
    });
    // this.socket.on('deal-complete', () => {
    //   this.playerData.hand = player.hand;
    // });
    this.socket.on('shuffle-state', (shuffling) => {
      this.shuffling = shuffling;
    });
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
      return this.players.find((player) => player.id === this.initPlayer.id);
    },
    // hand() {
    //   const player = this.players.find((player) => player.id === this.playerData.id);

    //   return player.hand;
    // },
  },
  methods: {
    move(direction) {
      this.socket.emit('move', direction);
    },
    submitName() {
      this.modalOpened = false;
      this.socket.emit('add-player', this.initPlayer);
    },
    resetPlayers() {
      this.socket.emit('wipe-players');
    },
    shuffleDeck() {
      this.socket.emit('shuffle-deck');
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
