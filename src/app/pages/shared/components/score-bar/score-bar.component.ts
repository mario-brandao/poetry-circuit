import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { ScoreService } from 'src/app/services/score.service';

@Component({
  selector: 'app-score-bar',
  templateUrl: './score-bar.component.html',
  styleUrls: ['./score-bar.component.scss'],
})
export class ScoreBarComponent implements OnDestroy {
  public points$ = this.scoreService.points$;
  private subscription: Subscription = new Subscription();
  public isARPage = false;

  constructor(private scoreService: ScoreService, private router: Router) {
    // Verifica se está na página AR
    this.checkIfARPage();

    // Escuta mudanças de rota
    this.subscription.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          this.checkIfARPage();
        })
    );

    // Escuta mudanças nos pontos
    this.subscription.add(
      this.points$.subscribe((points) => {
        if (points > 0 && !this.isARPage) {
          document.body.classList.add('score-bar-visible');
        } else {
          document.body.classList.remove('score-bar-visible');
        }
      })
    );
  }

  private checkIfARPage(): void {
    this.isARPage = this.router.url.includes('/augmented-reality');

    // Adiciona/remove classe no body para CSS
    if (this.isARPage) {
      document.body.classList.add('ar-page');
    } else {
      document.body.classList.remove('ar-page');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    document.body.classList.remove('score-bar-visible');
    document.body.classList.remove('ar-page');
  }
}
