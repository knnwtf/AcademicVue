<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Confirm Delete</h2>
        <button class="close-btn" @click="$emit('cancel')">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <p>Are you sure you want to delete this item? This action cannot be undone.</p>

      <div class="form-actions">
        <button class="btn-secondary" @click="$emit('cancel')">Cancel</button>
        <button class="btn-danger" @click="$emit('confirm')">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<style scoped>
.form-actions {
  display: flex;
  gap: 10px;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

p {
  margin: 1.5rem 0;
  color: #666;
}
</style>
