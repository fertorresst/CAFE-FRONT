<template>
  <v-dialog
    v-model="show"
    max-width="400"
    persistent
  >
    <v-card
      align="center"
      justify="center"
      class="rounded-xl"
    >
      <v-card-text class="bg-blue white--text py-4">
        <h2>
          AGREGAR NUEVO PERIODO
        </h2>
      </v-card-text>

      <v-card-text class="py-3">
        <v-form
          ref="form"
          v-model="validForm"
          lazy-validation
          class="px-6 black--text"
        >
          <h3>FECHA DE INICIO</h3>
          <v-text-field
            v-model="dateStart"
            :rules="[
              requiredRule,
              dateStartRule,
              v => dateRange(v, dateStart, dateEnd)
            ]"
            :min="minDateStart"
            type="date"
            outlined
            dense
            required
          />

          <h3>FECHA DE FIN</h3>
          <v-text-field
            v-model="dateEnd"
            :rules="[
              requiredRule,
              v => dateEndRule(v, dateStart),
              v => dateRange(v, dateStart, dateEnd)
            ]"
            :min="dateStart"
            type="date"
            outlined
            dense
            required
          />

          <v-checkbox
            v-model="exclusive"
            color="#07538a"
            label="EXCLUSIVO PARA EGRESADOS"
            dense
          />
          <h5
            class="text-left subtitle"
          >
            *Si el periodo es exclusivo, solo los egresados podrán realizar solicitudes.
          </h5>

          <h3
            class="text-left subtitle mt-4"
            style="color: #07538a"
          >
            ID DEL PERIODO: <strong>{{ periodId }}</strong>
          </h3>
        </v-form>
      </v-card-text>

      <v-card-actions
        class="d-flex justify-center pb-6"
      >
        <v-btn
          color="black"
          rounded
          text
          @click="cancel()"
        >
          <span class="text">CANCELAR</span>
        </v-btn>
        <v-btn
          color="#fed55e"
          rounded
          elevation="0"
          @click="createPeriod()"
        >
          <strong>CREAR PERIODO</strong>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    dateStartRule: {
      type: Function,
      required: true
    },
    dateEndRule: {
      type: Function,
      required: true
    },
    requiredRule: {
      type: Function,
      required: true
    },
    dateRange: {
      type: Function,
      required: true
    },
    minDateStart: {
      type: String,
      required: true
    },
    allPeriods: {
      type: Array,
      required: true
    },
    moment: {
      type: Function,
      required: true
    }
  },

  data () {
    return {
      show: true,
      validForm: false,
      periodId: '',
      exclusive: false,
      dateStart: '',
      dateEnd: ''
    }
  },

  watch: {
    dateStart: {
      handler (newValue) {
        if (newValue) {
          this.updatePeriodId()
        }
      }
    },
    exclusive: {
      handler () {
        this.updatePeriodId()
      }
    }
  },

  methods: {
    createPeriod () {
      if (this.validForm) {
        const period = {
          id: this.periodId,
          dateStart: this.dateStart,
          dateEnd: this.dateEnd,
          exclusive: this.exclusive,
          request: 0,
          approval: 0,
          rejected: 0,
          status: 'active'
        }

        this.$emit('action', { period, action: 'createPeriod' })
        this.cancel()
      }
    },

    cancel () {
      if (this.$refs.form) {
        this.$refs.form.reset()
      }
      this.validForm = false
      this.periodId = ''
      this.exclusive = false
      this.dateStart = ''
      this.dateEnd = ''
      this.$emit('action', { action: 'cancel' })
    },

    getLastConsecutive () {
      if (!this.allPeriods || this.allPeriods.length === 0) {
        return 1
      }

      const consecutive = this.allPeriods.map((period) => {
        const match = period.id.match(/-(\d+)/)
        return match ? parseInt(match[1]) : 0
      })

      return Math.max(...consecutive) + 1
    },

    updatePeriodId () {
      if (!this.dateStart) { return }

      const date = moment(this.dateStart)
      const month = date.month()
      const year = date.format('YY')
      const consecutive = this.getLastConsecutive()

      // Determinar el prefijo según el periodo
      let prefix = ''
      if (month >= 0 && month <= 6) {
        prefix = 'EJ'
      } else if (month >= 7 && month <= 11) {
        prefix = 'AD'
      }

      // Construir el ID base
      let newId = `${prefix}${year}-${consecutive}`

      // Agregar o quitar la E según exclusividad
      if (this.exclusive) {
        newId += 'E'
      }

      this.periodId = newId
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
