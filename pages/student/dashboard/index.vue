<template>
  <v-col cols="12">
    <v-row align="center" justify="center">
      <h1 class="my-5">
        ACTIVIDADES ENVIADAS
      </h1>
    </v-row>

    <v-row align="center" justify="center">
      <v-btn
        elevation="0"
        class="rounded-pill mb-4"
        color="#fed55e"
        @click="sendActivityDialog()"
      >
        <strong>ENVIAR ACTIVIDADES</strong>
      </v-btn>
    </v-row>

    <v-row align="center" justify="center">
      <StudentActivitiesPanel
        v-if="sendActivities.length"
        :send-activities="sendActivities"
        :areas="areas"
        :required-rule="requiredRule"
        :date-end-rule="dateEndRule"
        :files-limit-rule="filesLimitRule"
        :get-send-activities="getSendActivities"
        :mostrar-alerta="mostrarAlerta"
        :footer-props="footerProps"
        :moment="moment"
        @action="decoder"
      />

      <h4
        v-else
        class="text-center my-5"
      >
        AUN NO ENVÍAS NINGUNA ACTIVIDAD
        <br>
        DA CLICK EN EL BOTÓN DE ARRIBA PARA ENVIAR UNA ACTIVIDAD
      </h4>
    </v-row>

    <StudentSendActivitiesDialog
      v-if="sendActivitiesDialog"
      :areas="areas"
      :date-end-rule="dateEndRule"
      :required-rule="requiredRule"
      :files-limit-rule="filesLimitRule"
      :mostrar-alerta="mostrarAlerta"
      :get-send-activities="getSendActivities"
      :moment="moment"
      @action="decoder"
    />
  </v-col>
</template>

<script>
import moment from 'moment'
import StudentSendActivitiesDialog from '../../../components/student/dialogs/StudentSendActivitiesDialog'
import StudentActivitiesPanel from '../../../components/student/panels/StudentActivitiesPanel'
moment.locale('es')

export default {
  components: { StudentSendActivitiesDialog, StudentActivitiesPanel },

  layout: 'student',

  middleware: 'auth-student',

  data () {
    return {
      moment,
      sendActivities: [],
      footerProps: {
        'items-per-page-options': [5, 10, 15, 20],
        'items-per-page-text': 'FILAS POR PÁGINA',
        'show-current-page': true,
        'show-first-last-page': true,
        'show-page-size-options': true,
        'show-rows-per-page': true,
        'show-select': true
      },

      areas: ['DP', 'RS', 'CEE', 'FCI', 'AC'],

      // REGLAS
      dateEndRule: (value, dateStart) => {
        return value >= dateStart ||
        'LA FECHA DE FIN DEBE SER MAYOR O IGUAL A LA FECHA DE INICIO'
      },
      requiredRule: value =>
        !!value || 'ESTE CAMPO ES REQUERIDO',
      filesLimitRule: files =>
        !files ||
        files.length <= 2 ||
        'SOLO SE PERMITEN 2 ARCHIVOS POR ACTIVIDAD',
      filesSizeRule: files =>
        !files ||
        files.every(file => file.size <= 3 * 1024 * 1024) ||
        'TAMAÑO MÁXIMO DE 3 MB POR ARCHIVO',

      activePeriodsItems: [],
      exclusiveActivePeriodsItems: [],

      // Datos para las actividades
      currentActivityData: {
        name: '',
        dateStart: '',
        dateEnd: '',
        hours: null,
        institution: '',
        area: '',
        evidence: null
      },

      // DIALOGO DE ENVIAR ACTIVIDADES
      sendActivitiesDialog: false
    }
  },

  mounted () {
    this.getSendActivities()
  },

  methods: {
    // FUNCIÓN DE ALERTAS
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

    // FUNCIÓN QUE DECODIFICA EL TIPO DE ACCIÓN A REALIZAR
    decoder (data) {
      switch (data.action) {
        case 'close':
          this.sendActivitiesDialog = false
          break
        case 'deleteActivity':
          this.deleteActivity(data.item)
          break
        default:
          break
      }
    },

    // OBTENER LAS ACTIVIDADES ENVIADAS POR EL USUARIO
    async getSendActivities () {
      try {
        const url = `/activities/get-activities-by-user/${this.$store.state.user.id}`
        const res = await this.$axios.get(url)
        if (res.data.success) {
          if (this.sendActivities.length === 0) {
            this.mostrarAlerta('green', 'success', res.data.message)
          }
          this.sendActivities = res.data.activities.periods
        } else {
          // eslint-disable-next-line no-console
          console.error(res.data.message)
          this.mostrarAlerta('red', 'error', res.data.message)
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
        this.mostrarAlerta('red', 'error', 'ERROR AL OBTENER LAS ACTIVIDADES DEL USUARIO')
      }
    },

    // ELIMINAR ACTIVIDAD
    async deleteActivity (id) {
      try {
        const url = `/activities/delete-activity/${id}`
        const res = await this.$axios.delete(url)
        if (res.data.success) {
          this.getSendActivities()
          this.mostrarAlerta('green', 'success', res.data.message)
        } else {
          // eslint-disable-next-line no-console
          console.error(res.data.message)
          this.mostrarAlerta('red', 'error', res.data.message)
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
        this.mostrarAlerta('red', 'error', 'ERROR AL ELIMINAR LA ACTIVIDAD')
      }
    },

    // ABRIR EL DIALOGO DE ENVIAR ACTIVIDADES
    sendActivityDialog () {
      this.sendActivitiesDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
