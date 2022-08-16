<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-btn @click="$router.push('/calendar')" text>
        <span class="mr-2">Calendar</span>
      </v-btn>
      <v-btn @click="$router.push('/')" text>
        <span class="mr-2">Home</span>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  mounted() {},
  data: () => ({
    //
  }),
};
</script>
