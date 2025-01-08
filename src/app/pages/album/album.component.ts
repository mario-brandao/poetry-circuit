import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'dexie';
import { StatuesService } from 'src/app/services/statues/statues.service';
import { Statue } from 'src/db';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss'],
})
export class AlbumComponent implements OnInit {
  statues$: Observable<Statue[]>;

  constructor(
    protected router: Router,
    private statuesService: StatuesService
  ) {}

  ngOnInit(): void {
    this.statues$ = this.statuesService.statues$;
  }
}
