<template>
  <div>
    <v-col
      cols="12"
      align="center"
      justify="center"
      class="text-uppercase my-4"
    >
      <v-row
        class="d-flex flex-wrap flex-row align-stretch justify-space-between"
      >
        <div
          class="d-flex flex-row align-stretch"
        >
          <v-icon
            v-if="activity.status === 'approval'"
            color="success"
            class="mr-1"
            size="48"
          >
            mdi-check-circle
          </v-icon>

          <v-icon
            v-else-if="activity.status === 'rejected'"
            color="error"
            class="mr-1"
            size="48"
          >
            mdi-close-circle
          </v-icon>

          <v-icon
            v-else-if="activity.status === 'pending'"
            color="grey"
            class="mr-1"
            size="48"
          >
            mdi-alert-circle
          </v-icon>

          <v-icon
            v-else-if="activity.status === 'contacted'"
            color="warning"
            class="mr-1"
            size="48"
          >
            mdi-progress-clock
          </v-icon>

          <h1
            :class="{
              'success--text subtitle': activity.status === 'approval',
              'error--text subtitle': activity.status === 'rejected',
              'grey--text subtitle': activity.status === 'pending',
              'warning--text subtitle': activity.status === 'contacted'
            }"
          >
            {{ getStatusText(activity.status) }}
          </h1>
        </div>
        <activities-actions
          v-if="!editFlag"
          :key="activity.id + '-' + activity.status"
          :activity="activity"
          :table-origin="tableOrigin"
          @createContact="decoder(action = 'createContactDialog', alum, activity)"
          @editActivity="decoder(action = 'editActivity', null, activity)"
          @rejectEdit="decoder(action = 'rejectEdit', null, activity)"
          @approveEdit="decoder(action = 'approveEdit', null, null)"
          @rejectActivity="decoder(action = 'rejectActivityDialog', null, activity)"
          @approveActivity="decoder(action = 'approveActivity', null, activity)"
        />
      </v-row>
    </v-col>

    <v-row class="text-left d-flex flex-wrap flex-row align-stretch justify-center mb-4">
      <v-col sm="6" md="3" lg="3">
        <strong>
          FECHA DE SOLICITUD:
        </strong>
        <br>
        <span>
          {{ moment(activity.createdAt, "DD/MM/YYYY").format("DD MMM YYYY").toUpperCase() }}
        </span>
      </v-col>

      <v-col sm="6" md="3" lg="3">
        <strong>
          ÚLTIMA ACTUALIZACIÓN:
        </strong>
        <br>
        <span>
          {{ moment(activity.updatedAt, "DD/MM/YYYY").format("DD MMM YYYY").toUpperCase() }}
        </span>
      </v-col>

      <v-col sm="12" md="6" lg="6">
        <strong>
          OBSERVACIONES:
        </strong>
        <span v-if="activity.observations">
          {{ activity.observations.toUpperCase() }}
        </span>
      </v-col>
    </v-row>

    <div
      v-if="editFlag === false"
    >
      <v-row class="d-flex flex-wrap flex-row align-stretch justify-center">
        <v-col>
          <strong class="strong-type">
            NOMBRE DE LA ACTIVIDAD:
          </strong>
          <br>
          <span class="span-type">
            {{ activity.name.toUpperCase() }}
          </span>
        </v-col>

        <v-col>
          <strong class="strong-type">
            INSTITUCIÓN ORGANIZADORA:
          </strong>
          <br>
          <span class="span-type">
            {{ activity.institution.toUpperCase() }}
          </span>
        </v-col>
      </v-row>

      <v-row class="d-flex flex-wrap flex-row align-stretch justify-center">
        <v-col>
          <strong class="strong-type">
            INICIO:
          </strong>
          <br>
          <span class="span-type">
            {{ moment(activity.startDate).format("DD MMM YYYY").toUpperCase() }}
          </span>
        </v-col>

        <v-col>
          <strong class="strong-type">
            TÉRMINO:
          </strong>
          <br>
          <span class="span-type">
            {{ moment(activity.endDate).format("DD MMM YYYY").toUpperCase() }}
          </span>
        </v-col>

        <v-col>
          <strong class="strong-type">
            HORAS:
          </strong>
          <br>
          <span class="span-type">
            {{ activity.hours.toString().toUpperCase() }}
          </span>
        </v-col>

        <v-col>
          <strong class="strong-type">
            ÁREA:
          </strong>
          <br>
          <span class="span-type">
            {{ activity.area.toString().toUpperCase() }}
          </span>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import ActivitiesActions from '../buttons/ActivitiesActions'

export default {
  components: {
    ActivitiesActions
  },

  props: {
    alum: {
      type: Object,
      required: true
    },
    activity: {
      type: Object,
      required: true
    },
    tableOrigin: {
      type: String,
      required: true
    },
    editFlag: {
      type: Boolean,
      required: true,
      default: false
    },
    getStatusText: {
      type: Function,
      required: true
    },
    moment: {
      type: Function,
      required: true,
      default: moment
    }
  },

  methods: {
    decoder (action, alum, activity) {
      this.$emit('action', { action, alum, activity })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
