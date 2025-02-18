export const state = () => ({
  type: '',
  color: '',
  icon: '',
  showAlert: false,
  mensaje: '',
  user: {},
  token: null
})

export const getters = {
  type: state => state.type,
  color: state => state.color,
  icon: state => state.icon,
  showAlert: state => state.showAlert,
  mensaje: state => state.mensaje,
  user: state => state.user,
  token: state => state.token
}

export const mutations = {
  modifyColor (state, color) {
    state.color = color
  },
  modifyType (state, type) {
    state.type = type
  },
  modifyAlert (state, showAlert) {
    state.showAlert = showAlert
  },
  modifyText (state, mensaje) {
    state.mensaje = mensaje
  },
  modifyIcon (state, icon) {
    state.icon = icon
  },
  setUser (state, user) {
    state.user = user
  },
  setToken (state, token) {
    state.token = token
  }
}
