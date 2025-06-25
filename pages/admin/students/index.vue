<template>
  <v-col cols="12">
    <v-row align="center" justify="center">
      <h1 class="my-5">
        ACTIVIDADES ENVIADAS POR ALUMNO
      </h1>
    </v-row>

    <v-row align="center" justify="center">
      <v-btn
        elevation="0"
        class="rounded-pill mb-4"
        color="#fed55e"
        @click="registerStudentDialog()"
      >
        <strong>REGISTRAR NUEVO ALUMNO</strong>
      </v-btn>
    </v-row>

    <!-- Cuadro de búsqueda aquí -->
    <v-row align="center" justify="center" class="d-flex flex-column mt-12">
      <v-text-field
        v-model="studentSearch"
        label="BUSCAR ALUMNO POR NOMBRE O NUA"
        clearable
        prepend-inner-icon="mdi-magnify"
        outlined
        dense
        style="max-width:600px; width:100%;"
      />
    </v-row>

    <v-row align="center" justify="center">
      <v-expansion-panels
        focusable
      >
        <v-expansion-panel
          v-for="(alum, index) in filteredStudents"
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
                <v-row class="rounded-xl mt-2 text-center" style="border: black; border-width: 1px; border-style: solid;">
                  <v-col cols="12">
                    <activities-alum-info
                      :alum="alum"
                    />
                  </v-col>
                </v-row>

                <v-row class="rounded-xl mt-8 text-center" style="border: black; border-width: 1px; border-style: solid;">
                  <v-col cols="12">
                    <ActivitiesAreasCountInfo
                      :activities="alum.activities"
                    />
                  </v-col>
                </v-row>

                <!-- Filtros de actividades por alumno -->
                <v-row class="mt-12 py-0 px-6 mb-0 justify-center align-center border-top">
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="alum.activityNameFilter"
                      label="BUSCAR ACTIVIDAD POR NOMBRE"
                      clearable
                      prepend-inner-icon="mdi-magnify"
                      outlined
                      dense
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-select
                      v-model="alum.statusFilter"
                      :items="statusOptions"
                      label="FILTRAR POR ESTADO"
                      clearable
                      outlined
                      dense
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-select
                      v-model="alum.areaFilter"
                      :items="areaOptions"
                      label="FILTRAR POR ÁREA"
                      clearable
                      outlined
                      dense
                    />
                  </v-col>
                </v-row>

                <StudentAllActivities
                  :all-activities="filteredActivities(alum)"
                  :footer-props="footerProps"
                  :moment="moment"
                  @action="decoder"
                />
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>

    <StudentActivityInfoDialog
      v-model="dialogInfoActivity"
      :activity-info="activityInfo"
      :moment="moment"
      @action="decoder"
    />

    <StudentRegisterDialog
      :key="key.registerStudent"
      v-model="dialogRegisterStudent"
      @action="decoder"
    />

    <StudentActivityChangeStatus
      :key="key.changeStatus"
      v-model="dialogChangeStatus"
      :activity-change-status="activityChangeStatus"
      :areas="areaOptions"
      :required-rule="requiredRule"
      :date-end-rule="dateEndRule"
      @action="decoder"
    />
  </v-col>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import StudentActivityChangeStatus from '../../../components/student/dialogs/StudentActivityChangeStatus'
import StudentRegisterDialog from '../../../components/student/dialogs/StudentRegisterDialog'
import StudentActivityInfoDialog from '../../../components/student/dialogs/StudentActivityInfoDialog'
import StudentAllActivities from '../../../components/student/tables/StudentAllActivities'
import ActivitiesAreasCountInfo from '~/components/activities/tables/ActivitiesAreasCountInfo.vue'
import ActivitiesAlumInfo from '~/components/activities/tables/ActivitiesAlumInfo.vue'
moment.locale('es')

