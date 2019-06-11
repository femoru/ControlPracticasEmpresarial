<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        <h3 class="title">Usuarios</h3>
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
          <span>Agregar usuario</span>
        </v-tooltip>
      </v-card-title>

      <v-card-text>
        <v-data-table :headers="headers" :items="usuarios" :search="search">
          <template v-slot:items="props">
            <tr
              @dblclick="editItem(props.item)"
              :class="[props.item.ESTADO?'':'red--text text--darken-4']"
            >
              <td>{{ props.item.ID_USUARIO }}</td>
              <td>{{ props.item.NOMBRE }}</td>
              <td>{{ props.item.USUARIO }}</td>
              <td>{{ props.item.ROL }}</td>
              <td class="justify-center layout px-0">
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
          <template v-slot:no-data>
            <h2 class="caption text-xs-center">No hay datos disponibles</h2>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Dialogos -->

    <v-dialog v-model="dialog" width="80%" transition="dialog-bottom-transition">
      <v-card>
        <v-card-text>
          <usuario-component :usuario="editedItem"/>
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
import UsuarioComponent from "@/components/Usuario";
import shajs from "crypto";

export default {
  data: () => ({
    isEditing: false,
    dialog: false,
    search: "",
    /**
     * Headers de la tabla
     */
    headers: [
      { text: "ID", value: "ID_USUARIO", align: "left" },
      { text: "Nombre", value: "NOMBRE", align: "left" },
      { text: "Usuario", value: "USUARIO", align: "left" },
      { text: "Perfil", value: "ROL", align: "left" },
      { text: "Editar", value: "name", sortable: false, align: "center" }
    ],
    /**
     * Listado de universidades
     */
    universidades: [],
    usuarios: [],
    universidad: null,
    editedIndex: -1,
    editedItem: {},
    defaultItem: {},
    roles: []
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
      this.loadUsers();
    },
    loadUsers() {
      this.$axios.get("/user").then(resp => (this.usuarios = resp.data));
    },
    editItem(item) {
      this.editedIndex = this.usuarios.indexOf(item);
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
      for (let key in this.editedItem) {
        if (this.editedItem[key] == null) {
          delete this.editedItem[key];
        }
        if (key == "PASSWORD") {
          this.editedItem.PASSWORD = shajs
            .createHash("sha256")
            .update(this.editedItem.PASSWORD)
            .digest("hex");
        }
      }

      if (this.editedIndex > -1) {
        delete this.editedItem.ROL;

        this.$axios
          .put(`/user/${this.editedItem.ID_USUARIO}`, this.editedItem)
          .then(() => {
            this.loadUsers();
            this.close();
          });
      } else {
        this.$axios.post("/user", this.editedItem).then(resp => {
          if (resp.data) this.loadUsers();
          this.close();
        });
      }
    },
    cambiarEstado(item) {
      this.$axios
        .put(`/user/${item.ID_USUARIO}`, {
          ESTADO: item.ESTADO ? 0 : 1
        })
        .then(this.loadUsers);
    }
  },
  components: {
    UsuarioComponent
  }
};
</script>