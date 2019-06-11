<template>
  <div class="printer">
    <v-card>
      <v-card-title primary-title>
        <h3 class="title">Bitacora de evolucion</h3>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              fab
              small
              dark
              color="primary"
              v-on="on"
              @click.stop="add"
              v-show="!isEstudiante"
            >
              <v-icon>fas fa-plus</v-icon>
            </v-btn>
          </template>
          <span>Nueva entrada</span>
        </v-tooltip>
        <download-excel v-ripple :data="excel" name="Bitacora.xls">
          <v-btn flat icon>
            <v-icon color="green">fas fa-file-excel</v-icon>
          </v-btn>
        </download-excel>
      </v-card-title>
      <v-card-text>
        <div>
          <v-timeline>
            <v-timeline-item v-for="item in evoluciones" :key="item.idevolucion" fill-dot small>
              <v-card class="elevation-2">
                <v-card-text v-html="item.comentario"></v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-rating v-model="item.stars" small dense readonly></v-rating>
                  <v-spacer></v-spacer>
                  <span class="grey--text">
                    <i class="fas fa-calendar-alt"/>
                    {{item.fecha | humanize }}
                  </span>
                </v-card-actions>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </div>
      </v-card-text>
    </v-card>

    <!-- Dialogos -->
    <v-form v-model="valid">
      <v-dialog scrollable v-model="dialog" persistent max-width="660" lazy>
        <v-card>
          <v-card-title>
            <div>
              <h3 class="headline mb-0">Evolucion</h3>

              <h3 class="caption">
                Fecha:
                <v-dialog
                  ref="dialogDate"
                  v-model="modalDate"
                  :return-value.sync="editedItem.fecha"
                  persistent
                  lazy
                  max-width="290"
                >
                  <v-chip small slot="activator">{{editedItem.fecha | fecha}}</v-chip>
                  <!-- <v-btn flat small class="mx-0 px-0" color="grey" slot="activator">{{editedItem.fecha | fecha}}</v-btn> -->
                  <v-card>
                    <v-date-picker no-title v-model="date" scrollable locale="es"></v-date-picker>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" flat @click.native="modalDate = false">Cancelar</v-btn>
                      <v-btn color="primary" @click="$refs.dialogDate.save(`${date} ${hour}`)">Ok</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog
                  ref="dialogHour"
                  v-model="modalHour"
                  :return-value.sync="editedItem.fecha"
                  persistent
                  lazy
                  max-width="290"
                >
                  <v-chip small slot="activator">{{editedItem.fecha | hora}}</v-chip>
                  <v-card>
                    <v-time-picker v-model="hour" format="24hr" scrollable></v-time-picker>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" flat @click.native="modalHour = false">Cancelar</v-btn>
                      <v-btn color="primary" @click="$refs.dialogHour.save(`${date} ${hour}`)">Ok</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </h3>
            </div>
            <v-spacer></v-spacer>
            <v-rating v-model="editedItem.stars" hover></v-rating>
          </v-card-title>
          <v-card-text>
            <ckeditor :editor="editor" v-model="editedItem.comentario" :config="editorConfig"></ckeditor>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="dialog = false">Cerrar</v-btn>
            <v-btn
              color="blue darken-1"
              dark
              :disabled="!valid"
              @click.stop="save(editedItem)"
            >Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-form>
  </div>
</template>
<script>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import moment from "moment";
import { mapGetters } from "vuex";

moment.locale("es");

export default {
  props: {
    estudianteParam: Object
  },
  filters: {
    humanize(date) {
      return moment(date).format("YYYY-MM-DD HH:mm");
    },
    fecha(date) {
      return moment(date).format("YYYY-MM-DD");
    },
    hora(date) {
      return moment(date).format("HH:mm");
    }
  },
  data() {
    return {
      indexItem: -1,
      editedItem: {
        comentario: "",
        stars: 3
      },
      date: moment().format("YYYY-MM-DD"),
      hour: moment().format("HH:mm"),
      modalDate: false,
      modalHour: false,
      dialog: false,
      valid: false,
      editor: ClassicEditor,
      editorData: "<p></p><p></p><p></p>",
      editorConfig: { language: "es" },
      evoluciones: [],
      rules: [v => !!v || "Campo obligatorio"]
    };
  },
  computed: {
    ...mapGetters(["user"]),
    isEstudiante() {
      return this.user.ID_ROL == 4;
    },
    defaultItem() {
      return {
        fecha: `${this.date} ${this.hour}`,
        idestudiante: this.estudianteParam.ID_USUARIO,
        idautor: this.user.ID_USUARIO,
        comentario: "",
        stars: 3
      };
    },
    excel() {
      return this.evoluciones.map(evol => {
        return {
          Fecha: evol.fecha,
          Comentario: evol.comentario,
          Calificacion: evol.stars
        };
      });
    }
  },
  mounted() {
    this.load();
  },
  methods: {
    moment: moment,
    add() {
      this.indexItem = -1;
      this.editedItem = Object.assign({}, this.defaultItem);
      this.dialog = true;
    },
    save(item) {
      let evolucion = Object.assign({}, item);
      evolucion.comentario = btoa(item.comentario);
      this.$axios.post("/bitacora", evolucion).then(resp => {
        if (resp) {
          this.$swal("Evolucion guardada", "", "success");
          this.load();
          this.dialog = false;
        }
      });
    },
    cargarBitacora() {
      this.$axios.get(`/bitacora/${this.idestudiante}`).then(resp => {
        this.evoluciones = resp.data.map(val => {
          val.comentario = decodeURIComponent(escape(atob(val.comentario)));
          return val;
        });
      });
    },
    load() {
      if (this.user.ID_ROL == 4) {
        this.idestudiante = this.user.ID_USUARIO;
      } else if (this.estudianteParam.ID_USUARIO) {
        this.idestudiante = this.estudianteParam.ID_USUARIO;
      }
      this.cargarBitacora();
    }
  },
  watch: {
    estudianteParam() {
      this.load();
    }
  }
};
</script>
