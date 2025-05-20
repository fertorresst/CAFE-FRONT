<template>
  <v-col cols="12">
    <v-row class="my-4" align="center" justify="center">
      <h2>
        ALUMNOS A CONTACTAR
      </h2>
    </v-row>

    <v-row align="center" justify="center">
      <contact-table
        :user-contact="userContact"
        :headers-contact="headersContact"
        :table-origin="tableOrigin"
        :footer-props="footerProps"
        @action="decoder"
      />
    </v-row>

    <v-row
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
      :validate-password="validatePassword"
      :mostrar-alerta="mostrarAlerta"
      @action="decoder"
    />

    <contact-update-dialog
      v-if="dialogUpdateContact"
      :contact-to-update="contactToUpdate"
      :required-rule="requiredRule"
      :validate-password="validatePassword"
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
      :collective-id="collectiveId"
      :required-rule="requiredRule"
      @action="decoder"
    />

    <activity-reject-dialog
      v-if="dialogRejectActivity"
      :activity="activity"
      :activity-id="activityId"
      :collective-id="collectiveId"
      :origin="origin"
      :required-rule="requiredRule"
      @action="decoder"
    />
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

moment.locale('es')

export default {
  components: { ActivityRejectDialog, ContactNewDialog, ActivitiesPanel, ContactUpdateDialog, ContactDeleteDialog, ContactInfoDialog, ContactTable },

  data () {
    return {
      moment,

      // DATOS DE ENTRADA
      periodId: '',
      adminId: 1,
      tableOrigin: '',
      period: {
        per_name: ''
      },

      panel: 0,

      // VARIABLE DE TABLAS
      footerProps: {
        'items-per-page-text': 'FILAS POR PÁGINA',
        'items-per-page-options': [5, 10, 15, 20, 25, 50, 100]
      },

      // TABLA DE CONTACTOS
      headersContact: [
        { text: 'ID', align: 'left', value: 'id', sortable: false },
        { text: 'NUA', align: 'left', value: 'user.nua', sortable: true },
        { text: 'NOMBRE', align: 'left', value: 'user.name', sortable: false },
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
      collectiveId: null,
      activity: {},

      areas: ['DP', 'RS', 'CEE', 'FCI', 'AC'],
      origin: '',

      // ACTIVIDADES INDIVIDUALES
      activitiesFlag: false,
      activities: [],
      dialogRejectActivity: false,

      // ACTIVIDADES COLECTIVAS
      collectivesFlag: false,
      collectives: []
    }
  },

  created () {
    this.periodId = this.$route.query.periodId
    this.tableOrigin = this.$route.query.tableOrigin

    if (!this.periodId || !this.tableOrigin) {
      this.$router.push({ name: 'periods' })
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

      if (data.action === 'cancel') {
        this.cancel()
        return
      }

      if (data.action === 'deleteContactTable') {
        this.deleteContactDialog(data.item)
        return
      }

      if (data.action === 'infoContactTable') {
        this.infoContactDialog(data.item)
        return
      }

      if (data.action === 'updateContactTable') {
        this.updateContactDialog(data.item)
        return
      }

      if (data.action === 'deleteContact') {
        this.deleteContact(data.id)
        return
      }

      if (data.action === 'updateContact') {
        this.updateContact(data.data)
        return
      }

      if (data.action === 'createContactDialog') {
        this.createContactDialog(data.alum.id, data.activity, data.origin)
        return
      }

      if (data.action === 'createContact') {
        this.createContact(data.data)
        const activityId = data.data.activityId
        const updateData = {
          observations: data.data.description,
          status: 'contacted'
        }
        this.changeStatusActivity(activityId, updateData)
        return
      }

      if (data.action === 'approveEdit') {
        if (data.origin === 'individual') {
          this.updateActivity(data.data)
        } else {
          this.updateCollective(data.data)
        }
        return
      }

      if (data.action === 'rejectActivityDialog') {
        this.rejectActivityDialog(data.activity, data.origin)
        return
      }

      if ((data.action === 'rejectActivity' || data.action === 'approveActivity') && data.origin === 'individual') {
        this.changeStatusActivity(data.id, data.data)
      }
    },

    // VALIDAR CONTRASEÑA
    async validatePassword (password) {
      try {
        const url = '/validate-password'
        const data = {
          user: this.$store.state.user,
          password
        }
        const res = await this.$axios.post(url, data)

        if (res.data.success) {
          return res.data.success
        }

        this.mostrarAlerta('red', 'error', res.data.message)
        return false
      } catch (error) {
        this.mostrarAlerta('red', 'error', 'OCURRIÓ UN ERROR AL VALIDAR LA CONTRASEÑA')
        // eslint-disable-next-line no-console
        console.error('Error:', error)
        return false
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
      this.collectiveId = null
      this.activity = {}
      this.origin = ''
    },

    cancel () {
      this.clean()
    },

    // CARGAR INFORMACIÓN DEL PERIODO
    async getPeriodInfo (periodId) {
      const url = `/get-period-info/${periodId}`
      await this.$axios.get(url)
        .then((res) => {
          if (res.data.success) {
            this.period = res.data.period
            this.mostrarAlerta('green', 'success', 'INFORMACIÓN DEL PERIODO CARGADA CORRECTAMENTE')
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('🚀 ~ getPeriodInfo ~ error', error)
          this.mostrarAlerta('red', 'error', 'ERROR AL CARGAR LA INFORMACIÓN DEL PERIODO')
        })
    },

    // CARGAR USUARIOS A CONTACTAR
    async getUserContact (periodId) {
      const url = `/get-contacts-by-period/${periodId}`
      await this.$axios.get(url)
        .then((res) => {
          if (res.data.success) {
            this.userContact = res.data.contacts
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('🚀 ~ getUserContact ~ error', error)
          this.mostrarAlerta('red', 'error', 'ERROR AL CARGAR LOS USUARIOS A CONTACTAR')
        })
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
      const url = `/delete-contact-by-id/${params}`
      await this.$axios.delete(url)
        .then((res) => {
          if (res.data.success) {
            this.mostrarAlerta('green', 'success', res.data.message)
            this.getUserContact(this.periodId)
          } else {
            this.mostrarAlerta('red', 'error', res.data.message)
          }
        })
        .catch((e) => {
          this.mostrarAlerta('red', 'error', 'OCURRIÓ UN ERROR AL ELIMINAR EL CONTACTO')
          // eslint-disable-next-line no-console
          console.log('🚀 ~ deleteContact ~ e: ', e)
        })
    },

    // DIALOG UPDATE CONTACT
    updateContactDialog (item) {
      this.contactToUpdate = item
      this.dialogUpdateContact = true
    },

    updateContact (data) {
      const url = '/update-contact'
      this.$axios.patch(url, data)
        .then((res) => {
          if (res.data.success) {
            this.mostrarAlerta('green', 'success', res.data.message)
            this.getUserContact(this.periodId)
          } else {
            this.mostrarAlerta('red', 'error', res.data.message)
          }
        })
        .catch((e) => {
          this.mostrarAlerta('red', 'error', 'OCURRIÓ UN ERROR AL ACTUALIZAR EL CONTACTO')
          // eslint-disable-next-line no-console
          console.log('🚀 ~ updateContact ~ e: ', e)
        })
    },

    // CARGAR ACTIVIDADES INDIVIDUALES
    loadActivities () {
      this.activitiesFlag = true
      this.collectivesFlag = false
      this.getActivities()
    },

    async getActivities () {
      const url = `/get-activities-by-period/${this.periodId}`
      await this.$axios.get(url)
        .then((res) => {
          if (res.data.success) {
            if (this.activities.length === 0 || !this.activities) {
              this.mostrarAlerta('green', 'success', res.data.message)
            }
            this.activities = res.data.data
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('🚀 ~ getActivities ~ error', error)
          this.mostrarAlerta('red', 'error', 'ERROR AL CARGAR LAS ACTIVIDADES INDIVIDUALES')
        })
    },

    // CREAR CONTACTO
    createContactDialog (userId, activity, origin) {
      this.userId = userId
      this.activity = activity
      if (origin === 'individual') {
        this.activityId = activity.id
      } else {
        this.collectiveId = activity.id
      }

      this.dialogCreateContact = true
    },

    async createContact (data) {
      const url = '/create-contact'
      await this.$axios.post(url, data)
        .then((res) => {
          if (res.data.success) {
            this.mostrarAlerta('green', 'success', res.data.message)
            this.getUserContact(this.periodId)
          } else {
            this.mostrarAlerta('red', 'error', res.data.message)
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('🚀 ~ createContact ~ error', error)
          this.mostrarAlerta('red', 'error', 'ERROR AL CREAR EL CONTACTO')
        })
    },

    // EDITAR ACTIVIDAD
    updateActivity (activityData) {
      const url = `/update-activity/${activityData.id}`
      this.$axios.put(url, activityData)
        .then((res) => {
          if (res.data.success) {
            this.mostrarAlerta('green', 'success', res.data.message)
            this.getActivities()
          } else {
            this.mostrarAlerta('red', 'error', res.data.message)
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('🚀 ~ updateActivity ~ error', error)
          this.mostrarAlerta('red', 'error', 'ERROR AL EDITAR LA ACTIVIDAD')
        })
    },

    // RECHAZAR ACTIVIDAD
    rejectActivityDialog (activity, origin) {
      if (origin === 'individual') {
        this.activityId = activity.id
      } else {
        this.collectiveId = activity.id
      }
      this.activity = activity
      this.origin = origin
      this.dialogRejectActivity = true
    },

    // CAMBIAR ESTADO DE LA ACTIVIDAD
    async changeStatusActivity (params, data) {
      const url = `/update-activity-status/${params}`
      await this.$axios.patch(url, data)
        .then((res) => {
          if (res.data.success) {
            this.getActivities()
          } else {
            this.mostrarAlerta('red', 'error', res.data.message)
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('🚀 ~ changeStatusActivity ~ error', error)
          this.mostrarAlerta('red', 'error', 'ERROR AL CAMBIAR EL ESTADO DE LA ACTIVIDAD')
        })
    },

    // CARGAR ACTIVIDADES COLECTIVAS
    loadCollectives () {
      this.activitiesFlag = false
      this.collectivesFlag = true
      this.getCollectives()
    },

    async getCollectives () {
      const url = `/get-collectives-by-period/${this.periodId}`
      await this.$axios.get(url)
        .then((res) => {
          if (res.data.success) {
            if (this.collectives.length === 0 || !this.collectives) {
              this.mostrarAlerta('green', 'success', res.data.message)
            }
            this.collectives = res.data.data
            console.log('🚀 ~ .then ~ this.collectives:', this.collectives)
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('🚀 ~ getCollectives ~ error', error)
          this.mostrarAlerta('red', 'error', 'ERROR AL CARGAR LAS ACTIVIDADES COLECTIVAS')
        })
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
