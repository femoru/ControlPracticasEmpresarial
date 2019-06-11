<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3 class="title mb-0">Estudiantes</h3>
          <div class="subtitle text-capitalize">{{universidad.RAZON_SOCIAL}}</div>
        </div>
        <v-spacer></v-spacer>
        <v-text-field
          append-icon="fas fa-search"
          label="Buscar"
          single-line
          hide-details
          v-model="search"
        ></v-text-field>
        <v-toolbar-items>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                fab
                small
                dark
                color="green"
                v-on="on"
                @click.stop="dialogImport=true"
                v-show="isCoordinador"
              >
                <v-icon>fas fa-upload</v-icon>
              </v-btn>
            </template>
            <span>Cargar estudiantes</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                fab
                small
                dark
                color="indigo"
                v-on="on"
                @click.stop="add"
                v-show="isCoordinador"
              >
                <v-icon>fas fa-plus</v-icon>
              </v-btn>
            </template>
            <span>Nuevo estudiante</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                fab
                small
                dark
                color="light-blue"
                v-on="on"
                @click.stop="actualizarEstudiantes"
              >
                <v-icon>fas fa-sync</v-icon>
              </v-btn>
            </template>
            <span>Actualizar</span>
          </v-tooltip>
        </v-toolbar-items>
      </v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="estudiantes" :search="search">
          <template v-slot:items="props">
            <td>{{ props.item.CODIGO }}</td>
            <td>{{ props.item.NOMBRE }}</td>
            <td>{{ props.item.CARRERA }}</td>
            <td>{{ props.item.PERIODO }}</td>
            <td class="justify-center layout px-0 red--text">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon small @click="editItem(props.item)" v-on="on">
                    <v-icon color="grey darken-2" small>fas fa-edit</v-icon>
                  </v-btn>
                </template>
                <span>Modificar</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon small @click="verEstudiante(props.item)" v-on="on">
                    <v-icon color="grey darken-2" small>fas fa-eye</v-icon>
                  </v-btn>
                </template>
                <span>Ficha</span>
              </v-tooltip>
            </td>
          </template>
          <template v-slot:no-data>
            <h2 class="caption text-xs-center">No hay datos disponibles</h2>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Dialogo crear estudiante -->
    <v-dialog v-model="dialog" width="80%" lazy>
      <v-card>
        <v-card-text>
          <usuario-component
            :usuario="editedItem"
            :idrol="4"
            :iduniversidad="universidad.ID_UNIVERSIDAD"
          />
          <small>Todos los campos son obligatorios</small>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error darken-1" v-if="editedItem.id" flat @click="inactive">Inactivar</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="secondary darken-1" flat @click="close">Cancelar</v-btn>
          <v-btn color="primary darken-1" @click="save">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialogo cargar estudiantes -->
    <v-dialog v-model="dialogImport" lazy>
      <v-card>
        <v-card-title>
          <span class="headline">Cargar estudiantes</span>
        </v-card-title>
        <v-card-text>
          <cargar-estudiantes-component ref="cargar" :universidad="universidad"/>
        </v-card-text>
        <v-card-actions>
          <a href="/static/plantilla.csv" class="v-btn v-btn--flat" download>Descargar plantilla</a>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon small color="blue-grey" v-on="on">
                <v-icon :size="2" color="white" small>fas fa-question</v-icon>
              </v-btn>
            </template>
            <span>La plantillla presentada contiene los datos minimos requeridos para la creación de los estudiantes, no altere ni quite los encabezados</span>
          </v-tooltip>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="dialogImport = false">Cerrar</v-btn>
          <v-btn color="primary" @click.native="cargarEstudiantes">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-layout row justify-center>
      <v-dialog v-model="fichaEstudiante" fullscreen lazy :overlay="false">
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon @click.native="fichaEstudiante = false" dark>
              <v-icon>fas fa-times</v-icon>
            </v-btn>
            <v-toolbar-title>{{editedItem.NOMBRE}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click.native="fichaEstudiante = false">Cerrar</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <div>
            <v-tabs dark slider-color="white" color="primary">
              <v-tab>Datos del estudiante</v-tab>
              <v-tab v-if="isCoordinador">Datos del tutor</v-tab>
              <v-tab>Información profesional</v-tab>
              <v-tab>Acta de inicio</v-tab>
              <v-tab>Ficha solución</v-tab>
              <v-tab>Cronograma</v-tab>
              <v-tab>Documentos</v-tab>
              <v-tab>Agendar visita</v-tab>
              <v-tab>Bitacora</v-tab>
              <v-tab>Evaluacion</v-tab>

              <v-tabs-items>
                <v-tab-item>
                  <v-card>
                    <usuario-component
                      :usuario="editedItem"
                      :iduniversidad="universidad.ID_UNIVERSIDAD"
                      :disabled="true"
                    />
                  </v-card>
                </v-tab-item>
                <v-tab-item v-if="isCoordinador">
                  <v-card>
                    <usuario-component
                      :usuario="tutor"
                      :iduniversidad="universidad.ID_UNIVERSIDAD"
                      :disabled="true"
                    />
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card>
                    <infoprofesional-component :estudianteParam="editedItem"></infoprofesional-component>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card>
                    <actainicio-component :estudianteParam="editedItem"></actainicio-component>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card>
                    <ficha-solucion-component :estudianteParam="editedItem"></ficha-solucion-component>
                  </v-card>
                </v-tab-item>

                <v-tab-item>
                  <v-card>
                    <cronograma-component :estudianteParam="editedItem"></cronograma-component>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card>
                    <documentos-component :estudianteParam="editedItem"></documentos-component>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card>
                    <agendar-visita-component :estudianteParam="editedItem"></agendar-visita-component>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card>
                    <bitacora-component :estudianteParam="editedItem"></bitacora-component>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card>
                    <evaluacion-component :estudianteParam="editedItem"></evaluacion-component>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-tabs>
          </div>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>
<script>
import UsuarioComponent from "@/components/Usuario";
import CargarEstudiantesComponent from "@/components/CargarEstudiantes";
import ActainicioComponent from "@/views/pages/estudiante/Actainicio.vue";
import InfoprofesionalComponent from "@/views/pages/estudiante/InformacionProfesional.vue";
import FichaSolucionComponent from "@/views/pages/estudiante/FichaSolucion.vue";
import CronogramaComponent from "@/views/pages/estudiante/Cronograma.vue";
import AgendarVisitaComponent from "@/views/pages/estudiante/AgendarVisita.vue";
import DocumentosComponent from "@/views/pages/estudiante/Documentos.vue";
import BitacoraComponent from "@/views/pages/estudiante/Bitacora.vue";
import EvaluacionComponent from "@/views/pages/estudiante/Evaluacion.vue";

import { mapGetters } from "vuex";

export default {
  data: () => ({
    fab: false,
    search: "",
    isEditing: false,
    dialog: false,
    dialogImport: false,
    fichaEstudiante: false,
    /**
     * Headers de la tabla
     */
    headers: [
      { text: "Codigo", value: "CODIGO", align: "left" },
      { text: "Nombre", value: "NOMBRE", align: "left" },
      { text: "Carrera", value: "CARRERA", align: "left" },
      { text: "Periodo", value: "PERIODO", align: "left", sortable: true },
      { text: "Modificar", value: "name", sortable: false, align: "center" }
    ],
    /**
     * Listado de universidades
     */
    estudiantes: [],
    universidad: {},
    editedIndex: -1,
    editedItem: {},
    tutor: {},
    isCoordinador: false,
    defaultItem: {
      ESTADO: 1,
      ID_ROL: 4,
      ID_UNIVERSIDAD: 0
    }
  }),

  computed: {
    ...mapGetters(["user"])
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  mounted() {
    this.initialize();
  },

  methods: {
    initialize() {
      const anno = new Date().toISOString().substr(0, 4);
      const periodo = Number(new Date().toISOString().substr(5, 2)) > 6 ? 2 : 1;
      this.defaultItem = {
        ESTADO: 1,
        ID_ROL: 4,
        ID_UNIVERSIDAD: this.user.ID_UNIVERSIDAD,
        PERIODO: `${anno}-${periodo}`
      };
      if (this.user.ID_ROL == 2) {
        this.isCoordinador = true;
      }

      this.$axios
        .get(`/universidad/${this.user.ID_UNIVERSIDAD}`)
        .then(r => (this.universidad = r.data))
        .then(this.actualizarEstudiantes);
    },
    actualizarEstudiantes() {
      let url = "";
      if (this.isCoordinador) {
        url = `/students/${this.user.ID_UNIVERSIDAD}`;
      } else {
        url = `/students/${this.user.ID_UNIVERSIDAD}/tutor/${
          this.user.ID_USUARIO
        }`;
      }
      this.$axios.get(url).then(r => (this.estudiantes = r.data));
    },
    editItem(item) {
      this.editedIndex = this.estudiantes.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    add() {
      this.editedIndex = -1;
      this.editedItem = Object.assign({}, this.defaultItem);
      this.dialog = true;
    },
    save() {
      for (let key in this.editedItem) {
        if (this.editedItem[key] == null) {
          delete this.editedItem[key];
        }
      }
      if (this.editedIndex > -1) {
        delete this.editedItem.ROL;
        delete this.editedItem.CARRERA;

        this.$axios
          .put(`/user/${this.editedItem.ID_USUARIO}`, this.editedItem)
          .then(this.afterSave);
      } else {
        this.$axios.post("/user", this.editedItem).then(this.afterSave);
      }
    },
    afterSave(resp) {
      if (resp) {
        this.actualizarEstudiantes();
        this.close();
        this.$swal({
          title: "Ok",
          text: "Los cambios se han guardado correctamente",
          icon: "success",
          timer: 1500
        });
      } else {
        this.$swal({
          title: "Ooops",
          text: "Ocurrio un error mientras estabamos guardando",
          icon: "error",
          timer: 1500
        });
      }
    },
    cargarEstudiantes() {
      this.$refs.cargar
        .sendFile()
        .then(() => {
          this.actualizarEstudiantes();
          this.$swal('Todo listo','','success')
          this.dialogImport = false;
        })
        .catch(err => {
          this.$swal("Error cargando el archivo", err.data.code, "error");
        });
    },
    async verEstudiante(estudiante) {
      if (this.isCoordinador) {
        await this.$axios.get(`/user/${estudiante.TUTOR}`).then(resp => {
          this.tutor = resp.data[0];
        });
      }
      this.editedItem = Object.assign({}, estudiante);
      this.fichaEstudiante = true;
    }
  },
  components: {
    UsuarioComponent,
    CargarEstudiantesComponent,
    ActainicioComponent,
    InfoprofesionalComponent,
    FichaSolucionComponent,
    CronogramaComponent,
    DocumentosComponent,
    AgendarVisitaComponent,
    BitacoraComponent,
    EvaluacionComponent
  }
};
</script>