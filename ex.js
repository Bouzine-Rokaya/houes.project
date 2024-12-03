document.addEventListener('DOMContentLoaded', () => {
    // Array of image pairs
    const images = [
        './pineapple.webp',
        './orange.webp',
        './pich.jpg',
        './avocado.jpg',
        './bananas.jpg',
        './bananas.jpg',
        // Add more image pairs as needed
    ];

    let firstWindow = null;
    let secondWindow = null;
    let canFlip = true;
    let matchedPairs = 0;
    let moves = 0;

    // Create score display
    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'score-display';
    document.body.appendChild(scoreDisplay);
    updateScore();

    // Get all windows
    const windows = document.querySelectorAll('.window');  // Update this line to select all windows
    
    // Create full-screen overlay
    const fullscreenOverlay = document.createElement('div');
    fullscreenOverlay.className = 'fullscreen-overlay';
    const fullscreenImage = document.createElement('img');
    fullscreenImage.className = 'fullscreen-image';
    fullscreenOverlay.appendChild(fullscreenImage);
    document.body.appendChild(fullscreenOverlay);

    fullscreenOverlay.addEventListener('click', () => {
        fullscreenOverlay.style.display = 'none';
    });

    // Initialize game
    function initializeGame() {
        // Double the images array to create pairs
        const gameImages = [...images, ...images];
        
        // Shuffle the array
        const shuffledImages = gameImages.sort(() => Math.random() - 0.5);
        
        // Assign images to windows
        windows.forEach((window, index) => {
            const img = window.querySelector('img');  // Get the <img> inside each window
            if (img) {
                img.src = shuffledImages[index];
                img.style.display = 'none';

                // Add fullscreen event listener to the image
                img.addEventListener('click', () => {
                    if (img.requestFullscreen) {
                        img.requestFullscreen();
                    } else if (img.webkitRequestFullscreen) { // Safari
                        img.webkitRequestFullscreen();
                    } else if (img.msRequestFullscreen) { // IE11
                        img.msRequestFullscreen();
                    }
                    fullscreenOverlay.style.display = 'flex';
                    fullscreenImage.src = img.src;
                });
            }
        });
    }

    // Add click listeners to windows
    windows.forEach(window => {
        window.addEventListener('click', () => handleWindowClick(window));
    });

    function handleWindowClick(window) {
        if (!canFlip || window.classList.contains('window-flipped') || window === firstWindow) {
            return;
        }

        flipWindow(window);

        if (!firstWindow) {
            firstWindow = window;
        } else {
            secondWindow = window;
            moves++;
            updateScore();
            checkMatch();
        }
    }

    function flipWindow(window) {
        window.classList.add('window-flipped');
        const img = window.querySelector('img');
        if (img) {
            img.style.display = 'block';
        }
    }

    function unflipWindows() {
        canFlip = false;
        setTimeout(() => {
            firstWindow.classList.remove('window-flipped');
            secondWindow.classList.remove('window-flipped');
            const img1 = firstWindow.querySelector('img');
            const img2 = secondWindow.querySelector('img');
            if (img1) img1.style.display = 'none';
            if (img2) img2.style.display = 'none';
            resetWindows();
        }, 1000);
    }

    function checkMatch() {
        const img1 = firstWindow.querySelector('img').src;
        const img2 = secondWindow.querySelector('img').src;

        if (img1 === img2) {
            matchedPairs++;
            updateScore();
            showFullscreenImage(img1);
            resetWindows();
            if (matchedPairs === images.length) {
                setTimeout(() => {
                    alert('Congratulations! You won the game!');
                    resetGame();
                }, 500);
            }
        } else {
            unflipWindows();
        }
    }

    function resetWindows() {
        firstWindow = null;
        secondWindow = null;
        canFlip = true;
    }

    function updateScore() {
        scoreDisplay.innerHTML = `
            <h3>Memory Game</h3>
            <p>Moves: ${moves}</p>
            <p>Matches: ${matchedPairs}/${images.length}</p>
        `;
    }

    function resetGame() {
        windows.forEach(window => {
            window.classList.remove('window-flipped');
            const img = window.querySelector('img');
            if (img) img.style.display = 'none';
        });
        matchedPairs = 0;
        moves = 0;
        updateScore();
        initializeGame();
    }

    function showFullscreenImage(src) {
        fullscreenImage.src = src;
        fullscreenOverlay.style.display = 'flex';
    }
    

    // Initialize the game when the page loads
    initializeGame();
});
