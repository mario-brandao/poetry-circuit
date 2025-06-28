# Circuito Digital da Poesia

Uma aplicação web interativa que promove a literatura e cultura local através de experiências digitais inovadoras, combinando realidade aumentada, gamificação e exploração de poetas e escritores brasileiros.

## ✨ Visão Geral

- Explore estátuas de escritores e poetas.
- Visualize poesias em realidade aumentada (AR) com modelos 3D e áudio.
- Ganhe pontos ao descobrir novas poesias e acompanhe seu progresso.

## 🚀 Tecnologias Utilizadas

- **Angular 16** (TypeScript)
- **Three.js** (visualização 3D/AR)
- **Dexie.js** (IndexedDB para persistência local)
- **Node.js/Express** (servidor local para desenvolvimento)
- **SCSS** e **TailwindCSS** (estilização)

## 📁 Estrutura do Projeto

```
poetry-circuit/
  ├── src/
  │   ├── app/
  │   │   ├── augmented-reality/   # Módulo de AR
  │   │   ├── pages/               # Páginas principais (home, álbum, perfil, etc.)
  │   │   ├── services/            # Serviços (pontuação, estátuas, etc.)
  │   │   └── ...
  │   ├── assets/                  # Imagens, modelos 3D, áudios
  │   └── environments/            # Configurações de ambiente
  ├── package.json
  ├── README.md
  └── ...
```

## ⚙️ Requisitos

- Node.js >= 18
- npm >= 9

## 🛠️ Instalação e Execução

1. **Clone o repositório:**
   ```sh
   git clone <url-do-repo>
   cd poetry-circuit
   ```
2. **Instale as dependências:**
   ```sh
   npm install
   ```
3. **Inicie o servidor local:**

   ```sh
   npm run start:local
   ```

   > Acesse via navegador: `https://localhost:443` ou `http://localhost:4200` (dependendo da configuração)

4. **Acesse via celular:**
   - Certifique-se de que o computador e o celular estão na mesma rede Wi-Fi.
   - Descubra o IP local do computador (ex: `192.168.1.15`).
   - Acesse `http://<ip-local>:4200` no navegador do celular.

## 🎮 Gamificação

- O usuário ganha 1000 pontos ao visualizar uma poesia em AR pela primeira vez.
- A pontuação é salva localmente e exibida em uma barra fixa na interface.
- Modal de parabéns é exibido ao conquistar pontos.

## 🧩 Contribuição

1. Fork este repositório
2. Crie uma branch: `git checkout -b minha-feature`
3. Faça suas alterações e commit: `git commit -m 'feat: minha nova feature'`
4. Push para o fork: `git push origin minha-feature`
5. Abra um Pull Request

## 📄 Licença

Este projeto é distribuído sob a licença MIT.

---

**Desenvolvido para fins acadêmicos e culturais.**
