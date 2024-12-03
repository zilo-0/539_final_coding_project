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
            
            section.innerHTML = `
                <div class="month-header">
                    <h2>${month.name}'s Favorite Song</h2>
                    <p class="month-description">${month.description}</p>
                </div>
                <div class="song-content">
                    <div class="spotify-widget" 
                        role="complementary" 
                        aria-label="${month.name}'s favorite song player"
                    >
                        <iframe 
                            src="https://open.spotify.com/embed/track/${month.spotifyId}?utm_source=generator&theme=0"
                            title="${month.name}'s Song"
                            width="100%" 
                            height="152"
                            frameborder="0"
                            allow="encrypted-media"
                        ></iframe>
                    </div>
                </div>
            `;
            
            this.sections.push(section);
            this.container.appendChild(section);
        });
    }

    async goToMonth(index, direction = 1) {
        if (this.isAnimating) return;
        this.isAnimating = true;

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
    }

    updateProgress() {
        const progress = document.querySelector('.progress');
        progress.style.width = `${((this.currentIndex + 1) / this.sections.length) * 100}%`;
    }
}

// Initialize and store instance
document.addEventListener('DOMContentLoaded', () => {
    window.monthSlider = new MonthSlider();
});
