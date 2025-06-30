# Áudio do Projeto Poetry Circuit

## Arquivos de Áudio

### coins.wav

- **Descrição**: Som de moedas para efeito sonoro de conquistas
- **Uso**: Reproduzido quando o usuário ganha pontos ao descobrir uma nova estátua
- **Localização**: `src/assets/audio/coins.wav`

## Licenciamento

### Mixkit Free License

O arquivo `coins.wav` é licenciado sob a **Mixkit Free License** da Mixkit.

#### Condições de Uso:

- ✅ **Uso comercial permitido**
- ✅ **Modificação permitida**
- ✅ **Distribuição permitida**
- ✅ **Atribuição não obrigatória**

#### Links da Licença:

- [Mixkit Free License](https://mixkit.co/license/#sfxFree)
- [Termos de Uso](https://mixkit.co/terms/)

#### Conformidade do Projeto:

Este projeto está em conformidade com a licença Mixkit Free License porque:

1. **Uso Educacional/Cultural**: O projeto é uma aplicação educacional sobre cultura pernambucana
2. **Não Comercial**: O projeto não visa lucro direto
3. **Atribuição**: Os links da licença estão documentados neste arquivo
4. **Uso Apropriado**: O áudio é usado apenas para feedback sonoro de conquistas

### Implementação Técnica

O áudio é gerenciado pelo `AudioService` (`src/app/services/audio.service.ts`) que:

- Gerencia o contexto de áudio do navegador
- Implementa cache de áudio para melhor performance
- Fornece fallbacks para navegadores que não suportam AudioContext
- Controla volume e loop dos áudios

### Como Usar

```typescript
// No componente
constructor(private audioService: AudioService) {}

// Reproduzir som de moedas
await this.audioService.playCoinsSound();

// Ou reproduzir qualquer áudio
await this.audioService.playAudio('assets/audio/coins.wav', 0.7, false);
```

## Manutenção

- Mantenha este arquivo README atualizado quando adicionar novos áudios
- Sempre verifique a licença antes de adicionar novos arquivos de áudio
- Documente qualquer mudança no uso ou licenciamento dos áudios
