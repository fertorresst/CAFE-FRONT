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
          {{ titleNewStatus }}
        </h2>
      </v-card-text>

      <v-card-text
        v-if="moment().isBefore(moment(periodToChangeStatus.per_date_end)) && periodToChangeStatus.per_status === 'active'"
        class="py-3"
      >
        <h3
          class="text-justify subtitle black--text"
        >
          El periodo
          <strong
            class="text-left subtitle mt-4"
            style="color: #07538a"
          >
            {{ periodToChangeStatus.per_name }}
          </strong>
          aun no llega a su fecha de fin ¿Estás seguro de finalizarlo?
          <br>
          <br>
          Después de finalizarlo ya no se podrán realizar cambios ni recibir solicitudes.
        </h3>
      </v-card-text>

      <v-card-text
        v-else
        class="py-3"
      >
        <h3
          class="text-left subtitle black--text"
        >
          ¿Estás seguro de que desea {{ textNewStatus }} este periodo?

          <strong
            class="text-left subtitle mt-4"
            style="color: #07538a"
          >
            {{ periodToChangeStatus.per_name }}
          </strong>
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
          @click="endPeriod()"
        >
          <strong>FINALIZAR</strong>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    periodToChangeStatus: {
      type: Object,
      required: true
    },
    newStatus: {
      type: String,
      required: true
    },
    textNewStatus: {
      type: String,
      required: true
    },
    titleNewStatus: {
      type: String,
      required: true
    },
    moment: {
      type: Function,
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

  methods: {
    cancel () {
      this.$emit('action', { action: 'cancel' })
    },

    endPeriod () {
      if (confirm('ESTA ACCIÓN NO SE PUEDE DESHACER. ¿ESTÁS SEGURO DE QUE DESEAS ' + this.textNewStatus.toUpperCase() + ' ESTE PERIODO?')) {
        const data = {
          id: this.periodToChangeStatus.per_id,
          status: this.newStatus
        }

        this.$emit('action', { action: 'changeStatus', data })
        this.cancel()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
