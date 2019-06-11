<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        <h3 class="title">Evaluación a prácticas empresariales</h3>
        <v-spacer></v-spacer>
        <v-btn flat icon color="red darken-4" @click.stop="print">
          <v-icon>far fa-file-pdf</v-icon>
        </v-btn>
        <v-btn color="success" @click.stop="save" v-show="!isEstudiante">Guardar</v-btn>
      </v-card-title>
      <v-card-text>
        <v-card>
          <v-card-title class="blue-grey white--text subheading py-1">I . Informacion del estudiante</v-card-title>
          <v-card-text>
            <persona-component :persona="estudiante" disabled></persona-component>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-title class="blue-grey white--text subheading py-1">II . Criterios de evaluación</v-card-title>
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
                      :readonly="isEstudiante"
                      v-model="item.calificacion"
                      color="yellow accent-4"
                      dense
                      hover
                      size="18"
                    ></v-rating>
                    <span slot="badge">{{item.calificacion}}</span>
                  </v-badge>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
            <v-list subheader dense>
              <v-subheader>Desempeño laboral</v-subheader>
              <v-list-tile v-for="(item,i) in laboral" :key="i" avatar>
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
                      :readonly="isEstudiante"
                      v-model="item.calificacion"
                      color="yellow accent-4"
                      dense
                      hover
                      size="18"
                    ></v-rating>
                    <span slot="badge">{{item.calificacion}}</span>
                  </v-badge>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile avatar>
                <v-list-tile-avatar></v-list-tile-avatar>
                <v-list-tile-content>Nota promedio</v-list-tile-content>
                <v-list-tile-action>
                  <v-avatar color="grey lighten-3">
                    <b>{{promedio}}</b>
                  </v-avatar>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
            <v-textarea
              label="Comentarios"
              v-model="comentario"
              :readonly="isEstudiante"
              hide-details
            ></v-textarea>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import personaComponent from "@/components/Persona";
