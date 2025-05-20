<template>
  <v-expansion-panels v-if="collectivesFlag" focusable>
    <v-expansion-panel v-for="(alum, index) in collectives" :key="index">
      <v-expansion-panel-header class="bg-blue white--text">
        <h4>{{ alum.nua }} &nbsp;|&nbsp; {{ alum.fullName.toUpperCase() }}</h4>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-card
          flat
          class="elevation-0 my-2"
        >
          <v-card-text class="black--text">
            <activities-alum-info
              :alum="alum"
            />
          </v-card-text>
        </v-card>

        <v-expansion-panels focusable>
          <v-expansion-panel v-for="(activity, indexA) in alum.collectives" :key="indexA">
            <v-expansion-panel-header class="bg-gold white--text">
              <h4>
                <v-icon
                  color="white"
                >
                  {{ getIconHeader(activity.status) }}
                </v-icon>
                &emsp;
                {{ activity.event.toUpperCase() }}
                &nbsp;
                —
                &nbsp;
                {{ activity.place.toUpperCase() }}
              </h4>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <collective-info-content
                :alum="alum"
                :activity="activity"
                :table-origin="tableOrigin"
                :edit-flag="editFlag"
                :get-status-text="getStatusText"
                :decoder="decoder"
                :moment="moment"
                @action="decoder"
              />

              <collective-edit-content
                v-if="editFlag === true"
                :activity="editActivity"
                :areas="areas"
                :required-rule="requiredRule"
                :date-end-rule="dateEndRule"
                :edit-flag="editFlag"
                @action="decoder"
              />

              <collective-documents
                @participants="decoder({ action: 'participantsDialog', activity})"
                @assistance="decoder({ action: 'assistanceDialog', activity})"
                @compare="decoder({ action: 'compareDialog', activity})"
                @authorization="decoder({ action: 'authorizationDialog', activity})"
              />

              <v-row>
                <v-col cols="12">
                  <h3>
                    EVIDENCIAS
                  </h3>
                  <v-carousel>
                    <v-carousel-item
                      v-for="(item,i) in activity.evidenceLinks"
                      :key="i"
                      :src="item"
                      reverse-transition="fade-transition"
                      transition="fade-transition"
                    />
                  </v-carousel>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <collective-participants-dialog
      v-if="participantsDialog"
      :activity-name="activityName"
      :participants="participants"
      @action="decoder({ action: 'close' })"
    />

    <collective-assistance-dialog
      v-if="assistanceDialog"
      :activity-name="activityName"
      :assistance="assistanceFormat"
      @action="decoder({ action: 'close' })"
    />

    <collective-compare-dialog
      v-if="compareDialog"
      :activity-name="activityName"
      :participants="participants"
      :assistance="assistanceFormat"
      @action="decoder({ action: 'close' })"
    />

    <collective-authorization-dialog
      v-if="authorizationDialog"
      :activity-name="activityName"
      :authorization="authorizationFormat"
      @action="decoder({ action: 'close' })"
    />
  </v-expansion-panels>
</template>

<script>
import CollectiveCompareDialog from '../dialogs/CollectiveCompareDialog'
import CollectiveAuthorizationDialog from '../dialogs/CollectiveAuthorizationDialog'
import CollectiveAssistanceDialog from '../dialogs/CollectiveAssistanceDialog'
import CollectiveParticipantsDialog from '../dialogs/CollectiveParticipantsDialog'
import CollectiveDocuments from '../buttons/CollectiveDocuments'
import CollectiveEditContent from '../panelContents/CollectiveEditContent'
import CollectiveInfoContent from '../panelContents/CollectiveInfoContent'
import ActivitiesAlumInfo from '../tables/ActivitiesAlumInfo'

