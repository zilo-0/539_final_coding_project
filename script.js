const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const monthsData = [
    { 
        name: 'January', 
        spotifyId: '4FEr6dIdH6EqLKR0jB560J',
        description: 'A new year, an old song.'
    },
    { 
        name: 'February', 
        spotifyId: '6dCinyV7SIlfZarPHY7pbt',
        description: 'What fills my chill February evenings.'
    },
    { 
        name: 'March', 
        spotifyId: '0pWrU4My52DJ75GnZKDlv8',
        description: 'Trip hop March!'
    },
    { 
        name: 'April', 
        spotifyId: '6OQwMff2WPtGP0seQTgUh4',
        description: 'Jazz Metal for an intense April, and sleepless nights.'
    },
    { 
        name: 'May', 
        spotifyId: '0YEgsf81H5qrDG09l8wBtH',
        description: 'My favorite chinese experimental electronic music group band came back in May with a new album!'
    },
    { 
        name: 'June', 
        spotifyId: '10GfvzN9IObRdYctVQbZU9',
        description: 'It\'s getting warmer and warmer. Bring some heat.'
    },
    { 
        name: 'July', 
        spotifyId: '1Tedbu5oWtVY7rruak6zpE',
        description: 'All summers are long when you are in them. Like this song.'
    },
    { 
        name: 'August', 
        spotifyId: '6XWpLFadBmkIIihQDVqMiR',
        description: 'Summer, don\'t go away!'
    },
    { 
        name: 'September', 
        spotifyId: '1mRK7wx8mihCF7UYS8f07z',
        description: 'Dark jazz is for when the leaves are starting to fall.'
    },
    { 
        name: 'October', 
        spotifyId: '55enrFQCMzLYSdDeeLyhr5',
        description: 'Might as well enjoy the chill breeze of October.'
    },
    { 
        name: 'November', 
        spotifyId: '21wqgvfAvfiwzN1O5UvMEJ',
        description: 'Trying to find spring in my headphones.'
    },
    { 
        name: 'December', 
        spotifyId: '5PdijRkZTyfn6v05wGuC9U',
        description: 'It\'s the most intense month. it\'s the most relaxing month. It\'s complicated. Why don\'t we watch some boats?'
    }
];

const monthColors = {
    'January': 'rgba(173, 216, 230, 0.8)',   // Ice blue for winter
    'February': 'rgba(255, 182, 193, 0.8)',   // Pink for Valentine's
    'March': 'rgba(144, 238, 144, 0.8)',      // Spring green
    'April': 'rgba(230, 230, 250, 0.8)',      // Lavender for spring flowers
    'May': 'rgba(255, 218, 185, 0.8)',        // Peach for late spring
    'June': 'rgba(135, 206, 250, 0.8)',       // Sky blue for summer
    'July': 'rgba(255, 165, 0, 0.8)',         // Orange for summer heat
    'August': 'rgba(255, 215, 0, 0.8)',       // Golden for late summer
    'September': 'rgba(205, 133, 63, 0.8)',    // Peru brown for fall
    'October': 'rgba(255, 69, 0, 0.8)',        // Red-orange for autumn
    'November': 'rgba(139, 69, 19, 0.8)',      // Saddle brown for late fall
    'December': 'rgba(65, 105, 225, 0.8)'      // Royal blue for winter
};

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 3 + 2;
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 6 - 3;
        this.alpha = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.01;
        this.size -= 0.1;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'particle-canvas';
        // Find the main element and insert canvas as its first child
        const mainElement = document.querySelector('main');
        mainElement.insertBefore(this.canvas, mainElement.firstChild);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createBurst(x, y, color) {
        for (let i = 0; i < 30; i++) {
            this.particles.push(new Particle(x, y, color));
        }
        if (!this.isAnimating) {
            this.animate();
        }
    }

    animate() {
        this.isAnimating = true;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update();
            particle.draw(this.ctx);

            if (particle.alpha <= 0 || particle.size <= 0) {
                this.particles.splice(i, 1);
            }
        }

        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.isAnimating = false;
        }
    }
}

class MonthSlider {
    constructor() {
        this.currentIndex = 0;
        this.isAnimating = false;
        this.container = document.querySelector('.months-container');
        this.character = document.querySelector('.character');
        
        // Create array of sections for direct manipulation
        this.sections = [];
        
        // Add sound effect with correct path
        this.jumpSound = new Audio('assets/audios/maro-jump-sound-effect_1.mp3');
        this.jumpSound.volume = 0.3;  // Lowered volume a bit for better user experience
        
        this.progressBar = document.querySelector('.progress-bar');
        this.progressIndicator = document.querySelector('.progress');
        this.monthPreview = document.createElement('div');
        this.monthPreview.className = 'month-preview';
        this.progressBar.appendChild(this.monthPreview);
        
        this.particleSystem = new ParticleSystem();
        
        this.controlsPrompt = document.querySelector('.controls-prompt');
        this.updatePromptText(); // Initial update
        
        // Add resize listener to update prompt text when window size changes
        window.addEventListener('resize', () => this.updatePromptText());
        
        this.init();
        this.bindEvents();
    }

