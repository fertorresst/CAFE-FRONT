<template>
  <v-col cols="12">
    <v-row align="center" justify="center">
      <h1 class="my-5">
        PERFILES DE ALUMNOS
      </h1>
    </v-row>

    <v-row align="center" justify="center">
      <v-btn
        elevation="0"
        class="rounded-pill mb-4"
        color="#fed55e"
        @click="newStudentDialog()"
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
        style="max-width:600px; width:100%; ba"
      />
    </v-row>

    <v-row align="center" justify="center">
      <v-expansion-panels
        v-model="activePanel"
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
                <activities-alum-info
                  :alum="alum"
                />
                <br>
                <ActivitiesAreasCountInfo
                  :activities="alum.activities"
                />

                <StudentAllActivities
                  :all-activities="alum.activities"
                  :footer-props="footerProps"
                  :moment="moment"
                />
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </v-col>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import StudentAllActivities from '../../../components/student/tables/StudentAllActivities'
import ActivitiesAreasCountInfo from '~/components/activities/tables/ActivitiesAreasCountInfo.vue'
import ActivitiesAlumInfo from '~/components/activities/tables/ActivitiesAlumInfo.vue'
moment.locale('es')

export default {
  components: {
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
      activePanel: 0,
      allStudentsWithActivities: [],
      studentSearch: '' // <-- variable para búsqueda
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

    async fetchAllStudentsWithActivities () {
      try {
        const res = await this.$axios.get('/users/students-with-activities', {
          withCredentials: true
        })
        if (res.data.success) {
          this.allStudentsWithActivities = res.data.students
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
