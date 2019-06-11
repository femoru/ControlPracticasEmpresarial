<template>
  <v-form>
    <v-card class="fill-height">
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">Agendar visita</h3>
        </div>
        <v-spacer></v-spacer>
        <v-btn color="success" @click.stop="agendar">
          Agendar
          <v-icon right>fas fa-paper-plane</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-layout row style="height:420px" justify-space-around>
          <v-flex xs12 sm6 md5>
            <v-layout row wrap>
              <v-flex xs2>
                <v-subheader>Fecha</v-subheader>
              </v-flex>
              <v-flex xs4>
                <v-menu
                  ref="menuFecha"
                  v-model="menuFecha"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="fecha"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="fecha"
                      label="Fecha"
                      prepend-icon="fas fa-calendar-alt"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker locale="es" v-model="fecha" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="menuFecha = false">Cancelar</v-btn>
                    <v-btn color="primary" @click="$refs.menuFecha.save(fecha)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex shrink>
                <v-subheader>Hora</v-subheader>
              </v-flex>
              <v-flex xs4>
                <v-menu
                  ref="menuHora"
                  v-model="menuHora"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="hora"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="hora"
                      label="Hora"
                      prepend-icon="fas fa-clock"
                      readonly
                      hide-details
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker v-if="menuHora" v-model="hora" full-width>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="menuFecha = false">Cancelar</v-btn>
                    <v-btn color="primary" @click="$refs.menuHora.save(hora)">OK</v-btn>
                  </v-time-picker>
                </v-menu>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs2>
                <v-subheader>Lugar</v-subheader>
              </v-flex>
              <v-flex auto>
                <v-text-field
                  prepend-icon="fas fa-map-marker"
                  label="Lugar"
                  v-model="lugar.name"
                  hide-details
                  :hint="JSON.stringify(lugar.geometry.location)"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs2>
                <v-subheader>Contacto</v-subheader>
              </v-flex>
              <v-flex auto>
                <v-text-field
                  prepend-icon="fas fa-user-tie"
                  label="Jefe inmediato"
                  v-model="jefe.NOMBRE"
                  hide-details
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs2>
                <v-subheader>Correo</v-subheader>
              </v-flex>
              <v-flex auto>
                <v-text-field prepend-icon="fas fa-at" label="Correo" v-model="jefe.CORREO"></v-text-field>
              </v-flex>
            </v-layout>
            <ckeditor :editor="editor" :value="editorData" :config="editorConfig" @ready="isReady"></ckeditor>
          </v-flex>
          <v-flex xs12 sm6 md6 class="px-2">
            <GoogleMapLoader :lugar="lugar.name" class="fill-height" @place="ubicar"></GoogleMapLoader>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import GoogleMapLoader from "@/components/GoogleMapLoader";
import { mapGetters } from "vuex";
import moment from "moment";
moment.locale("es");

export default {
  components: {
    GoogleMapLoader
  },
  props: {
    estudianteParam: Object
  },
  computed: {
    ...mapGetters(["user"])
  },
  data() {
    return {
      fecha: moment().format("YYYY-MM-DD"),
      menuFecha: false,
      hora: moment().format("HH:mm"),
      menuHora: false,
      jefe: {},
      lugar: {
        name: "",
        geometry: {}
      },
      editor: ClassicEditor,
      editorData: "<p></p>",
      editorConfig: {
        language: "es",
        height: 500
      }
    };
  },
  methods: {
    isReady() {
      this.actualizarMemo();
    },
    ubicar(lugar) {
      this.lugar = lugar;
    },
    agendar() {
      this.$axios
        .post("/students/agendarvisita", {
          fecha: this.fecha,
          hora: this.hora,
          lugar: this.lugar,
          mensaje: this.editorData,
          estudiante: this.estudianteParam,
          jefe: this.jefe,
          usuario: this.user
        })
        .then(() => {
          this.$swal("Se ha enviado un mensaje agendando la cita");
        });
    },
    actualizarMemo() {
      this.editorData = `<p>Cordial saludo, </p>
      <p>Señor: ${this.jefe.NOMBRE || ""}</p>
      <p>Por la presente me permito solicitar una reunión para realizar la visita de seguimiento de practicas para el estudiante <strong>${
        this.estudianteParam.NOMBRE
      }</strong> el dia ${moment(`${this.fecha} ${this.hora}`).format(
        "LLLL"
      )} en <strong>${this.lugar.name}</strong> ${this.lugar
        .formatted_address || ""} </p></div>`;
    }
  },
  watch: {
    lugar() {
      this.actualizarMemo();
    },
    fecha() {
      this.actualizarMemo();
    },
    hora() {
      this.actualizarMemo();
    },
    "jefe.NOMBRE"() {
      this.actualizarMemo();
    }
  }
};
</script>