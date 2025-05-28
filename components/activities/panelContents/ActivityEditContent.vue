<template>
  <div>
    <v-form
      ref="form"
      v-model="validForm"
      lazy-validation
      class="black--text"
    >
      <v-row class="d-flex flex-wrap flex-row align-stretch justify-center">
        <v-col>
          <h3>
            NOMBRE DE LA ACTIVIDAD
          </h3>
          <v-text-field
            v-model="editActivity.name"
            flat
            outlined
            dense
            type="text"
            :rules="[requiredRule]"
            required
          />
        </v-col>

        <v-col>
          <h3>
            INSTITUCIÓN ORGANIZADORA
          </h3>
          <v-text-field
            v-model="editActivity.institution"
            flat
            outlined
            dense
            type="text"
            :rules="[requiredRule]"
            required
          />
        </v-col>
      </v-row>

      <v-row class="d-flex flex-wrap flex-row align-stretch justify-center">
        <v-col>
          <h3>
            INICIO
          </h3>
          <v-text-field
            v-model="editActivity.startDate"
            flat
            outlined
            dense
            type="date"
            :rules="[requiredRule]"
            required
          />
        </v-col>

        <v-col>
          <h3>
            TÉRMINO
          </h3>
          <v-text-field
            v-model="editActivity.endDate"
            flat
            outlined
            dense
            type="date"
            :rules="[
              requiredRule,
              v => dateEndRule(v, editActivity.startDate)
            ]"
            :min="activity.startDate"
            required
          />
        </v-col>

        <v-col>
          <h3>
            HORAS
          </h3>
          <v-text-field
            v-model="editActivity.hours"
            flat
            outlined
            dense
            type="number"
            :rules="[requiredRule]"
            :min="0"
            required
          />
        </v-col>

        <v-col>
          <h3>
            ÁREA
          </h3>
          <v-combobox
            v-model="editActivity.area"
            :items="areas"
            flat
            outlined
            dense
            type="text"
            :rules="[requiredRule]"
            required
          />
        </v-col>
      </v-row>
    </v-form>

    <v-row class="d-flex justify-center align-stretch my-2">
      <v-btn-toggle
        tile
      >
        <v-tooltip bottom color="red">
          <template #activator="{ on, attrs }">
            <v-btn
              color="red"
              class="white--text elevation-0 ml-4 rounded-pill"
              v-bind="attrs"
              v-on="on"
              @click="emit('rejectEdit')"
            >
              <v-icon color="white">
                mdi-close-thick
              </v-icon>
            </v-btn>
          </template>
          <span>CANCELAR EDICIÓN</span>
        </v-tooltip>

        <v-tooltip bottom color="green">
          <template #activator="{ on, attrs }">
            <v-btn
              color="green"
              class="white--text elevation-0 ml-4 rounded-pill"
              v-bind="attrs"
              v-on="on"
              @click="emit('approveEdit')"
            >
              <v-icon color="white">
                mdi-check-bold
              </v-icon>
            </v-btn>
          </template>
          <span>GUARDAR CAMBIOS</span>
        </v-tooltip>
      </v-btn-toggle>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    activity: {
      type: Object,
      required: true
    },
    areas: {
      type: Array,
      required: true
    },
    requiredRule: {
      type: Function,
      required: true
    },
    dateEndRule: {
      type: Function,
      required: true
    }
  },

  data () {
    return {
      validForm: false,
      editActivity: {}
    }
  },

  created () {
    this.editActivity = this.activity
  },

  methods: {
    emit (action) {
      if (action === 'approveEdit') {
        const validateForm = this.$refs.form.validate()

        if (validateForm) {
          this.$emit('action', { action, activity: this.editActivity })
        }
      }

      if (action === 'rejectEdit') {
        this.editActivity = {}
        this.validForm = false
        this.$emit('action', { action })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
