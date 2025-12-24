// ========== 核心数据定义（替代外部JSON） ==========
const booksData = [
  {
    id: 1,
    title: "HTML5+CSS3+Bootstrap响应式Web前端设计",
    author: "张三",
    price: 59.8,
    cover: "https://picsum.photos/300/400?random=1",
    press: "电子工业出版社",
    intro: "本书系统讲解HTML5、CSS3核心知识，结合Bootstrap框架实现响应式Web设计，包含大量实战案例，适合前端入门学习。",
    category: "计算机技术",
    sales: 1200,
    isNew: true
  },
  {
    id: 2,
    title: "JavaScript高级程序设计（第4版）",
    author: "李四",
    price: 89.0,
    cover: "https://picsum.photos/300/400?random=2",
    press: "人民邮电出版社",
    intro: "JavaScript经典权威指南，全面覆盖ES6+新特性，深入讲解DOM、BOM、异步编程等核心知识点，前端进阶必备。",
    category: "计算机技术",
    sales: 850,
    isNew: false
  },
  {
    id: 3,
    title: "活着",
    author: "余华",
    price: 29.5,
    cover: "https://picsum.photos/300/400?random=3",
    press: "作家出版社",
    intro: "讲述了福贵一生的悲欢，表达了对生命的敬畏与尊重，是中国当代文学的经典之作。",
    category: "文学小说",
    sales: 2000,
    isNew: false
  },
  {
    id: 4,
    title: "2025考研英语真题详解",
    author: "考研命题研究组",
    price: 45.8,
    cover: "https://picsum.photos/300/400?random=4",
    press: "高等教育出版社",
    intro: "包含近10年考研英语真题，逐题详解，配套视频讲解，考研复习必备资料。",
    category: "考试教辅",
    sales: 1500,
    isNew: true
  },
  {
    id: 5,
    title: "Python编程：从入门到实践",
    author: "埃里克·马瑟斯",
    price: 79.0,
    cover: "https://picsum.photos/300/400?random=5",
    press: "人民邮电出版社",
    intro: "零基础Python入门教程，包含大量实战项目，适合编程初学者。",
    category: "计算机技术",
    sales: 1800,
    isNew: true
  },
  {
    id: 6,
    title: "解忧杂货店",
    author: "东野圭吾",
    price: 39.5,
    cover: "https://picsum.photos/300/400?random=6",
    press: "南海出版公司",
    intro: "充满温情的治愈系小说，讲述了跨越时空的温暖故事，触动人心。",
    category: "文学小说",
    sales: 1900,
    isNew: false
  },
  {
      id: 7,
      title: "三体（全集）",
      author: "刘慈欣",
      price: 98.0,
      cover: "https://picsum.photos/300/400?random=7",
      press: "重庆出版社",
      intro: "刘慈欣科幻小说巅峰之作，包含《三体》《黑暗森林》《死神永生》三部，讲述地球人类文明与三体文明的信息交流、生死搏杀及两个文明在宇宙中的兴衰历程。",
      category: "文学小说",
      sales: 3500,
      isNew: false
    },
    {
      id: 8,
      title: "Java编程思想（第4版）",
      author: "Bruce Eckel",
      price: 108.0,
      cover: "https://picsum.photos/300/400?random=8",
      press: "机械工业出版社",
      intro: "经典Java教程，深入讲解Java语言核心概念、面向对象编程思想，以及Java高级特性，是Java程序员必读书籍。",
      category: "计算机技术",
      sales: 1600,
      isNew: true
    }
];

// ========== 单页面切换核心函数 ==========
function showPage(pageId) {
  // 隐藏所有页面
  document.querySelectorAll('.page-container').forEach(container => {
    container.classList.remove('active');
  });
  // 显示目标页面
  document.getElementById(pageId).classList.add('active');
  // 页面切换后初始化对应内容
  if (pageId === 'home') initHomePage();
  if (pageId === 'book-list') initBookListPage();
  if (pageId === 'cart') renderCart();
}

