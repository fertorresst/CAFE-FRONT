<template>
  <v-btn-toggle
    v-if="tableOrigin !== 'active'"
    v-model="toggle"
    tile
    :mandatory="hasSelection"
  >
    <v-tooltip bottom color="blue">
      <template #activator="{ on, attrs }">
        <v-btn
          v-if="activity.status !== 'contacted'"
          color="blue"
          class="white--text elevation-0 rounded-pill"
          v-bind="attrs"
          v-on="on"
          @click="selectButton('createContact', 0)"
        >
          <v-icon color="white">
            mdi-email
          </v-icon>
        </v-btn>
      </template>
      <span>MARCAR ACTIVIDAD PARA CONTACTAR</span>
    </v-tooltip>

    <v-tooltip bottom color="orange">
      <template #activator="{ on, attrs }">
        <v-btn
          color="orange"
          class="white--text elevation-0 ml-4 rounded-pill"
          v-bind="attrs"
          v-on="on"
          @click="selectButton('editActivity', 1)"
        >
          <v-icon color="white">
            mdi-pencil
          </v-icon>
        </v-btn>
      </template>
      <span>EDITAR ACTIVIDAD</span>
    </v-tooltip>

    <v-tooltip bottom color="red">
      <template #activator="{ on, attrs }">
        <v-btn
          color="red"
          class="white--text elevation-0 ml-4 rounded-pill"
          v-bind="attrs"
          v-on="on"
          @click="selectButton('rejectActivity', 2)"
        >
          <v-icon color="white">
            mdi-close-thick
          </v-icon>
        </v-btn>
      </template>
      <span>RECHAZAR ACTIVIDAD</span>
    </v-tooltip>

    <v-tooltip bottom color="green">
      <template #activator="{ on, attrs }">
        <v-btn
          color="green"
          class="white--text elevation-0 ml-4 rounded-pill"
          v-bind="attrs"
          v-on="on"
          @click="selectButton('approveActivity', 3)"
        >
          <v-icon color="white">
            mdi-check-bold
          </v-icon>
        </v-btn>
      </template>
      <span>APROBAR ACTIVIDAD</span>
    </v-tooltip>
  </v-btn-toggle>
</template>

<script>
export default {
  props: {
    activity: {
      type: Object,
      required: true
    },
    tableOrigin: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      toggle: null,
      hasSelection: false
    }
  },

  methods: {
    selectButton (action, index) {
      this.toggle = index
      this.hasSelection = true

      if (action === 'createContact') {
        this.$emit(action)
        return
      }

      if (action === 'editActivity') {
        this.$emit(action)
        return
      }

      if (action === 'rejectActivity') {
        this.$emit(action)
        return
      }

      if (action === 'approveActivity') {
        this.$emit(action)
        return
      }

      // eslint-disable-next-line no-console
      console.log('🚀 ~ selectButton ~ this.editButton:', this.editButton)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
