document.addEventListener('DOMContentLoaded', function () {
    // CARROSSEL ORIGINAL (como estava)
    const images = document.querySelectorAll('.carousel-image');
    const indicators = document.querySelectorAll('.carousel-indicator');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    const carouselContainer = document.querySelector('.carousel-container');
    let current = 0;
    let interval;

    function showImage(index) {
        images.forEach(img => img.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        images[index].classList.add('active');
        indicators[index].classList.add('active');
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

    // SISTEMA DE LOGIN/CADASTRO COM LOCALSTORAGE
    const userIcon = document.getElementById('userIcon');
    const loginModal = document.getElementById('loginModal');
    const closeModals = document.querySelectorAll('.close-modal');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const usernameDisplay = document.getElementById('nomeDoUsuario');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');

    // Alternar entre login e cadastro
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            
            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${tabName}Form`).classList.add('active');
        });
    });

    // Fechar modais
    closeModals.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
            document.body.style.overflow = 'auto';
        });
    });

    // Abrir modal de login
    userIcon.addEventListener('click', () => {
        loginModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Verificar se já está logado
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            document.getElementById('loginForm').querySelector('h2').textContent = 'Perfil';
            document.getElementById('loginBtn').textContent = 'Sair';
        } else {
            document.getElementById('loginForm').querySelector('h2').textContent = 'Login';
            document.getElementById('loginBtn').textContent = 'Entrar';
        }
    });

    // Cadastro de usuário
    registerBtn.addEventListener('click', () => {
        const name = document.getElementById('registerName').value.trim();
        const username = document.getElementById('registerUsername').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        const errorElement = document.getElementById('registerError');
        
        errorElement.textContent = '';
        
        // Validações
        if (!name || !username || !email || !password || !confirmPassword) {
            errorElement.textContent = 'Por favor, preencha todos os campos.';
            return;
        }
        
        if (password !== confirmPassword) {
            errorElement.textContent = 'As senha não coincidem.';
            return;
        }
        
        if (password.length < 6) {
            errorElement.textContent = 'A senha deve ter pelo menos 6 caracteres.';
            return;
        }
        
        // Verificar se usuário já existe
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(user => user.username === username)) {
            errorElement.textContent = 'Este nome de usuário já está em uso.';
            return;
        }
        
        if (users.some(user => user.email === email)) {
            errorElement.textContent = 'Este e-mail já está cadastrado.';
            return;
        }
        
        // Criar novo usuário
        const newUser = {
            name,
            username,
            email,
            password // Em uma aplicação real, isso seria criptografado
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Logar automaticamente
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        usernameDisplay.textContent = newUser.name;
        
        // Fechar modal
        loginModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Feedback visual
        userIcon.style.color = '#4a90e2';
        setTimeout(() => {
            userIcon.style.color = '';
        }, 2000);
        
        alert('Cadastro realizado com sucesso!');
    });

    // Login de usuário
    loginBtn.addEventListener('click', () => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        // Se já está logado, fazer logout
        if (currentUser) {
            localStorage.removeItem('currentUser');
            usernameDisplay.textContent = 'Visitante';
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            alert('Logout realizado com sucesso!');
            return;
        }
        
        // Se não está logado, fazer login
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        const errorElement = document.getElementById('loginError');
        
        errorElement.textContent = '';
        
        if (!username || !password) {
            errorElement.textContent = 'Por favor, preencha todos os campos.';
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);
        
        if (!user) {
            errorElement.textContent = 'Usuário ou senha incorretos.';
            return;
        }
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        usernameDisplay.textContent = user.name;
        
        loginModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        userIcon.style.color = '#4a90e2';
        setTimeout(() => {
            userIcon.style.color = '';
        }, 2000);
    });

    // Verificar se já está logado ao carregar a página
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        usernameDisplay.textContent = currentUser.name;
    }

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
    const calculateShipping = document.getElementById('calculateShipping');
    const shippingOptions = document.getElementById('shippingOptions');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Abrir carrinho
    cartIcon.addEventListener('click', () => {
        // Verificar se o usuário está logado
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            alert('Por favor, faça login para acessar o carrinho.');
            loginModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            return;
        }
        
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
             // Verificar se o usuário está logado
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) {
                alert('Por favor, faça login para adicionar produtos ao carrinho.');
                loginModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                return;
            }
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
    }  // Atualizar quantidade de um item
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
    
    // Calcular frete
    calculateShipping.addEventListener('click', () => {
        const zipcode = document.getElementById('shippingZipcode').value.trim();
        
        if (!zipcode || zipcode.length !== 8) {
            alert('Por favor, insira um CEP válido com 8 dígitos.');
            return;
        }
        
        // Simulação de cálculo de frete
        shippingOptions.innerHTML = `
            <div class="shipping-options">
                <div class="shipping-option selected">
                    <input type="radio" name="shipping" checked>
                    <span>Entrega Padrão</span>
                    <span>R$ 15,00</span>
                </div>
                <div class="shipping-option">
                    <input type="radio" name="shipping">
                    <span>Entrega Expressa</span>
                    <span>R$ 25,00</span>
                </div>
            </div>
        `;
        
        // Atualizar totais com frete
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        updateCartTotals(subtotal);
    });
    
    // Finalizar compra
    checkoutBtn.addEventListener('click', () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!currentUser) {
            alert('Por favor, faça login para finalizar a compra.');
            loginModal.style.display = 'flex';
            cartModal.style.display = 'none';
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

     // SMOOTH SCROLL COM INÉRCIA (DELAY) - RESTAURADO
    let currentScroll = window.scrollY;
    let targetScroll = window.scrollY;
    let isScrolling = false;

    function smoothScroll() {
        currentScroll += (targetScroll - currentScroll) * 0.04;
        window.scrollTo(0, currentScroll);

        if (Math.abs(targetScroll - currentScroll) > 0.5) {
            requestAnimationFrame(smoothScroll);
        } else {
            isScrolling = false;
        }
    }

    window.addEventListener("wheel", (e) => {
        e.preventDefault();
        targetScroll += e.deltaY;
        targetScroll = Math.max(0, Math.min(targetScroll, document.body.scrollHeight - window.innerHeight));

        if (!isScrolling) {
            isScrolling = true;
            requestAnimationFrame(smoothScroll);
        }
    }, { passive: false });
});