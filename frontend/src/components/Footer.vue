<template>
  <v-content>
    <v-footer height="auto" class="primary">
      <v-layout row wrap justify-center>
        <v-img
          :src="require('@/assets/logo-horizontal.png')"
          height="100"
          contain
        />
        <v-btn>Home</v-btn>
        <v-btn>About Us</v-btn>
        <v-btn>Team</v-btn>
        <v-btn>Services</v-btn>
        <v-btn>Blog</v-btn>
        <v-btn>Contact Us</v-btn>
        <v-flex xs12 py-3 text-xs-center white--text>
          &copy;2018 —
          <strong>Vuetify</strong>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-content>
</template>
