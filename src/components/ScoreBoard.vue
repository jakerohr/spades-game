<template>
  <div>
    <cdr-table class="advanced-table" size="small">
      <caption class="cdr-align-text-center">
        Score
      </caption>
      <thead>
        <tr>
          <td></td>
          <th id="team-one" scope="col">Team 1</th>
          <th id="team-two" scope="col">Team 2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th id="bids" class="advanced-table__header" scope="row">Bids</th>
          <td headers="bids team-one">{{ teamOneBids }}</td>
          <td headers="bids team-two">{{ teamTwoBids }}</td>
        </tr>
        <tr>
          <th id="tricks" class="advanced-table__header" scope="row">Tricks</th>
          <td headers="tricks team-one">{{ teamOneTricks }}</td>
          <td headers="tricks team-two">{{ teamTwoTricks }}</td>
        </tr>
        <tr>
          <th id="total" class="advanced-table__header" scope="row">Total</th>
          <td headers="total team-one">{{ totalScore.teamOne }}</td>
          <td headers="total team-two">{{ totalScore.teamTwo }}</td>
        </tr>
      </tbody>
    </cdr-table>
    <button @click="sendScores">Send Scores</button>
  </div>
</template>

<script>
import { CdrTable } from '@rei/cedar';

export default {
  name: 'ScoreBoard',
  components: {
    CdrTable,
  },
  props: {
    players: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      totalScore: {
        teamOne: 0,
        teamTwo: 0,
      },
    };
  },
  sockets: {
    getScore() {
      this.sendScores();
    },
    displayScores(scores) {
      this.totalScore = scores;
    },
  },
  computed: {
    teamOne() {
      const team = this.players.filter((player) => player.team === 'Team One');
      return team;
    },
    teamTwo() {
      const team = this.players.filter((player) => player.team === 'Team Two');
      return team;
    },
    teamOneBids() {
      return this.teamOne.reduce((bid, player) => bid + player.bid, 0);
    },
    teamTwoBids() {
      return this.teamTwo.reduce((bid, player) => player.bid + bid, 0);
    },
    teamOneTricks() {
      return this.teamOne.reduce((tricks, player) => tricks + player.tricksTaken, 0);
    },
    teamTwoTricks() {
      return this.teamTwo.reduce((tricks, player) => tricks + player.tricksTaken, 0);
    },
    scoreData() {
      return [
        {
          team: 'teamOne',
          bids: this.teamOneBids,
          tricks: this.teamOneTricks,
        },
        {
          team: 'teamTwo',
          bids: this.teamTwoBids,
          tricks: this.teamTwoTricks,
        },
      ];
    },
  },
  methods: {
    sendScores() {
      this.$socket.client.emit('sendScores', this.scoreData);
    },
  },
};
</script>

<style lang="scss">
@import '~@rei/cdr-tokens/dist/scss/cdr-tokens.scss';
</style>
