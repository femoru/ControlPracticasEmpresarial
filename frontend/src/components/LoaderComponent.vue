<template>
  <div>
    <v-dialog lazy v-model="value" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          <slot>Por favor espere, estamos validando</slot>
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    value: Boolean
  }
};
</script>

