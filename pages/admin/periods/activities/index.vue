<template>
  <v-col cols="12">
    <v-row class="my-4" align="center" style="position: relative; min-height: 56px;">
      <!-- Botón de regreso a la izquierda -->
      <v-col cols="auto" class="d-flex align-center" style="position: absolute; left: 0; z-index: 10;">
        <v-tooltip color="primary" bottom>
          <template #activator="{ on, attrs }">
            <v-btn
              icon
              color="primary"
              v-bind="attrs"
              class="mr-2"
              v-on="on"
              @click="$router.push('/admin/periods')"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </template>
          <span>REGRESAR A PERIODOS</span>
        </v-tooltip>
      </v-col>

      <!-- Título centrado absolutamente -->
      <v-col v-if="!isConsulta" cols="12" class="pa-0">
        <div style="display: flex; justify-content: center; align-items: center; height: 56px; position: relative;">
          <h2 class="mb-0" style="text-align: center;">
            ALUMNOS A CONTACTAR
          </h2>
          <!-- Botón de ayuda (posición absoluta) -->
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                icon
                small
                color="info"
                style="position: absolute; right: 16px;"
                v-bind="attrs"
                v-on="on"
                @click="dialogLegend = true"
              >
                <v-icon>mdi-help-circle-outline</v-icon>
              </v-btn>
            </template>
            <span>Ver ayuda</span>
          </v-tooltip>
        </div>
      </v-col>

      <v-col v-else cols="12" class="pa-0">
        <div style="display: flex; justify-content: center; align-items: center; height: 56px; position: relative;">
          <h2 class="mb-0" style="text-align: center;">
            ACTIVIDADES ENVIADAS POR LOS ALUMNOS EN EL PERIODO
            <br>
            {{ period.per_name.toUpperCase() }}
          </h2>
          <!-- Botón de ayuda (posición absoluta) -->
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                icon
                small
                color="info"
                style="position: absolute; right: 16px;"
                v-bind="attrs"
                v-on="on"
                @click="dialogLegend = true"
              >
                <v-icon>mdi-help-circle-outline</v-icon>
              </v-btn>
            </template>
            <span>Ver ayuda</span>
          </v-tooltip>
        </div>
      </v-col>
    </v-row>

    <v-row v-if="!isConsulta" align="center" justify="center">
      <contact-table
        :user-contact="userContact"
        :headers-contact="headersContact"
        :table-origin="tableOrigin"
        :footer-props="footerProps"
        @action="decoder"
      />
    </v-row>

    <v-row
      v-if="!isConsulta"
      class="text-center d-flex justify-center align-center mt-15 mb-4"
    >
      <h4
        v-if="tableOrigin === 'active'"
      >
        PERIODO ACTIVO, SE MOSTRARÁN LAS ACTIVIDADES EN MODO DE VISUALIZACIÓN, PARA COMENZAR REVISIÓN ES NECESARIO MARCAR EL PERIODO COMO 'PENDIENTE DE REVISIÓN'
      </h4>

      <h2
        v-else
      >
        ACTIVIDADES ENVIADAS POR LOS ALUMNOS EN EL PERIODO
        <br>
        {{ period.per_name.toUpperCase() }}
      </h2>
    </v-row>

    <v-row align="center" justify="center">
      <activities-panel
        :activities="activities"
        :areas="areas"
        :table-origin="tableOrigin"
        :required-rule="requiredRule"
        :date-end-rule="dateEndRule"
        :moment="moment"
        @action="decoder"
      />
    </v-row>

    <contact-info-dialog
      v-if="dialogInfoContact"
      :contact-to-info="contactToInfo"
      :moment="moment"
      @action="decoder"
    />

    <contact-delete-dialog
      v-if="dialogDeleteContact"
      :contact-to-delete="contactToDelete"
      :required-rule="requiredRule"
      :mostrar-alerta="mostrarAlerta"
      @action="decoder"
    />

    <contact-update-dialog
      v-if="dialogUpdateContact"
      :contact-to-update="contactToUpdate"
      :required-rule="requiredRule"
      :mostrar-alerta="mostrarAlerta"
      @action="decoder"
    />

    <contact-new-dialog
      v-if="dialogCreateContact"
      :user-id="userId"
      :admin-id="adminId"
      :period-id="periodId"
      :activity="activity"
      :activity-id="activityId"
      :required-rule="requiredRule"
      @action="decoder"
    />

    <activity-reject-dialog
      v-if="dialogRejectActivity"
      :activity="activity"
      :activity-id="activityId"
      :required-rule="requiredRule"
      @action="decoder"
    />

    <!-- Modal de ayuda -->
    <LegendHelpDialog v-model="dialogLegend" page="activities" />
  </v-col>
</template>