export default {
  components: {
    CollectiveCompareDialog,
    CollectiveAuthorizationDialog,
    CollectiveAssistanceDialog,
    CollectiveParticipantsDialog,
    CollectiveDocuments,
    CollectiveEditContent,
    CollectiveInfoContent,
    ActivitiesAlumInfo
  },

  props: {
    collectivesFlag: {
      type: Boolean,
      require: true
    },
    collectives: {
      type: Array,
      required: true
    },
    areas: {
      type: Array,
      required: true
    },
    tableOrigin: {
      type: String,
      required: true
    },
    requiredRule: {
      type: Function,
      required: true
    },
    dateEndRule: {
      type: Function,
      required: true
    },
    moment: {
      type: Function,
      required: true
    }
  },

  data () {
    return {
      editFlag: false,
      editActivity: [],
      validForm: false,

      activityName: '',

      participantsDialog: false,
      participants: [],

      assistanceDialog: false,
      assistanceFormat: '',

      authorizationDialog: false,
      authorizationFormat: '',

      compareDialog: false
    }
  },

  methods: {
    decoder (data) {
      console.log('🚀 ~ decoder collectives ~ data:', data)
      const { action, alum, activity } = data

      if (action === 'createContactDialog') {
        this.$emit('action', { action, alum, activity, origin: 'collective' })
        return
      }

      if (action === 'editActivity') {
        this.editActivity = activity
        this.editFlag = true
        return
      }

      if (action === 'rejectEdit') {
        this.editFlag = false
        this.editActivity = null
        return
      }

      if (action === 'approveEdit') {
        const data = this.editActivity
        this.$emit('action', { action, data, origin: 'collective' })
        this.editFlag = false
        this.editActivity = null
        return
      }

      if (action === 'rejectActivityDialog') {
        this.editFlag = false
        this.editActivity = null
        this.$emit('action', { action, activity, origin: 'collective' })
        return
      }

      if (action === 'approveActivity') {
        this.editFlag = false
        this.editActivity = null
        const data = {
          observations: 'ACTIVIDAD APROBADA',
          status: 'approval'
        }
        this.$emit('action', { action, data, id: activity.id, origin: 'collective' })
        return
      }

      if (action === 'participantsDialog') {
        this.participants = activity.participants
        this.activityName = activity.event
        this.participantsDialog = true
        return
      }

      if (action === 'assistanceDialog') {
        this.assistanceFormat = '/PDF/Booking.pdf'
        this.activityName = activity.event
        this.assistanceDialog = true
        return
      }

      if (action === 'compareDialog') {
        this.participants = activity.participants
        this.assistanceFormat = '/PDF/Booking.pdf'
        this.activityName = activity.event
        this.compareDialog = true
        return
      }

      if (action === 'authorizationDialog') {
        this.authorizationFormat = '/PDF/Booking.pdf'
        this.activityName = activity.event
        this.authorizationDialog = true
        return
      }

      if (action === 'close') {
        this.activityName = ''

        this.participantsDialog = false
        this.participants = []

        this.assistanceDialog = false
        this.assistanceFormat = ''

        this.authorizationDialog = false
        this.authorizationFormat = ''

        this.compareDialog = false
        return
      }

      // eslint-disable-next-line no-console
      console.error('Acción no válida:', action)
    },

    getIconHeader (status) {
      const statusMap = {
        approval: 'mdi-check-circle',
        pending: 'mdi-alert-circle',
        rejected: 'mdi-close-circle',
        contacted: 'mdi-progress-clock'
      }

      return statusMap[status] || status
    },

    getStatusText (status) {
      const statusMap = {
        approval: 'APROBADA',
        pending: 'PENDIENTE DE REVISIÓN',
        rejected: 'RECHAZADA',
        contacted: 'CONTACTADO'
      }

      return statusMap[status] || status
    },

    cancelEdit () {
      this.editFlag = false
    }
  }
}
</script>

<style lang="scss" scoped>
.uppercase-text {
  text-transform: uppercase;
}

.strong-type {
  font-weight: bold;
  font-size: 1.17rem;
  font-family: 'Novecento Wide', sans-serif;
}

.span-type {
  font-size: 16px;
}

/* Para campos de Vuetify */
::v-deep .v-text-field input {
  text-transform: uppercase;
}

::v-deep .v-textarea textarea {
  text-transform: uppercase;
}
</style>
