// ?? FIREBASE CONFIG (REPLACE WITH YOUR OWN)
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "ID",
  appId: "APP_ID"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

let cart = [];

// ADMIN LOGIN
function adminLogin() {
  const email = adminEmail.value;
  const pass = adminPassword.value;

  auth.signInWithEmailAndPassword(email, pass)
    .then(() => {
      document.getElementById("adminArea").classList.remove("hidden");
    })
    .catch(err => alert(err.message));
}

// UPLOAD PRODUCT
function uploadProduct() {
  const file = productImage.files[0];
  const ref = storage.ref("products/" + file.name);

  ref.put(file).then(() => {
    ref.getDownloadURL().then(url => {
      db.collection("products").add({
        name: productName.value,
        price: productPrice.value,
        image: url
      });
    });
  });
}

// LOAD PRODUCTS
db.collection("products").onSnapshot(snapshot => {
  productList.innerHTML = "";
  snapshot.forEach(doc => {
    const p = doc.data();
    productList.innerHTML += `
      <div class="card">
        <img src="${p.image}" width="100%">
        <h3>${p.name}</h3>
        <p>${p.price}</p>
        <button onclick='addToCart("${p.name}",${p.price})'>Add</button>
      </div>
    `;
  });
});

function addToCart(name, price) {
  cart.push({ name, price });
  renderCart();
}

function renderCart() {
  cartItems.innerHTML = cart.map(i => `<p>${i.name} - ${i.price}</p>`).join("");
}

function checkout() {
  alert("Order placed. Admin will contact you.");
}