    init() {
        // Create all months at once
        monthsData.forEach((month, index) => {
            const section = document.createElement('section');
            section.className = 'month-section';
            section.style.transform = `translateX(${100 * index}vw)`;
            section.style.backgroundImage = `url('assets/images/Slice ${index + 1}.png')`;
            
            // Create the month content without the Spotify widget
            section.innerHTML = `
                <div class="month-header">
                    <h2>${month.name}'s Favorite Song</h2>
                    <p class="month-description">${month.description}</p>
                </div>
                <div class="song-content">
                    <div class="spotify-placeholder" data-month="${month.name}"></div>
                </div>
            `;
            
            // Create the Spotify widget in the player container
            const playerContainer = document.getElementById('player-container');
            const widget = document.createElement('div');
            widget.className = 'spotify-widget';
            widget.setAttribute('role', 'complementary');
            widget.setAttribute('aria-label', `${month.name}'s favorite song player`);
            widget.style.display = index === 0 ? 'block' : 'none';
            
            widget.innerHTML = `
                <iframe 
                    src="https://open.spotify.com/embed/track/${month.spotifyId}?utm_source=generator&theme=0"
                    title="${month.name}'s Song"
                    width="100%" 
                    height="152"
                    frameborder="0"
                    allow="encrypted-media"
                ></iframe>
            `;
            
            playerContainer.appendChild(widget);
            
            // Create list item for this month
            const monthListItem = document.createElement('li');
            monthListItem.appendChild(section);
            
            this.sections.push(section);
            this.container.querySelector('ul[role="list"]').appendChild(monthListItem);
        });

        // Create month indicators as proper list items
        const indicatorsList = document.querySelector('.month-indicators');
        monthsData.forEach((_, index) => {
            const li = document.createElement('li');
            li.className = 'month-indicator';
            li.setAttribute('aria-hidden', 'true');
            indicatorsList.appendChild(li);
        });
    }

    async goToMonth(index, direction = 1) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        // Update Spotify widget visibility
        const widgets = document.querySelectorAll('.spotify-widget');
        widgets.forEach((widget, i) => {
            widget.style.display = i === index ? 'block' : 'none';
        });

        // Create particle burst at Mario's position
        const marioRect = this.character.getBoundingClientRect();
        const color = monthColors[monthsData[index].name];
        this.particleSystem.createBurst(
            marioRect.left + marioRect.width / 2,
            marioRect.top + marioRect.height / 2,
            color
        );

        // Get current and next sections
        const currentSection = this.sections[this.currentIndex];
        const nextSection = this.sections[index];

        // Add flash effect to next section
        nextSection.classList.add('flash');
        setTimeout(() => nextSection.classList.remove('flash'), 500);

        // Move all sections
        this.sections.forEach((section, i) => {
            section.style.transition = 'transform 0.5s ease';
            section.style.transform = `translateX(${100 * (i - index)}vw)`;
        });

        // Animate Mario
        this.character.classList.add('jump');
        setTimeout(() => {
            this.character.classList.remove('jump');
            this.isAnimating = false;
        }, 500);

        this.currentIndex = index;
        this.updateProgress();
        document.documentElement.style.setProperty(
            '--progress-color', 
            monthColors[monthsData[index].name]
        );
    }

    next() {
        const nextIndex = (this.currentIndex + 1) % this.sections.length;
        this.goToMonth(nextIndex, 1);
    }

    prev() {
        const prevIndex = (this.currentIndex - 1 + this.sections.length) % this.sections.length;
        this.goToMonth(prevIndex, -1);
    }

    bindEvents() {
        document.addEventListener('keydown', e => {
            if (e.code === 'Space' || e.code === 'ArrowRight') {
                e.preventDefault();
                this.jumpSound.currentTime = 0;  // Reset sound to start
                this.jumpSound.play();
                this.next();
            } else if (e.code === 'ArrowLeft') {
                e.preventDefault();
                this.prev();
            }
        });

        document.querySelector('.next-btn').addEventListener('click', () => {
            this.jumpSound.currentTime = 0;
            this.jumpSound.play();
            this.next();
        });
        document.querySelector('.prev-btn').addEventListener('click', () => this.prev());

        // Add click event for Mario
        this.character.addEventListener('click', () => {
            if (!this.isAnimating) {
                this.jumpSound.currentTime = 0;
                this.jumpSound.play();
                this.next();
            }
        });

        // Add progress bar interaction
        this.progressBar.addEventListener('mousemove', (e) => {
            const rect = this.progressBar.getBoundingClientRect();
            const position = (e.clientX - rect.left) / rect.width;
            const monthIndex = Math.floor(position * this.sections.length);
            const month = monthsData[monthIndex];
            
            // Update preview position and content
            this.monthPreview.style.left = `${e.clientX}px`;
            this.monthPreview.textContent = month.name;
        });

        this.progressBar.addEventListener('click', (e) => {
            if (this.isAnimating) return;
            
            const rect = this.progressBar.getBoundingClientRect();
            const position = (e.clientX - rect.left) / rect.width;
            const monthIndex = Math.floor(position * this.sections.length);
            
            this.goToMonth(monthIndex);
        });
    }

    updateProgress() {
        const progress = document.querySelector('.progress');
        progress.style.width = `${((this.currentIndex + 1) / this.sections.length) * 100}%`;
    }

    updatePromptText() {
        // Check if device is mobile (screen width less than 768px)
        const isMobile = window.innerWidth < 768;
        this.controlsPrompt.textContent = isMobile 
            ? 'Click mario to jump to the next month!'
            : 'press spacebar to jump to the next month!';
    }
}

// Initialize and store instance
document.addEventListener('DOMContentLoaded', () => {
    window.monthSlider = new MonthSlider();
});
