export default function ({ $axios }) {
  $axios.onError((error) => {
    console.log('Error en Axios:', error)
  })
}
