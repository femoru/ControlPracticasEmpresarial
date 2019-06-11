<template>
  <v-container fluid grid-list-md class="pt-0"> 
    <persona-component  :persona="{}"/>
    <v-layout row justify-space-between align-center wrap>
      <v-flex xs12 sm6 md9>
        <v-autocomplete
          prepend-icon="fas fa-briefcase"
          hint="Selecciona la carrera"
          :items="carreras"
          item-text="CARRERA"
          item-value="ID_CARRERA"
          label="Carrera"
          persistent-hint
          clearable
        ></v-autocomplete>
      </v-flex>
      <v-flex xs12 md2>
        <v-select prepend-icon="fas fa-list-ol" :items="semestres" label="Semestre"></v-select>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import personaComponent from "@/components/Persona";
export default {
  components:{
    personaComponent
  },
  props: {
    carreras: Array,
    default: () => []
  },
  data() {
    return {
      semestres: [
        "Primero",
        "Segundo",
        "Tercero",
        "Cuarto",
        "Quinto",
        "Sexto",
        "Séptimo",
        "Octavo",
        "Noveno",
        "Decimo"
      ]
    };
  }
};
</script>
