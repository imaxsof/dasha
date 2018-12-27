
<template>
    <div>
        Name: <input v-model="name" type="text">
        <hello-component :name="name" :initialEnthusiasm="initialEnthusiasm"/>
    </div>
</template>

<script lang="ts">
  import HelloComponent from "./Hello.vue";
  import Vue from "vue";

  export default Vue.extend({
    data: function() {
      return {
        name: 'World',
        initialEnthusiasm: 5
      }
    },
    components: {
      HelloComponent,
    },
  });
</script>
