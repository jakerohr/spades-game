<template>
  <div>
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
import { CdrButton, CdrModal, CdrText, CdrInput } from '@rei/cedar';
export default {
  name: 'GreenRoom',
  components: {
    CdrButton,
    CdrModal,
    CdrText,
    CdrInput,
  },
};
</script>

<style lang="scss" scoped></style>
