<template>
  <v-form>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">Acta de inicio de práctica profesional</h3>
          <div>Diligencia completamente la siguiente información</div>
        </div>
      </v-card-title>
      <v-card-text>
        <v-card>
          <v-card-title class="blue-grey white--text subheading py-1">I . Modalidad y escenario</v-card-title>
          <v-card-text>
            <v-container fluid grid-list-md pa-0>
              <v-layout row wrap>
                <v-flex xs12 sm6>
                  <v-select
                    v-model="acta.modalidad"
                    :items="modalidades"
                    label="Modalidad de practica"
                    hide-details
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-select
                    v-model="acta.escenario"
                    :items="escenarios"
                    label="Escenario de practica"
                    hint="Seleccione un escenario"
                    hide-details
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-title
            class="blue-grey white--text subheading py-1"
          >II . Datos generales del estudiante</v-card-title>
          <v-card-text>
            <persona-component :persona="estudiante" disabled></persona-component>
          </v-card-text>
        </v-card>
        <v-divider></v-divider>
        <v-card>
          <v-card-title class="blue-grey white--text subheading py-1">III. Información de la empresa</v-card-title>
          <v-card-text>
            <v-text-field v-model="acta.nitempresa" prepend-icon="far fa-copyright" label="NIT"></v-text-field>
            <v-text-field
              v-model="acta.nombreempresa"
              prepend-icon="fas fa-signature"
              label="Nombre"
            ></v-text-field>
            <v-text-field
              v-model="acta.telefonoempresa"
              prepend-icon="fas fa-phone"
              label="Telefonos"
            ></v-text-field>
            <v-text-field
              v-model="acta.direccionempresa"
              prepend-icon="fas fa-building"
              label="Dirección"
            ></v-text-field>
            <v-text-field v-model="acta.correoempresa" prepend-icon="fas fa-at" label="Correo"></v-text-field>
            <v-text-field
              v-model="acta.sectoreconomico"
              prepend-icon="fas fa-industry"
              label="Sector economico"
            ></v-text-field>
            <v-text-field
              v-model="acta.representantelegal"
              prepend-icon="fas fa-user-tie"
              label="Representante legal"
            ></v-text-field>
            <v-text-field
              v-model="acta.documentorepresentante"
              prepend-icon="fas fa-id-card"
              label="No. documento"
            ></v-text-field>
          </v-card-text>
        </v-card>
        <v-divider></v-divider>
        <v-card>
          <v-card-title class="blue-grey white--text subheading py-1">IV. Información jefe directo</v-card-title>
          <v-card-text>
            <v-text-field v-model="acta.nombrejefe" prepend-icon="fas fa-signature" label="Nombre"></v-text-field>
            <v-text-field
              v-model="acta.documentojefe"
              prepend-icon="far fa-id-card"
              label="Identificacion"
            ></v-text-field>
            <v-text-field
              v-model="acta.telefonosjefe"
              prepend-icon="fas fa-phone"
              label="Telefonos"
            ></v-text-field>
            <v-text-field v-model="acta.cargojefe" prepend-icon="fas fa-user-tie" label="Cargo"></v-text-field>
            <v-text-field
              v-model="acta.profesionjefe"
              prepend-icon="fas fa-user-graduate"
              label="Profesion"
            ></v-text-field>
            <v-text-field v-model="acta.correojefe" prepend-icon="fas fa-at" label="Correo"></v-text-field>
          </v-card-text>
        </v-card>
        <v-divider></v-divider>
        <v-card>
          <v-card-title
            class="blue-grey white--text subheading py-1"
          >V. Funciones a desempeñar por el estudiante</v-card-title>
          <v-card-text>
            <v-textarea
              v-model="acta.funciones"
              label="Funciones"
              placeholder="Mis funciones son..."
            ></v-textarea>
          </v-card-text>
        </v-card>
        <v-divider></v-divider>
        <v-card>
          <v-card-title
            class="blue-grey white--text subheading py-1"
          >VI. Fecha de inicio y finalización de la practica</v-card-title>
          <v-card-text>
            <v-dialog
              ref="dialogInicio"
              v-model="modalInicio"
              :return-value.sync="acta.fechainicio"
              persistent
              lazy
              full-width
              width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  :value="acta.fechainicio | asFecha"
                  label="Fecha inicio"
                  prepend-icon="far fa-calendar-plus"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker locale="es" v-model="acta.fechainicio" scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="modalInicio = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="$refs.dialogInicio.save(acta.fechainicio)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
            <!-- Fecha finalizacion -->
            <v-dialog
              ref="dialogFinalizacion"
              v-model="modalFinalizacion"
              :return-value.sync="acta.fechafinal"
              persistent
              lazy
              full-width
              width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  :value="acta.fechafinal | asFecha"
                  label="Fecha finalización"
                  prepend-icon="far fa-calendar-check"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker locale="es" v-model="acta.fechafinal" scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="modalFinalizacion = false">Cancelar</v-btn>
                <v-btn
                  flat
                  color="primary"
                  @click="$refs.dialogFinalizacion.save(acta.fechafinal)"
                >OK</v-btn>
              </v-date-picker>
            </v-dialog>
            <v-text-field
              v-model="acta.horariopractica"
              prepend-icon="far fa-calendar-alt"
              label="Horario"
            ></v-text-field>
            <v-text-field
              prepend-icon="fas fa-hourglass-half"
              label="Total horas"
              v-model="acta.totalhoras"
            ></v-text-field>
          </v-card-text>
        </v-card>
        <v-divider></v-divider>
        <v-card>
          <v-card-title
            class="blue-grey white--text subheading py-1"
          >VII. Dias para el desarrollo de la practica</v-card-title>
          <v-card-text>
            <v-btn-toggle dark mandatory multiple v-model="acta.diaspracticas">
              <v-btn color="primary" v-for="dia in dias" :key="dia" :value="dia">{{dia}}</v-btn>
            </v-btn-toggle>
            {{acta.diaspracticas}}
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
import moment from "moment";
moment.locale("es");

