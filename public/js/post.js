const newPostHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector('#project-name').value.trim();
  const description = document.querySelector('#project-desc').value.trim();
  const image = document.querySelector('.file-input').files[0];

  console.log(title, description, image);

  if (title && description && image) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);

    const response = await fetch(`/api/post`, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      document.location.replace('/');
    } else {
      alert('Failed to create post');
    }
  } else {
    alert('Please fill out all fields and select an image');
  }
};

console.log("here we are");
document
  .querySelector('.new-project-form')
  .addEventListener('submit', newPostHandler);

document.getElementById('imageUpload').addEventListener('change', function() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const preview = document.getElementById('imagePreview');
      preview.innerHTML = `<img src="${e.target.result}" alt="Image Preview" style="max-width: 100%; height: auto;" />`;
    }
    reader.readAsDataURL(file);
  }
});
