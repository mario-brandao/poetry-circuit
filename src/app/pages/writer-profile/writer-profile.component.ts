import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(
    protected router: Router,
    private route: ActivatedRoute,
    private statuesService: StatuesService
  ) {}

  async ngOnInit(): Promise<void> {
    this.statue = await this.statuesService.getStatueData(
      Number(this.route.snapshot.params.id)
    );
    await this.statuesService.markAsVisited(this.statue.id);
  }

  toAugmentedReality(): void {
    this.router.navigate(['/augmented-reality'], {
      // queryParams: { writer, poem },
      queryParamsHandling: 'merge',
      skipLocationChange: true,
    });
  }
}
