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
    const userConsent = confirm('Deseja iniciar o áudio e o vídeo?');
    if (userConsent) {
      this.openCamera('ascenso-ferreira', 'maracatu'); // nao mexe a boca e pixação
      // this.openCamera('ascenso-ferreira', 'trem-de-alagoas'); // nao mexe a boca
      // this.openCamera('antonio-maria', 'cafe-com-leite'); // nao mexe a boca
      // this.openCamera('antonio-maria', 'ninguem-me-ama'); // animação e posição quebradas
    }
  }

  openCamera(writer: string, poem: string): void {
    console.log('params triggered', { writer, poem });

    this.router.navigate([], {
      queryParams: { writer, poem },
      queryParamsHandling: 'merge', // Mantém os parâmetros existentes e adiciona/atualiza 'poeta'
      skipLocationChange: true, // Não muda o URL visível (opcional)
    });
  }
}
