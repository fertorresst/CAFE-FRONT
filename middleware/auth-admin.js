export default async function ({ $axios, store, route, redirect }) {
  if (!route.path.startsWith('/admin') || route.path === '/admin/login') {
    return
  }

  try {
    const res = await $axios.get('/admin/me', { withCredentials: true })
    const admin = res.data.admin
    store.commit('setAdmin', admin)

    // Defensa adicional en frontend. La autorización real también se valida en backend.
    const superadminOnly = ['/admin/admins', '/admin/qr-codes']
    const adminOrSuperadmin = ['/admin/students']

    if (superadminOnly.some(path => route.path.startsWith(path)) && admin.role !== 'superadmin') {
      return redirect('/admin/periods')
    }

    if (
      adminOrSuperadmin.some(path => route.path.startsWith(path)) &&
      !['superadmin', 'admin'].includes(admin.role)
    ) {
      return redirect('/admin/periods')
    }
  } catch (e) {
    return redirect('/admin/login')
  }
}
