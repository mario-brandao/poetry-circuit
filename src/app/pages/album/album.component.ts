import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatuesService } from 'src/app/services/statues.service';
import { Statue } from 'src/app/shared/interfaces/statue.interface';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss'],
})
export class AlbumComponent implements OnInit {
  statues: Statue[];

  constructor(
    protected router: Router,
    private statuesService: StatuesService
  ) {}

  ngOnInit(): void {
    this.statuesService.getStatuesWithProgress$().subscribe((statues) => {
      //======= TO CHANGE ========//
      this.statues = statues.filter(
        (statue) =>
          statue.id === 'antonio-maria' || statue.id === 'ascenso-ferreira'
      );
      //======= ^^^^^^^^^^ ========//
    });
  }
}
