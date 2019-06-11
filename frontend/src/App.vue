<template>
  <v-app>
    <loader-component v-model="$store.state.busy"/>
    <router-view/>
    <v-snackbar top right :color="$store.state.alert.type" v-model="$store.state.alert.model">
      {{$store.state.alert.message}}
      <v-btn dark flat @click.native="$store.state.alert.model = false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import loaderComponent from "@/components/LoaderComponent";
export default {
  name: "App",
  components: {
    loaderComponent
  },
  data() {
    return {
      //
    };
  }
};
</script>
