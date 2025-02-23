# Zalvira

**Zalvira** to projekt portfolio prezentujący nowoczesną aplikację webową symulującą doświadczenie kasynowe. Projekt demonstruje zaawansowane wzorce projektowe oraz wykorzystanie najnowszych technologii w budowie aplikacji frontendowych i backendowych.

## Spis treści

- [Opis projektu](#opis-projektu)
- [Technologie](#technologie)
- [Struktura folderów](#struktura-folderów)
- [Instalacja i uruchomienie](#instalacja-i-uruchomienie)
- [Konfiguracja](#konfiguracja)
- [Dodatkowe informacje](#dodatkowe-informacje)
- [Autor](#autor)

## Opis projektu

**Zalvira** to interaktywna platforma kasynowa/minigier, stworzona z myślą o portfolio. Główne cele projektu to:

- Prezentacja umiejętności budowania skalowalnych i responsywnych aplikacji webowych.
- Wykorzystanie nowoczesnych technologii oraz wzorców projektowych, takich jak:
  - **Micro Frontends** – podział aplikacji na niezależne moduły.
  - **Server Components** – renderowanie części interfejsu po stronie serwera.
  - **Atomic Design** – projektowanie spójnych komponentów UI.
- Integracja zaawansowanych animacji oraz efektów graficznych dla lepszych wrażeń użytkownika.

## Technologie

### Frontend:

- **Next.js 14** (alternatywnie SvelteKit) – framework do budowy aplikacji z funkcjami server-side rendering i automatycznym dzieleniem kodu.
- **Tailwind CSS** – narzędzie do tworzenia responsywnych interfejsów.
- **Framer Motion** – biblioteka animacji.
- **DaisyUI/Headless UI** – zestaw gotowych komponentów UI wspierających spójny design.

### Backend:

- **NestJS** – framework do budowy skalowalnych aplikacji backendowych na Node.js.
- **GraphQL (Apollo)** – elastyczna komunikacja między frontend a backend.
- **PostgreSQL** – relacyjna baza danych.
- _(Opcjonalnie)_ **Redis** – dla cache’owania danych i zwiększenia wydajności.

### Dodatkowe narzędzia:

- **WebAssembly (Wasm)** – dla krytycznych fragmentów logiki gier.
- **Docker i Kubernetes** – do konteneryzacji oraz zarządzania środowiskami.
- **CI/CD:** Konfiguracja przy użyciu GitHub Actions lub GitLab CI dla automatyzacji testów i wdrożeń.

## Struktura folderów

```plaintext
Zalvira/
├── apps/
│   ├── frontend/                # Aplikacja frontendowa
│   │   ├── public/              # Statyczne zasoby (obrazy, favicon, etc.)
│   │   ├── src/
│   │   │   ├── app/             # Główna logika aplikacji (pages lub app)
│   │   │   ├── components/      # Komponenty UI zgodnie z Atomic Design
│   │   │   │   ├── atoms/       # Podstawowe elementy interfejsu (przyciski, ikony)
│   │   │   │   ├── molecules/   # Kombinacje atomów (formularze, karty)
│   │   │   │   └── organisms/   # Złożone sekcje interfejsu (np. nagłówki, stopki)
│   │   │   ├── hooks/           # Własne hooki (React/Svelte)
│   │   │   ├── layouts/         # Szablony stron i układu
│   │   │   ├── styles/          # Pliki CSS/Tailwind, zmienne, motywy
│   │   │   ├── utils/           # Funkcje pomocnicze i konfiguracje
│   │   │   └── assets/          # Pliki graficzne, czcionki itp.
│   │   ├── package.json         # Zależności i skrypty frontendu
│   │   └── next.config.js       # Konfiguracja Next.js (lub odpowiednik dla SvelteKit)
│   │
│   └── backend/                 # Aplikacja backendowa oparta na NestJS
│       ├── src/
│       │   ├── modules/         # Moduły aplikacji (np. Auth, Casino)
│       │   │   ├── auth/        # Moduł autoryzacji
│       │   │   │   ├── auth.controller.ts
│       │   │   │   ├── auth.service.ts
│       │   │   │   └── auth.module.ts
│       │   │   └── casino/      # Moduł logiki gier kasynowych
│       │   │       ├── casino.controller.ts
│       │   │       ├── casino.service.ts
│       │   │       └── casino.module.ts
│       │   ├── common/          # Wspólne elementy (filtry, interceptory, guardy)
│       │   ├── config/          # Konfiguracje (np. ustawienia bazy danych)
│       │   ├── main.ts          # Punkt wejścia aplikacji
│       │   └── app.module.ts    # Główny moduł aplikacji
│       ├── package.json         # Zależności i skrypty backendu
│       └── tsconfig.json        # Konfiguracja TypeScript
│
├── libs/                        # Współdzielone biblioteki lub moduły między frontendem a backendem
├── config/                      # Globalne konfiguracje (zmienne środowiskowe, ustawienia CI/CD)
├── scripts/                     # Skrypty automatyzujące procesy budowy, wdrożeń, migracji bazy danych
├── docker/                      # Pliki Dockerfile, docker-compose.yml, manifesty Kubernetes
├── docs/                        # Dokumentacja projektu, diagramy, specyfikacje API
└── README.md                    # Ten plik
```

## Instalacja i uruchomienie

### Wymagania:

- Node.js (zalecana wersja 18 lub nowsza)
- npm lub yarn
- Docker (opcjonalnie, jeśli korzystasz z konteneryzacji)

### Frontend:

1. Przejdź do folderu `apps/frontend`:
   ```bash
   cd apps/frontend
   ```
2. Zainstaluj zależności:
   ```bash
   npm install
   ```
3. Uruchom aplikację developerską:
   ```bash
   npm run dev
   ```
   Aplikacja powinna być dostępna pod adresem: `http://localhost:3000`.

### Backend:

1. Przejdź do folderu `apps/backend`:
   ```bash
   cd apps/backend
   ```
2. Zainstaluj zależności:
   ```bash
   npm install
   ```
3. Uruchom serwer backendowy:
   ```bash
   npm run start:dev
   ```
   Domyślnie API backendu będzie dostępne na porcie `http://localhost:3001`.

## Konfiguracja

- **Zmienne środowiskowe:**
  Utwórz pliki `.env` zarówno w `apps/frontend` jak i `apps/backend` na podstawie plików przykładowych (np. `.env.example`).

- **Docker:**
  W folderze `docker` znajdują się pliki konfiguracyjne Docker i docker-compose, które umożliwiają konteneryzację aplikacji.

## Dodatkowe informacje

- **CI/CD:**
  Projekt zawiera konfigurację CI/CD przy użyciu GitHub Actions lub GitLab CI, co umożliwia automatyczne testy i wdrożenia.
- **Testy:**
  Zarówno frontend, jak i backend posiadają przykładowe testy jednostkowe i e2e. Uruchom je komendą:

  ```bash
  npm run test
  ```

- **Dokumentacja:**
  Szczegółowa dokumentacja projektu, diagramy i specyfikacje API znajdują się w folderze `docs`.

## Autor

Mateusz Popielarz – _Projekt portfolio_
