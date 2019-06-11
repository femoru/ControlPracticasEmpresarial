<template>
  <v-navigation-drawer
    v-model="value"
    :clipped="$vuetify.breakpoint.mdAndUp"
    permanent
    absolute
    overflow
  >
    <v-list dense>
      <template v-for="item in items">
        <v-layout v-if="item.heading" :key="item.heading" row align-center>
          <v-flex xs6>
            <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
          </v-flex>
          <v-flex xs6 class="text-xs-center">
            <a href="#!" class="body-2 black--text">EDIT</a>
          </v-flex>
        </v-layout>
        <v-list-group
          v-else-if="item.children"
          :key="item.text"
          v-model="item.model"
          :prepend-icon="item.model ? item.icon : item['icon-alt']"
          append-icon
        >
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.text }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
          <v-list-tile
            v-for="(child, i) in item.children"
            :key="i"
            :to="{name:child.link}"
            :title="child.text"
          >
            <v-list-tile-action v-if="child.icon">
              <v-icon small>{{child.icon}}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ child.text }}</v-list-tile-title>
            </v-list-tile-content>
            <!-- <v-list-tile-action v-if="child.link">
                <v-icon small>fas fa-external-link-alt</v-icon>
            </v-list-tile-action>-->
          </v-list-tile>
        </v-list-group>
        <v-list-tile v-else :key="item.text">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
    <v-spacer></v-spacer>
    <v-list>
      <v-list-tile @click="logout()">
        <v-list-tile-avatar>
          <v-icon>fas fa-sign-out-alt</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>Cerrar sesion</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
export default {
  props: {
    value: Boolean
  },
  data() {
    return {
      items: [
        {
          icon: "fas fa-user-graduate",
          "icon-alt": "fas fa-user-graduate",
          text: "Estudiante",
          model: false,
          children: [
            { text: "Inducción a la práctica empresarial", link: "/induccion" }
            // { text: "Documentos acta de inicio y perfil del estudiante " },
            // { text: "Ficha de solución del problema" },
            // { text: "Cronograma" },
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
        },
        {
          icon: "fas fa-user-edit",
          "icon-alt": "fas fa-user-edit",
          text: "Coordinador",
          model: true,
          children: [
            {
              icon: "fas fa-user-graduate",
              text: "Estudiantes",
              link: "estudiantes"
            }
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
        },
        {
          icon: "fas fa-chalkboard-teacher",
          "icon-alt": "fas fa-chalkboard-teacher",
          text: "Tutor",
          model: false,
          children: [
            // { text: "Ver documentos adjuntos" },
            // { text: "Ver ficha solución del problema" },
            // { text: "Ver cronograma" },
            // { text: "Ver evolución" },
            // { text: "Agendar  Visita" },
            // { text: "Adjuntar formato de evaluación de práctica empresarial" }
          ]
        },
        {
          icon: "fas fa-tools",
          "icon-alt": "fas fa-tools",
          text: "Administrador",
          model: false,
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
      ]
    };
  },
  methods: {
    logout() {
      this.$store
        .dispatch("logout")
        .then(() => this.$router.go({ name: "login" }));
    }
  }
};
</script>
