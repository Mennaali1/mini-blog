const apiBaseUrl = "http://localhost:3000";

let currentUserId = null;

// Utility function to make API calls
async function apiCall(url, method = "GET", body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(url, options);
  return response.json();
}

// Show only the specified section and hide others
function showSection(sectionId) {
  const sections = ["home-section", "add-post-section", "profile-section"];
  sections.forEach((id) => {
    document.getElementById(id).style.display =
      id === sectionId ? "block" : "none";
  });
}

// Show navbar and home section after login
function showApp() {
  document.getElementById("auth-container").style.display = "none";
  document.getElementById("navbar").style.display = "block";
  document.querySelector("main").style.display = "block";
  showSection("home-section");
  loadAllPosts();
}

// Switch between signup and signin pages with animation
function switchAuthPage(showSignup) {
  const signupPage = document.getElementById("signup-page");
  const signinPage = document.getElementById("signin-page");
  const signupBtn = document.getElementById("show-signup");
  const signinBtn = document.getElementById("show-signin");

  if (showSignup) {
    signupPage.classList.add("active");
    signinPage.classList.remove("active");
    signupBtn.classList.add("active");
    signinBtn.classList.remove("active");
  } else {
    signupPage.classList.remove("active");
    signinPage.classList.add("active");
    signupBtn.classList.remove("active");
    signinBtn.classList.add("active");
  }
}

// Signup form handler
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  const result = await apiCall(`${apiBaseUrl}/users/signup`, "POST", {
    name,
    email,
    password,
  });

  Toastify({
    text: result.message,
    duration: 3000,
    gravity: "top",
    close: true,
    position: "right",
    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
  }).showToast();
  if (result.message === "Account created successfully!") {
    document.getElementById("signup-form").reset();
    // After successful signup, switch to signin page
    switchAuthPage(false);
  }
});

// Signin form handler
document.getElementById("signin-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signin-email").value;
  const password = document.getElementById("signin-password").value;

  const result = await apiCall(`${apiBaseUrl}/users/signin`, "POST", {
    email,
    password,
  });
  Toastify({
    text: result.message,
    duration: 3000,
    gravity: "top",
    close: true,
    position: "right",
    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
  }).showToast();
  if (result.message === "Welcome to Post App") {
    currentUserId = result.user;
    localStorage.setItem("currentUserId", currentUserId);
    showApp();
    loadUserPosts();
  }
});

// Auth navigation buttons
document.getElementById("show-signup").addEventListener("click", () => {
  switchAuthPage(true);
});
document.getElementById("show-signin").addEventListener("click", () => {
  switchAuthPage(false);
});

// On page load, check if user is logged in
window.addEventListener("load", () => {
  const storedUserId = localStorage.getItem("currentUserId");
  if (storedUserId) {
    currentUserId = storedUserId;
    showApp();
    loadUserPosts();
  } else {
    // Show signup page by default
    switchAuthPage(true);
  }
});

// Signout button handler
document.getElementById("signout-btn").addEventListener("click", () => {
  currentUserId = null;
  localStorage.removeItem("currentUserId");
  document.getElementById("auth-container").style.display = "block";
  document.getElementById("navbar").style.display = "none";
  document.querySelector("main").style.display = "none";
  showSection(null);
  clearPosts();
  // Show signup page by default on signout
  switchAuthPage(true);
});

function clearPosts() {
  document.getElementById("all-posts-container").innerHTML = "";
  document.getElementById("user-posts-container").innerHTML = "";
}

// Navbar navigation handlers
document.getElementById("nav-home").addEventListener("click", () => {
  showSection("home-section");
  loadAllPosts();
});
document.getElementById("nav-icon").addEventListener("click", () => {
  showSection("home-section");
  loadAllPosts();
});

document.getElementById("nav-add-post").addEventListener("click", () => {
  showSection("add-post-section");
});

document.getElementById("nav-profile").addEventListener("click", () => {
  showSection("profile-section");
  loadUserPosts();
});

