<template>
  <div class="container py-5" data-aos="fade-up">
    <h2 class="text-center text-primary mb-4">
      <i class="pi pi-calendar me-2"></i>All Events
    </h2>

    <DataTable
      :value="events"
      paginator
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20]"
      :globalFilterFields="['title', 'description', 'date']"
      :filters="filters"
      filterDisplay="row"
      responsiveLayout="scroll"
      stripedRows
      removableSort
      class="p-datatable-sm"
    >
      <template #header>
        <div class="d-flex justify-content-between align-items-center">
          <span class="fw-bold">Event List (Realtime)</span>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Search events..." />
          </span>
        </div>
      </template>

      <Column field="title" header="Title" sortable></Column>
      <Column field="date" header="Date" sortable></Column>
      <Column field="description" header="Description" :style="{ width: '40%' }"></Column>
      <Column
        header="Action"
        :body="actionTemplate"
        :style="{ width: '10%' }"
      ></Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, onSnapshot } from 'firebase/firestore'
import { FilterMatchMode } from 'primevue/api'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const events = ref([])

// 搜索过滤器
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

onMounted(() => {
  const eventsRef = collection(db, 'events')
  onSnapshot(eventsRef, (snapshot) => {
    events.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  })
})

// 每行操作按钮
import { h } from 'vue'
import { RouterLink } from 'vue-router'

const actionTemplate = (rowData) => {
  return h(
    RouterLink,
    { to: `/event/${rowData.id}` },
    () => h(Button, { icon: "pi pi-eye", class: "p-button-sm p-button-text p-button-primary" })
  )
}
</script>

<style scoped>
.container {
  max-width: 1000px;
}
</style>
