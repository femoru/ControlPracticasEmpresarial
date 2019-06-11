<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">Cronograma</h3>
          <div>Cronograma de actividades</div>
        </div>
        <v-spacer></v-spacer>
        <!-- <v-switch label="Gantt" v-model="gantt"></v-switch> -->
        <v-btn round color="primary" @click.stop="clickAdd">Nueva Actividad</v-btn>
  <download-excel v-ripple :data="excel" name="Cronograma.xls">
          <v-btn flat icon>
            <v-icon color="green">fas fa-file-excel</v-icon>
          </v-btn>
        </download-excel>
      </v-card-title>
      <v-card-text>
        <v-data-table
          v-if="!gantt"
          :headers="headers"
          :items="tasks"
          hide-actions
          class="elevation-1"
        >
          <template v-slot:items="props">
            <tr>
              <td>{{ props.index +1 }}</td>
              <td class="text-xs-left">{{ props.item.label }}</td>
              <td class="text-xs-center">{{ dayjs(props.item.start).format('YYYY-MM-DD') }}</td>
              <td class="text-xs-center">{{ dayjs(props.item.end).format('YYYY-MM-DD') }}</td>
              <td class="text-xs-center">{{ props.item.duration/1000/60/60 }} Horas</td>
              <td class="text-xs-center">
                <v-btn icon small color="primary" @click="editTask(props.item)">
                  <v-icon small>fas fa-wrench</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
        <gantt-elastic v-else :tasks="tasks" :options="options">
          <!-- <gantt-elastic-header slot="header"></gantt-elastic-header>-->
        </gantt-elastic>
      </v-card-text>
    </v-card>
    <!-- Dialogo añadir tarea -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Actividad</v-card-title>
        <v-card-text>
          <v-text-field prepend-icon="fas fa-signature" v-model="edited.label" label="Titulo"></v-text-field>
          <v-menu
            v-model="menuInicio"
            :close-on-content-click="false"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="edited.start"
                label="Fecha de inicio"
                prepend-icon="fas fa-calendar-alt"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="edited.start" @input="menuInicio = false"></v-date-picker>
          </v-menu>
          <v-menu
            v-model="menuFin"
            :close-on-content-click="false"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="edited.end"
                label="Fecha final"
                prepend-icon="fas fa-calendar-alt"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="edited.end" @input="menuFin = false"></v-date-picker>
          </v-menu>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat="flat" @click.native="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" flat="flat" @click.native="addTask">Agregar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template> 
<script>
import GanttElastic from "gantt-elastic";
// import GanttElasticHeader from "gantt-elastic-header";
import dayjs from "dayjs";
import { mapGetters } from "vuex";

export default {
  components: {
    GanttElastic
    // GanttElasticHeader
  },
  props: {
    estudianteParam: Object
  },
  data() {
    return {
      headers: [
        { text: "No", value: "idactividad",align: "left" },
        { text: "Actividad", value: "label", align: "left" },
        { text: "Inicio", value: "start", align: "center" },
        { text: "Fin", value: "end", align: "center" },
        { text: "Duracion", value: "duration", align: "center" },
        { text: "Acciones", sortable: false, align: "center" }
      ],
      gantt: false,
      tasks: [],
      options,
      dialog: false,
      menuInicio: false,
      menuFin: false,
      idestudiante: 0,
      edited: {},
      editedIndex: -1,
      defaultActivity: {
        label: "",
        start: new Date().toISOString().substr(0, 10),
        end: new Date().toISOString().substr(0, 10)
      }
    };
  },
  mounted() {
    if (this.user.ID_ROL == 4) {
      this.idestudiante = this.user.ID_USUARIO;
      this.estudiante = this.user;
      this.cargarActividades();
    } else if (this.estudianteParam.ID_USUARIO) {
      this.idestudiante = this.estudianteParam.ID_USUARIO;
      this.estudiante = this.estudianteParam;
      this.cargarActividades();
    } else if (this.$route.params.idestudiante) {
      this.idestudiante = this.$route.params.idestudiante;
      this.cargarEstudiante().then(this.cargarActividades);
    }
  },
  computed: {
    ...mapGetters(["user"]),
    excel(){
      return this.tasks.map(task=>{
        return{
          Actividad: task.label,
          'Fecha inicio': task.start,
          'Fecha fin': task.end,
        }
      })
    }
  },
  methods: {
    dayjs,
    cargarEstudiante() {
      return this.$axios(`/user/${this.$route.params.idestudiante}`).then(
        res => {
          this.estudiante = res.data[0];
        }
      );
    },
    addTask() {
      this.edited.duration =
        Date.parse(this.edited.end) - Date.parse(this.edited.start);

      const item = {
        idactividad: this.edited.idactividad,
        idestudiante: this.idestudiante,
        descripcion: this.edited.label,
        inicio: this.edited.start,
        fin: this.edited.end,
        duracion: this.edited.duration
      };

      if (this.editedIndex > -1) {
        const idactividad = this.edited.idactividad;
        delete item.idactividad;
        this.$axios
          .put(`/actividades/${idactividad}`, item)
          .then(this.cargarActividades);
        // Object.assign(this.tasks[this.editedIndex], this.edited);
      } else {
        this.$axios.post(`/actividades/`, item).then(this.cargarActividades);
        // this.tasks.push(this.edited);
      }
      this.dialog = false;
      this.editedIndex = -1;
    },
    cargarActividades() {
      this.$axios(`/actividades/${this.idestudiante}`).then(r => {
        this.tasks = r.data.map(t => ({
          idactividad: t.idactividad,
          idestudiante: t.idestudiante,
          label: t.descripcion,
          start: dayjs(t.inicio).format("YYYY-MM-DD"),
          end: dayjs(t.fin).format("YYYY-MM-DD"),
          duration: t.duracion
        }));
      });
    },
    clickAdd() {
      this.edited = Object.assign({}, this.defaultActivity);
      this.dialog = true;
    },
    editTask(item) {
      this.editedIndex = this.tasks.indexOf(item);
      this.edited = Object.assign({}, item);
      this.dialog = true;
    }
  },
  watch: {
    estudianteParam() {
      this.idestudiante = this.estudianteParam.ID_USUARIO;
      this.estudiante = this.estudianteParam;
      this.cargarActividades();
    }
  }
};

const options = {
  taskList: {
    expander: {
      size: 16,
      columnWidth: 24,
      padding: 16,
      margin: 10,
      straight: false
    },
    columns: [
      {
        id: 1,
        label: "No.",
        value: task => {
          console.log(task);
          return task.idactividad;
        },
        width: 40
      },
      {
        id: 2,
        label: "Actividad",
        value: "label",
        width: 200,
        expander: true
      },
      {
        id: 3,
        label: "Inicio",
        value: "start",
        width: 78
      },
      {
        id: 4,
        label: "Inicio",
        value: "end",
        width: 78
      }
    ]
  },
  locale: {
    name: "es",
    Now: "Ahora",
    "X-Scale": "Zoom-XXX",
    "Y-Scale": "Zoom-Y",
    "Task list width": "Task list",
    "Before/After": "Expand",
    "Display task list": "Task list"
  }
};
</script>
