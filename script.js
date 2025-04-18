let products = []; // Initialize an empty array for products
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentProduct = null;
let activeCategory = 'all'; // Default category
let activeFrameType = 'all'; // Default frame type

function showSection(section) {
    // Hide all sections initially
    document.querySelector('.category-container').style.display = 'none';
    document.querySelector('.product-container').style.display = 'none';
    document.getElementById('productDetail').style.display = 'none';
    document.getElementById('aboutUs').style.display = 'none';
    document.getElementById('contact').style.display = 'none';
    document.getElementById('aboutEyeglasses').style.display = 'none';
    document.getElementById('makingGlasses').style.display = 'none';
    document.getElementById('makingSunglasses').style.display = 'none';
    document.getElementById('login').style.display = 'none';
    document.getElementById('register').style.display = 'none'; // Hide callback section
    document.getElementById('forgotPassword').style.display = 'none'; // Hide forgot password section
    document.getElementById('shoppingCart').style.display = 'none'; // Hide shopping cart section
    document.getElementById('hero').style.display = 'block'; // Hide shopping cart section
    document.getElementById('termsOfService').style.display = 'none'; // Hide terms of service section
    document.getElementById('privacyPolicy').style.display = 'none'; // Hide privacy policy section
    document.getElementById('goodsReturnPolicy').style.display = 'none'; // Hide goods return policy section
    // Show the selected section
    switch (section) {
        case "about-us":
            document.getElementById('aboutUs').style.display = 'block'; // Show About Us section
            break;
        case "contact":
            document.getElementById('contact').style.display = 'block'; // Show Contact section
            break;
        case "about-eyeglasses":
            document.getElementById('aboutEyeglasses').style.display = 'block'; // Show About Eyeglasses section
            break;
        case "making-glasses":
            document.getElementById('makingGlasses').style.display = 'block'; // Show Our Team section
            break;
        case "making-sunglasses":
            document.getElementById('makingSunglasses').style.display = 'block'; // Show Our Process section
            break;
        case "login":
            document.getElementById('login').style.display = 'block'; // Show Login section
            document.getElementById('hero').style.display = 'none'; // Show Shopping Cart section
            break;
        case "register":
            document.getElementById('register').style.display = 'block'; // Show Register section
            document.getElementById('hero').style.display = 'none'; // Show Shopping Cart section
            break;
        case "forgot-password":
            document.getElementById('forgotPassword').style.display = 'block'; // Show Forgot Password section
            document.getElementById('hero').style.display = 'none';
            break;
        case "shopping-cart":
            document.getElementById('shoppingCart').style.display = 'block'; // Show Shopping Cart section
            document.getElementById('hero').style.display = 'none'; // Show Shopping Cart section
            initShoppingCart();
            break;
        case "product-detail":
            document.getElementById('productDetail').style.display = 'block'; // Show Product Detail section
            document.getElementById('detailQuantity').value = 1; // Reset quantity to 1
            break;
        case "termsOfService":
            document.getElementById('termsOfService').style.display = 'block';
        
            break;
        case "privacyPolicy":
            document.getElementById('privacyPolicy').style.display = 'block';
         
            break;
        case "goodsReturnPolicy":
            document.getElementById('goodsReturnPolicy').style.display = 'block';
   
            break;
        default:
            document.querySelector('.category-container').style.display = 'block';
            document.querySelector('.product-container').style.display = 'block';

            
            applyFilters(); // Apply filters when showing the home section
            break;
        
    }
    updateBackgroundColor(section); // Update background color based on the section
}

function updateBackgroundColor(section) {
    const body = document.body;
    switch (section) {
        case 'login':
        case 'register':
        case 'forgot-password':
            body.style.background = "linear-gradient(to right, #4f4f4f, #171717, #000000)"; // Set gradient background
            break;
        default:
            body.style.background = ''; // Reset to default
            break;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    fetch('products.json') // Fetch the products from the JSON file
        .then(response => response.json())
        .then(data => {
            // Update the price to the discounted price if it exists
            products = data.map(product => {
                if (product.discountedPrice) {
                    const price = product.price;
                    product.price = product.discountedPrice; // Set price to discounted price
                    product.discountedPrice = price; // Store original price in discountedPrice
                }
                return product;
            });

            renderProducts(products); // Render products initially
            setupModalListeners();
            updateCartCount();

            // Ensure the product detail section is hidden initially
            showSection("home");
        });
});

