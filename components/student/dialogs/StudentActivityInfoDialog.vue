<template>
  <v-dialog
    v-model="show"
    max-width="950"
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
          DETALLES DE LA ACTIVIDAD
        </h2>
      </v-card-text>

      <v-card-text class="py-3">
        <h3
          class="text-center subtitle black--text"
        >
          MOSTRANDO LOS DETALLES LA ACTIVIDAD:
          <br>
          <strong
            class="text-left subtitle mt-4"
            style="color: #07538a"
          >
            {{ activityInfo.name.toUpperCase() }}
          </strong>
        </h3>
      </v-card-text>

      <v-card-text
        class="text-justify black--text"
      >
        <v-row>
          <v-col lg="6" sm="12">
            <strong>INSTITUCIÓN ORGANIZADORA: </strong>
            <span>{{ activityInfo.institution }}</span>

            <br>

            <strong>FECHA DE INICIO: </strong>
            <span>{{ moment(activityInfo.dateStart).format('dddd DD MMMM YYYY').toUpperCase() }}</span>

            <br>

            <strong>FECHA DE FIN: </strong>
            <span>{{ moment(activityInfo.dateEnd).format('dddd DD MMMM YYYY').toUpperCase() }}</span>

            <br>

            <strong>HORAS: </strong>
            <span>{{ activityInfo.hours }}</span>

            <br>

            <strong>AREA: </strong>
            <span>{{ activityInfo.area }}</span>
          </v-col>

          <v-col lg="6" sm="12">
            <strong>FECHA DE ENVÍO </strong>
            <span>{{ moment(activityInfo.createdAt, "DD/MM/YYYY").format('dddd DD MMMM YYYY').toUpperCase() }}</span>

            <br>

            <strong>FECHA DE ÚLTIMA REVISIÓN: </strong>
            <span>{{ moment(activityInfo.updatedAt, "DD/MM/YYYY").format('dddd DD MMMM YYYY').toUpperCase() }}</span>

            <br>

            <strong>ESTADO: </strong>
            <v-icon
              v-if="activityInfo.status === 'approval'"
              color="success"
              small
            >
              mdi-check-circle
            </v-icon>

            <v-icon
              v-else-if="activityInfo.status === 'rejected'"
              color="error"
              small
            >
              mdi-close-circle
            </v-icon>

            <v-icon
              v-else-if="activityInfo.status === 'contacted'"
              color="warning"
              small
            >
              mdi-progress-clock
            </v-icon>

            <v-icon
              v-else-if="activityInfo.status === 'pending'"
              color="grey"
              small
            >
              mdi-alert-circle
            </v-icon>
            <strong
              :class="{
                'success--text': activityInfo.status === 'approval',
                'error--text': activityInfo.status === 'rejected',
                'warning--text': activityInfo.status === 'contacted',
                'grey--text': activityInfo.status === 'pending'
              }"
            >
              {{ status() }}
            </strong>

            <br>

            <strong v-if="activityInfo.observations">ÚLTIMAS OBSERVACIONES: </strong>
            <span>{{ activityInfo.observations.toUpperCase() }}</span>
          </v-col>
        </v-row>

        <br>

        <strong>EVIDENCIAS: </strong>
        <v-carousel>
          <v-carousel-item
            v-for="(item, i) in activityInfo.evidenceLinks"
            :key="i"
            :src="item"
            reverse-transition="fade-transition"
            transition="fade-transition"
          />
        </v-carousel>
      </v-card-text>

      <v-card-actions
        class="d-flex justify-center pb-6"
      >
        <v-btn
          color="#fed55e"
          rounded
          elevation="0"
          @click="close()"
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
    activityInfo: {
      type: Object,
      require: true,
      default: () => {}
    },
    moment: {
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
    close () {
      this.$emit('action', { action: 'cancel' })
    },

    status () {
      if (this.activityInfo.status === 'approval') {
        return 'APROBADA'
      }

      if (this.activityInfo.status === 'pending') {
        return 'PENDIENTE DE REVISIÓN'
      }

      if (this.activityInfo.status === 'rejected') {
        return 'RECHAZADA'
      }

      if (this.activityInfo.status === 'contacted') {
        return 'CONTACTADO PARA ACLARACIÓN'
      }
    }
  }
}
</script>

<style scoped>
</style>
