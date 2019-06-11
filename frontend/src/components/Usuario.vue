<template>
  <v-container pa-0>
    <v-layout align-center row wrap>
      <v-flex grow>
        <h3 class="title" v-show="!disabled">{{ usuario.id?"Editar":"Crear"}} usuario</h3>
        <span class="subtitle">Informacion del usuario</span>
      </v-flex>
      <v-flex shrink>
        <v-switch
          label="Estado"
          v-model="usuario.ESTADO"
          :true-value="1"
          :false-value="0"
          :disabled="disabled"
        ></v-switch>
      </v-flex>
    </v-layout>
    <v-form v-model="valid" ref="form">
      <v-container>
        <v-layout row justify-space-between align-center wrap>
          <v-flex xs12 md3>
            <v-text-field
              v-model="usuario.CODIGO"
              label="Codigo interno"
              prepend-icon="fas fa-barcode"
              required
              :disabled="disabled"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md9>
            <v-text-field
              v-model="usuario.NOMBRE"
              label="Nombre completo"
              prepend-icon="fas fa-signature"
              :disabled="disabled"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md3>
            <v-text-field
              v-model="usuario.TIPODOCUMENTO"
              label="Tipo de documento"
              prepend-icon="fas fa-id-card"
              required
              :disabled="disabled"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md3>
            <v-text-field
              v-model="usuario.NRODOCUMENTO"
              label="Nro. de documento"
              prepend-icon="fas fa-hashtag"
              :disabled="disabled"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md2>
            <v-text-field
              v-model="usuario.TELEFONO"
              prepend-icon="fas fa-phone"
              label="Telefono"
              required
              :disabled="disabled"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md4>
            <v-text-field
              v-model="usuario.CORREO"
              prepend-icon="fas fa-at"
              label="Correo"
              required
              :disabled="disabled"
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              label="Usuario"
              prepend-icon="fas fa-at"
              v-model="usuario.USUARIO"
              required
              :rules="[rules.require]"
              clearable
              :disabled="disabled"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md6>
            <v-text-field
              type="password"
              label="Contraseña"
              prepend-icon="fas fa-lock"
              v-model="usuario.PASSWORD"
              required
              :rules="[rules.require, rules.min8]"
              counter
              clearable
              :disabled="disabled"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md6>
            <v-text-field
              prepend-icon="fas fa-lock"
              type="password"
              label="Confirmar contraseña"
              required
              :rules="[rules.require, rules.min8,(v)=>v == usuario.PASSWORD || 'Las contraseñas deben coincidir']"
              counter
              clearable
              :disabled="disabled"
            ></v-text-field>
          </v-flex>
          <v-flex shrink>
            <v-select
              prepend-icon="fas fa-sitemap"
              :items="roles"
              v-model="usuario.ID_ROL"
              label="Rol"
              item-text="ROL"
              item-value="ID_ROL"
              :disabled="disabled || !!idrol"
              :rules="[rules.require]"
            ></v-select>
          </v-flex>
          <v-flex grow v-if="usuario.ID_ROL != 1">
            <v-autocomplete
              prepend-icon="fas fa-landmark"
              hint="Selecciona primero una universidad"
              v-model="usuario.ID_UNIVERSIDAD"
              :items="universidades"
              item-text="RAZON_SOCIAL"
              item-value="ID_UNIVERSIDAD"
              label="Universidad"
              :rules="[rules.require]"
              persistent-hint
              clearable
              :disabled="disabled || !!iduniversidad"
              @input="obtenerCarrera"
            ></v-autocomplete>
          </v-flex>
          <v-flex xs12 sm6 md7 v-if="usuario.ID_ROL == 4">
            <v-autocomplete
              prepend-icon="fas fa-briefcase"
              hint="Selecciona la carrera"
              :items="carreras"
              item-text="CARRERA"
              item-value="ID_CARRERA"
              v-model="usuario.ID_CARRERA"
              label="Carrera"
              persistent-hint
              clearable
              :disabled="disabled"
            ></v-autocomplete>
          </v-flex>
          <v-flex xs12 md2 v-if="usuario.ID_ROL == 4">
            <v-text-field
              label="Periodo"
              v-model="usuario.PERIODO"
              prepend-icon="fas fa-calendar-week"
              required
              :rules="[rules.require,rules.periodo]"
              return-masked-value
              counter
              clearable
              mask="####-#"
              :disabled="disabled"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md2 v-if="usuario.ID_ROL == 4">
            <v-select
              v-model="usuario.SEMESTRE"
              prepend-icon="fas fa-list-ol"
              :items="semestres"
              label="Semestre"
              :disabled="disabled"
            ></v-select>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      valid: false,
      universidades: [],
      carreras: [],
      roles: JSON.parse(sessionStorage.getItem("roles")),
      rules: {
        require: v => !!v || "Campo requerido",
        min8: v =>
          (v || "").length >= 8 ||
          "La contraseña debe tener al menos 8 caracteres",
        periodo: v =>
          /^(20\d{2}|19\d{2})-([1-2])$/.test(v) || "Periodo Invalido"
      },
      semestres: [
        { value: 1, text: "Primero" },
        { value: 2, text: "Segundo" },
        { value: 3, text: "Tercero" },
        { value: 4, text: "Cuarto" },
        { value: 5, text: "Quinto" },
        { value: 6, text: "Sexto" },
        { value: 7, text: "Séptimo" },
        { value: 8, text: "Octavo" },
        { value: 9, text: "Noveno" },
        { value: 10, text: "Decimo" }
      ]
    };
  },
  props: {
    usuario: Object,
    idrol: Number,
    iduniversidad: Number,
    disabled: Boolean
  },
  methods: {
    initialize() {
      this.$axios
        .get("/universidad")
        .then(resp => (this.universidades = resp.data));
      this.roles = JSON.parse(sessionStorage.getItem("roles"));
    },
    obtenerCarrera() {
      return this.$axios(`/carrera/${this.usuario.ID_UNIVERSIDAD}`).then(
        r => (this.carreras = r.data)
      );
    }
  },
  created() {
    this.initialize();
  },
  mounted() {
    this.usuario.ID_ROL = this.idrol | this.usuario.ID_ROL;
    this.usuario.ID_UNIVERSIDAD = this.iduniversidad;
    this.obtenerCarrera();
  },
  watch: {
    "usuario.ID_UNIVERSIDAD": function(val) {
      this.$axios(`/carrera/${val}`).then(r => (this.carreras = r.data));
    }
  }
};
</script>
