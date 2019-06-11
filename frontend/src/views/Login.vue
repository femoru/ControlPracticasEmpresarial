<template>
  <v-container fluid fill-height pa-0>
    <v-layout row justify-center fill-height>
      <v-flex md8 primary hidden-sm-and-down>
        <v-layout justify-center align-center fill-height>
          <v-flex shrink>
            <v-img :src="require('@/assets/logo-vertical.png')" width="250"/>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm6 md4 d-flex>
        <v-container>
          <v-form v-model="valid" @submit.prevent.stop="login">
            <v-card>
              <v-card-title primary-title class="primary">
                <div class="white--text">
                  <p
                    class="text-xs-center headline"
                  >Ingreso a la plataforma de practicas empresariales</p>
                </div>
              </v-card-title>
              <v-card-text>
                <v-text-field
                  prepend-icon="fas fa-user-graduate"
                  v-model="user.usuario"
                  label="Usuario"
                  :rules="reglas"
                  required
                ></v-text-field>
                <v-text-field
                  prepend-icon="far fa-id-card"
                  v-model="user.password"
                  label="Contraseña"
                  type="password"
                  :rules="reglas"
                  required
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn flat small color="primary" to="/recuperacion">Recuperar contraseña</v-btn>
                <v-spacer></v-spacer>
                <v-btn type="submit" :disabled="!valid" color="primary">Ingreso</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
          <v-snackbar color="error" v-model="show" absolute top right>
            Usuario y/o contraseña invalidos
            <v-btn dark flat icon @click.native="show = false">
              <v-icon>fas fa-times</v-icon>
            </v-btn>
          </v-snackbar>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      valid: true,
      show: false,
      user: {
        usuario: "",
        password: ""
      },
      source: "",
      reglas: [v => !!v || "Campo requerido"]
    };
  },
  methods: {
    login() {
      this.dialog = true;
      this.$store.dispatch("login", { user: btoa(JSON.stringify(this.user)) })
        .then(this.loginSuccess)
        .catch(this.loginFail)
        .finally(() => (this.dialog = false));
    },
    loginFail() {
      this.show = true;
    },
    loginSuccess() {
      this.$router.push("/");
    }
  }
};
</script>