import personaComponent from "@/components/Persona";
export default {
  filters: {
    asFecha(date) {
      return moment(date).format("YYYY-MM-DD");
    }
  },
  components: {
    personaComponent
  },
  props: {
    estudianteParam: Object
  },
  data() {
    return {
      modalInicio: false,
      modalFinalizacion: false,
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
        arl: 0,
        fechafinal: moment()
          .add(6, "months")
          .format("YYYY-MM-DD"),
        fechainicio: moment().format("YYYY-MM-DD"),
        dias: [0, 1, 2, 3, 4]
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
    }
  },
  computed: {
    ...mapGetters(["user"]),
    dias() {
      return moment.localeData().weekdays(true);
    }
  },
  methods: {
    moment: moment,
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
          if (res.data[0]) {
            this.acta = res.data[0];
            this.acta.fechainicio = moment(res.data[0].fechainicio).format(
              "YYYY-MM-DD"
            );
            this.acta.fechafinal = moment(res.data[0].fechafinal).format(
              "YYYY-MM-DD"
            );
            this.acta.diaspracticas = res.data[0].diaspracticas.split(",");

            this.acta.funciones = decodeURIComponent(
              escape(atob(res.data[0].funciones))
            );
          }
        });
      });
    },
    save() {
      if (this.acta.idactainicio) {
        const idacta = this.acta.idactainicio;
        delete this.acta.idactainicio;
        this.acta.funciones = btoa(this.acta.funciones);
        this.acta.diaspracticas = this.acta.diaspracticas.join(",");
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
    },
    "acta.fechainicio"(val) {
      if (val) {
        this.acta.totalhoras = moment
          .duration(moment(this.acta.fechafinal).diff(val, true))
          .asHours();
        this.acta.fechafinal = moment(val)
          .add(6, "months")
          .format("YYYY-MM-DD");
      }
    },
    "acta.fechafinal"(val) {
      if (val) {
        this.acta.totalhoras = moment
          .duration(moment(val).diff(this.acta.fechainicio, true))
          .asHours();
      }
    }
  }
};
</script>
