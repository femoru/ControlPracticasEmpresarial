<template>
  <v-container grid-list-md pa-0>
    <v-layout row wrap>
      <v-flex xs12>
        <h2>Crear Carrera y asignatura</h2>
      </v-flex>
      <v-form v-model="valid" ref="form">
        <v-flex xs12>
          <h3>Informacion general de la carrera</h3>
        </v-flex>
        <v-flex xs12>
          <v-container>
            <v-layout wrap>
              <v-flex xs12 md12>
                <v-text-field
                  prepend-icon="fas fa-briefcase"
                  label="Nombre del programa"
                  name="name"
                  v-model="carrera.CARRERA"
                  required
                  :rules="[rules.require]"
                  counter
                  clearable
                  @input="carrera.ASIGNATURA = 'Practicas en '+carrera.CARRERA"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md3>
                <v-text-field
                  prepend-icon="fas fa-barcode"
                  label="Codigo del programa"
                  name="name"
                  v-model="carrera.CODIGO"
                  required
                  :rules="[rules.require]"
                  counter
                  clearable
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md9>
                <v-text-field
                  prepend-icon="fas fa-user-tie"
                  label="Director del programa"
                  name="name"
                  v-model="carrera.DIRECTOR"
                  required
                  :rules="[rules.require]"
                  counter
                  clearable
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
        <v-flex xs12>
          <h3>Informacion general de la asignatura</h3>
        </v-flex>
        <v-flex xs12>
          <v-container>
            <v-layout justify-space-between wrap>
              <v-flex xs12 md6>
                <v-text-field
                  prepend-icon="fas fa-book-open"
                  label="Nombre de la asignatura"
                  name="name"
                  v-model="carrera.ASIGNATURA"
                  required
                  :rules="[rules.require]"
                  counter
                  clearable
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-autocomplete
                  prepend-icon="fas fa-chalkboard-teacher"
                  hint="Selecciona el tutor"
                  :items="tutores"
                  item-text="NOMBRE"
                  item-value="ID_USUARIO"
                  label="Tutor"
                  v-model="carrera.TUTOR"
                  :rules="[rules.require]"
                  required
                  persistent-hint
                  clearable
                ></v-autocomplete>
              </v-flex>
              <v-flex xs12 md3>
                <v-text-field
                  prepend-icon="fas fa-calendar-alt"
                  label="Creditos"
                  name="name"
                  type="number"
                  v-model="carrera.CREDITOS"
                  required
                  :rules="[rules.require]"
                  counter
                  clearable
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md3>
                <v-text-field
                  prepend-icon="fas fa-clock"
                  label="Horas semanales"
                  name="name"
                  type="number"
                  v-model="carrera.HORAS"
                  required
                  :rules="[rules.require]"
                  counter
                  clearable
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md3>
                <v-text-field
                  prepend-icon="fas fa-users"
                  label="Cupos"
                  name="name"
                  type="number"
                  v-model="carrera.CUPOS"
                  required
                  :rules="[rules.require]"
                  counter
                  clearable
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-form>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    rules: {
      require: v => !!v || "Campo requerido"
    },
    valid: false,
    tutores: []
  }),
  props: {
    universidad: {
      type: Number,
      default: () => 0,
      required: true
    },
    carrera: {
      type: Object,
      default: () => ({
        id: "",
        carrera: "",
        codigo: "",
        director: ""
      })
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.$axios
        .get(`/user/tutors/${this.universidad}`)
        .then(d => (this.tutores = d.data || []));
    }
  }
};
</script>
