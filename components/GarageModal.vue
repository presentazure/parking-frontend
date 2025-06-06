<template>
  <div
    class="absolute rounded-md lg:top-1/4 left-1/2 transform -translate-x-1/2 p-4 w-full h-full lg:h-auto max-w-5xl bg-white py-8 shadow-2xl"
    v-if="garage && Object.keys(garage).length">

    <div class="flex pb-6 pt-10 lg:pt-0 items-center">
      <div class="w-5/6 text-4xl tracking-tight font-extrabold text-gray-700">{{ garage.name }}</div>
      <div class="w-1/6 text-right cursor-pointer hover:text-blue-600 text-4xl text-gray-500 transition-colors duration-200" @click="close()">×</div>
    </div>

    <hr class="border-gray-200">

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mt-6">
      <div>
        <label for="from" class="block text-sm font-medium text-gray-700 mb-2">From</label>
        <div class="mt-1">
          <date-picker 
            id="from" 
            v-model="filters.start" 
            :show-second="false" 
            :minute-step="15" 
            type="datetime"
            class="w-full"
            placeholder="Select start date and time"
          />
        </div>
      </div>

      <div>
        <label for="to" class="block text-sm font-medium text-gray-700 mb-2">To</label>
        <div class="mt-1">
          <date-picker 
            id="to" 
            v-model="filters.end" 
            :show-second="false" 
            :minute-step="15" 
            type="datetime"
            class="w-full"
            placeholder="Select end date and time"
          />
        </div>
      </div>

      <div>
        <p class="text-lg font-medium text-gray-700 mb-3">Options</p>

        <div class="relative flex items-start mt-2" v-for="(price, attribute) in attributes" :key="attribute">
          <div class="flex items-center h-5">
            <input 
              :id="attribute" 
              :name="attribute" 
              :value="attribute" 
              type="checkbox"
              class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded transition-colors duration-200"
              v-model="filters.attributes"
            />
          </div>
          <div class="ml-3 text-sm flex justify-between flex-grow">
            <label :for="attribute" class="font-medium text-gray-700 cursor-pointer">{{ ucFirst(attribute) }}</label>
            <p class="text-gray-500">+${{ (price / 100).toFixed(2) }}/hour</p>
          </div>
        </div>
      </div>

      <div>
        <p class="text-lg font-medium text-gray-700 mb-3">Size</p>

        <div class="grid grid-cols-3 gap-3 mt-2">
          <div 
            v-for="(size, index) in sizes" 
            :key="index"
            @click="filters.size = size.name"
            class="p-6 bg-gray-50 flex flex-col justify-center items-center cursor-pointer rounded border-2 border-gray-200 hover:border-indigo-300 transition-all duration-200"
            :class="{'bg-indigo-50 border-indigo-500' : filters.size === size.name}"
          >
            <p class="text-gray-700 text-lg font-bold">{{ ucFirst(size.name) }}</p>
            <p class="text-gray-600">${{ (size.price / 100).toFixed(2) }}/h</p>
          </div>
        </div>
      </div>
    </div>
    
    <hr class="border-gray-200">
    
    <div v-if="showSpotsSection" class="grid mt-8">
      <div :class="{'text-center' : !hasAvailableSpots}">
        <div v-if="hasAvailableSpots" class="grid grid-cols-2">
          <div class="text-xl text-green-600 font-bold flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            {{ this.spots.length }} available spot{{ this.spots.length !== 1 ? 's' : '' }}
          </div>
          <div>
            <template v-if="selectedSpot">
              <div class="text-gray-500 mr-4 flex justify-between mb-2">
                <span class="font-medium">Selected spot</span>
                <span
                  v-text="manualSpotSelection ? 'Close' : 'Change spot'"
                  v-if="hasAvailableSpots && this.spots.length > 1" 
                  class="cursor-pointer text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                  @click="manualSpotSelection = !manualSpotSelection"
                />
              </div>
              <div class="bg-gray-50 p-3 rounded-lg">
                <div class="mb-2">
                  <span class="text-gray-600">Floor:</span>
                  <span class="text-lg leading-6 font-medium text-gray-900 ml-1">{{ this.selectedSpot.floor }}</span>
                  <span class="text-gray-600 ml-4">Number:</span>
                  <span class="text-lg leading-6 font-medium text-gray-900 ml-1">{{ this.selectedSpot.number }}</span>
                </div>
                <div v-if="this.selectedSpot.attributes && this.selectedSpot.attributes.length">
                  <span class="text-gray-600">Options:</span>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 ml-2 mr-1" v-for="attribute in this.selectedSpot.attributes" :key="attribute">
                    {{ ucFirst(attribute) }}
                  </span>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div v-else class="text-center py-8">
          <svg class="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <span class="text-red-600 text-xl font-medium">No available spots matching current filters</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6" v-if="manualSpotSelection">
        <div 
          v-for="spot in sortedSpots" 
          :key="spot.id"
          class="shadow-md p-4 cursor-pointer rounded-lg border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200" 
          @click="selectSpot(spot)" 
          v-if="selectedSpot.id !== spot.id"
        >
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="mb-2">
                <span class="text-gray-600 text-sm">Floor:</span>
                <span class="text-lg leading-6 font-medium text-gray-900 ml-1">{{ spot.floor }}</span>
              </p>
              <p>
                <span class="text-gray-600 text-sm">Spot no.:</span>
                <span class="text-lg leading-6 font-medium text-gray-900 ml-1">{{ spot.number }}</span>
              </p>
            </div>
            <div class="flex flex-col justify-center">
              <div v-if="spot.attributes && spot.attributes.length" class="flex flex-wrap gap-1">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800" v-for="attribute in spot.attributes" :key="attribute">
                  {{ ucFirst(attribute) }}
                </span>
              </div>
              <p v-else class="text-center text-gray-500 text-sm">
                No special options
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 grid grid-cols-2 gap-6" v-if="selectedSpot">
      <div class="text-center">
        <p class="text-gray-600 mb-2">Total Price</p>
        <p v-if="price" class="text-4xl tracking-tight font-extrabold text-gray-700">
          {{ (price / 100).toLocaleString("en-US", {style:"currency", currency:"USD"}) }}
        </p>
        <div v-else class="animate-pulse">
          <div class="h-12 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
      <div class="text-center flex items-center justify-center">
        <button 
          type="button"
          @click="issueCheckoutUrl()"
          :disabled="!price"
          class="inline-flex items-center px-6 py-3 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 sm:text-sm"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
          </svg>
          Continue to payment
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker';

