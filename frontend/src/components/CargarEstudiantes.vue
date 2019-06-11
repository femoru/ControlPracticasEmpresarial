<template>
  <v-container grid-list-md>
    <v-layout wrap>
      <v-flex xs12 sm6 md12>
        <v-autocomplete
          prepend-icon="fas fa-briefcase"
          hint="Selecciona primero la carrera"
          v-model="ID_CARRERA"
          :items="carreras"
          item-text="CARRERA"
          item-value="ID_CARRERA"
          label="Carrera"
          persistent-hint
          clearable
        ></v-autocomplete>
      </v-flex>
      <v-flex xs12 md12>
        <v-text-field
          label="Seleccionar archivo"
          v-model="fileName"
          @click.stop="pickFile"
          prepend-icon="fas fa-paperclip"
          append-icon="fas fa-download"
          readonly
        ></v-text-field>
        <input
          type="file"
          style="display: none"
          ref="file"
          accept="plain/text"
          @change="onFilePicked"
        >
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  props: {
    universidad: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      carreras: [],
      ID_CARRERA: null,
      dialog: false,
      fileName: "",
      fileUrl: "",
      documentFile: ""
    };
  },
  mounted() {
    this.$axios
      .get(`/carrera/${this.universidad.ID_UNIVERSIDAD}`)
      .then(r => (this.carreras = r.data));
  },
  methods: {
    pickFile() {
      this.$refs.file.click();
    },
    onFilePicked(e) {
      const files = e.target.files;
      if (files[0] !== undefined) {
        this.fileName = files[0].name;
        if (this.fileName.lastIndexOf(".") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.fileUrl = fr.result;
          this.documentFile = files[0]; // this is a file that can be sent to server...
        });
      } else {
        this.fileName = "";
        this.documentFile = "";
        this.fileUrl = "";
      }
    },
    sendFile() {
      let formData = new FormData();
      formData.append("file", this.documentFile);
      formData.append("ID_CARRERA", this.ID_CARRERA);
      const url = `/students/${this.universidad.ID_UNIVERSIDAD}/cargar`;
      return this.$axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    }
  }
};
</script>