// ========== 公共函数 ==========
// 检测登录状态
function checkLoginStatus() {
  const user = localStorage.getItem('loggedUser');
  const loginLink = document.getElementById('login-link');
  const userLink = document.getElementById('user-link');
  
  if (user) {
    const userObj = JSON.parse(user);
    if (loginLink) loginLink.style.display = 'none';
    if (userLink) {
      userLink.style.display = 'block';
      userLink.querySelector('.dropdown-toggle').innerText = `您好，${userObj.username}`;
    }
  } else {
    if (loginLink) loginLink.style.display = 'block';
    if (userLink) userLink.style.display = 'none';
  }
}

// 退出登录
function logout() {
  localStorage.removeItem('loggedUser');
  alert('退出登录成功！');
  checkLoginStatus();
  showPage('home');
}

// 加载分类导航
function loadCategoryNav(containerId, isListPage = false) {
  const categoryContainer = document.getElementById(containerId);
  if (!categoryContainer) return;
  
  const categories = [
    { name: '全部图书', action: isListPage ? "loadBooksByCategory('')" : "showPage('book-list');loadBooksByCategory('')" },
    { name: '计算机技术', action: isListPage ? "loadBooksByCategory('计算机技术')" : "showPage('book-list');loadBooksByCategory('计算机技术')" },
    { name: '文学小说', action: isListPage ? "loadBooksByCategory('文学小说')" : "showPage('book-list');loadBooksByCategory('文学小说')" },
    { name: '考试教辅', action: isListPage ? "loadBooksByCategory('考试教辅')" : "showPage('book-list');loadBooksByCategory('考试教辅')" }
  ];
  
  let html = '';
  categories.forEach(cat => {
    html += `<span class="category-item" onclick="${cat.action}">${cat.name}</span>`;
  });
  categoryContainer.innerHTML = html;
}

// ========== 首页初始化 ==========
function initHomePage() {
  // 加载首页分类导航
  loadCategoryNav('category-container-home');
  // 加载新品推荐
  loadNewBooks();
  // 加载热销榜单
  loadHotBooks();
}

// 加载新品推荐
function loadNewBooks() {
  const newBooks = booksData.filter(book => book.isNew);
  const bookList = document.getElementById('new-books-list');
  
  let html = '';
  newBooks.forEach(book => {
    html += `
      <div class="col-md-3 col-sm-6 mb-4">
        <div class="card h-100">
          <img src="${book.cover}" class="card-img-top" alt="${book.title}">
          <div class="card-body">
            <h5 class="card-title">${book.title}</h5>
            <p class="card-text text-muted">${book.author}</p>
            <p class="card-text font-weight-bold">¥${book.price}</p>
            <button class="btn btn-outline-dark" onclick="showBookDetail(${book.id})">查看详情</button>
          </div>
        </div>
      </div>
    `;
  });
  
  bookList.innerHTML = html;
}

// 加载热销榜单
function loadHotBooks() {
  // 按销量排序
  const hotBooks = [...booksData].sort((a, b) => b.sales - a.sales);
  const bookList = document.getElementById('hot-books-list');
  
  let html = '';
  hotBooks.forEach(book => {
    html += `
      <div class="col-md-3 col-sm-6 mb-4">
        <div class="card h-100">
          <img src="${book.cover}" class="card-img-top" alt="${book.title}">
          <div class="card-body">
            <h5 class="card-title">${book.title}</h5>
            <p class="card-text text-muted">${book.author}</p>
            <p class="card-text font-weight-bold">¥${book.price}</p>
            <button class="btn btn-outline-dark" onclick="showBookDetail(${book.id})">查看详情</button>
          </div>
        </div>
      </div>
    `;
  });
  
  bookList.innerHTML = html;
}

// ========== 图书列表页初始化 ==========
function initBookListPage() {
  loadCategoryNav('category-container-list', true);
  loadBooksByCategory(''); // 默认加载全部
}

