<template>
  <div>
    <canvas ref="game" width="640" height="480" style="border: 1px solid black"> </canvas>
    <p>
      <cdr-button v-on:click="move('right')">Right</cdr-button>
      <cdr-button v-on:click="move('left')">Left</cdr-button>
      <cdr-button v-on:click="move('up')">Up</cdr-button>
      <cdr-button v-on:click="move('down')">Down</cdr-button>
    </p>
  </div>
</template>

<script>
import { io } from 'socket.io-client';
import { CdrButton } from '@rei/cedar';
export default {
  name: 'SpadesGame',
  components: {
    CdrButton,
  },
  data() {
    return {
      socket: {},
      context: {},
      position: {
        x: 0,
        y: 0,
      },
    };
  },
  created() {
    this.socket = io('http://localhost:3000');
  },
  mounted() {
    this.context = this.$refs.game.getContext('2d');
    this.socket.on('position', (data) => {
      this.position = data;
      this.context.clearRect(0, 0, this.$refs.game.width, this.$refs.game.height);
      this.context.fillRect(this.position.x, this.position.y, 20, 20);
    });
  },
  methods: {
    move(direction) {
      this.socket.emit('move', direction);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '~@rei/cedar/dist/style/cdr-button.css';
</style>
