document.addEventListener('DOMContentLoaded', () => {

    const GITHUB_USERNAME = 'pulkittaneja09';
    const projectsGrid = document.getElementById('projects-grid');
    const repoCountSpan = document.getElementById('repo-count');
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalTechs = document.getElementById('modal-techs');
    const modalLink = document.getElementById('modal-link');
    const closeButton = document.querySelector('.close-button');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    // --- GitHub API Fetch ---
    async function fetchGitHubData() {
        if (!projectsGrid) return;
        projectsGrid.innerHTML = `<div class="loader"></div>`;
        try {
            const [userResponse, reposResponse] = await Promise.all([
                fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
                fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&direction=desc`)
            ]);
            if (!userResponse.ok || !reposResponse.ok) throw new Error('Failed to fetch data from GitHub.');
            const userData = await userResponse.json();
            const repos = await reposResponse.json();
            projectsGrid.innerHTML = '';
            if (repoCountSpan) repoCountSpan.textContent = `(${userData.public_repos} Total)`;
            repos.slice(0, 6).forEach(repo => {
                const projectCard = document.createElement('div');
                projectCard.classList.add('project-card');
                projectCard.dataset.repoData = JSON.stringify({ name: repo.name, description: repo.description || 'No detailed description provided.', html_url: repo.html_url, languages_url: repo.languages_url });
                projectCard.innerHTML = `<h3>${repo.name}</h3>${repo.description ? `<p>${repo.description}</p>` : ''}`;
                projectsGrid.appendChild(projectCard);
                projectCard.addEventListener('click', () => openModal(projectCard));
            });
        } catch (error) {
            console.error("Error fetching GitHub data:", error);
            projectsGrid.innerHTML = `<p style="text-align: center; grid-column: 1 / -1;">Could not load projects. ${error.message}</p>`;
        }
    }

    // --- Modal Logic ---
    async function openModal(cardElement) {
        const data = JSON.parse(cardElement.dataset.repoData);
        modalTitle.textContent = data.name;
        modalDescription.textContent = data.description;
        modalLink.href = data.html_url;
        modalTechs.innerHTML = '<em>Loading...</em>';
        modal.style.display = 'block';
        try {
            const langResponse = await fetch(data.languages_url);
            if (!langResponse.ok) throw new Error('Could not fetch language data.');
            const languages = await langResponse.json();
            modalTechs.innerHTML = '';
            const langKeys = Object.keys(languages);
            if (langKeys.length > 0) {
                langKeys.forEach(lang => {
                    const techTag = document.createElement('span');
                    techTag.className = 'tech-tag';
                    techTag.textContent = lang;
                    modalTechs.appendChild(techTag);
                });
            } else {
                modalTechs.innerHTML = '<em>Not specified.</em>';
            }
        } catch (error) {
            console.error("Language fetch error:", error);
            modalTechs.innerHTML = '<em>Could not load languages.</em>';
        }
    }

    function closeModal() {
        if (modal) modal.style.display = 'none';
    }

    if (closeButton) closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == modal) closeModal();
    });

    // --- Contact Form Submission ---
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const form = e.target;
            const data = new FormData(form);
            formStatus.innerHTML = 'Sending...';
            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    formStatus.innerHTML = "Thanks for your message! I'll get back to you soon.";
                    formStatus.style.color = 'var(--accent-color)';
                    form.reset();
                } else {
                    const responseData = await response.json();
                    if (responseData.errors && responseData.errors.length > 0) {
                        formStatus.innerHTML = responseData.errors.map(error => error.message).join(", ");
                    } else {
                        formStatus.innerHTML = "Oops! There was a problem submitting your form.";
                    }
                    formStatus.style.color = 'red';
                }
            } catch (error) {
                formStatus.innerHTML = "Oops! There was a network problem.";
                formStatus.style.color = 'red';
            } finally {
                setTimeout(() => { formStatus.innerHTML = ''; }, 6000);
            }
        });
    }

    // --- Animations & Effects ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.scroll-section').forEach(section => observer.observe(section));

    const heroSection = document.getElementById('hero');
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            const { clientX, clientY } = e;
            const { offsetWidth, offsetHeight } = heroSection;
            const xPos = (clientX / offsetWidth) - 0.5;
            const yPos = (clientY / offsetHeight) - 0.5;
            heroSection.querySelectorAll('.parallax-layer').forEach(layer => {
                const speed = parseFloat(layer.dataset.speed);
                const xMove = xPos * speed;
                const yMove = yPos * speed;
                layer.style.transform = `translate(${xMove}px, ${yMove}px)`;
            });
        });
    }

    // --- Initial Fetch ---
    fetchGitHubData();
});