function showConfirmationModal() {
    document.getElementById('confirmModal').style.display = 'block';
  }
  
  function closeModal() {
    document.getElementById('confirmModal').style.display = 'none';
  }

export {showConfirmationModal, closeModal}