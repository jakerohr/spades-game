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
      <cdr-text>You have selected: {{ getTeammateName }}</cdr-text>
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
import io from 'socket.io-client';
import {
  CdrButton,
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
    playerId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      modalOpened: true,
      playerName: null,
      teams: {},
      selectedTeammate: null,
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
  },
};
</script>

<style lang="scss" scoped>
@import '~@rei/cdr-tokens/dist/scss/cdr-tokens.scss';

.heading-600 {
  @include cdr-text-heading-serif-600;
}
</style>