// 按分类加载图书
function loadBooksByCategory(category) {
  const titleEl = document.getElementById('book-list-title');
  const bookList = document.getElementById('all-books-list');
  
  // 筛选分类
  let filteredBooks = booksData;
  if (category && category !== '') {
    filteredBooks = booksData.filter(book => book.category === category);
    titleEl.innerText = category + ' - 图书列表';
  } else {
    titleEl.innerText = '全部图书';
  }
  
  let html = '';
  if (filteredBooks.length === 0) {
    html = '<div class="col-12 text-center py-5"><h5>暂无该分类图书</h5></div>';
  } else {
    filteredBooks.forEach(book => {
      html += `
        <div class="col-md-3 col-sm-6 mb-4">
          <div class="card h-100">
            <img src="${book.cover}" class="card-img-top" alt="${book.title}">
            <div class="card-body">
              <h5 class="card-title">${book.title}</h5>
              <p class="card-text text-muted">${book.author}</p>
              <p class="card-text font-weight-bold">¥${book.price}</p>
              <button class="btn btn-outline-dark" onclick="showBookDetail(${book.id})">查看详情</button>
            </div>
          </div>
        </div>
      `;
    });
  }
  
  bookList.innerHTML = html;
}

// ========== 图书详情页 ==========
function showBookDetail(bookId) {
  showPage('book-detail');
  const book = booksData.find(item => item.id === bookId);
  if (!book) return;

  // 渲染图书详情
  const detailContainer = document.getElementById('book-detail-container');
  detailContainer.innerHTML = `
    <div class="row">
      <div class="col-md-4 book-cover">
        <img src="${book.cover}" alt="${book.title}">
      </div>
      <div class="col-md-8 book-info">
        <h2 class="mb-3">${book.title}</h2>
        <p class="text-muted mb-2">作者：${book.author}</p>
        <p class="text-muted mb-2">出版社：${book.press}</p>
        <p class="h4 text-accent mb-4">¥${book.price.toFixed(2)}</p>
        <div class="mb-4">
          <button class="btn btn-accent me-3" onclick="addToCart(${book.id})">加入购物车</button>
          <button class="btn btn-outline-dark" onclick="buyNow(${book.id})">立即购买</button>
        </div>
        <div class="book-intro">
          <h5>内容简介：</h5>
          <p>${book.intro}</p>
        </div>
      </div>
    </div>
  `;

  // 加载相关推荐
  loadRelatedBooks(book.category, book.id);
}

// 加载相关推荐图书
function loadRelatedBooks(category, excludeId) {
  const relatedBooks = booksData.filter(item => item.category === category && item.id !== excludeId).slice(0, 3);
  const relatedContainer = document.getElementById('related-books-container');

  if (relatedContainer && relatedBooks.length > 0) {
    let html = '<h4 class="mt-5 mb-3">相关推荐</h4><div class="row">';
    relatedBooks.forEach(book => {
      html += `
        <div class="col-md-4 mb-3">
          <div class="card h-100">
            <img src="${book.cover}" class="card-img-top" alt="${book.title}">
            <div class="card-body">
              <h5 class="card-title">${book.title}</h5>
              <p class="card-text font-weight-bold">¥${book.price}</p>
              <button class="btn btn-outline-dark btn-sm" onclick="showBookDetail(${book.id})">查看详情</button>
            </div>
          </div>
        </div>
      `;
    });
    html += '</div>';
    relatedContainer.innerHTML = html;
  } else {
    relatedContainer.innerHTML = '';
  }
}

