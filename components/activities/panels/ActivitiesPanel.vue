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
      <v-expansion-panel-header
          :class="[
          getHeaderClass(alum),
          getHeaderTextClass(alum)
        ]"
      >
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
            <br>
            <ActivitiesAreasCountInfo
              :activities="alum.activities"
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
                  <v-carousel content>
                    <v-carousel-item
                      v-for="(item, i) in activity.evidenceLinks || []"
                      :key="i"
                    >
                      <div style="position: relative;">
                        <img
                          :src="getEvidenceUrl(item)"
                          class="carousel-img"
                        />
                        <v-btn
                          small
                          icon
                          color="primary"
                          style="position: absolute; top: 10px; right: 10px; z-index: 2;"
                          @click="openZoom(getEvidenceUrl(item))"
                        >
                          <v-icon>mdi-magnify-plus</v-icon>
                        </v-btn>
                      </div>
                    </v-carousel-item>
                  </v-carousel>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-dialog v-model="zoomDialog" max-width="100%" max-height="100%" persistent>
      <v-card>
        <v-card-title>
          <span>Zoom de evidencia</span>
          <v-spacer />
          <v-btn icon @click="zoomDialog = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-card-text>
          <div
            style="position: relative; display: flex; justify-content: center;"
          >
            <img
              :src="zoomImage"
              ref="zoomImg"
              style="max-width: 400px; width: 100%;"
              @mousemove="onZoomMove"
              @mouseleave="onZoomLeave"
            />
            <!-- Lupa dinámica -->
            <div
              v-if="zoomCursor.x !== null"
              :style="zoomLensStyle"
            >
              <img
                :src="zoomImage"
                :style="zoomedImgStyle"
              />
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-expansion-panels>
</template>

<script>
import ActivitiesAreasCountInfo from '../tables/ActivitiesAreasCountInfo'
import ActivityEditContent from '../panelContents/ActivityEditContent'
import ActivityInfoContent from '../panelContents/ActivityInfoContent'
import ActivitiesAlumInfo from '../tables/ActivitiesAlumInfo'

export default {
  components: {
    ActivitiesAreasCountInfo,
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
      previousActivityPanel: null,
      zoomDialog: false,
      zoomImage: '',
      zoomCursor: { x: 0, y: 0 }
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
    },

    getHeaderClass (alum) {
      const statuses = alum.activities.map(a => a.status)
      if (statuses.every(s => s === 'pending')) {
        return 'header-blue'
      }
      if (statuses.includes('contacted')) {
        return 'header-warning'
      }
      if (statuses.every(s => ['approval', 'rejected'].includes(s))) {
        return 'header-success'
      }
      return 'header-blue'
    },

    getHeaderTextClass (alum) {
      const statuses = alum.activities.map(a => a.status)
      if (statuses.includes('contacted')) {
        return 'header-warning-text'
      }
      if (statuses.every(s => ['approval', 'rejected'].includes(s))) {
        return 'header-success-text'
      }
      return 'white--text'
    },

    openZoom (img) {
      this.zoomImage = img
      this.zoomDialog = true
      this.zoomCursor = { x: null, y: null }
    },

    onZoomMove (e) {
      const rect = this.$refs.zoomImg.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      this.zoomCursor = { x, y, rect }
    },

    onZoomLeave () {
      this.zoomCursor = { x: null, y: null }
    }
  },

  computed: {
    zoomLensStyle () {
      if (!this.zoomCursor.x) { return {} }
      const size = 400
      const left = this.zoomCursor.x - size / 2.5
      const top = this.zoomCursor.y - size / 2.5
      return {
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: `${size}px`,
        height: `${size}px`,
        border: '2px solid #1976d2',
        borderRadius: '25%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 10,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }
    },
    zoomedImgStyle () {
      if (!this.zoomCursor.x) { return {} }
      const size = 120
      const zoom = 2.5
      const x = this.zoomCursor.x
      const y = this.zoomCursor.y
      return {
        position: 'absolute',
        left: `${-x * zoom + size / 2}px`,
        top: `${-y * zoom + size / 2}px`,
        width: `${this.zoomCursor.rect.width * zoom}px`,
        height: `${this.zoomCursor.rect.height * zoom}px`
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

.header-blue {
  background-color: #07538a !important;
  color: #fff !important;
}
.header-warning {
  background-color: #FFC107 !important;
}
.header-warning-text {
  color: #222 !important;
}
.header-success {
  background-color: #43a047 !important; /* Verde */
}
.header-success-text {
  color: #e8f5e9 !important; /* Verde muy claro para contraste */
}

/* Cambia el color del icono de despliegue solo para warning */
::v-deep .header-warning .v-expansion-panel-header__icon .v-icon {
  color: #222 !important;
}
/* Cambia el color del icono de despliegue solo para success */
::v-deep .header-success .v-expansion-panel-header__icon .v-icon {
  color: #e8f5e9 !important;
}

.carousel-img {
  width: 780px; /* Ancho máximo de la imagen */
  height: 500px; /* Puedes ajustar este valor según tu diseño */
  object-fit: contain;
  background: #f5f5f5; /* Opcional: para que se note el área vacía */
  display: block;
  margin: 0 auto;
}
</style>
