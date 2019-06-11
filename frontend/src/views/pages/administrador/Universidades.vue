<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        <h3 class="title">Universidades</h3>
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
            <v-btn icon color="accent" dark v-on="on" @click.stop="dialog = true">
              <v-icon small>fas fa-plus</v-icon>
            </v-btn>
          </template>
          <span>Agregar universidad</span>
        </v-tooltip>
      </v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="universidades" :search="search">
          <template slot="items" slot-scope="props">
            <tr
              @dblclick="editItem(props.item)"
              :class="[props.item.ESTADO?'':'red--text text--darken-4']"
            >
              <!-- <td>{{ props.item.ID_UNIVERSIDAD }}</td> -->
              <td class="text-xs-left">{{ props.item.NIT }}</td>
              <td class="text-xs-left">{{ props.item.RAZON_SOCIAL }}</td>
              <td class="text-xs-left">{{ props.item.CORREO }}</td>
              <td class="text-xs-left">{{ props.item.TELEFONOS }}</td>
              <td class="layout justify-center">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn flat icon color="primary" @click="editItem(props.item)" v-on="on">
                      <v-icon small>fas fa-edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Modificar</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      flat
                      icon
                      :color="props.item.ESTADO?'error':'success'"
                      @click="cambiarEstado(props.item)"
                      v-on="on"
                    >
                      <v-icon small>fas fa-{{props.item.ESTADO?'ban':'check'}}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{props.item.ESTADO?'Inactivar':'Activar'}}</span>
                </v-tooltip>
              </td>
            </tr>
          </template>
          <v-alert
            slot="no-results"
            :value="true"
            color="error"
            icon="warning"
          >Tu busqueda para "{{ search }}" no encontro resultados.</v-alert>
        </v-data-table>
      </v-card-text>
    </v-card>
    <!-- Dialogos -->
    <v-dialog v-model="dialog" width="80%">
      <v-card>
        <v-card-text>
          <Universidad :universidad="editedItem"/>
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
import Universidad from "@/components/Universidad";
export default {
  data: () => ({
    dialog: false,
    search: "",
    headers: [
      // { text: "ID", value: "ID_UNIVERSIDAD" },
      { text: "NIT", value: "NIT" },
      { text: "Razon social", value: "RAZON_SOCIAL" },
      { text: "Correo", value: "CORREO" },
      { text: "Telefono", value: "TELEFONOS" },
      { text: "Editar", value: "name", sortable: false, align: "center" }
    ],
    /**
     * Listado de universidades
     */
    universidades: [],
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
      this.editedIndex = this.universidades.indexOf(item);
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
      if (this.editedIndex > -1) {
        const idUniversidad = this.editedItem.ID_UNIVERSIDAD;
        delete this.editedItem.FECHA_CREACION;
        delete this.editedItem.ID_UNIVERSIDAD;
        this.$axios
          .put(`/universidad/${idUniversidad}`, this.editedItem)
          .then(this.initialize)
          .finally(this.close);
      } else {
        this.$axios
          .post("/universidad", this.editedItem)
          .then(this.initialize)
          .finally(this.close);
      }
    },
    cambiarEstado(item) {
      const idUniversidad = item.ID_UNIVERSIDAD;
      this.$axios
        .put(`/universidad/${idUniversidad}`, {
          ESTADO: item.ESTADO ? 0 : 1
        })
        .then(this.initialize);
    }
  },
  components: {
    Universidad
  }
};
</script>