<script>
import moment from 'moment'
import ActivityRejectDialog from '../../../../components/activities/dialogs/ActivityRejectDialog'
import ContactNewDialog from '../../../../components/activities/dialogs/ContactNewDialog'
import ActivitiesPanel from '../../../../components/activities/panels/ActivitiesPanel'
import ContactUpdateDialog from '../../../../components/activities/dialogs/ContactUpdateDialog'
import ContactDeleteDialog from '../../../../components/activities/dialogs/ContactDeleteDialog'
import ContactInfoDialog from '../../../../components/activities/dialogs/ContactInfoDialog'
import ContactTable from '../../../../components/activities/tables/ContactTable'
import LegendHelpDialog from '../../../../components/shared/LegendHelpDialog'

moment.locale('es')

export default {
  components: { ActivityRejectDialog, ContactNewDialog, ActivitiesPanel, ContactUpdateDialog, ContactDeleteDialog, ContactInfoDialog, ContactTable, LegendHelpDialog },

  layout: 'admin',

  middleware: 'auth-admin',

  data () {
    return {
      moment,

      // DATOS DE ENTRADA
      periodId: '',
      adminId: null,
      tableOrigin: '',
      period: {
        per_name: ''
      },

      panel: 0,

      // VARIABLE DE TABLAS
      footerProps: {
        'items-per-page-options': [5, 10, 15, 20],
        'items-per-page-text': 'FILAS POR PÁGINA',
        'show-current-page': true,
        'show-first-last-page': true,
        'show-page-size-options': true,
        'show-rows-per-page': true,
        'show-select': true
      },

      // TABLA DE CONTACTOS
      headersContact: [
        { text: 'NUA', align: 'left', value: 'user.nua', sortable: true },
        { text: 'NOMBRE', align: 'left', value: 'user.name', sortable: false },
        { text: 'ACTIVIDAD', align: 'left', value: 'relatedItem.name', sortable: true },
        { text: 'DESCRIPCIÓN DEL CONTACTO', align: 'left', value: 'description', sortable: false },
        { text: 'ESTADO', align: 'center', value: 'status', sortable: true },
        { text: 'ACCIONES', align: 'center', value: 'actions', sortable: false }
      ],
      userContact: [],

      // REGLAS
      requiredRule: value => !!value || 'ESTE CAMPO ES REQUERIDO',
      dateEndRule: (value, dateStart) => {
        return value > dateStart || 'LA FECHA DE FIN DEBE SER MAYOR A LA FECHA DE INICIO'
      },

      // DIALOG INFO CONTACTO
      dialogInfoContact: false,
      contactToInfo: [],

      // DIALOG DELETE CONTACT
      dialogDeleteContact: false,
      contactToDelete: [],

      // DIALOG UPDATE CONTACT
      dialogUpdateContact: false,
      contactToUpdate: [],

      // DIALOG CREATE CONTACT
      dialogCreateContact: false,
      userId: null,
      activityId: null,
      activity: {},

      areas: ['DP/VSS', 'RS/VCI', 'CEE/EIE', 'FCI/ICP', 'AC'],

      // ACTIVIDADES INDIVIDUALES
      activities: [],
      dialogRejectActivity: false,

      // DIALOG LEYENDA DE AYUDA
      dialogLegend: false
    }
  },

  computed: {
    isSuperadmin () {
      return this.$store.state.admin.role === 'superadmin'
    },
    isAdmin () {
      return this.$store.state.admin.role === 'admin'
    },
    isValidador () {
      return this.$store.state.admin.role === 'validador'
    },
    isConsulta () {
      return this.$store.state.admin.role === 'consulta'
    }
  },

  created () {
    this.periodId = this.$route.query.periodId
    this.tableOrigin = this.$route.query.tableOrigin
    this.adminId = this.$store.state.admin?.id || null

    if (!this.periodId || !this.tableOrigin) {
      this.$router.push('/admin/periods')
      this.mostrarAlerta('red', 'error', 'PERIODO O TABLA DE ORIGEN NO ESPECIFICADOS')
    } else {
      this.getPeriodInfo(this.periodId)
      this.getUserContact(this.periodId)
    }
  },

  mounted () {
    this.loadActivities()
  },

  methods: {
    mostrarAlerta (color, type, message) {
      this.$store.commit('modifyAlert', true)
      this.$store.commit('modifyColor', `${color} lighten-2`)
      this.$store.commit('modifyIcon', color === 'green' ? 'mdi-check-circle' : 'mdi-close-circle')
      this.$store.commit('modifyType', type)
      this.$store.commit('modifyText', message)
      setTimeout(() => {
        this.$store.commit('modifyAlert', false)
      }, 3000)
    },

    // EMITS DE LOS COMPONENTES
    decoder (data) {
      console.log('🚀 ~ decoder index ~ data:', data)
      switch (data.action) {
        case 'alert':
          this.mostrarAlerta(data.data.color, data.data.type, data.data.message)
          break
        case 'cancel':
          this.cancel()
          break
        case 'deleteContactTable':
          this.deleteContactDialog(data.item)
          break
        case 'infoContactTable':
          this.infoContactDialog(data.item)
          break
        case 'updateContactTable':
          this.updateContactDialog(data.item)
          break
        case 'deleteContact':
          this.deleteContact(data.data.contactId)
          this.changeStatusActivity(data.data.activityId, { status: 'pending' })
          break
        case 'updateContact': {
          const dataContact = {
            id: data.data.idContact,
            observations: data.data.observations,
            status: data.data.statusContact,
            lastAdminId: this.adminId
          }
          this.updateContact(dataContact)

          const dataActivity = {
            observations: data.data.observations,
            status: data.data.statusActivity,
            lastAdminId: this.adminId
          }
          const params = data.data.idActivity
          this.changeStatusActivity(params, dataActivity)
          break
        }
        case 'createContactDialog':
          this.createContactDialog(data.alum.id, data.activity)
          break
        case 'createContact': {
          this.createContact(data.data)
          const activityId = data.data.activityId
          const updateData = {
            observations: data.data.description,
            status: 'contacted'
          }
          this.changeStatusActivity(activityId, updateData)
          break
        }
        case 'approveEdit':
          this.updateActivity(data.data)
          break
        case 'rejectActivityDialog':
          this.rejectActivityDialog(data.activity)
          break
        case 'rejectActivity':
        case 'approveActivity':
          this.changeStatusActivity(data.id, data.data)
          break
        default:
          this.mostrarAlerta('red', 'error', 'ACCIÓN NO VÁLIDA')
          break
      }
    },

    // REINICIAR LAS VARIABLES
    clean () {
      // DIALOGS
      this.dialogInfoContact = false
      this.dialogDeleteContact = false
      this.dialogUpdateContact = false
      this.dialogCreateContact = false
      this.dialogRejectActivity = false

      // VARIABLES
      this.contactToInfo = []
      this.contactToDelete = []
      this.contactToUpdate = []
      this.userId = null
      this.activityId = null
      this.activity = {}
    },

    cancel () {
      this.clean()
    },

    // CARGAR INFORMACIÓN DEL PERIODO
    async getPeriodInfo (periodId) {
      const url = `/periods/get-period-info/${periodId}`
      try {
        const res = await this.$axios.get(url)
        if (res.data.success) {
          this.period = res.data.period
          this.mostrarAlerta('green', 'success', 'INFORMACIÓN DEL PERIODO CARGADA CORRECTAMENTE')
        } else {
          this.mostrarAlerta('red', 'error', res.data.message || 'ERROR AL CARGAR LA INFORMACIÓN DEL PERIODO')
        }
      } catch (error) {
        this.mostrarAlerta('red', 'error', error.response?.data?.message || 'ERROR AL CARGAR LA INFORMACIÓN DEL PERIODO')
      }
    },

    // CARGAR USUARIOS A CONTACTAR
    async getUserContact (periodId) {
      const adminRole = this.$store.state.admin.role
      const adminId = this.$store.state.admin.id
      const url = `/contacts/get-contacts-by-period/${periodId}?role=${adminRole}&adminId=${adminId}`
      try {
        const res = await this.$axios.get(url)
        if (res.data.success) {
          this.userContact = res.data.contacts
        } else {
          this.mostrarAlerta('red', 'error', res.data.message || 'ERROR AL CARGAR LOS USUARIOS A CONTACTAR')
        }
      } catch (error) {
        this.mostrarAlerta('red', 'error', error.response?.data?.message || 'ERROR AL CARGAR LOS USUARIOS A CONTACTAR')
      }
    },

    // DIALOG INFO CONTACTO
    infoContactDialog (item) {
      this.contactToInfo = item
      this.dialogInfoContact = true
    },

    // DIALOG DELETE CONTACT
    deleteContactDialog (item) {
      this.contactToDelete = item
      this.dialogDeleteContact = true
    },

    async deleteContact (params) {
      const url = `/contacts/delete-contact-by-id/${params}`
      try {
        const res = await this.$axios.delete(url)
        if (res.data.success) {
          this.mostrarAlerta('green', 'success', res.data.message)
          this.getUserContact(this.periodId)
        } else {
          this.mostrarAlerta('red', 'error', res.data.message || 'OCURRIÓ UN ERROR AL ELIMINAR EL CONTACTO')
        }
      } catch (e) {
        this.mostrarAlerta('red', 'error', e.response?.data?.message || 'OCURRIÓ UN ERROR AL ELIMINAR EL CONTACTO')
      }
    },

    // DIALOG UPDATE CONTACT
    updateContactDialog (item) {
      this.contactToUpdate = item
      this.dialogUpdateContact = true
    },

    async updateContact (data) {
      const url = '/contacts/update-contact'
      data.lastAdminId = this.adminId
      try {
        const res = await this.$axios.patch(url, data)
        if (res.data.success) {
          this.mostrarAlerta('green', 'success', res.data.message)
          this.getUserContact(this.periodId)
        } else {
          this.mostrarAlerta('red', 'error', res.data.message || 'OCURRIÓ UN ERROR AL ACTUALIZAR EL CONTACTO')
        }
      } catch (e) {
        this.mostrarAlerta('red', 'error', e.response?.data?.message || 'OCURRIÓ UN ERROR AL ACTUALIZAR EL CONTACTO')
      }
    },

    // CARGAR ACTIVIDADES INDIVIDUALES
    loadActivities () {
      this.getActivities()
    },

    async getActivities () {
      const url = `/activities/get-activities-by-period/${this.periodId}`
      try {
        const res = await this.$axios.get(url)
        if (res.data.success) {
          if (this.activities.length === 0 || !this.activities) {
            this.mostrarAlerta('green', 'success', res.data.message)
          }
          this.activities = res.data.data
          console.log('🚀 ~ getActivities ~ this.activities:', this.activities)
        } else {
          this.mostrarAlerta('red', 'error', res.data.message || 'ERROR AL CARGAR LAS ACTIVIDADES INDIVIDUALES')
        }
      } catch (error) {
        this.mostrarAlerta('red', 'error', error.response?.data?.message || 'ERROR AL CARGAR LAS ACTIVIDADES INDIVIDUALES')
      }
    },

    // CREAR CONTACTO
    createContactDialog (userId, activity) {
      this.userId = userId
      this.activity = activity
      this.activityId = activity.id

      this.dialogCreateContact = true
    },

    async createContact (data) {
      const url = '/contacts/create-contact'
      try {
        const res = await this.$axios.post(url, data)
        if (res.data.success) {
          this.mostrarAlerta('green', 'success', res.data.message)
          this.getUserContact(this.periodId)
        } else {
          this.mostrarAlerta('red', 'error', res.data.message || 'ERROR AL CREAR EL CONTACTO')
        }
      } catch (error) {
        this.mostrarAlerta('red', 'error', error.response?.data?.message || 'ERROR AL CREAR EL CONTACTO')
      }
    },

    // EDITAR ACTIVIDAD
    async updateActivity (activityData) {
      const url = `/activities/update-activity/${activityData.id}`
      activityData.lastAdminId = this.adminId
      try {
        const res = await this.$axios.put(url, activityData)
        if (res.data.success) {
          this.mostrarAlerta('green', 'success', res.data.message)
          this.getActivities()
        } else {
          this.mostrarAlerta('red', 'error', res.data.message || 'ERROR AL EDITAR LA ACTIVIDAD')
        }
      } catch (error) {
        this.mostrarAlerta('red', 'error', error.response?.data?.message || 'ERROR AL EDITAR LA ACTIVIDAD')
      }
    },

    // RECHAZAR ACTIVIDAD
    rejectActivityDialog (activity) {
      this.activityId = activity.id
      this.activity = activity

      this.dialogRejectActivity = true
    },

    // CAMBIAR ESTADO DE LA ACTIVIDAD
    async changeStatusActivity (params, data) {
      const url = `/activities/update-activity-status/${params}`
      data.lastAdminId = this.adminId
      try {
        const res = await this.$axios.patch(url, data)
        if (res.data.success) {
          // Recarga todas las actividades para asegurar reactividad
          await this.getActivities()
        } else {
          this.mostrarAlerta('red', 'error', res.data.message || 'ERROR AL CAMBIAR EL ESTADO DE LA ACTIVIDAD')
        }
      } catch (error) {
        this.mostrarAlerta('red', 'error', error.response?.data?.message || 'ERROR AL CAMBIAR EL ESTADO DE LA ACTIVIDAD')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .v-data-table {
  border-radius: 5px !important;
  overflow: hidden !important;
  font-family: 'Gandhi Sans', sans-serif !important;
}

::v-deep .v-data-table-header {
  background-color: #a3915f !important;
  border-radius: 20px !important;
  font-family: 'Novecento Wide', sans-serif !important;
}

::v-deep .v-data-table-header th {
  color: white !important;
  font-family: 'Novecento Wide', sans-serif !important;
  font-size: 14px !important;
}

::v-deep .v-data-table-header th.sortable {
  color: white !important;
}

::v-deep .v-expansion-panel-header__icon .v-icon {
  color: white !important;
}

::v-deep .v-data-table tbody td {
  font-family: 'Gandhi Sans', sans-serif !important;
}
</style>
