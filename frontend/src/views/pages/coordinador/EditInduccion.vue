<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        <v-toolbar card dense color="white">
          <v-toolbar-title>
            <h3 class="title mr-4">Inducción</h3>
          </v-toolbar-title>
        </v-toolbar>
        <v-autocomplete
          class="mb-4"
          prepend-icon="fas fa-briefcase"
          :items="carreras"
          item-text="CARRERA"
          item-value="ID_CARRERA"
          v-model="idCarrera"
          label="Carrera"
          clearable
          hide-details
          @change="cargarPasos"
        ></v-autocomplete>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn class="mb-4" color="success" dark v-on="on" icon @click.stop="save">
              <v-icon small>fas fa-save</v-icon>
            </v-btn>
          </template>
          <span>Guardar</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn class="mb-4" color="primary" dark v-on="on" icon @click.stop="addStep">
              <v-icon small>fas fa-plus</v-icon>
            </v-btn>
          </template>
          <span>Añadir descripcion</span>
        </v-tooltip>
      </v-card-title>
      <v-card-text>
        <v-alert
          v-if="pasos.length == 0"
          color="info"
          :value="true"
        >Selecciona una carrera y añade una descripcion para continuar</v-alert>

        <v-data-iterator v-else row wrap :items="pasos">
          <v-flex slot="item" slot-scope="props">
            <v-card>
              <v-card-title primary-title>
                <v-text-field
                  @click.stop
                  :disabled="!idCarrera"
                  label="Titulo"
                  v-model="props.item.titulo"
                  hide-details
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn color="error" dark v-on="on" icon @click.stop="eliminar(props.item)">
                      <v-icon small>fas fa-trash</v-icon>
                    </v-btn>
                  </template>
                  <span>Borrar</span>
                </v-tooltip>
              </v-card-title>
              <v-card-text>
                <ckeditor :editor="editor" v-model="props.item.descripcion" :config="editorConfig"></ckeditor>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-data-iterator>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Base64UploadAdapter from "@/mixins/uploadadapter.js"
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      e6: 0,
      pasos: [],
      panel: [],
      dialog: false,
      carreras: [],
      idCarrera: -1,
      editor: ClassicEditor,
      editorConfig: {
        language: "es",
        height: 500,
        mediaEmbed:{
          previewsInData:true
        },
        extraPlugins: [ MyCustomUploadAdapterPlugin ],

      }
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  mounted() {
    this.cargarCarreras();
  },
  methods: {
    cargarCarreras() {
      return this.$axios(`/carrera/${this.user.ID_UNIVERSIDAD}`).then(
        r => (this.carreras = r.data)
      );
    },
    cargarPasos() {
      return this.$axios(`/inducciones/${this.idCarrera}`).then(
        r =>
          (this.pasos = r.data.map(p => {
            p.descripcion = decodeURIComponent(escape(atob(p.descripcion)));
            return p;
          }))
      );
    },
    addStep() {
      this.pasos.push({
        titulo: "Titulo",
        descripcion: "Breve descripcion de la actividad",
        orden: this.pasos.length
      });
      this.panel.push(true);
    },
    save() {
      Promise.all(
        this.pasos.map(paso => {
          let item = Object.assign({ idcarrera: this.idCarrera }, paso);
          item.descripcion = btoa(item.descripcion);
          if (item.idinduccion) {
            return this.$axios.put(
              `/inducciones/${item.idcarrera}/${item.idinduccion}`,
              item
            );
          } else {
            return this.$axios.post(`/inducciones/`, item);
          }
        })
      ).then(info => {
        if (info.every(p => p)) {
          this.$swal({
            title: "Ok",
            text: "Los cambios se han guardado correctamente",
            icon: "success",
            timer: 1500
          });
          this.cargarPasos()
        } else {
          this.$swal({
            title: "Ooops",
            text: "Ocurrio un error mientras estabamos guardando",
            icon: "error",
            timer: 1500
          });
        }
      });
    },
    eliminar(item) {
      this.$axios
        .delete(`/inducciones/${item.idcarrera}/${item.idinduccion}`)
        .then(this.cargarPasos);
    }
  }
};

function MyCustomUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        // Configure the URL to the upload script in your back-end here!
        return new Base64UploadAdapter( loader );
    };
}
</script>


