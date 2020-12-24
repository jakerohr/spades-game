<template>
  <div>
    <div class="cdr-container stack">
      <cdr-text v-show="playerName" tag="h1" class="heading-700 cdr-align-text-center"
        >Welcome {{ playerName }}!</cdr-text
      >
      <cdr-select
        v-model="selectedTeam"
        class="team-select"
        @change="onChange($event)"
        label="Team Selection"
        prompt="Select a team"
      >
        <option
          v-for="(team, index) in teams"
          :key="`team-${index}`"
          :value="team.name"
          :disabled="teamIsFull(team.name)"
        >
          {{ team.name }}
        </option>
      </cdr-select>
      <div class="team-list cdr-align-text-center">
        <div v-for="(team, index) in teams" :key="`team-${index}`">
          <cdr-text tag="h2" class="heading-500">{{ team.name }}</cdr-text>
          <hr />
          <cdr-list v-if="team.players">
            <li v-for="player in team.players" :key="player.id">{{ player.name }}</li>
          </cdr-list>
        </div>
      </div>
      <div class="cdr-align-text-center">
        <cdr-button v-if="readyGame" :modifier="buttonStyle" @click="handlePlayerIsReady">{{
          readyMessage
        }}</cdr-button>
      </div>
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
        <cdr-input v-model="playerName" label="Name" placeholder="Who are you?" />
        <cdr-button class="btn-submit-name" type="submit">Enter</cdr-button>
      </form>
    </cdr-modal>
  </div>
</template>

<script>
import { CdrButton, CdrSelect, CdrModal, CdrText, CdrInput, CdrList } from '@rei/cedar';
export default {
  name: 'GreenRoom',
  components: {
    CdrButton,
    CdrSelect,
    CdrModal,
    CdrList,
    CdrText,
    CdrInput,
  },
  props: {
    players: {
      type: Array,
      default: () => {},
    },
    teams: {
      type: Array,
      default: () => {},
    },
    playerId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      modalOpened: true,
      playerName: null,
      selectedTeam: '',
      readyGame: false,
      playerIsReady: false,
      gameFull: false,
    };
  },
  sockets: {
    fullGame(value) {
      this.gameFull = value;
    },
  },
  computed: {
    formLabel() {
      return this.players.length < 4 ? 'Wating for players...' : 'Select your teammate.';
    },
    readyMessage() {
      return this.playerIsReady ? "I'm not ready!" : "I'm ready!";
    },
    buttonStyle() {
      return this.playerIsReady ? 'sale' : 'primary';
    },
  },
  methods: {
    submitName() {
      this.modalOpened = false;
      this.$socket.client.emit('addPlayer', this.playerName);
    },
    onChange(team) {
      this.$socket.client.emit('selectTeam', team);
    },
    teamIsFull(team) {
      return this.getTeam(team).players.length >= 2;
    },
    getTeam(value) {
      const getTeam = this.teams.find((team) => team.name === value);
      return getTeam;
    },
    handlePlayerIsReady() {
      this.playerIsReady = !this.playerIsReady;
      this.$socket.client.emit('playerReady', this.playerIsReady);
    },
  },
  watch: {
    teams() {
      if (this.teams[1].players.length === 2 && this.teams[2].players.length === 2) {
        this.readyGame = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@rei/cdr-tokens/dist/scss/cdr-tokens.scss';
.stack > * + * {
  margin-top: $cdr-space-two-x;
}
.btn-submit-name {
  margin-top: $cdr-space-half-x;
}
.team-select {
  max-width: 50rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.team-list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 20px;
  justify-items: center;
}
</style>
