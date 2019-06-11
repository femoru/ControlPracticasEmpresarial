<template>
  <v-app id="inspire">
    <v-navigation-drawer
      :permanent="$vuetify.breakpoint.mdAndUp"
      :temporary="!$vuetify.breakpoint.mdAndUp"
      v-model="drawer"
      clipped
      app
    >
      <v-list>
        <v-list-group
          expand
          v-for="(item,index) in menu"
          :key="index"
          v-model="item.active"
          :prepend-icon="item.icon"
          no-action
        >
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title v-html="item.text"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>

          <v-list-tile
            v-for="subItem in item.children"
            :key="subItem.title"
            :to="{name:subItem.link}"
          >
            <v-list-tile-content>{{ subItem.text }}</v-list-tile-content>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar dense dark color="primary" clipped-left app>
      <v-toolbar-side-icon @click.stop="drawer=!drawer" v-if="!$vuetify.breakpoint.mdAndUp"></v-toolbar-side-icon>
      <v-toolbar-title>Plataforma de practicas empresariales</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu :close-on-content-click="false" :nudge-width="200" offset-x>
        <template v-slot:activator="{ on }">
          <v-btn icon color="accent darken-3" dark v-on="on">
            <v-icon>fas fa-user</v-icon>
          </v-btn>
        </template>

        <v-card>
          <v-list>
            <v-list-tile avatar>
              <v-list-tile-avatar color="accent" class="white--text">{{iniciales}}</v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title
                  class="text-capitalize"
                >{{$store.state.user.NOMBRE.toLowerCase()}}</v-list-tile-title>
                <v-list-tile-sub-title
                  class="text-capitalize"
                >{{$store.state.user.ROL.toLowerCase()}}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn icon>
                  <v-icon>fas fa-cog</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile>
              <v-list-tile-action>
                <v-switch color="accent"></v-switch>
              </v-list-tile-action>
              <v-list-tile-title>Enable messages</v-list-tile-title>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-action>
                <v-switch color="accent"></v-switch>
              </v-list-tile-action>
              <v-list-tile-title>Enable hints</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-menu>
      <v-btn flat @click="logout">
        <v-icon left>fas fa-sign-out-alt</v-icon>Cerrar sesion
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
export default {
  computed: {
    iniciales() {
      const nombres = this.$store.getters.user.NOMBRE.split(" ");
      const nroNombres = nombres.length;
      if (nroNombres > 1) {
        return nombres[0][0] + nombres[nroNombres - 2 || 0][0];
      }
      return "LM";
    },
    menu() {
      return this.items[this.ROL - 1];
    }
  },
  data: () => ({
    dialog: false,
    drawer: false,
    ROL: 0,
    items: [
      [
        {
          icon: "fas fa-tools",
          "icon-alt": "fas fa-tools",
          text: "Administrador",
          active: true,
          children: [
            {
              icon: "fas fa-landmark",
              text: "Universidades",
              link: "universidades"
            },
            {
              icon: "fas fa-briefcase",
              text: "Carreras y asignaturas",
              link: "carreras"
            },
            { icon: "fas fa-users", text: "Usuarios", link: "usuarios" }
          ]
        }
      ],
      [
        {
          icon: "fas fa-user-edit",
          "icon-alt": "fas fa-user-edit",
          text: "Coordinador",
          active: true,
          children: [
            { text: "Estudiantes", link: "estudiantes" },
            { text: "Editar inducción", link: "editinduccion" }
            // { text: "Cargar Estudiantes en el sistema" },
            // { text: "Eliminar Estudiantes en el sistema" },
            // { text: "Editar Estudiantes en el sistema" },
            // { text: "Ver estudiantes inscriptos en el sistema" },
            // { text: "Generar Formato de convenio" },
            // { text: "Generar carta de presentación" },
            // { text: "Ver documentos adjuntados" },
            // { text: "Ver ficha solución del problema" },
            // { text: "Ver cronograma" }
          ]
        }
      ],
      [
        {
          icon: "fas fa-chalkboard-teacher",
          "icon-alt": "fas fa-chalkboard-teacher",
          text: "Tutor",
          active: true,
          children: [
            { text: "Estudiantes", link: "estudiantes" },
          ]
        }
      ],
      [
        {
          icon: "fas fa-user-graduate",
          "icon-alt": "fas fa-user-graduate",
          text: "Estudiante",
          active: true,
          children: [
            { text: "Inducción a la práctica empresarial", link: "induccion" },
            {
              text: "Información profesional",
              link: "informacionprofesional"
            },
            {
              text: "Acta de inicio",
              link: "actainicio"
            },
            {
              text: "Adjuntar documentos",
              link: "documentos"
            },
            { text: "Ficha de solución del problema", link: "fichasolucion" },
            { text: "Cronograma", link: "cronograma" },
            { text: "Bitacora", link: "bitacora" },
            { text: "Evaluación", link: "evaluacion" }

            // { text: "Evolución" }

            // { text: "Ver inducción a la práctica empresarial" },
            // {
            //   text:
            //     "Diligenciar Documentos acta de inicio y perfil del estudiante "
            // },
            // {
            //   text: "Editar Documentos  acta de inicio y perfil del estudiante "
            // },
            // { text: "Adjuntar documentos " },
            // { text: "Eliminar documentos adjuntados" },
            // { text: "Diligenciar ficha de solución del problema" },
            // { text: "Editar ficha de solución del problema" },
            // { text: "Crear cronograma" },
            // { text: "Editar cronograma" },
            // { text: "Adjuntar evolución" },
            // { text: "Editar evolución adjunta" },
            // { text: "Ver formato de evaluación" }
          ]
        }
      ]
    ]
  }),
  created() {
    this.$store.dispatch("initialize");
    this.ROL = JSON.parse(sessionStorage.user).ID_ROL;
  },
  mounted() {},
  props: {
    source: String
  },
  methods: {
    getCarrera() {
      return;
    },
    logout() {
      this.$store
        .dispatch("logout")
        .then(() => this.$router.go({ name: "login" }));
    }
  }
};
</script>