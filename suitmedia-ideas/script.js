document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const postList = document.getElementById("post-list");
  const perPage = document.getElementById("per-page");
  const sortBy = document.getElementById("sort-by");
  const prevPage = document.getElementById("prev-page");
  const nextPage = document.getElementById("next-page");
  const rangeStart = document.getElementById("range-start");
  const rangeEnd = document.getElementById("range-end");
  const totalPosts = document.getElementById("total-posts");
  const toggleCMS = document.getElementById("toggle-cms");
  const cmsControls = document.getElementById("cms-controls");
  const addNewPost = document.getElementById("add-new-post");
  const postFormContainer = document.getElementById("post-form-container");
  const postForm = document.getElementById("post-form");
  const cancelPost = document.getElementById("cancel-post");
  const postImage = document.getElementById("post-image");
  const imagePreview = document.getElementById("image-preview");

  // State
  let currentPage = 1;
  let postsPerPage = 10;
  let isEditMode = false;
  let currentEditId = null;
  let posts = [];

  // Initialize with sample data
  function initializeData() {
    posts = [];
    const titles = [
      "Kenali Tingkatan Influencers berdasarkan Jumlah Followers",
      "Jangan Asal Pilih Influencer, Berikut Cara Menyusun Strategi Influencer Marketing",
    ];

    const images = ["assets/tingkatan.jpg", "assets/influencer-marketing.jpg"];

    for (let i = 0; i < 50; i++) {
      const randomTitle = titles[Math.floor(Math.random() * titles.length)];
      const randomImage = images[Math.floor(Math.random() * images.length)];
      const randomDay = Math.floor(Math.random() * 28) + 1;
      const randomMonth = Math.floor(Math.random() * 12);
      const randomYear = 2022 + Math.floor(Math.random() * 2);

      posts.push({
        id: i + 1,
        title: randomTitle,
        image: randomImage,
        date: new Date(randomYear, randomMonth, randomDay),
      });
    }

    updateTotalCount();
  }

  // Format date to "D MONTH YYYY" format
  function formatDate(date) {
    const months = [
      "JANUARY",
      "FEBRUARY",
      "MARCH",
      "APRIL",
      "MAY",
      "JUNE",
      "JULY",
      "AUGUST",
      "SEPTEMBER",
      "OCTOBER",
      "NOVEMBER",
      "DECEMBER",
    ];

    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  // Render posts
  function renderPosts() {
    // Sort posts
    let sortedPosts = [...posts];
    if (sortBy.value === "oldest") {
      sortedPosts.sort((a, b) => a.date - b.date);
    } else {
      sortedPosts.sort((a, b) => b.date - a.date);
    }

    // Paginate
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

    // Update range display
    rangeStart.textContent = startIndex + 1;
    rangeEnd.textContent = Math.min(endIndex, posts.length);

    // Render
    postList.innerHTML = "";
    paginatedPosts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.className = "post";
      postElement.innerHTML = `
        <img src="${post.image}" alt="${post.title}">
        <div class="post-content">
          <div class="post-date">${formatDate(post.date)}</div>
          <h3 class="post-title">${post.title}</h3>
        </div>
      `;

      // Add edit buttons if in CMS mode
      if (isEditMode) {
        const editActions = document.createElement("div");
        editActions.className = "post-edit-actions";
        editActions.innerHTML = `
          <button class="edit-post-btn" data-id="${post.id}">Edit</button>
          <button class="delete-post-btn" data-id="${post.id}">Delete</button>
        `;
        postElement.prepend(editActions);

        // Add event listeners
        postElement
          .querySelector(".edit-post-btn")
          .addEventListener("click", () => editPost(post.id));
        postElement
          .querySelector(".delete-post-btn")
          .addEventListener("click", () => deletePost(post.id));
      }

      postList.appendChild(postElement);
    });

    // Update pagination buttons
    prevPage.disabled = currentPage === 1;
    nextPage.disabled = endIndex >= posts.length;
  }

  // Update total post count
  function updateTotalCount() {
    totalPosts.textContent = posts.length;
  }

  // Edit post
  function editPost(id) {
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    currentEditId = id;
    document.getElementById("post-title").value = post.title;
    document.getElementById("post-date").valueAsDate = post.date;

    // Show current image in preview
    imagePreview.innerHTML = `<img src="${post.image}" alt="Current Image">`;

    postFormContainer.style.display = "block";
  }

  // Delete post
  function deletePost(id) {
    if (confirm("Are you sure you want to delete this post?")) {
      posts = posts.filter((post) => post.id !== id);
      renderPosts();
      updateTotalCount();
    }
  }

  // Initialize
  initializeData();
  renderPosts();

  // Event Listeners
  perPage.addEventListener("change", function () {
    postsPerPage = parseInt(this.value);
    currentPage = 1;
    renderPosts();
  });

  sortBy.addEventListener("change", function () {
    renderPosts();
  });

  prevPage.addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      renderPosts();
    }
  });

  nextPage.addEventListener("click", function () {
    const totalPages = Math.ceil(posts.length / postsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderPosts();
    }
  });

  // CMS Controls
  toggleCMS.addEventListener("click", function () {
    isEditMode = !isEditMode;
    this.textContent = isEditMode ? "Exit CMS Mode" : "CMS Mode";
    cmsControls.style.display = isEditMode ? "block" : "none";
    renderPosts();
  });

  addNewPost.addEventListener("click", function () {
    currentEditId = null;
    postForm.reset();
    imagePreview.innerHTML = "";
    postFormContainer.style.display = "block";
  });

  cancelPost.addEventListener("click", function () {
    postFormContainer.style.display = "none";
  });

  postImage.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        imagePreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
      };
      reader.readAsDataURL(file);
    }
  });

  postForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("post-title").value;
    const date = new Date(document.getElementById("post-date").value);
    const imageFile = postImage.files[0];

    if (currentEditId) {
      // Update existing post
      const postIndex = posts.findIndex((p) => p.id === currentEditId);
      if (postIndex !== -1) {
        posts[postIndex].title = title;
        posts[postIndex].date = date;

        if (imageFile) {
          const reader = new FileReader();
          reader.onload = function (event) {
            posts[postIndex].image = event.target.result;
            postFormContainer.style.display = "none";
            renderPosts();
          };
          reader.readAsDataURL(imageFile);
        } else {
          postFormContainer.style.display = "none";
          renderPosts();
        }
      }
    } else {
      // Add new post
      const newId =
        posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1;

      if (imageFile) {
        const reader = new FileReader();
        reader.onload = function (event) {
          posts.unshift({
            id: newId,
            title: title,
            image: event.target.result,
            date: date,
          });

          postFormContainer.style.display = "none";
          currentPage = 1;
          renderPosts();
          updateTotalCount();
        };
        reader.readAsDataURL(imageFile);
      } else {
        // Default image if none selected
        posts.unshift({
          id: newId,
          title: title,
          image: "assets/default-image.jpg",
          date: date,
        });

        postFormContainer.style.display = "none";
        currentPage = 1;
        renderPosts();
        updateTotalCount();
      }
    }
  });
});
// Fungsi baru untuk fetch data dari API
async function fetchPostsFromAPI() {
  try {
    const response = await fetch(
      `https://suitmedia-backend.suitdev.com/api/ideas?page[number]=${currentPage}&page[size]=${postsPerPage}&append[]=small_image&append[]=medium_image&sort=${
        sortBy.value === "newest" ? "-published_at" : "published_at"
      }`
    );

    if (!response.ok) {
      throw new Error("Gagal mengambil data dari API");
    }

    const result = await response.json();
    totalPostsFromAPI = result.meta.total;

    return result.data.map((post) => ({
      id: post.id,
      title: post.title,
      image:
        post.medium_image || post.small_image || "assets/default-image.jpg",
      date: new Date(post.published_at),
    }));
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

// Modifikasi initializeData untuk menggunakan API
async function initializeData() {
  posts = await fetchPostsFromAPI();
  updateTotalCount();
}

// Modifikasi renderPosts untuk handle API data
async function renderPosts() {
  // Jika bukan edit mode, ambil data terbaru dari API
  if (!isEditMode) {
    posts = await fetchPostsFromAPI();
  }
}
