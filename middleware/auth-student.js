export default async function ({ $axios, store, route, redirect }) {
  if (route.path.startsWith('/student') && route.path !== '/student/login') {
    try {
      const res = await $axios.get('/users/me', { withCredentials: true })
      store.commit('setUser', res.data.user)
    } catch (e) {
      return redirect('/student/login')
    }
  }
}
