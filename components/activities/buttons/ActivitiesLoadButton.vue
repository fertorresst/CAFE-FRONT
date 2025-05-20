<template>
  <v-col cols="12" class="d-flex justify-center align-center flex-nowrap flex-column my-9">
    <v-row>
      <strong class="subtitle">Selecciona el tipo de actividades que deseas revisar:</strong>
    </v-row>

    <v-row>
      <v-btn-toggle
        v-model="toggle"
        rounded
        :mandatory="hasSelection"
      >
        <v-btn
          elevation="0"
          color="#fed55e"
          @click="selectButton('loadActivities', 0)"
        >
          <strong>ACTIVIDADES INDIVIDUALES</strong>
        </v-btn>

        <v-btn
          elevation="0"
          color="#fed55e"
          @click="selectButton('loadCollective', 1)"
        >
          <strong>ACTIVIDADES COLECTIVAS</strong>
        </v-btn>
      </v-btn-toggle>
    </v-row>

    <v-row
      v-if="tableOrigin === 'active'"
      class="text-center d-flex justify-center align-center mt-8"
    >
      <h4>PERIODO ACTIVO, SE MOSTRARÁN LAS ACTIVIDADES EN MODO DE VISUALIZACIÓN, PARA COMENZAR REVISIÓN ES NECESARIO MARCAR EL PERIODO COMO 'PENDIENTE DE REVISIÓN'</h4>
    </v-row>
  </v-col>
</template>

<script>
export default {
  props: {
    tableOrigin: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      toggle: null,
      hasSelection: false
    }
  },

  methods: {
    selectButton (action, index) {
      if (this.toggle !== index) {
        this.$emit('action', { action })
      }
      this.toggle = index
      this.hasSelection = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
