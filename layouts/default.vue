<template>
  <v-app>
    <v-app-bar
      color="#07538a"
      class="white--text"
      fixed
      app
    >
      <v-spacer />
      <v-img
        src="/MiCAFÉ.svg"
        alt="MiCAFE"
        max-width="120"
        contain
        class="mx-auto"
      />
      <v-spacer />
    </v-app-bar>

    <v-main class="bg-default">
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

    <!-- <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer> -->

    <ui-alert v-if="showAlert" />
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import uiAlert from '@/components/ui-alert.vue'

export default {
  name: 'DefaultLayout',

  components: {
    uiAlert
  },

  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: true,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      title: 'CAFE'
    }
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
    async logout () {
      try {
        const res = await this.$axios.post('/users/logout', {}, { withCredentials: true })
        if (res.data.success) {
          this.$router.push('/student/login')
          this.mostrarAlerta('green', 'success', 'SESIÓN CERRADA CORRECTAMENTE.')
        } else {
          this.mostrarAlerta('red', 'error', res.data.message)
        }
      } catch (e) {
        this.mostrarAlerta('red', 'error', 'ERROR AL CERRAR SESIÓN. VUELVE A INTENTARLO.')
      }
    },

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

<style scoped>

</style>
