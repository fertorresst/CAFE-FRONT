<template>
  <v-dialog
    v-model="show"
    max-width="400"
    persistent
  >
    <v-card
      align="center"
      justify="center"
      class="rounded-xl"
    >
      <v-card-text class="bg-blue white--text py-4">
        <h2>
          ELIMINAR PERIODO
        </h2>
      </v-card-text>

      <v-card-text class="py-3">
        <h3
          class="text-left subtitle black--text"
        >
          ¿Estás seguro de que deseas eliminar este periodo?
          <strong
            class="text-center subtitle mt-4"
            style="color: #07538a"
          >
            {{ periodToDelete.per_name }}
          </strong>
        </h3>

        <br>

        <h3
          class="text-left subtitle black--text"
        >
          Esta acción no se puede deshacer.
        </h3>
      </v-card-text>

      <v-card-actions
        class="d-flex justify-center pb-6"
      >
        <v-btn
          color="black"
          rounded
          text
          @click="cancel()"
        >
          <span class="text">CANCELAR</span>
        </v-btn>
        <v-btn
          color="#fed55e"
          rounded
          elevation="0"
          @click="deletePeriod()"
        >
          <strong>ELIMINAR</strong>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    periodToDelete: {
      type: Object,
      required: true
    },
    mostrarAlerta: {
      type: Function,
      required: true
    }
  },

  data () {
    return {
      show: true
    }
  },

  mounted () {
    console.log('DeletePeriod mounted', this.periodToDelete)
  },

  methods: {
    cancel () {
      this.$emit('action', { action: 'cancel' })
    },

    deletePeriod () {
      if (confirm('¿ESTAS SEGURO DE QUE DESEAS ELIMINAR ESTE PERIODO? Esta acción no se puede deshacer.')) {
        const id = this.periodToDelete.per_id

        this.$emit('action', { action: 'deletePeriod', id })
        this.cancel()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
