<script setup>
definePageMeta({
  middleware: [
    function (to, from) {
      return navigateTo('/marketing/inicio')
    }
  ]
})
</script>
