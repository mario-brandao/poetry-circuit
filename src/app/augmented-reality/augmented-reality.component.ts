import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { Statue } from 'src/db';
import { StatuesService } from '../services/statues/statues.service';

interface Writer {
  name: string;
  normalizedName: string;
  coordinates: { x: number; y: number };
  poems: { title: string; normalizedTitle: string; visited: boolean }[];
}

@Component({
  selector: 'app-augmented-reality',
  templateUrl: './augmented-reality.component.html',
  styleUrls: ['./augmented-reality.component.scss'],
})
export class AugmentedRealityComponent implements OnInit, OnDestroy {
  activeButton: number | null = null;
  poemOptions: Array<{
    title: string;
    normalizedTitle: string;
    visited: boolean;
  }>;
  selectedWriter: Statue;
  $destroy = new Subject<void>();

  // Mock de escritores e poemas
  // this.openCamera('ascenso-ferreira', 'maracatu'); // nao mexe a boca e pixação
  // this.openCamera('ascenso-ferreira', 'trem-de-alagoas'); // nao mexe a boca
  // this.openCamera('antonio-maria', 'cafe-com-leite'); // nao mexe a boca
  // this.openCamera('antonio-maria', 'ninguem-me-ama'); // animação e posição quebradas

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private statuesService: StatuesService
  ) {}

  ngOnInit(): void {
    this.watchRouteParams();
  }

  ngOnDestroy(): void {
    this.$destroy.next();
  }

  watchRouteParams(): void {
    this.route.params
      .pipe(takeUntil(this.$destroy))
      .subscribe(async (params) => {
        if (params.writer) {
          const userConsent = confirm(`Deseja iniciar a experiencia imersiva?`);
          this.selectedWriter =
            await this.statuesService.getStatueByNormalizedName(params.writer);
          this.setDefaultPoem();
        }
      });
  }

  setDefaultPoem(): void {
    if (!this.selectedWriter) {
      this.router.navigate(['/home']);
    }

    this.poemOptions = this.selectedWriter.poems;
    this.openPoem(0);
  }

  /**
   * Alterna o botão ativo.
   * @param buttonNumber Número do botão a ser ativado.
   */
  openPoem(buttonNumber: number): void {
    if (this.activeButton === buttonNumber) {
      return;
    }

    this.activeButton = buttonNumber;
    this.statuesService.markPoemAsVisited(this.selectedWriter.id, buttonNumber);
    this.router.navigate(
      [this.selectedWriter.poems[buttonNumber].normalizedTitle],
      {
        relativeTo: this.route,
      }
    );
  }
}
