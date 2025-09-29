document.addEventListener('DOMContentLoaded', function () {
    // CARROSSEL
    const images = document.querySelectorAll('.carousel-image');
    const indicators = document.querySelectorAll('.carousel-indicator');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    const carouselContainer = document.querySelector('.carousel-container');
    let current = 0;
    let interval;

    function showImage(index) {
    images.forEach(img => img.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active')); // CORRIGIDO: classList
    images[index].classList.add('active');
    indicators[index].classList.add('active'); // CORRIGIDO: classList
    current = index;
}

    function nextImage() {
        let next = (current + 1) % images.length;
        showImage(next);
    }

    function prevImage() {
        let prev = (current - 1 + images.length) % images.length;
        showImage(prev);
    }

    function startCarousel() {
        interval = setInterval(nextImage, 3000);
    }

    function stopCarousel() {
        clearInterval(interval);
    }

    nextBtn.addEventListener('click', () => {
        stopCarousel();
        nextImage();
        startCarousel();
    });

    prevBtn.addEventListener('click', () => {
        stopCarousel();
        prevImage();
        startCarousel();
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopCarousel();
            showImage(index);
            startCarousel();
        });
    });

    carouselContainer.addEventListener('mouseenter', stopCarousel);
    carouselContainer.addEventListener('mouseleave', startCarousel);
    startCarousel();

    // NAVBAR SCROLL EFFECT
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // NAVEGAÇÃO ATIVA
    const sections = document.querySelectorAll("section, .home_page");
    const navLinks = document.querySelectorAll(".nav_itens a");

    function updateActiveNav() {
        let currentSectionId = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });
        
        if (!currentSectionId) {
            currentSectionId = "home";
        }
        
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").includes(currentSectionId)) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", updateActiveNav);
    updateActiveNav();

    // MENU MOBILE
    const menuToggle = document.querySelector('.menu-toggle');
    const navItems = document.querySelector('.nav_itens');

    menuToggle.addEventListener('click', () => {
        navItems.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.style.overflow = navItems.classList.contains('active') ? 'hidden' : 'auto';
    });

    document.querySelectorAll('.nav_itens a').forEach(link => {
        link.addEventListener('click', () => {
            navItems.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Fechar menu ao clicar fora dele
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav_itens') && !e.target.closest('.menu-toggle') && navItems.classList.contains('active')) {
            navItems.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // FILTRO DE PRODUTOS
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product_card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            productCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // FILTRO DE PESQUISA
    const searchInput = document.querySelector('.inputFilter');
    const shopSection = document.getElementById('shop');
    let searchTimeout;

    searchInput.addEventListener('input', () => {
        const searchText = searchInput.value.toLowerCase();
        
        if (searchText.length > 0) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                shopSection.scrollIntoView({ behavior: 'smooth' });
            }, 800);
        }
        
        productCards.forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            if (productName.includes(searchText)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Botão home leva para shop
    document.querySelector('.home_button').addEventListener('click', () => {
        shopSection.scrollIntoView({ behavior: 'smooth' });
    });

    // SISTEMA DE SELEÇÃO DE TAMANHOS E CARRINHO
    const buyButtons = document.querySelectorAll('.buy-btn');
    const cartNotification = document.getElementById('cartNotification');
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartShipping = document.getElementById('cartShipping');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const closeModals = document.querySelectorAll('.close-modal');

    // Fechar modais
    closeModals.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
            document.body.style.overflow = 'auto';
        });
    });

    // Abrir carrinho
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        updateCartDisplay();
    });

    // Fechar carrinho ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Sistema de compra
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product_card');
            const buyButton = productCard.querySelector('.buy-btn');
            const sizeSelector = productCard.querySelector('.size-selector');
            
            buyButton.style.display = 'none';
            sizeSelector.style.display = 'flex';
        });
    });

    // Seleção de tamanhos
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sizeOptions = this.closest('.size-options');
            sizeOptions.querySelectorAll('.size-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });

    // Adicionar ao carrinho
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product_card');
            const selectedSize = productCard.querySelector('.size-btn.selected');
            
            if (!selectedSize) {
                alert('Por favor, selecione um tamanho antes de adicionar ao carrinho.');
                return;
            }
            
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('p').textContent;
            const productImage = productCard.querySelector('img').src;
            const size = selectedSize.getAttribute('data-size');
            const priceValue = parseFloat(productPrice.replace('R$ ', '').replace(',', '.'));
            
            // Obter carrinho atual ou criar um novo
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Verificar se o produto já está no carrinho
            const existingItemIndex = cart.findIndex(item => 
                item.name === productName && item.size === size
            );
            
            if (existingItemIndex > -1) {
                // Se já existe, aumentar a quantidade
                cart[existingItemIndex].quantity += 1;
            } else {
                // Se não existe, adicionar novo item
                cart.push({
                    name: productName,
                    price: priceValue,
                    image: productImage,
                    size: size,
                    quantity: 1
                });
            }
            
            // Salvar carrinho no localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Mostrar notificação
            cartNotification.textContent = `${productName} (Tamanho: ${size}) adicionado ao carrinho!`;
            cartNotification.classList.add('show');
            setTimeout(() => {
                cartNotification.classList.remove('show');
            }, 3000);
            
            // Atualizar ícone do carrinho
            updateCartIcon();
            
            // Reseta a seleção
            const buyButton = productCard.querySelector('.buy-btn');
            const sizeSelector = productCard.querySelector('.size-selector');
            buyButton.style.display = 'block';
            sizeSelector.style.display = 'none';
            productCard.querySelectorAll('.size-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
        });
    });

    // Atualizar ícone do carrinho com contador
    function updateCartIcon() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Remover contador anterior se existir
        const existingCounter = document.querySelector('.cart-counter');
        if (existingCounter) {
            existingCounter.remove();
        }
        
        if (totalItems > 0) {
            const counter = document.createElement('span');
            counter.className = 'cart-counter';
            counter.textContent = totalItems;
            counter.style.position = 'absolute';
            counter.style.top = '-5px';
            counter.style.right = '-5px';
            counter.style.backgroundColor = 'var(--accent-color)';
            counter.style.color = 'white';
            counter.style.borderRadius = '50%';
            counter.style.width = '18px';
            counter.style.height = '18px';
            counter.style.fontSize = '12px';
            counter.style.display = 'flex';
            counter.style.alignItems = 'center';
            counter.style.justifyContent = 'center';
            
            cartIcon.style.position = 'relative';
            cartIcon.appendChild(counter);
        }
    }

    // Atualizar exibição do carrinho
    function updateCartDisplay() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            emptyCart.style.display = 'block';
            cartItems.innerHTML = '';
            cartItems.appendChild(emptyCart);
            updateCartTotals(0);
            return;
        }
        
        emptyCart.style.display = 'none';
        cartItems.innerHTML = '';
        
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                    <div class="cart-item-size">Tamanho: ${item.size}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
                <div class="remove-item" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        // Calcular totais
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        updateCartTotals(subtotal);
        
        // Adicionar event listeners para os botões de quantidade
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                updateItemQuantity(index, 1);
            });
        });
        
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                updateItemQuantity(index, -1);
            });
        });
        
        // Adicionar event listeners para remover itens
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeItemFromCart(index);
            });
        });
    }

    // Atualizar quantidade de um item
    function updateItemQuantity(index, change) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart[index]) {
            cart[index].quantity += change;
            
            // Se a quantidade for 0, remover o item
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
            updateCartIcon();
        }
    }

    // Remover item do carrinho
    function removeItemFromCart(index) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart[index]) {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
            updateCartIcon();
        }
    }

    // Atualizar totais do carrinho
    function updateCartTotals(subtotal) {
        const shipping = subtotal > 0 ? 15 : 0; // Frete fixo de R$ 15,00 para exemplo
        const total = subtotal + shipping;
        
        cartSubtotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        cartShipping.textContent = `R$ ${shipping.toFixed(2).replace('.', ',')}`;
        cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    // Finalizar compra
    checkoutBtn.addEventListener('click', () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        
        // Simulação de finalização de compra
        alert('Compra finalizada com sucesso! Obrigado pela preferência.');
        
        // Limpar carrinho
        localStorage.removeItem('cart');
        updateCartDisplay();
        updateCartIcon();
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Inicializar ícone do carrinho
    updateCartIcon();

    // TOGGLE DO TEMA CLARO/ESCURO
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Verificar se há uma preferência salva ou usar a preferência do sistema
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = prefersDarkScheme.matches ? 'dark' : 'light';
    const currentTheme = savedTheme || systemTheme;

    // Aplicar o tema inicial
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }

    // Alternar entre temas
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    });
});