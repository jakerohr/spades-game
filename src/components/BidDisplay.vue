<template>
  <div>
    <p>Bid</p>
  </div>
</template>

<script>
export default {
  name: 'BidDisplay',
  props: {
    teamOneBids: {
      type: Number,
      default: 0,
    },
    teamTwoBids: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="scss" scoped></style>
