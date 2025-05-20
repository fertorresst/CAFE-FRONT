<template>
  <v-dialog
    v-model="show"
    max-width="1000"
    persistent
    style="overflow-y: hidden;"
  >
    <v-card
      align="center"
      justify="center"
      class="rounded-xl"
    >
      <v-card-text class="bg-blue white--text py-4">
        <h2>
          FORMATO DE AUTORIZACIÓN
        </h2>
      </v-card-text>

      <v-card-text class="py-3">
        <h3
          class="text-center subtitle black--text"
        >
          FORMATO DE AUTORIZACIÓN DEL EVENTO:
          <br>
          <strong
            class="text-left subtitle mt-4"
            style="color: #07538a"
          >
            {{ activityName.toUpperCase() }}
          </strong>
        </h3>
      </v-card-text>

      <v-card-text
        class="text-center black--text"
      >
        <object
          :data="authorization"
          type="application/pdf"
          width="100%"
          height="500px"
          class="pdf-viewer"
        >
          <div class="pdf-fallback">
            <strong class="subtitle">Tu navegador no puede mostrar el PDF directamente</strong>
            <br>
            <v-btn
              color="#fed55e"
              class="mt-2"
              rounded
              elevation="0"
              :href="assistance"
              target="_blank"
            >
              <v-icon left>mdi-open-in-new</v-icon>
              <strong>Ver PDF en nueva pestaña</strong>
            </v-btn>
          </div>
        </object>
      </v-card-text>

      <v-card-actions
        class="d-flex justify-center pt-0 mt-0 pb-6"
      >
        <v-btn
          color="#fed55e"
          rounded
          elevation="0"
          @click="$emit('action')"
        >
          <strong>CERRAR</strong>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    activityName: {
      type: String,
      required: true
    },
    authorization: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      show: true
    }
  }
}
</script>

<style lang="scss" scoped>
.pdf-viewer {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.pdf-fallback {
  padding: 30px;
  text-align: center;
}
</style>
