<template>
  <v-container>
    <v-layout align-center>
      <v-flex>
        <h3 class="display-3">Esta página aun no está disponible</h3>
        <span
          class="subheading"
        >Es posible que el enlace que seleccionaste esté dañado o que se haya eliminado la página.</span>
        <v-divider class="my-3"></v-divider>
        <v-btn class="mx-0" color="primary" @click="$router.go(-1)" large>Volver</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>
