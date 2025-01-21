import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-augmented-reality',
  templateUrl: './augmented-reality.component.html',
  styleUrls: ['./augmented-reality.component.scss'],
})
export class AugmentedRealityComponent implements OnInit {
  activeButton: number | null = null;

  // Mock de escritores e poemas

  // this.openCamera('ascenso-ferreira', 'maracatu'); // nao mexe a boca e pixação
  // this.openCamera('ascenso-ferreira', 'trem-de-alagoas'); // nao mexe a boca
  // this.openCamera('antonio-maria', 'cafe-com-leite'); // nao mexe a boca
  // this.openCamera('antonio-maria', 'ninguem-me-ama'); // animação e posição quebradas
  writers = [
    {
      name: 'Ascenso Ferreira',
      normalizedName: 'ascenso-ferreira',
      coordinates: { x: 0, y: 0 },
      poems: [
        { title: 'Maracatu', normalizedTitle: 'maracatu' },
        { title: 'Trem de alagoas', normalizedTitle: 'trem-de-alagoas' },
      ],
    },
    {
      name: 'Antonio Maria',
      normalizedName: 'antonio-maria',
      coordinates: { x: 1, y: 1 },
      poems: [
        { title: 'Café com Leite', normalizedTitle: 'cafe-com-leite' },
        { title: 'Ninguém Me Ama', normalizedTitle: 'ninguem-me-ama' },
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

      if (writer && poem) {
        // Ambos os parâmetros estão definidos, mantém ambos
        this.setActiveWriterAndPoem(writer, poem);
      } else if (writer && !poem) {
        // Apenas o escritor está definido, seleciona o primeiro poema
        const selectedWriter = this.writers.find(
          (w) => w.normalizedName === writer
        );
        if (selectedWriter) {
          poem = selectedWriter.poems[0].normalizedTitle;
          this.setActiveWriterAndPoem(writer, poem);
          this.updateRouteParams(writer, poem);
        }
      } else {
        // Nenhum escritor definido, usa o primeiro da lista com o primeiro poema
        const defaultWriter = this.writers[0];
        writer = defaultWriter.normalizedName;
        poem = defaultWriter.poems[0].normalizedTitle;
        this.setActiveWriterAndPoem(writer, poem);
        this.updateRouteParams(writer, poem);
      }
    });
  }

  /**
   * Define o escritor e poema ativos.
   * @param writer Nome normalizado do escritor.
   * @param poem Nome normalizado do poema.
   */
  setActiveWriterAndPoem(writer: string, poem: string): void {
    console.log('Ativando escritor e poema:', { writer, poem });
    // Lógica para ativar botões ou outros elementos visuais pode ser adicionada aqui
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
    }
  }
}