export default {
  components: {DatePicker},
  data() {
    return {
      selectedSpot: null,
      price: 0,
      manualSpotSelection: false,
      attributes: [],
      reservationId: null,
      sizes: [],
      filters: {
        size: '',
        start: '',
        end: '',
        attributes: []
      },
      spots: []
    }
  },
  props: {
    garage: {
      type: Object,
      required: false
    }
  },
  watch: {
    garage: function (newValue, oldValue) {
      if (typeof newValue === 'object' && newValue !== null) {
        this.fetchDetails()
      } else {
        this.resetModal()
      }
    },
    async selectedSpot(newValue, oldValue) {
      if (newValue && Object.keys(newValue).length) {
        try {
          // create reservation
          const {data} = await this.$axios.post(`/reservations`, {
            'start': this.filters.start.toISOString(),
            'end': this.filters.end.toISOString(),
            'spot_id': newValue.id
          })
          this.reservationId = data.data.id
          await this.getReservationPrice(data.data.id)
        } catch (error) {
          console.error('Error creating reservation:', error)
          this.$toast.error('Failed to create reservation')
        }
      }
    },
    filters: {
      handler(val) {
        if (!this.canFilterSpots) {
          return
        }
        this.filterSpots()
      },
      deep: true
    }
  },
  computed: {
    hasAvailableSpots() {
      return this.spots.length > 0
    },
    showSpotsSection() {
      return typeof this.filters.start === 'object'
        && typeof this.filters.end === 'object'
        && this.filters.size.length
    },
    canFilterSpots() {
      return this.showSpotsSection
    },
    sortedSpots() {
      return this.spots.sort((a, b) => parseFloat(a.floor) - parseFloat(b.floor) || parseFloat(a.number) - parseFloat(b.number));
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    resetModal() {
      this.attributes = []
      this.sizes = []
      this.spots = []
      this.selectedSpot = null
      this.price = 0
      this.reservationId = null
      this.manualSpotSelection = false
      this.filters = {
        size: '',
        start: '',
        end: '',
        attributes: []
      }
    },
    async fetchDetails() {
      try {
        const {data} = await this.$axios.get(`/garages/${this.garage.id}`)
        this.attributes = data.data.attributes
        this.sizes = data.data.sizes
      } catch (error) {
        console.error('Error fetching garage details:', error)
      }
    },
    async filterSpots() {
      this.selectSpot(null)
      try {
        const {data} = await this.$axios.get(`/garages/${this.garage.id}/spots?${this.buildFilterUrl()}`)
        this.spots = data.data
        if (this.spots.length) {
          this.selectRandomSpot()
        }
      } catch (error) {
        console.error('Error filtering spots:', error)
      }
    },
    async getReservationPrice(reservationId) {
      try {
        const {data} = await this.$axios.post(`/calculate-payment`, {
          reservation_id: reservationId
        })
        this.price = data
      } catch (error) {
        console.error('Error calculating price:', error)
      }
    },
    selectSpot(spot) {
      this.selectedSpot = spot
      this.price = 0
      this.manualSpotSelection = false
    },
    selectRandomSpot() {
      this.selectedSpot = this.spots[Math.floor(Math.random() * this.spots.length)];
    },
    async issueCheckoutUrl() {
      try {
        const {data} = await this.$axios.get(`/checkout/${this.reservationId}`)
        window.location.replace(data.url);
      } catch (error) {
        console.error('Error getting checkout URL:', error)
      }
    },
    buildFilterUrl() {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(this.removeEmptyAttributes(this.filters))) {
        if (key === 'attributes') {
          value.forEach((entry) => {
            searchParams.append(`${key}[]`, entry)
          });
        } else if (['start', 'end'].includes(key)) {
          searchParams.append(key, value.toISOString())
        } else if (key === 'size') {
          searchParams.append(key, value)
        }
      }
      return searchParams.toString()
    },
    ucFirst(str) {
      if (!str) return str
      let firstLetter = str.substr(0, 1);
      return firstLetter.toUpperCase() + str.substr(1);
    },
    removeEmptyAttributes(obj) {
      return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null && (v.length || typeof v === 'object')));
    }
  }
}
</script>