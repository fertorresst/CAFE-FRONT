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
          CREAR RECORDATORIO DE CONTACTO
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
            MOTIVO DE CONTACTO
          </h3>
          <v-textarea
            v-model="description"
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
          @click="createContact()"
        >
          <strong>CREAR</strong>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    userId: {
      type: Number,
      required: true
    },
    adminId: {
      type: Number,
      required: true
    },
    periodId: {
      type: String,
      required: true
    },
    activityId: {
      type: Number,
      required: false,
      default: () => (null)
    },
    activity: {
      type: Object,
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
      description: ''
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

    createContact () {
      const validateForm = this.$refs.form.validate()
      if (validateForm) {
        const data = {
          userId: this.userId,
          adminId: this.adminId,
          periodId: this.periodId,
          activityId: this.activityId,
          description: this.description
        }

        this.$emit('action', { action: 'createContact', data })
        this.cancel()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