// Unified filter function to apply all active filters
function applyFilters() {
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || 300;
    const frameTypeCheckboxes = document.querySelectorAll('.frame-type-filter');
    const selectedFrameType = Array.from(frameTypeCheckboxes).find(checkbox => checkbox.checked)?.id.replace('frameType', '').toLowerCase() || 'all';
    const brandCheckboxes = document.querySelectorAll('.brand-filter');
    const selectedBrand = Array.from(brandCheckboxes).find(checkbox => checkbox.checked)?.value || null;
    const isDiscountChecked = document.getElementById('discountFilter').checked;

    const filteredProducts = products.filter(product => {
        const isInCategory = activeCategory === 'all' || product.category === activeCategory;
        const isInPriceRange = product.price >= minPrice && product.price <= maxPrice;
        const isInFrameType = selectedFrameType === 'all' || product.frameType === selectedFrameType;
        const isInBrand = !selectedBrand || product.name.toLowerCase().startsWith(selectedBrand.toLowerCase());
        const isDiscounted = !isDiscountChecked || product.discountedPrice;

        return isInCategory && isInPriceRange && isInFrameType && isInBrand && isDiscounted;
    });

    renderProducts(filteredProducts);
}

// Filter by category
function filterByCategory(category) {
    activeCategory = category; // Update the active category
    applyFilters(); // Apply all filters
    updateCategoryActiveState(activeCategory); // Update the active state of the category
}

// Filter by price
function filterByPrice() {
    applyFilters(); // Apply all filters
}

// Filter by frame type
function filterByFrameType(frameType) {
    // Get all frame type checkboxes
    const frameTypeCheckboxes = document.querySelectorAll('.frame-type-filter');

    // Uncheck all other checkboxes except the one that was clicked
    frameTypeCheckboxes.forEach(checkbox => {
        if (checkbox.id !== `frameType${frameType.charAt(0).toUpperCase() + frameType.slice(1)}`) {
            checkbox.checked = false;
        }
    });

    applyFilters(); // Apply all filters
}

function filterByBrand(brand) {
    // Get all brand checkboxes
    const brandCheckboxes = document.querySelectorAll('.brand-filter');

    // Uncheck all other checkboxes except the one that was clicked
    brandCheckboxes.forEach(checkbox => {
        if (checkbox.value !== brand) {
            checkbox.checked = false;
        }
    });

    // Find the currently selected checkbox
    const selectedCheckbox = Array.from(brandCheckboxes).find(checkbox => checkbox.checked);

    // Update the active brand based on the selected checkbox
    const activeBrand = selectedCheckbox ? selectedCheckbox.value : null;

    applyFilters(); // Apply all filters
}

function filterByDiscountProducts() {
    const discountCheckbox = document.getElementById('discountFilter');
    const isDiscountChecked = discountCheckbox.checked;

    applyFilters(); // Apply all filters
}

function showSelectedProducts(category) {
    const discountCheckbox = document.getElementById('discountFilter');
    discountCheckbox.checked = true; // Check the discount filter checkbox
  
    showCategory(category); // Show the selected category
   

    
}

function resetFilters() {
    document.getElementById('minPrice').value = 0;
    document.getElementById('maxPrice').value = 300;
    const frameTypeCheckboxes = document.querySelectorAll('.form-check-input');
    frameTypeCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    const brandCheckboxes = document.querySelectorAll('.brand-filter');
    brandCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    document.getElementById('discountFilter').checked = false; // Reset discount filter
    activeCategory = 'all';
    updateCategoryActiveState(activeCategory);
    applyFilters();
}

function showCategory(category)
{
    activeCategory = category; // Update the active category
    applyFilters(); // Apply all filters
    updateCategoryActiveState(activeCategory); // Update the active state of the category
    showSection("home"); // Show the home section
}

