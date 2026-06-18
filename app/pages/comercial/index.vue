<script setup>
definePageMeta({
  layout: 'comercial',
  middleware: [
    function (to, from) {
      return navigateTo('/comercial/inicio')
    }
  ]
})
</script>
