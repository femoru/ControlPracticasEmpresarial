<template>
  <v-form>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">Formato informacion y perfil del estudiante</h3>
          <div>Diligencia completamente la siguiente información</div>
        </div>
      </v-card-title>
      <v-card-text>
        <v-card>
          <v-card-title class="blue-grey white--text subheading py-1">I . Informacion del estudiante</v-card-title>
          <v-card-text>
            <persona-component :persona="estudiante" disabled></persona-component>
          </v-card-text>
        </v-card>
        <v-divider></v-divider>
        <v-card>
          <v-card-title
            class="blue-grey white--text subheading py-1"
          >II. Información de interés del practicante</v-card-title>
          <v-card-text>
            <v-text-field label="Programa" v-model="carrera" disabled></v-text-field>
            <v-textarea
              v-model="acta.perfil"
              label="Perfil practicante"
              hint="Habilidades y capacidades"
              hint-show
            ></v-textarea>
            <v-text-field v-model="acta.horario" label="Horario de practica sugerido"></v-text-field>
          </v-card-text>
        </v-card>
        <v-divider></v-divider>
        <v-card>
          <v-card-title class="blue-grey white--text subheading py-1">III. Modalidad</v-card-title>
          <v-card-text>
            <v-select
              v-model="acta.modalidad"
              :items="modalidades"
              label="Modalidad de practica"
              hint="Seleccione una modalidad"
            ></v-select>
          </v-card-text>
        </v-card>
        <v-divider></v-divider>
        <v-card>
          <v-card-title class="blue-grey white--text subheading py-1">IV. Escenario</v-card-title>
          <v-card-text>
            <v-select
              v-model="acta.escenario"
              :items="escenarios"
              label="Escenario de practica"
              hint="Seleccione un escenario"
            ></v-select>
          </v-card-text>
        </v-card>
        <v-divider></v-divider>
        <v-card>
          <v-card-title class="blue-grey white--text subheading py-1">V. Seguridad social</v-card-title>
          <v-card-text>
            <v-text-field v-model="acta.eps" label="Nombre de la EPS"></v-text-field>
            <v-checkbox v-model="acta.arl" :true-value="1" :false-value="0" label="ARL"></v-checkbox>
          </v-card-text>
        </v-card>
        <v-divider></v-divider>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click.stop="save">
          <v-icon left>fas fa-save</v-icon>Guardar
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-form>
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
      panels: [true, true, true, true, true],
      modalidades: ["Empresarial", "Docencia/tecnologias", "Investigacion"],
      escenarios: [
        "Empresarial",
        "Social/Fundacion",
        "Formulacion de mejora aplicada",
        "Monitorias/Ciclo Profesional",
        "UNICATOLICA",
        "Grupo de investigacion",
        "Creacion  de cursos",
        "Pasantia"
      ],
      carrera: "",
      estudiante: {},
      acta: {
        idestudiante: 0,
        perfil: "",
        horario: "",
        modalidad: "",
        escenario: "",
        eps: "",
        arl: 0
      }
    };
  },
  mounted() {
    if (this.user.ID_ROL == 4) {
      this.acta.idestudiante = this.user.ID_USUARIO;
      this.estudiante = this.user;
      this.cargarActa();
    } else if (this.estudianteParam.ID_USUARIO) {
      this.acta.idestudiante = this.estudianteParam.ID_USUARIO;
      this.estudiante = this.estudianteParam;
      this.cargarActa();
    } else if (this.$route.params.idestudiante) {
      this.acta.idestudiante = this.$route.params.idestudiante;
      this.cargarEstudiante().then(this.cargarActa);
    }
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    cargarEstudiante() {
      return this.$axios(`/user/${this.$route.params.idestudiante}`).then(
        res => {
          this.estudiante = res.data[0];
        }
      );
    },
    getCarrera() {
      return this.$axios(
        `/carrera/${this.estudiante.ID_UNIVERSIDAD}/${
          this.estudiante.ID_CARRERA
        }`
      ).then(r => {
        this.carrera = r.data.length ? r.data[0].CARRERA : {};
      });
    },
    cargarActa() {
      return this.getCarrera().then(() => {
        this.$axios(`/actainicio/${this.estudiante.ID_USUARIO}`).then(res => {
          if (res.data[0]) this.acta = res.data[0];
        });
      });
    },
    save() {
      if (this.acta.idactainicio) {
        const idacta = this.acta.idactainicio;
        delete this.acta.idactainicio;
        this.$axios.put(`/actainicio/${idacta}`, this.acta).then(() => {
          this.$swal("Se han guardado los cambios");
          this.cargarActa();
        });
      } else {
        this.$axios.post("/actainicio", this.acta).then(() => {
          this.$swal("Se han guardado los cambios");
          this.cargarActa();
        });
      }
    }
  },
  watch: {
    estudianteParam() {
      this.acta.idestudiante = this.estudianteParam.ID_USUARIO;
      this.estudiante = this.estudianteParam;
      this.cargarActa();
    }
  }
};
</script>
