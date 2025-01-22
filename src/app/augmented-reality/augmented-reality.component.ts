import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
export class AugmentedRealityComponent implements OnInit {
  activeButton: number | null = null;
  poemOptions: Array<{
    title: string;
    normalizedTitle: string;
    visited: boolean;
  }>;
  selectedWriter: Writer;

  // Mock de escritores e poemas
  // this.openCamera('ascenso-ferreira', 'maracatu'); // nao mexe a boca e pixação
  // this.openCamera('ascenso-ferreira', 'trem-de-alagoas'); // nao mexe a boca
  // this.openCamera('antonio-maria', 'cafe-com-leite'); // nao mexe a boca
  // this.openCamera('antonio-maria', 'ninguem-me-ama'); // animação e posição quebradas

  writers: Writer[] = [
    {
      name: 'Ascenso Ferreira',
      normalizedName: 'ascenso-ferreira',
      coordinates: { x: 0, y: 0 },
      poems: [
        { title: 'Maracatu', normalizedTitle: 'maracatu', visited: false },
        {
          title: 'Trem de alagoas',
          normalizedTitle: 'trem-de-alagoas',
          visited: false,
        },
      ],
    },
    {
      name: 'Antonio Maria',
      normalizedName: 'antonio-maria',
      coordinates: { x: 1, y: 1 },
      poems: [
        {
          title: 'Café com Leite',
          normalizedTitle: 'cafe-com-leite',
          visited: false,
        },
        {
          title: 'Ninguém Me Ama',
          normalizedTitle: 'ninguem-me-ama',
          visited: false,
        },
      ],
    },
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const userConsent = confirm('Deseja iniciar o áudio e o vídeo?');
    if (userConsent) {
      this.handleRouteParams();
    }
  }

  /**
   * Lida com os parâmetros da rota e define o comportamento baseado neles.
   */
  handleRouteParams(): void {
    this.route.queryParams.subscribe((params) => {
      let { writer, poem } = params;

      if (!writer) {
        this.setDefaultWriter();
      }

      if (writer && !poem) {
        this.selectedWriter = this.writers.find(
          (w) => w.normalizedName === writer
        );
        this.setDefaultPoem();
      }
    });
  }

  setDefaultWriter(): void {
    this.selectedWriter = this.writers[0];
    this.setDefaultPoem();
  }

  setDefaultPoem(): void {
    const selectedWriter = this.writers.find(
      (w) => w.normalizedName === this.selectedWriter.normalizedName
    );
    if (selectedWriter) {
      this.poemOptions = selectedWriter.poems;
      this.setActiveButton(0);
      this.updateRouteParams(
        selectedWriter.normalizedName,
        selectedWriter.poems[0].normalizedTitle
      );
    }
  }

  /**
   * Atualiza os parâmetros da rota.
   * @param writer Nome normalizado do escritor.
   * @param poem Nome normalizado do poema.
   */
  updateRouteParams(writer: string, poem: string): void {
    this.router.navigate([], {
      queryParams: { writer, poem },
      queryParamsHandling: 'merge',
      skipLocationChange: true,
    });
  }

  /**
   * Alterna o botão ativo.
   * @param buttonNumber Número do botão a ser ativado.
   */
  setActiveButton(buttonNumber: number): void {
    if (this.activeButton === buttonNumber) {
      this.activeButton = null;
    } else {
      this.activeButton = buttonNumber;
      // TODO: push history
      this.poemOptions[buttonNumber].visited = true;
    }
  }

  /**
   * Alterna o botão ativo.
   * @param btnIndex Número do botão a ser ativado.
   */
  selectPoem(btnIndex: number): void {
    this.setActiveButton(btnIndex);
    this.updateRouteParams(
      this.selectedWriter.normalizedName,
      this.selectedWriter.poems[btnIndex].normalizedTitle
    );
  }
}
