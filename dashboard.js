const firebaseConfig = {
  apiKey: "AIzaSyA7P_9PUfP1sb-G7ZiGwDDczUFuOzWrmd0",
  authDomain: "nexora-test-8732b.firebaseapp.com",
  projectId: "nexora-test-8732b",
  storageBucket: "nexora-test-8732b.firebasestorage.app",
  messagingSenderId: "690968574757",
  appId: "1:690968574757:web:e1e618059d5660c2cd38cc",
  measurementId: "G-4ZTF67W9DV"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const adminEmail = "yahya234@gmail.com";  // <-- Put your email here

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "signIn.html";
    return;
  }

  if (user.email !== adminEmail) {
    alert("Access denied: You are not the admin.");
    auth.signOut();
    return;
  }

  document.getElementById("userEmail").innerText = user.email;

  try {
    const userDoc = await db.collection("users").doc(user.uid).get();
    const name = userDoc.exists ? userDoc.data().name : "Admin";
    document.getElementById("username").innerText = name;
  } catch (err) {
    console.error("Error fetching user data:", err);
    document.getElementById("username").innerText = "Admin";
  }

  loadStats();
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  auth.signOut().then(() => {
    window.location.href = "signIn.html";
  });
});

// Theme toggle
const switcher = document.getElementById("themeSwitcher");
switcher.addEventListener("change", () => {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
});
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  switcher.checked = true;
}

// Profile dropdown toggle
const profileImg = document.querySelector(".profile img");
const profilePanel = document.getElementById("profilePanel");
profileImg.addEventListener("click", () => {
  profilePanel.style.display = profilePanel.style.display === "block" ? "none" : "block";
});

// Load dashboard stats
async function loadStats() {
  try {
    const usersSnap = await db.collection("users").get();
    const studentCount = usersSnap.docs.filter(doc => doc.data().role === "student").length;

    const coursesSnap = await db.collection("courses").get();
    const activeCourses = coursesSnap.docs.filter(doc => doc.data().active).length;

    document.getElementById("totalUsers").innerText = studentCount;
    document.getElementById("activeProjects").innerText = activeCourses;
    document.getElementById("storageUsed").innerText = "2.4 GB"; // example static

    renderChart();
  } catch (err) {
    console.error("Error loading stats:", err);
  }
}

// Chart.js rendering
function renderChart() {
  const ctx = document.getElementById("statsChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      datasets: [{
        label: 'Signups This Week',
        data: [4, 8, 6, 10, 5],
        borderColor: '#66e0ff',
        tension: 0.4,
        fill: false
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// ----- NEW: Add student form handling -----

// Listen for the form submit event
document.getElementById("addStudentForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("studentEmail").value.trim();
  const password = document.getElementById("studentPassword").value.trim();
  const role = document.getElementById("studentRole").value;

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  try {
    // Create new user in Firebase Authentication
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const newUser = userCredential.user;

    // Save user data in Firestore with role
    await db.collection("users").doc(newUser.uid).set({
      email,
      role,
      name: "", // optional, you can add a field for student name later
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert(`Student account created for ${email} with role ${role}`);

    // Clear form
    e.target.reset();

    // Reload stats to update student count
    loadStats();

  } catch (error) {
    console.error("Error creating student:", error);
    alert("Error: " + error.message);
  }
});
