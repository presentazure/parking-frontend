<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Reservation Status
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Reservation ID: {{ this.uuid }}
        </p>
      </div>

      <div v-if="loading" class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Checking reservation status...</p>
      </div>

      <div v-else-if="reservation" class="bg-white shadow rounded-lg p-6">
        <div v-if="reservation.paid_at" class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Payment Successful!</h3>
          <p class="text-sm text-gray-600 mb-4">
            Reservation {{ reservation.uuid }} has been paid successfully
          </p>
          <div class="bg-green-50 border border-green-200 rounded-md p-4">
            <p class="text-green-800 font-medium">
              Amount Paid: ${{ (reservation.paid_amount / 100).toFixed(2) }}
            </p>
          </div>
          <div class="mt-6">
            <nuxt-link 
              to="/" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Map
            </nuxt-link>
          </div>
        </div>
        
        <div v-else class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Payment Pending</h3>
          <p class="text-sm text-gray-600 mb-4">
            Reservation {{ reservation.uuid }} has not been paid yet
          </p>
          <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p class="text-yellow-800">
              Please complete your payment to confirm the reservation
            </p>
          </div>
        </div>
      </div>

      <div v-else class="bg-white shadow rounded-lg p-6 text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Reservation Not Found</h3>
        <p class="text-sm text-gray-600">
          Unable to find reservation with ID: {{ this.uuid }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      reservation: null,
      loading: true
    }
  },
  async asyncData({params}) {
    const uuid = params.uuid
    return {uuid}
  },
  async mounted() {
    await this.checkReservationStatus()
  },
  methods: {
    async checkReservationStatus() {
      try {
        const {data} = await this.$axios.get(`/reservations/${this.uuid}`)
        this.reservation = data.data
      } catch (error) {
        console.error('Error checking reservation status:', error)
        this.reservation = null
      } finally {
        this.loading = false
      }
    }
  }
}
</script>