<template>
  <v-dialog
    v-model="show"
    max-width="550"
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
          ALUMNOS PARTICIPANTES
        </h2>
      </v-card-text>

      <v-card-text class="py-3">
        <h3
          class="text-center subtitle black--text"
        >
          ALUMNOS PARTICIPANTES DEL EVENTO:
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
        <collective-participants
          :participants="participants"
        />
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
import CollectiveParticipants from '../tables/CollectiveParticipants'

export default {
  components: { CollectiveParticipants },

  props: {
    activityName: {
      type: String,
      required: true
    },
    participants: {
      type: Array,
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

</style>
