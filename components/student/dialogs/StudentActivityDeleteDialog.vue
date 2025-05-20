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
          ELIMINAR ACTIVIDAD
        </h2>
      </v-card-text>

      <v-card-text class="py-3">
        <h3
          class="text-left subtitle black--text"
        >
          ¿Estás seguro de que deseas eliminar esta actividad?
          <br>
          <strong
            class="text-left subtitle"
            style="color: #07538a"
          >
            {{ activityDelete.name.toUpperCase() }}
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
          @click="deleteActivity()"
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
    activityDelete: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      show: true
    }
  },

  methods: {
    cancel () {
      this.$emit('action', { action: 'cancel' })
    },

    deleteActivity () {
      this.$emit('action', { action: 'deleteActivity', item: this.activityDelete.id })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