export default {
  components: {
    StudentActivityChangeStatus,
    StudentRegisterDialog,
    StudentActivityInfoDialog,
    StudentAllActivities,
    ActivitiesAreasCountInfo,
    ActivitiesAlumInfo
  },

  layout: 'admin',

  middleware: 'auth-admin',

  data () {
    return {
      moment,
      footerProps: {
        'items-per-page-options': [5, 10, 15, 20],
        'items-per-page-text': 'FILAS POR PÁGINA',
        'show-current-page': true,
        'show-first-last-page': true,
        'show-page-size-options': true,
        'show-rows-per-page': true,
        'show-select': true
      },
      allStudentsWithActivities: [],
      studentSearch: '',
      statusOptions: [
        { text: 'PENDIENTES', value: 'pending' },
        { text: 'CONTACTADAS', value: 'contacted' },
        { text: 'APROBADAS', value: 'approval' },
        { text: 'RECHAZADAS', value: 'rejected' }
      ],
      areaOptions: [
        { text: 'DP/VSS', value: 'DP/VSS' },
        { text: 'RS/VCI', value: 'RS/VCI' },
        { text: 'CEE/EIE', value: 'CEE/EIE' },
        { text: 'FCI/ICP', value: 'FCI/ICP' },
        { text: 'AC', value: 'AC' }
      ],

      // INFO DIALOG
      dialogInfoActivity: false,
      activityInfo: {},

      // DIALOG REGISTRO ALUMNO
      dialogRegisterStudent: false,

      // DIALOG CHANGE STATUS
      dialogChangeStatus: false,
      activityChangeStatus: {},

      // RULES
      dateEndRule: (value, dateStart) => {
        return value > dateStart || 'LA FECHA DE FIN DEBE SER MAYOR A LA FECHA DE INICIO'
      },
      requiredRule: value => !!value || 'ESTE CAMPO ES REQUERIDO',

      // KEY PARA COMPONENTES
      keyCounter: 1,
      key: {
        registerStudent: 1,
        changeStatus: 2
      }
    }
  },

  computed: {
    ...mapState({
      showAlert: state => state.showAlert,
      admin: state => state.admin
    }),
    isSuperadmin () {
      return this.admin.role === 'superadmin'
    },
    isAdmin () {
      return this.admin.role === 'admin'
    },
    isValidador () {
      return this.admin.role === 'validador'
    },
    isConsulta () {
      return this.admin.role === 'consulta'
    },
    filteredStudents () {
      const search = this.studentSearch.trim().toLowerCase()
      if (!search) { return this.allStudentsWithActivities }
      return this.allStudentsWithActivities.filter((student) => {
        const fullName = student.fullName.toLowerCase()
        return (
          fullName.includes(search) ||
          String(student.nua).includes(search)
        )
      })
    }
  },

  watch: {
    showAlert () {}
  },

  created () {
    if (!(this.isSuperadmin || this.isAdmin)) {
      this.$router.push('/admin/periods')
    }
  },

  mounted () {
    this.fetchAllStudentsWithActivities()
  },

  methods: {
    // ALERTAS
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

    // DECODIFICADOR DE COMPONENTES
    decoder (data) {
      console.log('🚀 ~ decoder ~ data:', data)
      switch (data.action) {
        case 'cancel':
          this.clean()
          break
        case 'activityInfoDialog':
          this.activityInfoDialog(data.item)
          break
        case 'createUser':
          this.createUser(data.data)
          break
        case 'activityChangeStatusDialog':
          this.activityChangeStatusDialog(data.item)
          break
        case 'updateStatus':
          this.updateActivity(data.data.activity)
          this.updateStatus(data.data)
          if (data.data.contactId) {
            this.updateContact(data.data)
          }
          break
        default:
          console.warn('Acción no reconocida:', data.action)
      }
    },

    // Limpia los filtros y el estado del componente
    clean () {
      this.keyCounter = Date.now() + Math.random()
      if (this.dialogInfoActivity) {
        this.dialogInfoActivity = false
        this.activityInfo = {}
      }
      if (this.dialogRegisterStudent) {
        this.dialogRegisterStudent = false
        this.key.registerStudent = this.keyCounter++
      }
      if (this.dialogChangeStatus) {
        this.dialogChangeStatus = false
        this.activityChangeStatus = {}
        this.key.changeStatus = this.keyCounter++
      }
    },

    async fetchAllStudentsWithActivities () {
      try {
        const res = await this.$axios.get('/users/students-with-activities', {
          withCredentials: true
        })
        if (res.data.success) {
          // Inicializa los filtros por alumno
          this.allStudentsWithActivities = res.data.students.map(alum => ({
            ...alum,
            activityNameFilter: '',
            statusFilter: null,
            areaFilter: null
          }))
        } else {
          this.$store.dispatch('mostrarAlerta', {
            color: 'red',
            type: 'error',
            message: res.data.message || 'Error al obtener los alumnos con actividades.'
          })
        }
      } catch (error) {
        console.error('Error fetching students with activities:', error)
        this.$store.dispatch('mostrarAlerta', {
          color: 'red',
          type: 'error',
          message: 'Error al obtener los alumnos con actividades.'
        })
      }
    },

    newStudentDialog () {
    },

    // Filtra las actividades de cada alumno según los filtros seleccionados
    filteredActivities (alum) {
      let filtered = alum.activities

      if (alum.activityNameFilter && alum.activityNameFilter.trim()) {
        const nameSearch = alum.activityNameFilter.trim().toLowerCase()
        filtered = filtered.filter(act =>
          act.name && act.name.toLowerCase().includes(nameSearch)
        )
      }

      if (alum.statusFilter) {
        filtered = filtered.filter(act => act.status === alum.statusFilter)
      }

      if (alum.areaFilter) {
        filtered = filtered.filter(act =>
          act.area && act.area === alum.areaFilter
        )
      }

      return filtered
    },

    // Funciones para determinar el estilo del encabezado
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

    // Abre el diálogo de información de actividad
    activityInfoDialog (activity) {
      this.activityInfo = {
        ...activity,
        startDate: activity.dateStart,
        endDate: activity.dateEnd
      }
      this.dialogInfoActivity = true
    },

    // Abre el diálogo de registro de nuevo alumno
    registerStudentDialog () {
      this.dialogRegisterStudent = true
    },

    async createUser (data) {
      try {
        const res = await this.$axios.post('/users/create-user', data)
        if (res.data.success) {
          this.mostrarAlerta('green', 'success', res.data.message)
          this.clean()
        } else {
          this.mostrarAlerta('red', 'error', res.data.message)
        }
      } catch (e) {
        this.mostrarAlerta('red', 'error', 'ERROR AL CREAR USUARIO. ERROR INTERNO DEL SERVIDOR.')
      }
    },

    // Abre el diálogo para cambiar el estado de la actividad
    activityChangeStatusDialog (activity) {
      this.activityChangeStatus = {
        ...activity,
        startDate: activity.dateStart,
        endDate: activity.dateEnd
      }
      this.dialogChangeStatus = true
    },

    async updateActivity (data) {
      try {
        const params = data.id
        const url = `/activities/update-activity/${params}`
        const res = await this.$axios.put(url, data, { withCredentials: true })
        if (!res.data.success) {
          this.mostrarAlerta('red', 'error', res.data.message)
        }
      } catch (e) {
        console.error('Error al actualizar la actividad:', e)
        this.mostrarAlerta('red', 'error', 'ERROR AL ACTUALIZAR LA ACTIVIDAD. ERROR INTERNO DEL SERVIDOR.')
      }
    },

    async updateStatus (data) {
      try {
        data.lastAdminId = this.admin.id

        const params = data.activityId
        const url = `/activities/update-activity-status/${params}`
        const res = await this.$axios.patch(url, data, { withCredentials: true })
        if (res.data.success) {
          this.mostrarAlerta('green', 'success', res.data.message)
          this.clean()
          this.fetchAllStudentsWithActivities()
        } else {
          this.mostrarAlerta('red', 'error', res.data.message)
        }
      } catch (e) {
        console.error('Error al cambiar el estado de la actividad:', e)
        this.mostrarAlerta('red', 'error', 'ERROR AL CAMBIAR EL ESTADO DE LA ACTIVIDAD. ERROR INTERNO DEL SERVIDOR.')
      }
    },

    async updateContact (data) {
      try {
        const body = {
          id: data.contactId,
          observations: data.observations,
          status: 'resolved',
          lastAdminId: this.admin.id
        }

        const url = '/contacts/update-contact'
        const res = await this.$axios.patch(url, body, { withCredentials: true })
        if (!res.data.success) {
          this.mostrarAlerta('red', 'error', res.data.message || 'OCURRIÓ UN ERROR AL ACTUALIZAR EL CONTACTO')
        }
      } catch (e) {
        this.mostrarAlerta('red', 'error', e.response?.data?.message || 'OCURRIÓ UN ERROR AL ACTUALIZAR EL CONTACTO')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>
