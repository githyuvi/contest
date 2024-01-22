<template>
    <header>
        {{ receivedData }}
    </header>
<DemoContest :contest-name="receivedData">
</DemoContest>
</template>

<script>
import DemoContest from '../../components/old/DemoContest.vue';
export default {
components: { DemoContest },
  computed: {
    receivedData() {
      return this.$route.params.data;
    }
  }
};
</script>