import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audioContext: AudioContext | null = null;
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private userInteracted = false;

  constructor() {
    this.initAudioContext();
    this.setupUserInteractionListener();
  }

  private initAudioContext(): void {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }
    } catch (error) {
      // AudioContext não suportado, continua sem ele
    }
  }

  private setupUserInteractionListener(): void {
    const interactionEvents = ['click', 'touchstart', 'keydown'];

    const handleUserInteraction = () => {
      this.userInteracted = true;

      // Remove os listeners após a primeira interação
      interactionEvents.forEach((event) => {
        document.removeEventListener(event, handleUserInteraction, true);
      });
    };

    interactionEvents.forEach((event) => {
      document.addEventListener(event, handleUserInteraction, true);
    });
  }

  /**
   * Reproduz um arquivo de áudio
   * @param audioPath Caminho para o arquivo de áudio
   * @param volume Volume do áudio (0.0 a 1.0)
   * @param loop Se deve repetir o áudio
   */
  async playAudio(
    audioPath: string,
    volume: number = 1.0,
    loop: boolean = false
  ): Promise<void> {
    try {
      // Verifica se o áudio já está em cache
      let audio = this.audioCache.get(audioPath);

      if (!audio) {
        // Cria novo elemento de áudio
        audio = new Audio(audioPath);
        audio.preload = 'auto';
        this.audioCache.set(audioPath, audio);
      }

      // Configura o áudio
      audio.volume = Math.max(0, Math.min(1, volume));
      audio.loop = loop;

      // Inicializa o contexto de áudio se necessário
      if (this.audioContext && this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Reproduz o áudio
      await audio.play();
    } catch (error) {
      // Fallback: tenta reproduzir sem await
      try {
        const audio = this.audioCache.get(audioPath) || new Audio(audioPath);
        audio.volume = volume;
        audio.loop = loop;
        audio.play().catch(() => {
          // Silenciosamente ignora erros de reprodução
        });
      } catch (fallbackError) {
        // Silenciosamente ignora erros de fallback
      }
    }
  }

  /**
   * Para a reprodução de um áudio específico
   * @param audioPath Caminho do áudio a ser parado
   */
  stopAudio(audioPath: string): void {
    const audio = this.audioCache.get(audioPath);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  /**
   * Para todos os áudios em reprodução
   */
  stopAllAudio(): void {
    this.audioCache.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  /**
   * Reproduz o som de moedas (efeito sonoro para conquistas)
   */
  async playCoinsSound(): Promise<void> {
    await this.playAudio('assets/audio/coins.wav', 0.7, false);
  }

  /**
   * Limpa o cache de áudio
   */
  clearCache(): void {
    this.audioCache.clear();
  }

  /**
   * Verifica se o áudio é suportado no navegador
   */
  isAudioSupported(): boolean {
    return !!(window.AudioContext || (window as any).webkitAudioContext);
  }

  /**
   * Verifica se o usuário já interagiu com a página
   */
  hasUserInteracted(): boolean {
    return this.userInteracted;
  }
}
