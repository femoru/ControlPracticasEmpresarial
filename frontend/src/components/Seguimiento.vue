<template>
  <div>
    <v-card>
      <v-card-media src="src" height="200px"></v-card-media>
      <v-card-title primary-title>
        <h3 class="headline mb-0">Seguimiento</h3>
      </v-card-title>
      <v-card-text>
        <v-list subheader dense>
          <v-subheader>Desempeño personal</v-subheader>
          <v-list-tile v-for="(item,i) in personal" :key="i" avatar>
            <v-list-tile-avatar>
              <v-avatar color="grey lighten-3">
                <b>{{i+1}}</b>
              </v-avatar>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title v-text="item.texto"></v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-badge right bottom>
                <v-rating
                  v-model="item.calificacion"
                  color="yellow accent-4"
                  half-increments
                  dense
                  hover
                  size="18"
                ></v-rating>
                <span slot="badge">{{item.calificacion}}</span>
              </v-badge>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-btn flat color="primary">Cerrar</v-btn>
        <v-btn flat color="primary">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import personaComponent from "@/components/Persona";
export default {
  components: {
    personaComponent
  },
  props: {
    estudianteParam: Object
  },
  data() {
    return {
      idestudiante: 0,
      estudiante: {},
      seguimiento: [
        {
          text: "Evidencia de la empresa referenciada como campo de practica",
          score: 0
        },
        {
          text:
            "Las funciones que ejecuta, corresponden a las mencionadas en el formato de inicio",
          score: 0
        },
        {
          text: "Cumplimiento del estudiante a  las actividades asignadas",
          score: 0
        },
        { text: "Creatividad  e Iniciativa", score: 0 },
        { text: "Sentido de responsabilidad", score: 0 },
        { text: "Capacidad de aprendizaje", score: 0 },
        { text: "Motivación", score: 0 },
        { text: "Receptividad a las  criticas", score: 0 },
        { text: "Capacidad de trabajo en equipo", score: 0 },
        { text: "Relaciones con el entorno de trabajo", score: 0 },
        { text: "Puntualidad", score: 0 }
      ]
    };
  },
  mounted() {
    if (this.user.ID_ROL == 4) {
      this.idestudiante = this.user.ID_USUARIO;
      this.estudiante = this.user;
      this.cargarSeguimiento();
    } else if (this.estudianteParam.ID_USUARIO) {
      this.idestudiante = this.estudianteParam.ID_USUARIO;
      this.estudiante = this.estudianteParam;
      this.cargarSeguimiento();
    }
  },
  computed: {
    ...mapGetters(["user"]),
    promedio() {
      let notaSeguimiento = this.seguimiento.reduce((acum, nota) => {
        return acum + nota.score;
      }, 0);

      const nota = notaSeguimiento / this.seguimiento.length;

      return Math.round(nota * 10) / 10;
    }
  }, methods:{
    cargarSeguimiento(){
      
    }
  }
};
</script>
