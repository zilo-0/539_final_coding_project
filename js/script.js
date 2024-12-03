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

class SongReveal {
    constructor() {
        this.currentMonth = 0;
        this.container = document.querySelector('.months-container');
        this.character = document.querySelector('.character');
        this.progress = document.querySelector('.progress');
        this.isAnimating = false;

        this.lastScrollTime = Date.now();
        this.scrollThreshold = 50;
        this.scrollCooldown = 500;

        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
        this.handleNextClick = () => {
            if (!this.isAnimating) this.revealNext();
        };
        this.handlePrevClick = () => {
            if (!this.isAnimating) this.revealPrevious();
        };

        this.initializeMonths();
        this.setupEventListeners();
    }

    initializeMonths() {
        monthsData.forEach((month, index) => {
            const section = document.createElement('section');
            section.className = 'month-section';
            section.style.backgroundImage = `url('assets/images/Slice ${index + 1}.png')`;
            section.innerHTML = `
                <div class="month-header">
                    <h2>${month.name}'s Favorite Song</h2>
                    <p class="month-description">${month.description}</p>
                </div>
                <div class="song-content hidden">
                    <div class="spotify-widget" 
                        role="complementary" 
                        aria-label="${month.name}'s favorite song player"
                    >
                        <iframe 
                            src="https://open.spotify.com/embed/track/${month.spotifyId}?utm_source=generator&theme=0"
                            title="Spotify player: ${month.name}'s favorite song"
                            aria-label="Spotify embedded player for ${month.name}'s monthly favorite song"
                            width="100%"
                            height="152"
                            frameborder="0"
                            allowtransparency="true"
                            allow="encrypted-media"
                            style="border-radius: 12px;"
                            role="application"
                            tabindex="0"
                        ></iframe>
                    </div>
                </div>
            `;
            this.container.appendChild(section);
        });
    }

    setupEventListeners() {
        document.addEventListener('keydown', this.handleKeydown, { capture: true, passive: false });
        this.container.addEventListener('wheel', this.handleWheel, { 
            passive: false,
            capture: true 
        });
        document.querySelector('.next-btn').addEventListener('click', this.handleNextClick, { 
            capture: true,
            passive: true 
        });
        document.querySelector('.prev-btn').addEventListener('click', this.handlePrevClick, { 
            capture: true,
            passive: true 
        });
    }

    handleKeydown(e) {
        if (e.code === 'Space' && !this.isAnimating) {
            e.preventDefault();
            this.revealNext();
        } else if (e.code === 'ArrowRight' && !this.isAnimating) {
            e.preventDefault();
            this.revealNext();
        } else if (e.code === 'ArrowLeft' && !this.isAnimating) {
            e.preventDefault();
            this.revealPrevious();
        }
    }

    handleWheel(e) {
        e.preventDefault();

        const now = Date.now();
        if (now - this.lastScrollTime < this.scrollCooldown) return;

        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            if (Math.abs(e.deltaX) > this.scrollThreshold) {
                if (e.deltaX > 0 && !this.isAnimating) {
                    this.revealNext();
                } else if (e.deltaX < 0 && !this.isAnimating) {
                    this.revealPrevious();
                }
                this.lastScrollTime = now;
            }
        } else {
            if (Math.abs(e.deltaY) > this.scrollThreshold) {
                if (e.deltaY > 0 && !this.isAnimating) {
                    this.revealNext();
                } else if (e.deltaY < 0 && !this.isAnimating) {
                    this.revealPrevious();
                }
                this.lastScrollTime = now;
            }
        }
    }

    async revealNext() {
        this.isAnimating = true;

        if (this.currentMonth >= months.length - 1) {
            this.currentMonth = 0;
            // Disable smooth scrolling temporarily
            this.container.style.scrollBehavior = 'auto';
            this.container.style.scrollSnapType = 'none';
            this.container.scrollLeft = 0;
            // Re-enable after brief delay
            await new Promise(resolve => setTimeout(resolve, 50));
            this.container.style.scrollSnapType = 'x mandatory';
            this.container.style.scrollBehavior = 'smooth';
        } else {
            this.currentMonth++;
        }

        await this.animateReveal();
        this.updateProgress();
        this.isAnimating = false;
    }

    async revealPrevious() {
        this.isAnimating = true;

        if (this.currentMonth <= 0) {
            this.currentMonth = months.length - 1;
            // Disable smooth scrolling temporarily
            this.container.style.scrollBehavior = 'auto';
            this.container.style.scrollSnapType = 'none';
            this.container.scrollLeft = this.container.scrollWidth;
            // Re-enable after brief delay
            await new Promise(resolve => setTimeout(resolve, 50));
            this.container.style.scrollSnapType = 'x mandatory';
            this.container.style.scrollBehavior = 'smooth';
        } else {
            this.currentMonth--;
        }

        await this.animateReveal(true);
        this.updateProgress();
        this.isAnimating = false;
    }

    async animateReveal(reverse = false) {
        const section = this.container.children[this.currentMonth];
        const content = section.querySelector('.song-content');

        // Scroll to section
        section.scrollIntoView({ behavior: 'smooth' });

        // Character jump animation
        this.character.classList.add('jump');
        setTimeout(() => this.character.classList.remove('jump'), 500);

        // Reveal content
        content.classList.remove('hidden');

        // Simulate API call (replace with actual API integration)
        await this.fetchSongData(this.currentMonth);
    }

    updateProgress() {
        const progress = ((this.currentMonth + 1) / months.length) * 100;
        this.progress.style.width = `${progress}%`;
    }

    async fetchSongData(monthIndex) {
        // Simulate API call - replace with actual API integration
        return new Promise(resolve => {
            setTimeout(() => {
                // Mock data
                resolve({
                    title: 'Sample Song',
                    artist: 'Sample Artist',
                    description: 'This is why I love this song...'
                });
            }, 500);
        });
    }

    cleanup() {
        document.removeEventListener('keydown', this.handleKeydown, { capture: true, passive: false });
        this.container.removeEventListener('wheel', this.handleWheel, { 
            passive: false,
            capture: true 
        });
        document.querySelector('.next-btn').removeEventListener('click', this.handleNextClick, { 
            capture: true,
            passive: true 
        });
        document.querySelector('.prev-btn').removeEventListener('click', this.handlePrevClick, { 
            capture: true,
            passive: true 
        });
    }
}

// Initialize and store instance
document.addEventListener('DOMContentLoaded', () => {
    window.songReveal = new SongReveal();
});
