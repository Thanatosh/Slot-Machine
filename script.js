document.addEventListener("DOMContentLoaded", function () {
    const images = ['img/Cherry.png', 'img/Orange.png', 'img/Plum.png', 'img/Watermelon.png', 'img/Seven.png'];
    let balance = 100;
    let winnings = 0;
    let currentBet = 1;
    let betIsSet = false;

    window.onload = function () {
        images.forEach((imgUrl) => {
            const img = new Image();
            img.src = imgUrl;
            img.onload = function () {
                imagesLoaded++;
                if (imagesLoaded === images.length) {
                    initializeGame();
                }
            };
        });
    };

    let imagesLoaded = 0;

    function initializeGame() {
        const reel1 = document.getElementById('reel1');
        const reel2 = document.getElementById('reel2');
        const reel3 = document.getElementById('reel3');
        const reel4 = document.getElementById('reel4');
        const spinButton = document.getElementById('spin-button');
        const balanceDisplay = document.getElementById('balance');
        const winningsDisplay = document.getElementById('winnings');
        const betButtons = document.querySelectorAll('.bet-button');
        const resultDisplay = document.getElementById('result');
        const roundsInfo = document.getElementById('rounds-info');

        const lockedReels = [false, false, false, false];
        let spinOccurred = false;
        let wasReelLockedInPreviousSpin = false;
        let reelLockReset = false
        let roundCalculate = 1

        function spin() {
            if (balance >= currentBet) {
                const hasLockedReel = lockedReels.some(lock => lock);
                if (roundCalculate === 1 || hasLockedReel) {
                    
                    if (hasLockedReel) {
                        roundsInfo.textContent = 'First Spin of the round';
                        reelLockReset = true
                        betIsSet = false;
                    } else {
                        roundsInfo.textContent = 'Second Spin of the round';
                        reelLockReset = false
                        betIsSet = true;
                        balance -= currentBet;
                    }

                    balanceDisplay.textContent = `Balance: €${balance}`;
                    const result = [];
            
                    for (let i = 0; i < 4; i++) {
                        if (lockedReels[i]) {
                            result.push(reelResults[i]);
                        } else {
                            const randomIndex = Math.floor(Math.random() * images.length);
                            result.push(randomIndex);
                        }
                    }
            
                    for (let i = 0; i < 4; i++) {
                        lockedReels[i] = false;
                        const reelElement = document.getElementById(`reel${i + 1}`);
                        reelElement.style.border = 'solid';
                    }
            
                    reel1.src = images[result[0]];
                    reel2.src = images[result[1]];
                    reel3.src = images[result[2]];
                    reel4.src = images[result[3]];
            
                    spinOccurred = true;
                    reelResults = result;
                    checkWin(result);
            
                    wasReelLockedInPreviousSpin = hasLockedReel;
                    if (roundCalculate === 0) {
                        roundCalculate += 1}
                    else {roundCalculate -= 1}
                } else {
                    resultDisplay.textContent = 'Please lock atleast one reel during second spin';
                }
            } else {
                resultDisplay.textContent = 'Insufficient balance to spin.';
            }
        }

        let reelResults = [0, 0, 0, 0];
        function checkWin(result) {
            let winAmount = 0;

            if (result[0] === result[1] && result[1] === result[2] && result[2] === result[3]) {
                const symbol = images[result[0]].split('/').pop().split('.')[0];
                const multiplier = getMultiplier(symbol);
                winAmount = currentBet * multiplier;
            } else {
                for (let i = 0; i < result.length - 2; i++) {
                    if (result[i] === 4 && result[i] === result[i + 1] && result[i] === result[i + 2] && roundCalculate === 0) {
                        winAmount = currentBet * 5;
                        break;
                    }
                }
            }
        
            if (winAmount > 0) {
                balance += winAmount;
                winnings += winAmount;
                balanceDisplay.textContent = `Balance: €${balance}`;
                winningsDisplay.textContent = `Total Winnings: €${winnings}`;
                resultDisplay.textContent = `Congratulations! You won €${winAmount}`;

                lockedReels.fill(false);
                reelLockReset = true;
            } else {
                resultDisplay.textContent = 'You did not win';
            }
        }
        
        function toggleLockReel(reelIndex) {
            if (spinOccurred && !reelLockReset) {
                lockedReels[reelIndex] = !lockedReels[reelIndex];
                const reelElement = document.getElementById(`reel${reelIndex + 1}`);
                if (lockedReels[reelIndex]) {
                    reelElement.style.border = '3px solid red';
                } else {
                    reelElement.style.border = 'solid';
                }
            } else {
                resultDisplay.textContent = 'You can only lock reels during second spin';
            }
        }       
        
        reel1.addEventListener('click', () => toggleLockReel(0));
        reel2.addEventListener('click', () => toggleLockReel(1));
        reel3.addEventListener('click', () => toggleLockReel(2));
        reel4.addEventListener('click', () => toggleLockReel(3));

        function getMultiplier(symbol) {
            switch (symbol) {
                case 'Cherry':
                    return 3;
                case 'Orange':
                    return 4;
                case 'Plum':
                    return 5;
                case 'Watermelon':
                    return 6;
                case 'Seven':
                    return 10;
                default:
                    return 0;
            }
        }

        spinButton.addEventListener('click', spin);
        betButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (!betIsSet) {
                    currentBet = parseInt(button.getAttribute('data-bet'));

                    betButtons.forEach(betButton => {
                        betButton.classList.remove('selected');
                    });

                    button.classList.add('selected');
                } else {
                    resultDisplay.textContent = 'Bet can not be changed during second round';
                }
            });
        });
    }
});