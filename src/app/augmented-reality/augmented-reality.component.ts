import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-augmented-reality',
  templateUrl: './augmented-reality.component.html',
  styleUrls: ['./augmented-reality.component.scss'],
})
export class AugmentedRealityComponent implements OnInit {
  // mock
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.openCamera('ascenso');
  }

  openCamera(poet: string): void {
    console.log('params triggered', { poet });

    this.router.navigate([], {
      queryParams: { poet },
      queryParamsHandling: 'merge', // Mantém os parâmetros existentes e adiciona/atualiza 'poeta'
      skipLocationChange: true, // Não muda o URL visível (opcional)
    });
  }
}