// Create a post card element
function createPostCard(post, isUserPost = false) {
  const card = document.createElement("div");
  card.className = "post-card";

  const title = document.createElement("h3");
  title.textContent = post.title;
  card.appendChild(title);

  // Display team if available
  if (post.team) {
    const team = document.createElement("p");
    team.className = "post-team";
    team.textContent = `Team: ${post.team}`;
    card.appendChild(team);
  }

  const desc = document.createElement("p");
  desc.textContent = post.desc;
  card.appendChild(desc);

  if (!isUserPost && post.createdBy && post.createdBy.name) {
    const author = document.createElement("p");
    author.className = "post-author";
    author.textContent = `By: ${post.createdBy.name}`;
    card.appendChild(author);
  }

  // Like icon button
  const likeBtn = document.createElement("i");
  likeBtn.className = "like-button";
  likeBtn.innerHTML = "&#x1F44D;"; // Thumbs up emoji as like icon
  likeBtn.title = "Like";
  likeBtn.onclick = () => {
    // alert(`You liked post: ${post.title}`);
  };
  card.appendChild(likeBtn);

  // Display post time if available
  if (post.createdAt) {
    const time = document.createElement("p");
    time.className = "post-time";
    const date = new Date(post.createdAt);
    time.textContent = `Posted on: ${date.toLocaleString()}`;
    card.appendChild(time);
  }

  if (isUserPost) {
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "post-actions";

    const updateBtn = document.createElement("button");
    updateBtn.textContent = "Update";
    updateBtn.onclick = () => updatePostPrompt(post);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deletePost(post._id);

    actionsDiv.appendChild(updateBtn);
    actionsDiv.appendChild(deleteBtn);
    card.appendChild(actionsDiv);
  }

  return card;
}

// Load all posts
async function loadAllPosts() {
  const result = await apiCall(`${apiBaseUrl}/post/`);
  if (result.message === "success") {
    const container = document.getElementById("all-posts-container");
    container.innerHTML = "";
    result.posts.forEach((post) => {
      const card = createPostCard(post, false);
      container.appendChild(card);
    });
  }
}

// Load posts by current user
async function loadUserPosts() {
  if (!currentUserId) return;
  const result = await apiCall(`${apiBaseUrl}/post/${currentUserId}`);
  if (result.message === "success") {
    const container = document.getElementById("user-posts-container");
    container.innerHTML = "";
    result.posts.forEach((post) => {
      const card = createPostCard(post, true);
      container.appendChild(card);
    });
  }
}

// Add post form handler
document
  .getElementById("add-post-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUserId) {
      alert("Please sign in first.");
      return;
    }
    const title = document.getElementById("post-title").value;
    const desc = document.getElementById("post-desc").value;

    const result = await apiCall(`${apiBaseUrl}/post/`, "POST", {
      title,
      desc,
      createdBy: currentUserId,
    });

    Toastify({
      text: "Post Added Successfully",
      duration: 3000,
      gravity: "top",
      close: true,
      position: "right",
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    }).showToast();
    if (result.message === "success") {
      document.getElementById("add-post-form").reset();
      showSection("home-section");
      loadAllPosts();
    }
  });

// Prompt user to update post
function updatePostPrompt(post) {
  const newTitle = prompt("Enter new title:", post.title);
  if (newTitle === null) return;
  const newDesc = prompt("Enter new description:", post.desc);
  if (newDesc === null) return;

  updatePost(post._id, newTitle, newDesc);
}

// Update post API call
async function updatePost(id, title, desc) {
  const result = await apiCall(`${apiBaseUrl}/post/`, "PUT", {
    _id: id,
    title,
    desc,
  });

  Toastify({
    text: "Post Updated Successfully",
    duration: 3000,
    gravity: "top",
    close: true,
    position: "right",
    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
  }).showToast();
  if (result.message === "success") {
    loadAllPosts();
    loadUserPosts();
  }
}

// Delete post API call
async function deletePost(id) {
  if (!confirm("Are you sure you want to delete this post?")) return;

  const result = await apiCall(`${apiBaseUrl}/post/`, "DELETE", {
    _id: id,
  });

  Toastify({
    text: "Post Deleted Successfully",
    duration: 3000,
    gravity: "top",
    close: true,
    position: "right",
    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
  }).showToast();
  if (result.message === "success") {
    loadAllPosts();
    loadUserPosts();
  }
}
