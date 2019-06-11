<template>
  <div>
    <v-toolbar color="white">
      <v-toolbar-title>Universidad</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-autocomplete
        prepend-icon="fas fa-landmark"
        hint="Selecciona primero una universidad"
        v-model="universidad"
        :items="universidades"
        item-text="RAZON_SOCIAL"
        item-value="ID_UNIVERSIDAD"
        label="Universidad"
        @input="obtenerCarrera"
        hide-details
        clearable
      ></v-autocomplete>
    </v-toolbar>
    <v-card>
      <v-card-title primary-title >
        <h3 class="title">Carreras y asignaturas</h3>
        <v-spacer></v-spacer>
        <v-text-field
          append-icon="fas fa-search"
          label="Buscar"
          single-line
          hide-details
          v-model="search"
        ></v-text-field>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon color="primary" dark v-on="on" @click.stop="dialog = true">
              <v-icon small>fas fa-plus</v-icon>
            </v-btn>
          </template>
          <span>Agregar carrera</span>
        </v-tooltip>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-data-table :headers="headers" :items="carreras" :search="search">
          <template v-slot:items="props">
            <td>{{ props.item.CARRERA }}</td>
            <td>{{ props.item.DIRECTOR }}</td>
            <td>{{ props.item.ASIGNATURA }}</td>
            <td>{{ props.item.CREDITOS }}</td>
            <td>{{ props.item.HORAS }}</td>
            <td>{{ props.item.CUPOS }}</td>
            <td class="justify-center layout px-0">
              <v-icon color="blue" small class="mr-2" @click="editItem(props.item)">fas fa-edit</v-icon>
            </td>
          </template>
          <v-alert
            slot="no-results"
            :value="true"
            color="info"
            icon="fas fa-exclamation"
          >Tu busqueda para "{{ search }}" no encontro resultados.</v-alert>
          <template v-slot:no-data>
            <h2
              v-if="universidad"
              class="body-1 text-xs-center"
            >No hay datos para la universidad seleccionada</h2>
            <h2 v-else class="body-1 text-xs-center">Seleccione una universidad</h2>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Dialogos -->
    <v-dialog v-model="dialog" width="80%" lazy>
      <v-card>
        <v-card-text>
          <carrera-component :universidad="universidad" :carrera="editedItem"/>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error darken-1" v-if="editedItem.id" flat @click="inactive">Inactivar</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="secondary darken-1" flat @click="close">Cancelar</v-btn>
          <v-btn color="primary darken-1" @click="save">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import CarreraComponent from "@/components/CarrerayAsignatura";
export default {
  data: () => ({
    isEditing: false,
    dialog: false,
    search: "",
    /**
     * Headers de la tabla
     */
    headers: [
      { text: "Carrera", value: "CARRERA", align: "left" },
      { text: "Director", value: "DIRECTOR", align: "left" },
      { text: "Asignatura", value: "ASIGNATURA", align: "left" },
      { text: "Creditos", value: "CREDITOS", align: "left" },
      { text: "Horas", value: "HORAS", align: "left" },
      { text: "Cupos", value: "CUPOS", align: "left" },
      { text: "Editar", value: "name", sortable: false }
    ],
    /**
     * Listado de universidades
     */
    universidades: [],
    carreras: [],
    universidad: 0,
    editedIndex: -1,
    editedItem: {},
    defaultItem: {}
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.$axios
        .get("/universidad")
        .then(resp => (this.universidades = resp.data));
    },

    editItem(item) {
      this.editedIndex = this.carreras.indexOf(item);
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

    save() {
      this.editedItem["ID_UNIVERSIDAD"] = this.universidad;
      if (this.editedIndex > -1) {
        this.$axios
          .put(
            `/carrera/${this.universidad}/${this.editedItem.ID_CARRERA}`,
            this.editedItem
          )
          .then(this.obtenerCarrera)
          .finally(this.close);
      } else {
        this.$axios
          .post("/carrera", this.editedItem)
          .then(this.obtenerCarrera)
          .finally(this.close);
      }
    },
    obtenerCarrera() {
      if (this.universidad)
        this.$axios
          .get(`/carrera/${this.universidad}`)
          .then(resp => (this.carreras = resp.data));
      else this.carreras = [];
    },
    inactive() {}
  },
  components: {
    CarreraComponent
  }
};
</script>