import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScoreIncrementService } from 'src/app/services/score-increment.service';
import { StatuesService } from 'src/app/services/statues/statues.service';
import { Statue } from 'src/db';

@Component({
  selector: 'app-writer-profile',
  templateUrl: './writer-profile.component.html',
  styleUrls: ['./writer-profile.component.scss'],
})
export class WriterProfileComponent implements OnInit {
  statue: Statue;
  showingBio = true;
  showCongrats = false;

  constructor(
    protected router: Router,
    private route: ActivatedRoute,
    private statuesService: StatuesService,
    private scoreIncrementService: ScoreIncrementService
  ) {}

  async ngOnInit(): Promise<void> {
    this.statue = await this.statuesService.getStatueData(
      Number(this.route.snapshot.params.id)
    );
    await this.statuesService.markAsVisited(this.statue.id);

    // Verifica se deve mostrar o diálogo de parabéns
    if (sessionStorage.getItem('showCongrats')) {
      this.showCongrats = true;
      sessionStorage.removeItem('showCongrats');
    }
  }

  closeCongrats(): void {
    // Dispara o incremento da score bar (que também toca o áudio)
    this.scoreIncrementService.triggerIncrement();
    this.showCongrats = false;
  }

  toAugmentedReality(): void {
    this.router.navigate(['/augmented-reality', this.statue.normalizedName]);
  }
}
