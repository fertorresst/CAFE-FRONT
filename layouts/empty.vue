<!-- layouts/empty.vue -->
<template style="overflow: hidden;">
  <div>
    <Nuxt />
    <ui-alert v-if="showAlert" />
  </div>
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
      // token: state => state.token
    })
  },

  watch: {
    showAlert () {}
  },

  methods: {
    mostrarAlerta (color, type, message) {
      this.$store.commit('modifyAlert', true)
      this.$store.commit('modifyColor', `${color} darken-4`)
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