function renderProducts(productsArray) {
    const productsGrid = document.querySelector('#productsGrid');
    productsGrid.innerHTML = ''; // Clear the grid

    productsArray.forEach(product => {
        const discountPercentage = product.discountedPrice
            ? Math.round((Math.abs(product.price - product.discountedPrice) / product.discountedPrice) * 100)
            : null;

        const priceDisplay = product.discountedPrice
            ? `<span class="text-dark">$${product.price.toFixed(2)}</span> 
               <small class="text-muted text-decoration-line-through">$${product.discountedPrice.toFixed(2)}</small>
               ${`<span class="badge bg-dark ms-2">${discountPercentage}% OFF</span>`}`
            : `$${product.price.toFixed(2)}`;

        const productCard = `
            <div class="col-md-4 mb-4" id="product-${product.id}"> <!-- Dynamic ID based on product ID -->
                <div class="card product-card h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${priceDisplay}</p>
                        <div class="d-flex justify-content-between small">
                            <span class="badge bg-secondary">${product.category}</span>
                            <span class="text-muted">${product.color}</span>
                        </div>
                        <button class="btn btn-primary w-100 mt-3 view-detail product-button" 
                            data-id="${product.id}">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
        productsGrid.innerHTML += productCard; // Append the product card to the grid
    });

    setupModalListeners(); // Ensure modal listeners are set up for the new cards
}

function changePreviewImage(thumbnail) {
    const mainImage = document.getElementById('detailProductImage');
    mainImage.src = thumbnail.src; // Set the main image source to the clicked thumbnail's source
}

function setupModalListeners() {
    document.querySelectorAll('.view-detail').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.dataset.id);
            showProductDetails(productId); // Show product details when button is clicked
    
        });
    });
}

function showProductDetails(productId) {
    const product = products.find(p => p.id === productId); // Find the product by ID

    if (product) {
        currentProduct = product; // Set the current product

        // Update the product detail section with the product information
        document.getElementById('detailProductName').textContent = product.name;

        const discountPercentage = product.discountedPrice
            ? Math.round((Math.abs(product.price - product.discountedPrice) / product.discountedPrice) * 100)
            : null;

        const priceDisplay = product.discountedPrice
            ? `<span class="text-dark">$${product.price.toFixed(2)}</span> 
               <small class="text-muted text-decoration-line-through">$${product.discountedPrice.toFixed(2)}</small>
               ${`<span class="badge bg-dark ms-2">${discountPercentage}% OFF</span>`}`
            : `$${product.price.toFixed(2)}`;

        document.getElementById('detailProductPrice').innerHTML = priceDisplay;

        document.getElementById('detailProductDescription').textContent = product.description;
        document.getElementById('frameTypeValue').textContent = product.frameType;
        document.getElementById('colorValue').textContent = product.color;
        document.getElementById('detailQuantity').value = 1;

        // Update the main image and thumbnails
        const mainImage = product.image; // Main image path
        const baseName = mainImage.replace(/_1_.*\.[a-z]+$/, ''); // Remove `_1_XXX.extension` dynamically
        const extension = mainImage.split('.').pop(); // Get the file extension (e.g., png, jpg)

        document.getElementById('detailProductImage').src = mainImage; // Set the main image

        const thumbnails = document.querySelectorAll('.preview-image');
        thumbnails[0].src = `${baseName}_1_${mainImage.split('_1_')[1]}`; // First thumbnail (original)
        thumbnails[1].src = `${baseName}_2.${extension}`; // Second thumbnail
        thumbnails[2].src = `${baseName}_3.${extension}`; // Third thumbnail

        showSection("product-detail");
    }
}

function updateCategoryActiveState(selectedCategory) {
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('active');
        if (card.dataset.category === selectedCategory) {
            card.classList.add('active');
        }
    });
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cart.length;
    console.log("cart count: ", cartCount.textContent);
    cartCount.classList.add('animate__animated', 'animate__bounceIn');
    setTimeout(() => cartCount.classList.remove('animate__bounceIn'), 1000);
}

function updatePriceDisplay() {
    const priceRange = document.getElementById('priceRange');
    const priceValueDisplay = document.getElementById('priceValue');
    priceValueDisplay.textContent = `$${priceRange.value}.00`; // Update the displayed price
}

function addToCart()
{
    if (currentProduct) {
        const quantity = parseInt(document.getElementById('detailQuantity').value);
        if (quantity > 0) {
            const existingItem = cart.find(item => item.id === currentProduct.id);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    id: currentProduct.id,
                    name: currentProduct.name,
                    price: currentProduct.price,
                    quantity: quantity,
                    image: currentProduct.image, // Ensure the image is included
                    description: currentProduct.description
                });
            }
            
            currentProduct.quantity += quantity; // Update the quantity in the product array
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            alert(`${quantity} ${currentProduct.name} added to cart!`);
        }
    }
}

function submitCallbackForm(event) {
    event.preventDefault();

    var name = document.getElementById('callbackName').value;
    var phone = document.getElementById('callbackPhone').value;
    var email = document.getElementById('callbackEmail').value;
    var message = document.getElementById('callbackMessage').value;

    // Clear any previous error messages
    document.querySelectorAll('.error-message').forEach(el => el.remove());

    let hasErrors = false;

    if (!name) {
        displayError('callbackName', 'Please enter your name.');
        hasErrors = true;
    }

    if (!phone) {
        displayError('callbackPhone', 'Please enter your phone number.');
        hasErrors = true;
    } else {
        var phoneRegex = /^\+?\d{8,}$/; // Adjust the regex as per your phone number format
        if (!phoneRegex.test(phone)) {
            displayError('callbackPhone', 'Please enter a valid phone number.');
            hasErrors = true;
        }
    }

    if (!email) {
        displayError('callbackEmail', 'Please enter your email address.');
        hasErrors = true;
    } else {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            displayError('callbackEmail', 'Please enter a valid email address.');
            hasErrors = true;
        }
    }

    if (!message) {
        displayError('callbackMessage', 'Please enter your message.');
        hasErrors = true;
    }

    if (hasErrors) {
        return;
    }

    alert('Callback requested!');
    document.getElementById('callbackForm').reset();
}

function displayError(fieldId, errorMessage) {
    var field = document.getElementById(fieldId);
    var errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#b45942';
    errorDiv.innerText = errorMessage;
    field.parentNode.appendChild(errorDiv);
}

// Function to handle login form submission
function handleLogin(section, event) {
    event.preventDefault();
    
    if (!formIsValid(section)) {
        return; // Stop further execution if the form is not valid
    }

    const email = document.getElementById(section+'Email').value;
    const password = document.getElementById(section+'Password').value;

   
    // Simulate successful login
    localStorage.setItem('userEmail', email); // Store user email in localStorage
    if (section === 'register') 
    {
        displayUser(document.getElementById('registerName').value); // Display username in the navbar    
        alert('Registration successful!')
    }
    else
    {
        displayUser(email.split('@')[0]); // Display username in the navbar
        alert('Login successful!');
    }
    
    document.getElementById(section + 'Form').reset(); // Reset the form
    showSection('home'); // Redirect to the home section
}

function handleForgotPassword(event) {
    event.preventDefault();

    if (!formIsValid('forgotPassword')) {
        return; // Stop further execution if the form is not valid
    }

    // Clear any previous error messages
    const errorDiv = document.getElementById('confirmEmailError');
    if (errorDiv) {
        errorDiv.remove();
    }

    // Get the email and confirm email values
    const email = document.getElementById('forgotPasswordEmail').value;
    const confirmEmail = document.getElementById('confirmForgotPasswordEmail').value;

    // Check if the emails match
    if (email !== confirmEmail) {
        const confirmEmailField = document.getElementById('confirmForgotPasswordEmail');
        const errorMessage = document.createElement('div');
        errorMessage.id = 'confirmEmailError';
        errorMessage.className = 'mt-3';
        errorMessage.style.color = '#b45942';
        
        errorMessage.textContent = 'Email and Confirm Email do not match. Please try again.';
        confirmEmailField.parentNode.appendChild(errorMessage);
        return;
    }

    // Simulate sending a password reset email
    
    alert(`A password reset link has been sent to ${email}.`);
    document.getElementById('forgotPasswordForm').reset();
    showSection('login'); // Redirect to the login section
}

function formIsValid(section) {
    const form = document.getElementById(section+'Form');
    if (!form.checkValidity()) {
        // If the form is not valid, show validation messages
        form.reportValidity();
        return false; // Stop further execution
    }
    return true; // Form is valid
}
// Function to display the user's email or username in the navbar
function displayUser(email) {
    const userDisplay = document.getElementById('userDisplay');
    userDisplay.textContent = `Welcome, ${email}`;
    userDisplay.style.display = 'inline'; // Make the user display visible
}

// Check if a user is already logged in on page load
document.addEventListener('DOMContentLoaded', () => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
        displayUser(storedEmail); // Display the stored email in the navbar
    }
});
