<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="clipped"
      color="#a3915f"
      fixed
      app
      :temporary="true"
    >
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-icon color="white">
              mdi-account-circle
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="white--text">
              {{ studentData.name.toUpperCase() || '' }}
              {{ studentData.lastName.toUpperCase() || '' }}
              {{ studentData.secondLastName.toUpperCase() || '' }}
            </v-list-item-title>
            <v-list-item-subtitle class="white--text text--disabled">
              {{ studentData.email }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <hr>
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
      dense
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
              max-width="100"
              contain
              class="mx-auto"
            />
          </v-toolbar-title>
        </v-col>

        <v-col cols="4" class="d-flex justify-end">
          <v-btn
            v-if="isLoggedIn()"
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

  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-home',
          title: 'INICIO',
          to: '/student/index'
        },
        {
          icon: 'mdi-account',
          title: 'MI PERFIL',
          to: '/student/profile'
        },
        {
          icon: 'mdi-book-open-page-variant',
          title: 'MIS ACTIVIDADES',
          to: '/student/dashboard'
        }
      ],
      studentData: {
        name: '',
        lastName: '',
        secondLastName: '',
        email: ''
      }
    }
  },

  computed: {
    ...mapState({
      showAlert: state => state.showAlert,
      student: state => state.user
    })
  },

  created () {
    const studentId = this.$store.state.user?.id
    if (studentId) {
      this.fetchStudentData(studentId)
    }
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

    async isLoggedIn () {
      try {
        await this.$axios.get('/users/me', { withCredentials: true })
        return true
      } catch (e) {
        return false
      }
    },

    mostrarAlerta (color, type, message) {
      this.$store.commit('modifyAlert', true)
      this.$store.commit('modifyColor', `${color} lighten-2`)
      this.$store.commit('modifyIcon', color === 'green' ? 'mdi-check-circle' : 'mdi-close-circle')
      this.$store.commit('modifyType', type)
      this.$store.commit('modifyText', message)
      setTimeout(() => {
        this.$store.commit('modifyAlert', false)
      }, 3000)
    },

    async fetchStudentData (studentId) {
      try {
        const res = await this.$axios.get(`/users/get-user/${studentId}`, { withCredentials: true })
        if (res.data && res.data.success) {
          this.$store.commit('setUser', res.data.user)
          this.studentData = res.data.user
        } else {
          this.$store.commit('setUser', {})
        }
      } catch (e) {
        this.$store.commit('setUser', {})
      }
    }
  }
}
</script>

<style scoped>
</style>
