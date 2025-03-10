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
          EDITAR PERIODO
        </h2>
      </v-card-text>

      <v-card-text class="py-3">
        <h3
          class="text-justify subtitle black--text"
        >
          El siguiente periodo será editado:
          <strong
            class="text-left subtitle mt-4"
            style="color: #07538a"
          >
            {{ periodToEdit.id }}
          </strong>
        </h3>
      </v-card-text>

      <v-card-text class="pb-0">
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
          <h3>INTRODUCE TU CONTRASEÑA</h3>
          <v-text-field
            v-model="password"
            :rules="[requiredRule]"
            type="password"
            outlined
            dense
            required
          />
        </v-form>
      </v-card-text>

      <v-card-text>
        <h3
          class="text-justify subtitle black--text"
        >
          Si desea hacer exclusivo el periodo tendrá que crear uno nuevo.
        </h3>
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
          @click="editPeriod()"
        >
          <strong>ACTUALIZAR</strong>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    allPeriods: {
      type: Array,
      required: true
    },
    periodToEdit: {
      type: Object,
      required: true
    },
    requiredRule: {
      type: Function,
      required: true
    },
    dateStartRule: {
      type: Function,
      required: true
    },
    dateEndRule: {
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
    validatePassword: {
      type: Function,
      required: true
    },
    mostrarAlerta: {
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
      show: true,
      validForm: false,
      password: '',
      dateStart: moment(this.periodToEdit.dateStart).format('YYYY-MM-DD'),
      dateEnd: moment(this.periodToEdit.dateEnd).format('YYYY-MM-DD')
    }
  },

  methods: {
    cancel () {
      if (this.$refs.form) {
        this.$refs.form.reset()
      }
      this.validForm = false
      this.password = ''
      this.dateStart = ''
      this.dateEnd = ''
      this.$emit('action', { action: 'cancel' })
    },

    async editPeriod () {
      if (!this.password) {
        this.mostrarAlerta('red', 'error', 'DEBES INTRODUCIR TU CONTRASEÑA')
        return
      }

      const validateForm = this.$refs.form.validate()
      const validatePassword = await this.validatePassword(this.password)

      if (validateForm && validatePassword) {
        const data = {
          id: this.periodToEdit.id,
          dateStart: this.dateStart,
          dateEnd: this.editDateEnd
        }

        this.$emit('action', { action: 'updatePeriod', data })
        this.cancel()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
