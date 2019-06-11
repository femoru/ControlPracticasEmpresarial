<template>
  <v-layout row justify-space-between align-center wrap>
    <v-flex xs12 sm4 md3>
      <v-text-field :disabled="disabled"
        v-model="persona.CODIGO"
        label="Codigo interno"
        prepend-icon="fas fa-barcode"
        required
      ></v-text-field>
    </v-flex>
    <v-flex xs12 sm8 md9>
      <v-text-field :disabled="disabled"
        v-model="persona.NOMBRE"
        label="Nombre completo"
        prepend-icon="fas fa-signature"
      ></v-text-field>
    </v-flex>
    <v-flex xs12 sm3 md3>
      <v-text-field :disabled="disabled"
        v-model="persona.TIPODOCUMENTO"
        label="Tipo de documento"
        prepend-icon="fas fa-id-card"
        required
      ></v-text-field>
    </v-flex>
    <v-flex xs12 sm4 md3>
      <v-text-field :disabled="disabled"
        v-model="persona.NRODOCUMENTO"
        label="Nro. de documento"
        prepend-icon="fas fa-hashtag"
      ></v-text-field>
    </v-flex>
    <v-flex xs12 sm5 md2>
      <v-text-field :disabled="disabled"
        v-model="persona.TELEFONO"
        prepend-icon="fas fa-phone"
        label="Telefono"
        required
      ></v-text-field>
    </v-flex>
    <v-flex xs12 md4>
      <v-text-field :disabled="disabled" v-model="persona.CORREO" prepend-icon="fas fa-at" label="Correo" required></v-text-field>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  props: {
    persona: Object,
    default: () => ({
      CODIGO: ""
    }),
    disabled: Boolean
  },
  data() {
    return {};
  }
};
</script>
