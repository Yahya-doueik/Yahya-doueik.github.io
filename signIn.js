// Firebase config (same as your sign-up)
const firebaseConfig = {
    apiKey: "AIzaSyA7P_9PUfP1sb-G7ZiGwDDczUFuOzWrmd0",
    authDomain: "nexora-test-8732b.firebaseapp.com",
    projectId: "nexora-test-8732b",
    storageBucket: "nexora-test-8732b.firebasestorage.app",
    messagingSenderId: "690968574757",
    appId: "1:690968574757:web:e1e618059d5660c2cd38cc"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  
  // Sign In Logic
  document.getElementById("signin").addEventListener("click", function (e) {
    e.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        alert("Login successful!");
        // redirect or show dashboard
        window.location.href = "index.html";
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  });
  