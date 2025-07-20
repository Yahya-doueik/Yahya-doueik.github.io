// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA7P_9PUfP1sb-G7ZiGwDDczUFuOzWrmd0",
  authDomain: "nexora-test-8732b.firebaseapp.com",
  projectId: "nexora-test-8732b",
  storageBucket: "nexora-test-8732b.firebasestorage.app",
  messagingSenderId: "690968574757",
  appId: "1:690968574757:web:e1e618059d5660c2cd38cc",
  measurementId: "G-4ZTF67W9DV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const auth = firebase.auth();
const db = firebase.firestore();

// Form event
document.getElementById("submit").addEventListener("click", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Save extra user data to Firestore
      return db.collection("users").doc(user.uid).set({
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      alert("Account created & data saved!");
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
});
