<template>
  <v-form v-model="valid" @submit.prevent.stop="save">
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">Formato informacion y perfil del estudiante</h3>
          <div>Diligencia completamente la siguiente información</div>
        </div>
      </v-card-title>
      <v-card-text>
        <div v-for="documento in archivos" :key="documento.doc">
          <v-layout row justify-center>
            <v-flex xs3>
              <v-subheader>{{documento.label}}</v-subheader>
            </v-flex>
            <v-flex auto v-show="isEstudiante">
              <v-text-field
                label="Seleccionar archivo"
                v-model="documento.filename"
                @click.stop="pickFile(documento.doc)"
                prepend-icon="fas fa-paperclip"
                clearable
                readonly
                persistent-hint
                :hint="!documento.blobUrl?'Falta adjuntar documento':'Documento correcto'"
              ></v-text-field>
              <input
                type="file"
                style="display: none"
                :ref="documento.doc"
                accept="application/pdf"
                @change="onFilePicked($event, documento.doc)"
              >
            </v-flex>

            <v-flex shrink v-if="documento.blobUrl" v-show="isEstudiante">
              <v-layout row justify-center>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      flat
                      color="blue-grey"
                      icon
                      v-on="on"
                      @click.stop="documento.dialog = true"
                    >
                      <v-icon small>fas fa-eye</v-icon>
                    </v-btn>
                  </template>
                  <span>Ver {{documento.label}}</span>
                </v-tooltip>
                <v-dialog v-model="documento.dialog" scrollable max-width="50vw">
                  <v-card>
                    <v-card-text style="height: 100vh; overflow-y:hidden;">
                      <embed
                        :src="documento.blobUrl"
                        width="100%"
                        height="100%"
                        type="application/pdf"
                      >
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="blue darken-1"
                        flat
                        @click.native="documento.dialog = false"
                      >Cerrar</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-layout>
            </v-flex>
            <v-flex shrink v-if="documento.blobUrl" v-show="isEstudiante">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn flat color="error" icon v-on="on" @click="eliminar(documento.doc)">
                    <v-icon small>fas fa-trash</v-icon>
                  </v-btn>
                </template>
                <span>Eliminar {{documento.label}}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs3 v-show="!isEstudiante">
              <v-btn
                v-if="!documento.blobUrl"
                color="error"
                disabled
                block
              >Falta por adjuntar este documento</v-btn>
              <v-btn v-else color="success" block @click.stop="documento.dialog = true">
                <v-icon left small>fas fa-eye</v-icon>Ver documento
              </v-btn>
            </v-flex>
          </v-layout>
        </div>
      </v-card-text>
      <v-card-actions v-show="isEstudiante">
        <v-spacer></v-spacer>
        <v-btn color="primary" type="submit" :disabled="!valid">
          <v-icon left>fas fa-save</v-icon>Guardar
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: {
    estudianteParam: Object
  },
  data() {
    return {
      idestudiante: 0,
      valid: false,
      isEstudiante: false,
      archivos: [
        {
          label: "Cedula",
          doc: "CEDULA",
          filename: "",
          blobUrl: "",
          dialog: false,
          file: null
        },
        {
          label: "EPS",
          doc: "EPS",
          filename: "",
          blobUrl: "",
          dialog: false,
          file: null
        },
        {
          label: "ARL",
          doc: "ARL",
          filename: "",
          blobUrl: "",
          dialog: false,
          file: null
        },
        {
          label: "RUT",
          doc: "RUT",
          filename: "",
          blobUrl: "",
          dialog: false,
          file: null
        },
        {
          label: "Camara y Comercio",
          doc: "CC",
          filename: "",
          blobUrl: "",
          dialog: false,
          file: null
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  mounted() {
    this.initialize();
  },
  methods: {
    pickFile(ref) {
      this.$refs[ref][0].click();
    },
    onFilePicked(e, field) {
      const files = e.target.files;
      let archivo = this.archivos.find(f => f.doc == field);
      if (files[0] !== undefined) {
        archivo.filename = files[0].name;
        if (archivo.filename.lastIndexOf(".pdf") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          archivo.file = files[0]; // this is a file that can be sent to server...
        });
      } else {
        archivo.filename = "";
      }
    },
    save() {
      let formdata = new FormData();

      formdata.append("ID_ESTUDIANTE", this.idestudiante);
      this.archivos.forEach(documento => {
        formdata.append(`file${documento.doc}`, documento.file);
      });
      return this.$axios
        .post(`/students/subirdocumentos`, formdata, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(resp => {
          if (resp) {
            this.$swal({
              title: "Ok",
              text: "Los cambios se han guardado correctamente",
              icon: "success",
              timer: 1500
            });
            this.archivos.forEach(a => this.loadFile(a.doc));
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
    eliminar(doc) {
      this.$swal({
        title: "¿Estas seguro?",
        text: "Esta accion no podra ser deshecha!",
        icon: "warning",
        buttons: ["No", "Sí, borralo!"]
      }).then(result => {
        if (result) {
          this.$axios
            .delete(`/students/documentos/${this.idestudiante}/${doc}.pdf`)
            .then(resp => {
              if (resp) {
                this.$swal({
                  title: "Ok",
                  text: "Los cambios se han guardado correctamente",
                  icon: "success",
                  timer: 1500
                });

                this.archivos.forEach(a => this.loadFile(a.doc));
              }
            });
        }
      });
    },
    loadFile(doc) {
      if (this.idestudiante && doc)
        this.$axios
          .get(`/students/documentos/${this.idestudiante}/${doc}.pdf`, {
            responseType: "blob"
          })
          .then(res => {
            this.archivos.find(f => f.doc == doc).blobUrl = !res
              ? ""
              : window.URL.createObjectURL(new Blob([res.data]));
          });
    },
    getFile(nombredoc) {
      const url = this.archivos.find(f => nombredoc.startsWith(f.doc)).blobUrl;
      if (url) {
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", nombredoc);
        document.body.appendChild(link);
        link.click();
      }
    },
    initialize() {
      if (this.user.ID_ROL == 4) {
        this.idestudiante = this.user.ID_USUARIO;
        this.isEstudiante = true;
      } else if (this.estudianteParam.ID_USUARIO) {
        this.idestudiante = this.estudianteParam.ID_USUARIO;
        this.isEstudiante = false;
      }
      this.archivos.forEach(a => this.loadFile(a.doc));
    }
  },
  watch: {
    estudianteParam() {
      this.initialize();
    }
  }
};
</script>

