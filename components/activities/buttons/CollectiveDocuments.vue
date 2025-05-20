<template>
  <div class="d-flex flex-row flex-wrap justify-center align-stretch my-6">
    <v-btn
      elevation="0"
      class="rounded-pill mx-2 my-2"
      color="#fed55e"
      @click="$emit('participants')"
    >
      <strong>PARTICIPANTES</strong>
    </v-btn>

    <v-btn
      elevation="0"
      class="rounded-pill mx-2 my-2"
      color="#fed55e"
      @click="$emit('assistance')"
    >
      <strong>FORMATO DE ASISTENCIA</strong>
    </v-btn>

    <v-btn
      elevation="0"
      class="rounded-pill mx-2 my-2"
      color="#fed55e"
      @click="$emit('compare')"
    >
      <strong>PARTICIPANTES VS ASISTENCIAS</strong>
    </v-btn>

    <v-btn
      elevation="0"
      class="rounded-pill mx-2 my-2"
      color="#fed55e"
      @click="$emit('authorization')"
    >
      <strong>FORMATO DE AUTORIZACIÓN</strong>
    </v-btn>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>

</style>
