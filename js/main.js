const app = {
  posts: [],
  books: null,
  papers: null,
  currentTheme: 'light',

  async init() {
    this.loadTheme();
    this.setupThemeToggle();
    this.loadPosts();
    await Promise.all([this.loadBooks(), this.loadPapers()]);
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
        id: 'who-am-i',
        title: 'who am i?',
        date: 'Apr 11, 2026',
        dateObj: new Date('Apr 11, 2026'),
        snippet: 'a meditation on identity, self-discovery, and the journey of becoming.',
        filename: 'who-am-i.html'
      },
      {
        id: 'revered-stranger',
        title: 'revered stranger',
        date: 'Apr 5, 2026',
        dateObj: new Date('Apr 5, 2026'),
        snippet: 'lost in a lady\'s imagination during a storm.',
        filename: 'revered-stranger.html'
      },
      {
        id: 'unreciprocated-devoutness',
        title: 'unreciprocated devoutness',
        date: 'Mar 28, 2026',
        dateObj: new Date('Mar 28, 2026'),
        snippet: ' devotion that goes unrecognized and the quiet resilience within.',
        filename: 'unreciprocated-devoutness.html'
      },
      {
        id: 'the-fall-of-icarus',
        title: 'the fall of icarus',
        date: 'Mar 20, 2026',
        dateObj: new Date('Mar 20, 2026'),
        snippet: 'a meditation on ambition, mortality, and what it means to reach for the sky.',
        filename: 'the-fall-of-icarus.html'
      },
      {
        id: 'ekant-man',
        title: 'एकान्त मन',
        date: 'Feb 25, 2026',
        dateObj: new Date('Feb 25, 2026'),
        snippet: 'solitude captured in words.',
        filename: 'ekant-man.html'
      },
      {
        id: 'arthdah',
        title: 'अर्थदाह',
        date: 'Jan 22, 2026',
        dateObj: new Date('Jan 22, 2026'),
        snippet: 'न देव मान्छु म - questioning dogma and embracing inner fire.',
        filename: 'arthdah.html'
      },
      {
        id: 'basantapur',
        title: 'basantapur, and the weight of faces',
        date: 'Jan 18, 2026',
        dateObj: new Date('Jan 18, 2026'),
        snippet: 'a meditation on solitude, misunderstanding, and the impossibility of full translation in human connection.',
        filename: 'basantapur.html'
      },
      {
        id: 'i-hate-you',
        title: 'i hate you',
        date: 'Feb 17, 2025',
        dateObj: new Date('Feb 17, 2025'),
        snippet: 'a raw exploration of love masked as hate, pride bruised by loss.',
        filename: 'i-hate-you.html'
      },
      {
        id: 'me-and-her',
        title: 'me and her',
        date: 'Feb 11, 2024',
        dateObj: new Date('Feb 11, 2024'),
        snippet: 'a poignant reflection on love, loss, and the courage to let go.',
        filename: 'me-and-her.html'
      },
      {
        id: 'anitya-satya',
        title: 'अनित्यं सत्यं',
        date: 'Mar 6, 2024',
        dateObj: new Date('Mar 6, 2024'),
        snippet: 'a meditation on impermanence, the transience of life, and truth eternal.',
        filename: 'anitya-satya.html'
      },
      {
        id: 'schooling',
        title: 'schooling',
        date: 'Jul 18, 2022',
        dateObj: new Date('Jul 18, 2022'),
        snippet: 'a reflection on overconfidence, growth, and the lessons learned from a principal and a tree.',
        filename: 'schooling.html'
      }
    ];
  },

  async loadBooks() {
    try {
      const response = await fetch('./books/data.json');
      this.books = await response.json();
    } catch (error) {
      console.error('Error loading books:', error);
      this.books = { currentlyReading: [], favorites: [] };
    }
  },

  async loadPapers() {
    try {
      const response = await fetch('./papers/data.json');
      this.papers = await response.json();
    } catch (error) {
      console.error('Error loading papers:', error);
      this.papers = { currentlyReading: [], fascinating: [] };
    }
  },

  getRecentPosts(limit = 4) {
    return [...this.posts]
      .sort((a, b) => b.dateObj - a.dateObj)
      .slice(0, limit);
  },

  bindEvents() {
    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.showSection(link.getAttribute('data-section'));
        window.scrollTo(0, 0);
      });
    });
    document.addEventListener('click', (e) => {
      const postLink = e.target.closest('[data-post-id]');
      if (postLink) {
        e.preventDefault();
        this.showPost(postLink.getAttribute('data-post-id'));
        window.scrollTo(0, 0);
      }
    });
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('back-button')) {
        e.preventDefault();
        this.showSection('posts');
        window.scrollTo(0, 0);
      }
    });
  },

  showSection(name) {
    document.querySelectorAll('main > section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.post-detail').forEach(d => d.classList.remove('active'));
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    const section = document.getElementById(name);
    if (section) {
      section.classList.add('active');
      document.querySelector(`nav a[data-section="${name}"]`)?.classList.add('active');
      
      if (name === 'home') this.renderHome();
      else if (name === 'posts') this.renderPosts();
      else if (name === 'books') this.renderBooks();
      else if (name === 'papers') this.renderPapers();
    }
  },

  renderHome() {
    const content = document.getElementById('home-content');
    if (!content) return;
    
    const recentPosts = this.getRecentPosts(4);
    
    let html = '<h1><i>swagat cha</i></h1><p><i>here to waste time?</i></p><div class="posts-grid">';
    
    recentPosts.forEach(post => {
      html += `
        <div class="post-card">
          <div class="post-date">${post.date}</div>
          <h3 class="post-title"><a href="#" data-post-id="${post.id}">${post.title}</a></h3>
          <p class="post-snippet">${post.snippet}</p>
        </div>
      `;
    });
    
    html += '</div>';

    
    if (this.books && this.books.currentlyReading.length > 0) {
      html += '<h2 class="section-subtitle">currently reading</h2>';
      html += '<div class="books-papers-container"><div class="books-section">';
      html += '<h3 class="subsection-title">books</h3><div class="reading-list">';
      
      this.books.currentlyReading.forEach(book => {
        html += `
          <div class="reading-item">
            <span class="reading-title">${book.title}</span>
            <span class="reading-author">${book.author}</span>
          </div>
        `;
      });
      
      html += '</div></div>';
    }

   
    if (this.papers && this.papers.currentlyReading.length > 0) {
      if (!this.books || this.books.currentlyReading.length === 0) {
        html += '<h2 class="section-subtitle">currently reading</h2>';
        html += '<div class="books-papers-container">';
      }
      
      html += '<div class="papers-section"><h3 class="subsection-title">papers</h3><div class="reading-list">';
      
      this.papers.currentlyReading.forEach(paper => {
        html += `
          <div class="reading-item">
            <span class="reading-title">${paper.title}</span>
            <span class="reading-author">${paper.authors}</span>
          </div>
        `;
      });
      
      html += '</div></div>';
      html += '</div>';
    }
    
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

    document.querySelectorAll('main > section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.post-detail').forEach(d => d.classList.remove('active'));
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));

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
  },

  renderBooks() {
    const content = document.getElementById('books-content');
    if (!content || !this.books) return;

    let html = '<h1>books</h1>';

    if (this.books.currentlyReading && this.books.currentlyReading.length > 0) {
      html += '<h2 class="books-section-title">currently reading</h2><div class="books-list">';
      this.books.currentlyReading.forEach(book => {
        html += `
          <div class="book-card">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">by ${book.author}</p>
          </div>
        `;
      });
      html += '</div>';
    }

    if (this.books.favorites && this.books.favorites.length > 0) {
      html += '<h2 class="books-section-title">favorites</h2><div class="books-list">';
      this.books.favorites.forEach(book => {
        html += `
          <div class="book-card">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">by ${book.author}</p>
            <p class="book-feedback">${book.feedback}</p>
          </div>
        `;
      });
      html += '</div>';
    }

    content.innerHTML = html;
  },

  renderPapers() {
    const content = document.getElementById('papers-content');
    if (!content || !this.papers) return;

    let html = '<h1>papers</h1>';

    if (this.papers.currentlyReading && this.papers.currentlyReading.length > 0) {
      html += '<h2 class="papers-section-title">currently reading</h2><div class="papers-list">';
      this.papers.currentlyReading.forEach(paper => {
        html += `
          <div class="paper-card">
            <h3 class="paper-title">${paper.title}</h3>
            <p class="paper-authors">${paper.authors}</p>
          </div>
        `;
      });
      html += '</div>';
    }

    if (this.papers.fascinating && this.papers.fascinating.length > 0) {
      html += '<h2 class="papers-section-title">fascinating</h2><div class="papers-list">';
      this.papers.fascinating.forEach(paper => {
        html += `
          <div class="paper-card">
            <h3 class="paper-title">${paper.title}</h3>
            <p class="paper-authors">${paper.authors}</p>
            <p class="paper-learned">${paper.whatLearned}</p>
          </div>
        `;
      });
      html += '</div>';
    }

    content.innerHTML = html;
  }
};

document.addEventListener('DOMContentLoaded', async () => await app.init());