// ========== 购物车逻辑 ==========
// 加入购物车
function addToCart(bookId) {
  // 检测登录状态
  const user = localStorage.getItem('loggedUser');
  if (!user) {
    if (confirm('请先登录！是否跳转到登录页？')) {
      showPage('login');
    }
    return;
  }

  const book = booksData.find(item => item.id === bookId);
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingBook = cart.find(item => item.id === bookId);

  if (existingBook) {
    existingBook.quantity += 1; // 已存在则增加数量
  } else {
    cart.push({ ...book, quantity: 1 }); // 新增商品
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert('已加入购物车！');
}

// 立即购买
function buyNow(bookId) {
  addToCart(bookId);
  showPage('cart');
}

// 渲染购物车
function renderCart() {
  const cartContainer = document.getElementById('cart-container');
  const totalPriceEl = document.getElementById('total-price');
  
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // 购物车为空
  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-5">
          <h5>您的购物车为空</h5>
          <button class="btn btn-accent mt-3" onclick="showPage('book-list')">去逛逛</button>
        </td>
      </tr>
    `;
    totalPriceEl.innerText = '¥0.00';
    return;
  }

  // 渲染购物车列表
  let html = '';
  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = (item.price * item.quantity).toFixed(2);
    total += Number(subtotal);

    html += `
      <tr>
        <td>
          <img src="${item.cover}" alt="${item.title}" width="60">
        </td>
        <td>${item.title}</td>
        <td>${item.author}</td>
        <td>¥${item.price.toFixed(2)}</td>
        <td>
          <button class="btn btn-sm btn-outline-dark" onclick="changeQuantity(${index}, -1)">-</button>
          <span class="mx-2">${item.quantity}</span>
          <button class="btn btn-sm btn-outline-dark" onclick="changeQuantity(${index}, 1)">+</button>
        </td>
        <td>¥${subtotal}</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="removeCartItem(${index})">删除</button>
        </td>
      </tr>
    `;
  });

  cartContainer.innerHTML = html;
  totalPriceEl.innerText = `¥${total.toFixed(2)}`;
}

// 修改商品数量
function changeQuantity(index, num) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart[index].quantity + num < 1) return; // 数量不能小于1
  cart[index].quantity += num;
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// 删除购物车商品
function removeCartItem(index) {
  if (confirm('确定要删除该商品吗？')) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  }
}

// 结算功能
function checkout() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    alert('购物车为空，无法结算！');
    return;
  }
  
  if (confirm('确认结算？（模拟支付流程）')) {
    alert('订单提交成功！感谢您的购买～');
    localStorage.removeItem('cart'); // 清空购物车
    renderCart();
  }
}

// ========== 登录注册逻辑 ==========
// 注册功能
function register() {
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;
  const repassword = document.getElementById('register-repassword').value;

  // 表单验证
  if (!username || username.length < 6) {
    alert('用户名不能为空且长度不少于6位！');
    return;
  }

  if (!password || password.length < 8) {
    alert('密码不能为空且长度不少于8位！');
    return;
  }

  if (password !== repassword) {
    alert('两次输入的密码不一致！');
    return;
  }

  // 检查用户名是否已存在
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const exists = users.find(user => user.username === username);
  
  if (exists) {
    alert('用户名已存在！');
    return;
  }

  // 保存用户信息
  users.push({ username, password });
  localStorage.setItem('users', JSON.stringify(users));
  alert('注册成功！请登录');
  showPage('login');
}

// 登录功能
function login() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  // 表单验证
  if (!username || !password) {
    alert('用户名和密码不能为空！');
    return;
  }

  // 验证用户信息
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(item => item.username === username && item.password === password);
  
  if (user) {
    // 保存登录状态
    localStorage.setItem('loggedUser', JSON.stringify({ username }));
    alert('登录成功！');
    checkLoginStatus();
    showPage('home');
  } else {
    alert('用户名或密码错误！');
  }
}

// ========== 页面初始化 ==========
document.addEventListener('DOMContentLoaded', function() {
  // 初始化登录状态
  checkLoginStatus();
  // 初始化首页
  initHomePage();
  
  // 绑定退出登录按钮
  document.getElementById('logout-btn').addEventListener('click', logout);
  // 绑定结算按钮
  document.getElementById('checkout-btn').addEventListener('click', checkout);
  // 绑定注册按钮
  document.getElementById('register-btn').addEventListener('click', register);
  // 绑定登录按钮
  document.getElementById('login-btn').addEventListener('click', login);
});