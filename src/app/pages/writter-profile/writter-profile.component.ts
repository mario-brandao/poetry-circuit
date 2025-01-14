import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StatuesService } from 'src/app/services/statues/statues.service';
import { Statue } from 'src/db';

@Component({
  selector: 'app-writter-profile',
  templateUrl: './writter-profile.component.html',
  styleUrls: ['./writter-profile.component.scss'],
})
export class WritterProfileComponent implements OnInit {
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
    console.log(this.statue);
  }
}
