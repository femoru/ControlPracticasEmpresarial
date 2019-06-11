<template>
  <v-form>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">Ficha de solución del problema</h3>
          <div>Formato formulación de problema - mejora aplicada</div>
        </div>
      </v-card-title>
      <v-card-text>
        <v-card>
          <v-card-title class="blue-grey white--text subheading py-1">Datos del estudiante</v-card-title>
          <v-card-text>
            <persona-component :persona="estudiante" disabled></persona-component>
          </v-card-text>
        </v-card>
        <v-divider></v-divider>
        <v-card>
          <v-card-title class="blue-grey white--text subheading py-1">Datos del empleador</v-card-title>
          <v-card-text>
            <v-text-field v-model="ficha.empresa" label="Nombre de la empresa"></v-text-field>
            <v-text-field v-model="ficha.jefe" label="Jefe o cordinador"></v-text-field>
            <v-text-field v-model="ficha.telefono" label="Telefono de contacto"></v-text-field>
          </v-card-text>
        </v-card>
        <v-divider></v-divider>
        <v-card>
          <v-card-title
            class="blue-grey white--text subheading py-1"
          >Información del problema a mejorar</v-card-title>
          <v-card-text>
            <v-text-field v-model="ficha.proyecto" label="Titulo del proyecto"></v-text-field>
            <v-textarea v-model="ficha.planteamiento" label="Planteamiento del problema"></v-textarea>
            <v-textarea v-model="ficha.alcance" label="Alcance"></v-textarea>
          </v-card-text>
        </v-card>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="save">
          <v-icon left>fas fa-save</v-icon>Guardar
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
<script>
import personaComponent from "@/components/Persona";
import { mapGetters } from "vuex";
export default {
  components: {
    personaComponent
  },
  computed: {
    ...mapGetters(["user"])
  },
  props: {
    estudianteParam: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      ficha: {
        idestudiante: 0,
        empresa: "",
        jefe: "",
        telefono: "",
        proyecto: "",
        planteamiento: "",
        alcance: ""
      },
      estudiante: {}
    };
  },
  mounted() {
    if (this.user.ID_ROL == 4) {
      this.ficha.idestudiante = this.user.ID_USUARIO;
      this.estudiante = this.user;
      this.cargarFicha();
    } else if (this.estudianteParam.ID_USUARIO) {
      this.ficha.idestudiante = this.estudianteParam.ID_USUARIO;
      this.estudiante = this.estudianteParam;
      this.cargarFicha();
    } else if (this.$route.params.idestudiante) {
      this.ficha.idestudiante = this.$route.params.idestudiante;
      this.cargarEstudiante(this.$route.params.idestudiante).then(
        this.cargarFicha
      );
    }
  },
  methods: {
    cargarEstudiante(idestudiante) {
      return this.$axios(`/user/${idestudiante}`).then(res => {
        this.estudiante = res.data[0];
      });
    },
    cargarFicha() {
      this.$axios(`/fichaproblema/${this.estudiante.ID_USUARIO}`).then(res => {
        this.ficha = res.data[0] || this.ficha;
      });
    },
    save() {
      if (this.ficha.idfichaproblema) {
        const idficha = this.ficha.idfichaproblema;
        delete this.ficha.idfichaproblema;
        this.$axios
          .put(`/fichaproblema/${idficha}`, this.ficha)
          .then(()=>{
          this.$swal("Se han guardado los cambios")
          this.cargarFicha()
        });
      } else {
        this.$axios.post("/fichaproblema", this.ficha).then(()=>{
          this.$swal("Se han guardado los cambios")
          this.cargarFicha()
        });
      }
    }
  },
  watch: {
    estudianteParam() {
      this.ficha.idestudiante = this.estudianteParam.ID_USUARIO;
      this.estudiante = this.estudianteParam;
      this.cargarFicha();
    }
  }
};
</script>

