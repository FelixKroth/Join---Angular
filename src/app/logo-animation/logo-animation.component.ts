import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-logo-animation',
  standalone: true,
  templateUrl: './logo-animation.component.html',
  styleUrls: ['./logo-animation.component.scss'],
})
export class LogoAnimationComponent {
  @Output() animationComplete = new EventEmitter<void>();

  ngOnInit() {
    console.log('LogoAnimationComponent initialized');
    this.animateLogo();
  }

  animateLogo() {
    console.log('Starting logo animation');

    // Start the animation after a slight delay
    setTimeout(() => {
      const logoContainer = document.getElementById('logo-container');
      if (logoContainer) {
        console.log('Logo container element found:', logoContainer);
        logoContainer.classList.add('animate'); // Add the animate class

        // Emit animationComplete event after a delay to simulate animation
        setTimeout(() => {
          console.log('Emitting animationComplete event');
          this.animationComplete.emit(); // Emit after the animation is complete
        }, 1500); // Match this to your CSS transition duration
      } else {
        console.error('Logo container element not found');
      }
    }, 500); // Initial delay before starting the animation
  }
}
