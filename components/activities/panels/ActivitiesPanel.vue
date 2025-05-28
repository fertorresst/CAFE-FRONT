<template>
  <v-expansion-panels
    v-model="activePanel"
    focusable
    @change="onPanelChange"
  >
    <v-expansion-panel
      v-for="(alum, index) in activities"
      :key="index"
    >
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

        <v-expansion-panels
          v-model="activeActivityPanel"
          focusable
          @change="onActivityPanelChange"
        >
          <v-expansion-panel
            v-for="(activity, indexA) in alum.activities"
            :key="indexA"
          >
            <v-expansion-panel-header class="bg-gold white--text">
              <h4>
                <v-icon
                  color="white"
                >
                  {{ getIconHeader(activity.status) }}
                </v-icon>
                &emsp;
                {{ activity.area.toUpperCase() }}
                &nbsp;
                —
                &nbsp;
                {{ activity.name.toUpperCase() }}
              </h4>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <activity-info-content
                :alum="alum"
                :activity="activity"
                :table-origin="tableOrigin"
                :edit-flag="editFlag"
                :get-status-text="getStatusText"
                :decoder="decoder"
                :moment="moment"
                @action="decoder"
              />

              <activity-edit-content
                v-if="editFlag === true"
                :activity="editActivity"
                :areas="areas"
                :required-rule="requiredRule"
                :date-end-rule="dateEndRule"
                :edit-flag="editFlag"
                @action="decoder"
              />

              <v-row>
                <v-col cols="12">
                  <h3>
                    EVIDENCIAS
                  </h3>
                  <v-carousel>
                    <v-carousel-item
                      v-for="(item, i) in activity.evidenceLinks"
                      :key="i"
                      :src="getEvidenceUrl(item)"
                      reverse-transition="fade-transition"
                      transition="fade-transition"
                      contain
                    />
                  </v-carousel>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import ActivityEditContent from '../panelContents/ActivityEditContent'
import ActivityInfoContent from '../panelContents/ActivityInfoContent'
import ActivitiesAlumInfo from '../tables/ActivitiesAlumInfo'

export default {
  components: {
    ActivityEditContent,
    ActivityInfoContent,
    ActivitiesAlumInfo
  },

  props: {
    activitiesFlag: {
      type: Boolean,
      require: true
    },
    activities: {
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
      editActivity: {},
      validForm: false,
      activePanel: null, // Para el panel de alumnos
      activeActivityPanel: null, // Para el panel de actividades
      previousPanel: null,
      previousActivityPanel: null
    }
  },
  mounted () {
    this.previousPanel = this.activePanel
    this.previousActivityPanel = this.activeActivityPanel
  },

  methods: {
    decoder (data) {
      console.log('🚀 ~ decoder activities ~ data:', data)
      const { action, alum, activity } = data

      if (action === 'createContactDialog') {
        this.$emit('action', { action, alum, activity, origin: 'individual' })
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
        this.$emit('action', { action, data })
        this.editFlag = false
        this.editActivity = null
        return
      }

      if (action === 'rejectActivityDialog') {
        this.editFlag = false
        this.editActivity = null
        this.$emit('action', { action, activity })
        return
      }

      if (action === 'approveActivity') {
        this.editFlag = false
        this.editActivity = null
        const data = {
          observations: 'ACTIVIDAD APROBADA',
          status: 'approval'
        }
        this.$emit('action', { action, data, id: activity.id })
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
    },

    getEvidenceUrl (link) {
      return `http://localhost:5010${link}`
    },

    onPanelChange (newIndex) {
      if (this.editFlag) {
        const data = {
          color: 'red',
          type: 'error',
          message: 'GUARDA O CANCELA LA EDICIÓN ANTES DE CAMBIAR DE ACTIVIDAD'
        }
        this.$emit('action', { action: 'alert', data })
        // Evita el cambio de panel
        this.$nextTick(() => {
          this.activePanel = this.previousPanel
        })
      } else {
        this.previousPanel = newIndex
      }
    },

    onActivityPanelChange (newIndex) {
      if (this.editFlag) {
        const data = {
          color: 'red',
          type: 'error',
          message: 'GUARDA O CANCELA LA EDICIÓN ANTES DE CAMBIAR DE ACTIVIDAD'
        }
        this.$emit('action', { action: 'alert', data })
        // Evita el cambio de panel
        this.$nextTick(() => {
          this.activeActivityPanel = this.previousActivityPanel
        })
      } else {
        this.previousActivityPanel = newIndex
      }
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
