<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="clipped"
      color="#a3915f"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          class="white--text"
          router
          exact
        >
          <v-list-item-action>
            <v-icon color="white">
              {{ item.icon }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      color="#07538a"
      class="white--text"
      fixed
      app
    >
      <v-row class="d-flex align-center justify-center flex-row" no-gutters>
        <v-col cols="4" class="d-flex justify-start">
          <v-app-bar-nav-icon
            color="#cd7005"
            @click.stop="drawer = !drawer"
          />
        </v-col>

        <v-col cols="4" class="d-flex justify-center">
          <v-toolbar-title>
            <v-img
              src="/MiCAFÉ.svg"
              alt="MiCAFE"
              max-width="120"
              contain
              class="mx-auto"
            />
          </v-toolbar-title>
        </v-col>

        <v-col cols="4" class="d-flex justify-end">
          <v-btn
            color="#cd7005"
            class="rounded-pill"
            text
            @click="logout"
          >
            <v-icon>mdi-logout</v-icon>
            <strong class="pl-2 d-none d-md-inline">CERRAR SESIÓN</strong>
          </v-btn>
        </v-col>
      </v-row>
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
  name: 'AdminLayout',

  components: {
    uiAlert
  },

  middleware: 'auth',

  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-calendar-multiple',
          title: 'PERIODOS',
          to: '/admin/periods'
        },
        {
          icon: 'mdi-badge-account',
          title: 'ADMINS',
          to: '/admin/admins'
        },
        {
          icon: 'mdi-account-multiple',
          title: 'ALUMNOS',
          to: '/admin/students'
        }
      ],
      title: 'MiCAFE'
    }
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
    async logout () {
      try {
        const res = await this.$axios.post('/admin/logout', {}, { withCredentials: true })
        if (res.data.success) {
          this.mostrarAlerta('green', 'success', 'SESIÓN CERRADA CORRECTAMENTE.')
          this.$router.push('/admin/login')
        } else {
          this.mostrarAlerta('red', 'error', res.data.message)
        }
      } catch (e) {
        this.mostrarAlerta('red', 'error', 'ERROR AL CERRAR SESIÓN. VUELVE A INTENTARLO.')
      }
    },

    async isLoggedIn () {
      try {
        await this.$axios.get('/admin/me')
        return true
      } catch (e) {
        return false
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