import jsPDF from "jspdf";
import moment from "moment";
export default {
  components: {
    personaComponent
  },
  props: {
    estudianteParam: Object
  },
  data() {
    return {
      isEstudiante: false,
      idestudiante: 0,
      idevaluacion: -1,
      estudiante: {},
      personal: [
        {
          texto:
            "Relaciones Interpersonales (Integración del practicante con su entorno laboral)",
          calificacion: 2.5
        },
        {
          texto:
            "Actitud Hacia el Trabajo (disposición del practicante con respecto a las tareas recomendadas)",
          calificacion: 2.5
        },
        {
          texto:
            "Disposición para Aprender (Disposición para aceptar las sugerencias)",
          calificacion: 2.5
        },
        {
          texto:
            "Responsabilidad (Cumplimiento de horarios y de las actividades encomendadas)",
          calificacion: 2.5
        },
        {
          texto:
            "Colaboración (Disposición del estudiante para realizar tareas adicionales)",
          calificacion: 2.5
        }
      ],
      laboral: [
        {
          texto:
            "Cumplimiento Plan de Trabajo (Cumplimiento oportuno de las labores y las metas asignadas)",
          calificacion: 2.5
        },
        {
          texto:
            "Calidad de Trabajo (Cumplimiento de horarios y de las actividades encomendadas)",
          calificacion: 2.5
        },
        {
          texto: "Organización (Utilización de los recursos)",
          calificacion: 2.5
        },
        {
          texto:
            "Habilidades para Solucionar Problemas (Capacidad de planear, desarrollar y controlar las tareas asignadas)",
          calificacion: 2.5
        },
        {
          texto: "Conocimiento (Bases académicas del practicante)",
          calificacion: 2.5
        },
        {
          texto:
            "Comunicación y Manejo de la Información (Habilidad para comunicarse)",
          calificacion: 2.5
        }
      ],
      comentario: "",
      tutor: {},
      nombrejefe:'',
      nombreempresa:'',
      fechainicio:''
    };
  },
  computed: {
    ...mapGetters(["user"]),
    promedio() {
      let notaPersonal = this.personal.reduce((acum, nota) => {
        return acum + nota.calificacion;
      }, 0);
      let notaLaboral = this.laboral.reduce((acum, nota) => {
        return acum + nota.calificacion;
      }, 0);
      const nota =
        (notaPersonal + notaLaboral) /
        (this.personal.length + this.laboral.length);

      return (Math.round(nota * 10) / 10).toFixed(1);
    }
  },
  mounted() {
    this.load();
  },
  methods: {
    cargarEvaluacion() {
      this.$axios.get(`/evaluacion/${this.idestudiante}`).then(resp => {
        if (resp.data.length) {
          let index = 0;
          for (const key in resp.data[0]) {
            if (key.startsWith("personal")) {
              index = Number(key.substr(8, 1));
              this.personal[index - 1].calificacion = resp.data[0][key];
            }
            if (key.startsWith("laboral")) {
              index = Number(key.substr(7, 1));
              this.laboral[index - 1].calificacion = resp.data[0][key];
            }
          }
          this.idevaluacion = resp.data[0].idevaluacion;
          this.fecha = resp.data[0].fecha;
          this.comentario = decodeURIComponent(
            escape(atob(resp.data[0].comentario))
          );
          this.nombrejefe = resp.data[0].nombrejefe
          this.nombreempresa = resp.data[0].nombreempresa
          this.fechainicio = moment(resp.data[0].fechainicio).format('YYYY-MM-DD')
        }
      });
      this.$axios
        .get(`/user/${this.estudiante.TUTOR}`)
        .then(resp => (this.tutor = resp.data[0]));
    },
    save() {
      let evaluacion = {
        idestudiante: this.idestudiante,
        idautor: this.user.ID_USUARIO,
        comentario: btoa(this.comentario)
      };
      this.personal.forEach((pr, i) => {
        evaluacion[`personal${i + 1}`] = pr.calificacion;
      });
      this.laboral.forEach((pr, i) => {
        evaluacion[`laboral${i + 1}`] = pr.calificacion;
      });
      if (this.idevaluacion > 0) {
        this.$axios
          .put(`/evaluacion/${this.idevaluacion}`, evaluacion)
          .then(resp => {
            if (resp) {
              this.$swal("Evolucion guardada", "", "success");
              this.cargarEvaluacion();
            }
          });
      } else {
        this.$axios.post("/evaluacion", evaluacion).then(resp => {
          if (resp) {
            this.$swal("Evolucion guardada", "", "success");
            this.cargarEvaluacion();
          }
        });
      }
    },
    load() {
      if (this.user.ID_ROL == 4) {
        this.idestudiante = this.user.ID_USUARIO;
        this.estudiante = this.user;
        this.isEstudiante = true;
        this.cargarEstudiante().then(this.cargarEvaluacion);
      } else if (this.estudianteParam.ID_USUARIO) {
        this.idestudiante = this.estudianteParam.ID_USUARIO;
        this.estudiante = this.estudianteParam;
        this.cargarEvaluacion();
      }
    },
    cargarEstudiante() {
      return this.$axios(
        `/students/${this.user.ID_UNIVERSIDAD}/estudiante/${
          this.user.ID_USUARIO
        }`
      ).then(res => {
        this.estudiante = res.data[0];
      });
    },
    print() {
      var img = document.createElement("img");
      img.src = require("@/assets/FormatoEvaluacion.png");

      var doc = new jsPDF();
      var width = doc.internal.pageSize.getWidth();
      var height = doc.internal.pageSize.getHeight();

      doc.addImage(img, "PNG", 0, 0, width, height);
      doc.setFontSize(9);
      doc.text(this.estudiante.NOMBRE, 56, 72);
      doc.text(this.nombreempresa, 56, 77);
      doc.text(this.fechainicio, 160, 77);
      doc.text(this.estudiante.CODIGO, 160, 72);
      doc.text(this.estudiante.CARRERA, 56, 82);
      doc.text(moment(this.fecha).format("YYYY-MM-DD HH:mm"), 160, 82);
      doc.text(this.tutor.NOMBRE, 125, 92);
      doc.text(this.nombrejefe, 56, 92);
      this.personal.forEach((nota, i) => {
        doc.text("X", 161 + (nota.calificacion - 1) * 6.5, 127 + i * 7);
      });
      this.laboral.forEach((nota, i) => {
        doc.text("X", 161 + (nota.calificacion - 1) * 6.5, 170 + i * 6);
      });
      doc.text(String(this.promedio), 161, 212);
      doc.setFontSize(8);
      doc.text("Nota: " + this.comentario, 25, 216, {
        maxWidth: 173,
        align: "justify"
      });

      window.open(doc.output("bloburl"));
    }
  },
  watch: {
    estudianteParam() {
      this.load();
    }
  }
};
</script>
