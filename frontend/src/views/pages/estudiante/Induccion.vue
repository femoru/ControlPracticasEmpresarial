<template>
  <v-card>
    <v-card-text>
      <div v-for="(item,i) in pasos" :key="i" v-html="item.descripcion"></div>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="success" @click.stop="aceptar">
        Aceptar y continuar
        <v-icon right small>fas fa-arrow-right</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template> 
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      pasos: []
    };
  },
  mounted() {
    this.cargarPasos();
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    cargarPasos() {
      return this.$axios(`/inducciones/${this.user.ID_CARRERA}`).then(r => {
        this.pasos = r.data.map(p => {
          p.descripcion = atob(p.descripcion);
          return p;
        });
      });
    },
    aceptar(){
      this.$axios.post(`/inducciones/terms/${this.user.ID_USUARIO}`).then((resp)=>{
        if(resp)
          this.$router.push({name:'actainicio'})
      })
    }
  }
};
</script>