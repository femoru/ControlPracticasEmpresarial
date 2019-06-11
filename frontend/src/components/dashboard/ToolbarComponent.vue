<template>
  <v-toolbar clipped-left color="primary" dark app absolute>
    <v-toolbar-title>Control de practicas</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>fas fa-th</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>fas fa-bell</v-icon>
    </v-btn>
    <v-menu :close-on-content-click="false" :nudge-width="200" offset-x>
      <template v-slot:activator="{ on }">
        <v-btn icon color="accent darken-3" dark v-on="on">
          <v-icon>fas fa-user</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-list>
          <v-list-tile avatar>
            <v-list-tile-avatar color="accent" class="white--text">{{iniciales}}</v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title class="text-capitalize">{{$store.state.user.NOMBRE.toLowerCase()}}</v-list-tile-title>
              <v-list-tile-sub-title class="text-capitalize">{{$store.state.user.ROL.toLowerCase()}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon>
                <v-icon>fas fa-cog</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile>
            <v-list-tile-action>
              <v-switch color="accent"></v-switch>
            </v-list-tile-action>
            <v-list-tile-title>Enable messages</v-list-tile-title>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-action>
              <v-switch color="accent"></v-switch>
            </v-list-tile-action>
            <v-list-tile-title>Enable hints</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="logout">
            <v-list-tile-action >
              <v-icon color="accent">fas fa-sign-out-alt</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Cerrar sesión</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-menu>
  </v-toolbar>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    iniciales() {
      const nombres = this.$store.getters.user.NOMBRE.split(" ");
      const nroNombres = nombres.length;
      if (nroNombres > 1) {
        return nombres[0][0] + nombres[nroNombres - 2 || 0][0];
      }
      return "LM";
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("logout").then(() => this.$router.go({ name: "login" }));
    }
  }
};
</script>
 