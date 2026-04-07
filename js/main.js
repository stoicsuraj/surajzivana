// Blog App - Minimal & Clean
const app = {
  posts: [],
  currentTheme: 'light',

  init() {
    this.loadTheme();
    this.setupThemeToggle();
    this.loadPosts();
    this.bindEvents();
    this.showSection('home');
  },

  loadTheme() {
    const saved = localStorage.getItem('theme') || 'light';
    this.currentTheme = saved;
    document.documentElement.setAttribute('data-theme', saved);
  },

  setupThemeToggle() {
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.textContent = this.currentTheme === 'light' ? 'dark mode' : 'light mode';
      btn.addEventListener('click', () => this.toggleTheme());
    }
  },

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.currentTheme = newTheme;
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    document.querySelector('.theme-toggle').textContent = 
      newTheme === 'light' ? 'dark mode' : 'light mode';
  },

  loadPosts() {
    this.posts = [
      {
        id: 'revered-stranger',
        title: 'revered stranger',
        date: 'Apr 5, 2026',
        snippet: 'lost in a lady\'s imagination during a storm.',
        filename: 'revered-stranger.html'
      },
      {
        id: 'unreciprocated-devoutness',
        title: 'unreciprocated devoutness',
        date: 'Mar 28, 2026',
        snippet: ' devotion that goes unrecognized and the quiet resilience within.',
        filename: 'unreciprocated-devoutness.html'
      },
      {
        id: 'the-fall-of-icarus',
        title: 'the fall of icarus',
        date: 'Mar 20, 2026',
        snippet: 'a meditation on ambition, mortality, and what it means to reach for the sky.',
        filename: 'the-fall-of-icarus.html'
      },
      {
        id: 'ekant-man',
        title: 'एकान्त मन',
        date: 'Feb 25, 2026',
        snippet: 'solitude captured in words.',
        filename: 'ekant-man.html'
      },
      {
        id: 'arthdah',
        title: 'अर्थदाह',
        date: 'Jan 22, 2026',
        snippet: 'न देव मान्छु म - questioning dogma and embracing inner fire.',
        filename: 'arthdah.html'
      },
      {
        id: 'basantapur',
        title: 'basantapur, and the weight of faces',
        date: 'Jan 18, 2026',
        snippet: 'a meditation on solitude, misunderstanding, and the impossibility of full translation in human connection.',
        filename: 'basantapur.html'
      },
      {
        id: 'i-hate-you',
        title: 'i hate you',
        date: 'Feb 17, 2025',
        snippet: 'a raw exploration of love masked as hate, pride bruised by loss.',
        filename: 'i-hate-you.html'
      },
      {
        id: 'me-and-her',
        title: 'me and her',
        date: 'Feb 11, 2024',
        snippet: 'a poignant reflection on love, loss, and the courage to let go.',
        filename: 'me-and-her.html'
      },
      {
        id: 'anitya-satya',
        title: 'अनित्यं सत्यं',
        date: 'Mar 6, 2024',
        snippet: 'a meditation on impermanence, the transience of life, and truth eternal.',
        filename: 'anitya-satya.html'
      },
      {
        id: 'schooling',
        title: 'schooling',
        date: 'Jul 18, 2022',
        snippet: 'a reflection on overconfidence, growth, and the lessons learned from a principal and a tree.',
        filename: 'schooling.html'
      }
    ];
  },

  bindEvents() {
    // Navigation
    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.showSection(link.getAttribute('data-section'));
        window.scrollTo(0, 0);
      });
    });

    // Post links
    document.addEventListener('click', (e) => {
      const postLink = e.target.closest('[data-post-id]');
      if (postLink) {
        e.preventDefault();
        this.showPost(postLink.getAttribute('data-post-id'));
        window.scrollTo(0, 0);
      }
    });

    // Back button
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('back-button')) {
        e.preventDefault();
        this.showSection('posts');
        window.scrollTo(0, 0);
      }
    });
  },

  showSection(name) {
    // Hide all
    document.querySelectorAll('main > section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.post-detail').forEach(d => d.classList.remove('active'));
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));

    // Show selected
    const section = document.getElementById(name);
    if (section) {
      section.classList.add('active');
      document.querySelector(`nav a[data-section="${name}"]`)?.classList.add('active');
      
      // Render content
      if (name === 'home') this.renderHome();
      else if (name === 'posts') this.renderPosts();
    }
  },

  renderHome() {
    const content = document.getElementById('home-content');
    if (!content) return;
    
    let html = '<h1><i>swagat cha</i></h1><p><i>few of the stuffs i wrote</i></p><div class="posts-grid">';
    
    this.posts.forEach(post => {
      html += `
        <div class="post-card">
          <div class="post-date">${post.date}</div>
          <h3 class="post-title"><a href="#" data-post-id="${post.id}">${post.title}</a></h3>
          <p class="post-snippet">${post.snippet}</p>
        </div>
      `;
    });
    
    html += '</div>';
    content.innerHTML = html;
  },

  renderPosts() {
    const content = document.getElementById('posts-content');
    if (!content) return;
    
    let html = '<h1>stuffs i penned</h1><div class="posts-list">';
    
    this.posts.forEach(post => {
      html += `
        <div class="post-card">
          <div class="post-date">${post.date}</div>
          <h3 class="post-title"><a href="#" data-post-id="${post.id}">${post.title}</a></h3>
          <p class="post-snippet">${post.snippet}</p>
        </div>
      `;
    });
    
    html += '</div>';
    content.innerHTML = html;
  },

  async showPost(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    // Hide everything
    document.querySelectorAll('main > section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.post-detail').forEach(d => d.classList.remove('active'));
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));

    // Load and render
    try {
      const response = await fetch(`./posts/${post.filename}`);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const content = doc.querySelector('.post-content')?.innerHTML || '';

      let container = document.getElementById('post-detail-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'post-detail-container';
        document.querySelector('main').appendChild(container);
      }

      container.innerHTML = `
        <div class="post-detail active">
          <h2>${post.title}</h2>
          <p style="color: var(--text); opacity: 0.75;">${post.date}</p>
          <div class="post-detail-content">${content}</div>
          <button class="back-button">← Back</button>
        </div>
      `;
      container.classList.add('active');
    } catch (error) {
      console.error('Error loading post:', error);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => app.init());
