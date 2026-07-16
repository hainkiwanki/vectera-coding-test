import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <header style="padding:1rem;border-bottom:1px solid #eee;">
      <h1>Vectera Coding Test</h1>
      <nav><a routerLink="/meetings">Meetings</a></nav>
    </header>
    <main style="padding:1rem;">
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {}
