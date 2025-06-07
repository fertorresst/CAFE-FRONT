<template>
  <transition name="fade-alert">
    <div v-if="showAlert" class="alert-container">
      <v-alert
        :type="type"
        :color="color"
        :icon="icon"
        rounded
        @input="closeAlert"
      >
        {{ mensaje }}
      </v-alert>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      type: state => state.type,
      color: state => state.color,
      icon: state => state.icon,
      mensaje: state => state.mensaje,
      showAlert: state => state.showAlert
    })
  },
  methods: {
    closeAlert () {
      this.$store.commit('modifyAlert', false)
    }
  }
}
</script>

<style scoped>
.alert-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  min-width: 300px;
  max-width: 600px;
}

.fade-alert-enter-active,
.fade-alert-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-alert-enter,
.fade-alert-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}

.v-alert {
  margin: 0;
}
</style>
