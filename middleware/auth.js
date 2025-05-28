export default async function ({ $axios, route, redirect }) {
  // Solo proteger rutas que empiecen con /admin
  if (route.path.startsWith('/admin')) {
    try {
      await $axios.get('/admin/me') // Axios ya manda la cookie automáticamente
      // Si no hay error, el usuario está autenticado
    } catch (e) {
      // Si hay error (401), redirige al login
      return redirect('/admin/login')
    }
  }
}
