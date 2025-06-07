<!-- layouts/empty.vue -->
<template style="overflow: hidden;">
  <v-app data-app>
    <Nuxt />
    <ui-alert v-if="showAlert" />
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import uiAlert from '@/components/ui-alert.vue'

export default {
  name: 'EmptyLayout',

  components: {
    uiAlert
  },

  computed: {
    ...mapState({
      showAlert: state => state.showAlert
    })
  },

  watch: {
    showAlert () {}
  },

  methods: {
    mostrarAlerta (color, type, message) {
      this.$store.commit('modifyAlert', true)
      this.$store.commit('modifyColor', `${color} lighten-2`)
      this.$store.commit('modifyIcon', color === 'green' ? 'mdi-check-circle' : 'mdi-close-circle')
      this.$store.commit('modifyType', type)
      this.$store.commit('modifyText', message)
      setTimeout(() => {
        this.$store.commit('modifyAlert', false)
      }, 3000)
    }
  }
}
</script>

<style scoped>
</style>
