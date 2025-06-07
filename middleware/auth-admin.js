export default async function ({ $axios, store, route, redirect }) {
  // Solo proteger rutas que empiecen con /admin
  if (route.path.startsWith('/admin') && route.path !== '/admin/login') {
    try {
      const res = await $axios.get('/admin/me', { withCredentials: true }) // Axios ya manda la cookie automáticamente
      // Guarda los datos del admin en el store
      store.commit('setAdmin', res.data.admin)
    } catch (e) {
      // Si hay error (401), redirige al login
      return redirect('/admin/login')
    }
  }
}
