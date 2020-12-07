<template>
  <div>
    <div class="cdr-container">
      <cdr-text tag="h2" class="heading-600">Players</cdr-text>
      <cdr-form-group :label="formLabel">
        <cdr-list v-if="players" role="radiogroup">
          <li v-for="player in players" :key="player.id">
            <cdr-radio
              name="teammate"
              size="large"
              @change="inputName"
              :custom-value="player.id"
              v-model="selectedTeammate"
              :disabled="player.id === playerId"
              >{{ player.name }}</cdr-radio
            >
          </li>
        </cdr-list>
      </cdr-form-group>
      <cdr-select
        v-model="selectedTeam"
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
      <br />
      <div class="team-list">
        <div v-for="(team, index) in teams" :key="`team-${index}`">
          <cdr-text tag="h2" class="heading-600">{{ team.name }}</cdr-text>
          <cdr-list v-if="team.players">
            <li v-for="player in team.players" :key="player.id">{{ player.name }}</li>
          </cdr-list>
        </div>
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
        <cdr-button type="submit">Enter</cdr-button>
      </form>
    </cdr-modal>
  </div>
</template>

<script>
import {
  CdrButton,
  CdrSelect,
  CdrRadio,
  CdrFormGroup,
  CdrModal,
  CdrText,
  CdrInput,
  CdrList,
} from '@rei/cedar';
export default {
  name: 'GreenRoom',
  components: {
    CdrButton,
    CdrSelect,
    CdrRadio,
    CdrFormGroup,
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
      selectedTeammate: null,
      selectedTeam: '',
    };
  },

  computed: {
    formLabel() {
      return this.players.length < 4 ? 'Wating for players...' : 'Select your teammate.';
    },
    getTeammateName() {
      const teammate = this.players.find((player) => {
        return player.id === this.selectedTeammate;
      });
      return teammate ? teammate.name : null;
    },
  },
  methods: {
    submitName() {
      this.modalOpened = false;
      this.$socket.client.emit('addPlayer', this.playerName);
    },
    inputName(value) {
      this.selectedTeammate = value;
      this.$socket.client.emit('submitTeammate', value, this.playerId);
    },
    onChange(team) {
      this.$socket.client.emit('selectTeam', team);
      // this.checkTeamForPlayer(this.playerId);
      // this.getTeam(event).players.push(this.playerId);
      // this.selectedTeam = event;
    },
    teamIsFull(team) {
      return this.getTeam(team).players.length >= 2;
    },
    getTeam(value) {
      const getTeam = this.teams.find((team) => team.name === value);
      return getTeam;
    },
    checkTeamForPlayer(id) {
      this.teams.forEach((team) => {
        const clearPlayer = team.players.filter((player) => player !== id);
        console.log(clearPlayer);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@rei/cdr-tokens/dist/scss/cdr-tokens.scss';

.heading-600 {
  @include cdr-text-heading-serif-600;
}
.team-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
}
</style>
