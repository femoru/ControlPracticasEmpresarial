<template>
  <v-container pa-0>
    <v-layout wrap>
      <v-flex xs12>
        <h2>{{ universidad.id?"Editar":"Crear"}} universidad</h2>
      </v-flex>
      <v-flex xs12>
        <h3>Informacion general de la universidad</h3>
      </v-flex>
    </v-layout>
    <v-form v-model="valid" ref="form">
      <v-container>
        <v-layout wrap>
          <v-flex xs12 md3>
            <v-text-field
              prepend-icon="fas fa-building "
              mask="###.###.###-#"
              label="NIT"
              v-model="universidad.NIT"
              required
              :rules="[rules.require]"
              counter="10"
              clearable
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md9>
            <v-text-field
              prepend-icon="fas fa-landmark"
              label="Razon social"
              name="name"
              v-model="universidad.RAZON_SOCIAL"
              required
              :rules="[rules.require]"
              counter
              clearable
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md12>
            <v-text-field
              prepend-icon="fas fa-gavel"
              label="Representante legal"
              v-model="universidad.REPRESENTANTE"
              required
              :rules="[rules.require]"
              counter
              clearable
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md6>
            <v-text-field
              prepend-icon="fas fa-at"
              label="Correo"
              v-model="universidad.CORREO"
              required
              :rules="[rules.require]"
              counter
              clearable
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md6>
            <v-text-field
              prepend-icon="fas fa-phone"
              label="Telefono"
              v-model="universidad.TELEFONOS"
              required
              :rules="[rules.require]"
              counter
              clearable
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              prepend-icon="fas fa-map-marked "
              label="Dirección"
              v-model="universidad.DIRECCION"
              required
              :rules="[rules.require]"
              counter
              clearable
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    rules: {
      require: v => !!v || "Campo requerido"
    },
    valid: false,
    dialog: false
  }),
  props: {
    /**
     * Valor de la universidad
     */
    universidad: {
      type: Object,
      default: () => ({
        id: "",
        razon_social: "Universidad",
        nit: "",
        representante: "",
        correo: "",
        telefono: "",
        direccion: ""
      })
    }
  }
};
</script>
