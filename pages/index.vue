<template>
  <div />
</template>

<script>
export default {
  middleware ({ redirect }) {
    return redirect('/student/login')
  }
}
</script>
