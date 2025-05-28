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
              v => dateRange(v, dateStart, dateEnd, exclusive)
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
              v => dateRange(v, dateStart, dateEnd,exclusive),
              dateOverlapRule
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
    adminId: {
      type: Number,
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

  computed: {
    periodName () {
      return this.periodId
    },

    dateOverlapRule () {
      return (v) => {
        if (!this.dateStart || !this.dateEnd) { return true }

        const start = this.moment(this.dateStart)
        const end = this.moment(this.dateEnd)

        const overlappingPeriod = this.allPeriods.find((period) => {
          // Solo comparar con periodos del mismo tipo (exclusivo u ordinario)
          if (!!period.per_exclusive !== !!this.exclusive) { return false }

          const periodStart = this.moment(period.dateStart || period.per_date_start)
          const periodEnd = this.moment(period.dateEnd || period.per_date_end)

          return (
            start.isSameOrBefore(periodEnd) &&
            end.isSameOrAfter(periodStart)
          )
        })

        return overlappingPeriod
          ? `LAS FECHAS SE SOLAPAN EN EL PERIODO ${overlappingPeriod.name || overlappingPeriod.per_name}`
          : true
      }
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
        // Forzar la revalidación del formulario
        if (this.$refs.form) {
          this.$refs.form.validate()
        }
      }
    }
  },

  mounted () {
    console.log('NewPeriod mounted', this.allPeriods)
  },

  methods: {
    updatePeriodId () {
      if (!this.dateStart) { return }

      const date = this.moment(this.dateStart)
      const year = date.format('YY')
      const month = date.month() + 1

      const prefix = month >= 1 && month <= 7 ? 'EJ' : 'AD'
      const baseId = `${prefix}${year}`

      // Filtrar periodos por tipo (exclusivo/ordinario) y año
      const matchingPeriods = this.allPeriods.filter((p) => {
        if (!p.per_name) { return false }
        // Coincide el prefijo y año
        if (!p.per_name.startsWith(baseId)) { return false }
        // Coincide el tipo (exclusivo/ordinario)
        const isExclusive = p.per_name.endsWith('E')
        return isExclusive === this.exclusive
      })

      let maxNumber = 0
      matchingPeriods.forEach((period) => {
        // Extrae el número consecutivo antes de la E (si existe)
        const match = period.per_name.match(new RegExp(`${baseId}-(\\d+)`))
        if (match && match[1]) {
          const num = parseInt(match[1])
          if (num > maxNumber) {
            maxNumber = num
          }
        }
      })

      const newNumber = maxNumber + 1
      this.periodId = `${baseId}-${newNumber}${this.exclusive ? 'E' : ''}`
    },

    createPeriod () {
      if (!this.validForm) { return }

      const overlapValidation = this.dateOverlapRule()
      if (overlapValidation !== true) {
        this.$emit('show-error', overlapValidation)
        return
      }

      const period = {
        name: this.periodId,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
        exclusive: this.exclusive,
        status: 'active',
        createAdminId: this.adminId
      }

      this.$emit('action', { period, action: 'createPeriod' })
      this.cancel()
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
