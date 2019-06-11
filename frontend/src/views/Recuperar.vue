<template>
  <v-container fluid fill-height pa-0>
    <v-layout row justify-center fill-height>
      <v-flex md8 primary hidden-md-and-down>
        <v-layout justify-center align-center fill-height>
          <v-flex shrink>
            <v-img :src="require('@/assets/logo-vertical.png')" width="250"/>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 md4 d-flex>
        <v-container>
          <v-form v-model="valid" @submit.prevent.stop="recuperar">
            <v-card>
              <v-card-title primary-title class="primary">
                <div class="white--text">
                  <p
                    class="text-xs-center headline"
                  >Recuperacion de contraseña de la plataforma de practicas empresariales</p>
                </div>
              </v-card-title>
              <v-card-text>
                <v-text-field
                  prepend-icon="fas fa-user-graduate"
                  v-model="user.username"
                  label="Usuario"
                  :rules="reglas"
                  required
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn flat small color="primary" @click.stop="$router.go(-1)">Volver</v-btn>
                <v-spacer></v-spacer>
                <v-btn type="submit" :disabled="!valid" color="primary">Recuperar</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      valid: true,
      user: {},
      reglas: [v => !!v || "Campo requerido"]
    };
  },
  methods: {
    recuperar() {
      this.$store.dispatch("recover", this.user);
      this.$swal(
        "Se enviara un correo a su dirección con instrucciones para restablecer la contraseña"
      );
      this.$router.go(-1);
    }
  }
};
</script>
