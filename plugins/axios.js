export default function ({ $axios, redirect }) {
  $axios.onError((error) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error en Axios:', error.response?.status || error.message)
    }

    if (error.response?.status === 401 && process.client) {
      const path = window.location.pathname
      if (path.startsWith('/admin') && path !== '/admin/login') {
        redirect('/admin/login')
      } else if (path.startsWith('/student') && path !== '/student/login') {
        redirect('/student/login')
      }
    }
  })
}
