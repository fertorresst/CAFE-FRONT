<template>
  <v-dialog
    v-model="show"
    max-width="550"
    persistent
    style="overflow-y: hidden;"
  >
    <v-card
      align="center"
      justify="center"
      class="rounded-xl"
    >
      <v-card-text class="bg-blue white--text py-4">
        <h2>
          RECHAZAR ACTIVIDAD
        </h2>
      </v-card-text>

      <v-card-text class="py-3">
        <h3
          class="text-center subtitle black--text"
        >
          NOMBRE DE LA ACTIVIDAD:
          <br>
          <strong
            class="text-left subtitle mt-4"
            style="color: #07538a"
          >
            {{ activity.name.toUpperCase() }}
          </strong>
        </h3>
      </v-card-text>

      <v-card-text
        class="text-center black--text"
      >
        <v-form
          ref="form"
          v-model="validForm"
          lazy-validation
          class="pt-6 black--text"
        >
          <h3>
            MOTIVO DE RECHAZO
          </h3>
          <v-textarea
            v-model="observations"
            auto-grow
            rows="3"
            flat
            outlined
            dense
            type="text"
            :rules="[requiredRule]"
            required
          />
        </v-form>
      </v-card-text>

      <v-card-actions
        class="d-flex justify-center pt-0 mt-0 pb-6"
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
          @click="rejectActivity()"
        >
          <strong>CONFIRMAR</strong>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    activity: {
      type: Object,
      required: true
    },
    activityId: {
      type: Number,
      required: false,
      default: () => (null)
    },
    collectiveId: {
      type: Number,
      required: false,
      default: () => (null)
    },
    origin: {
      type: String,
      required: true
    },
    requiredRule: {
      type: Function,
      required: true
    }
  },

  data () {
    return {
      show: true,
      validForm: false,
      observations: ''
    }
  },

  methods: {
    cancel () {
      if (this.$refs.form) {
        this.$refs.form.reset()
      }
      this.validForm = false
      this.observations = ''
      this.$emit('action', { action: 'cancel' })
    },

    rejectActivity () {
      const validateForm = this.$refs.form.validate()
      if (validateForm) {
        if (this.origin === 'individual') {
          const data = {
            observations: this.observations,
            status: 'rejected'
          }
          this.$emit('action', { action: 'rejectActivity', id: this.activityId, data, origin: this.origin })
        } else {
          const data = {
            observations: this.observations,
            status: 'rejected'
          }
          this.$emit('action', { action: 'rejectCollective', id: this.collectiveId, data, origin: this.origin })
        }

        this.cancel()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
