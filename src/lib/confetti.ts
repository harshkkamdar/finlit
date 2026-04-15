import confetti from 'canvas-confetti';

export function fireConfetti() {
  // Left burst
  confetti({
    particleCount: 60,
    spread: 55,
    origin: { x: 0.25, y: 0.6 },
    colors: ['#1B6B4A', '#F5A623', '#2ECC71', '#4A90D9', '#8E44AD'],
    disableForReducedMotion: true,
  });

  // Right burst
  confetti({
    particleCount: 60,
    spread: 55,
    origin: { x: 0.75, y: 0.6 },
    colors: ['#1B6B4A', '#F5A623', '#2ECC71', '#4A90D9', '#8E44AD'],
    disableForReducedMotion: true,
  });
}
