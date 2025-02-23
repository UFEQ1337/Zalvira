# Zalvira – Backend

Poniższa dokumentacja opisuje główne założenia, strukturę oraz sposób uruchomienia serwera backendowego projektu **Zalvira**. Celem tej części aplikacji jest dostarczenie niezawodnego, skalowalnego i czytelnego API, które współpracuje z frontendem w symulowaniu funkcjonalności kasynowo-hazardowych oraz innych usług w obrębie platformy.

Kod źródłowy dostępny jest w repozytorium GitHub:  
[https://github.com/UFEQ1337/Zalvira](https://github.com/UFEQ1337/Zalvira)

---

## Spis treści

1. [Opis projektu](#opis-projektu)
2. [Wykorzystane technologie i wzorce projektowe](#wykorzystane-technologie-i-wzorce-projektowe)
3. [Struktura aplikacji](#struktura-aplikacji)
4. [Instalacja i uruchomienie](#instalacja-i-uruchomienie)
5. [Konfiguracja](#konfiguracja)
6. [Skrypty npm](#skrypty-npm)
7. [Testy i jakość kodu](#testy-i-jakość-kodu)
8. [Najczęstsze problemy](#najczęstsze-problemy)
9. [Dalsze plany rozwoju](#dalsze-plany-rozwoju)
10. [Autor](#autor)

---

## 1. Opis projektu

Backend **Zalvira** opiera się na frameworku [NestJS](https://nestjs.com/) i pełni rolę warstwy serwerowej w symulacji doświadczenia kasynowego. Jego główne zadania to:

- Obsługa logiki biznesowej związanej z zarządzaniem użytkownikami, grami kasynowymi, portfelami i innymi usługami.
- Zapewnienie bezpieczeństwa poprzez moduły autoryzacji i autentykacji.
- Komunikacja w czasie rzeczywistym (np. chat) przy wykorzystaniu WebSocketów (przez wbudowane Gateways w NestJS).
- Integracja z bazą danych (PostgreSQL) oraz ewentualnie z pamięcią podręczną (Redis).
- Udostępnianie API do obsługi żądań z aplikacji frontendowej.

Projekt kładzie duży nacisk na czystość kodu, zwinny rozwój (Agile), a także wykorzystanie nowoczesnych wzorców projektowych i architektonicznych.

---

## 2. Wykorzystane technologie i wzorce projektowe

### Technologie

- **NestJS 11** – do szybkiego rozwoju i modularnej architektury backendu.
- **TypeScript** – statyczne typowanie i poprawa jakości kodu.
- **TypeORM** – łączenie z relacyjną bazą danych (PostgreSQL).
- **JWT** – mechanizm autoryzacji i autentykacji (JSON Web Token).
- **WebSockets** (NestJS Gateways) – komunikacja w czasie rzeczywistym (m.in. do czatu).
- **ESLint + Prettier** – narzędzia do utrzymywania spójnego stylu i jakości kodu.
- **Jest** – testy jednostkowe i e2e.

### Wzorce projektowe i dobre praktyki

- **Modułowość i warstwowość** – rozdział odpowiedzialności (controllers, services, guards itp.).
- **DDD (Domain-Driven Design)** – podział logiki biznesowej według kontekstu domeny (np. `casino`, `auth`, `user-profile`).
- **Hexagonal / Clean Architecture** – unikanie nadmiernych zależności między warstwami biznesowymi a infrastrukturą.
- **Dependency Injection** – wbudowane w NestJS, ułatwia testowanie i skalowanie.
- **Guardy** (np. `JwtAuthGuard`, `RolesGuard`) – kontrola dostępu na poziomie endpointów.
- **Interceptory i Filtry** – przechwytywanie żądań/odpowiedzi w celu obsługi wyjątków, logowania, modyfikowania danych itp.
- **CQRS** (opcjonalnie) – rozdzielenie poleceń (commands) od zapytań (queries) przy bardziej rozbudowanych domenach.

---

## 3. Struktura aplikacji

Poniżej znajduje się pełna, aktualna struktura folderów i plików projektu backendowego **Zalvira**:

```
├── .env
├── .prettierrc
├── eslint.config.mjs
├── nest-cli.json
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.build.json
├── tsconfig.json
│
├── src
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── main.ts
│   │
│   ├── common
│   │   ├── decorators
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── public.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── filters
│   │   │   └── http-exception.filter.ts
│   │   ├── guards
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   └── interceptors
│   │       └── logging.interceptor.ts
│   │
│   ├── config
│   │   └── config.module.ts
│   │
│   ├── modules
│   │   ├── admin
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.module.ts
│   │   │   └── admin.service.ts
│   │   │
│   │   ├── auth
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── dto
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   └── login.dto.ts
│   │   │   └── entities
│   │   │       └── user.entity.ts
│   │   │
│   │   ├── casino
│   │   │   ├── casino.controller.ts
│   │   │   ├── casino.module.ts
│   │   │   ├── casino.service.ts
│   │   │   ├── dto
│   │   │   │   ├── play-advanced-blackjack.dto.ts
│   │   │   │   ├── play-baccarat.dto.ts
│   │   │   │   ├── play-blackjack.dto.ts
│   │   │   │   ├── play-dice.dto.ts
│   │   │   │   ├── play-roulette.dto.ts
│   │   │   │   ├── play-scratch-card.dto.ts
│   │   │   │   ├── play-slot-machine.dto.ts
│   │   │   │   └── start-game.dto.ts
│   │   │   └── entities
│   │   │       └── game-session.entity.ts
│   │   │
│   │   ├── chat
│   │   │   ├── chat.gateway.ts
│   │   │   └── chat.module.ts
│   │   │
│   │   ├── user-profile
│   │   │   ├── user-profile.controller.ts
│   │   │   ├── user-profile.module.ts
│   │   │   ├── user-profile.service.ts
│   │   │   └── dto
│   │   │       └── update-user-profile.dto.ts
│   │   │
│   │   └── wallet
│   │       ├── wallet.controller.ts
│   │       ├── wallet.module.ts
│   │       ├── wallet.service.ts
│   │       ├── dto
│   │       │   ├── deposit.dto.ts
│   │       │   ├── transfer.dto.ts
│   │       │   └── withdraw.dto.ts
│   │       └── entities
│   │           └── wallet-transaction.entity.ts
│   │
│   └── types
│       └── express
│           └── index.d.ts
│
└── test
    ├── app.e2e-spec.ts
    └── jest-e2e.json
```

**Najważniejsze elementy:**

- **`common/`** – elementy współdzielone przez wiele modułów (dekoratory, filtry błędów, guardy, interceptory).
- **`config/`** – pliki konfiguracyjne (np. `config.module.ts`).
- **`modules/`** – moduły domenowe (np. `auth`, `casino`, `user-profile`, `wallet`). Każdy moduł może mieć foldery `dto/` (Data Transfer Objects) i `entities/` (modele/encje).
- **`types/express`** – dodatkowe typy dla Expressa lub definiowanie customowych interfejsów.
- **`main.ts`** – punkt startowy NestJS. Rejestruje główny moduł aplikacji (zwykle `AppModule`) i uruchamia serwer HTTP/HTTPS.
- **`test/`** – testy jednostkowe i e2e (np. `app.e2e-spec.ts`).

---

## 4. Instalacja i uruchomienie

### Wymagania wstępne

- **Node.js** (rekomendowana wersja 18+)
- **npm** (lub **yarn**) w wersji kompatybilnej z Node.js
- Dostęp do bazy **PostgreSQL** (lokalnej lub zdalnej)
- (Opcjonalnie) **Docker** – do uruchomienia bazy danych lub konteneryzacji aplikacji

### Instalacja

1. Sklonuj repozytorium projektu:
   ```bash
   git clone https://github.com/UFEQ1337/Zalvira.git
   ```
2. Przejdź do folderu z backendem:
   ```bash
   cd Zalvira
   cd backend
   ```
3. Zainstaluj zależności:
   ```bash
   npm install
   ```
4. Utwórz plik `.env`

### Uruchomienie aplikacji

- **Tryb deweloperski** (watch mode):

  ```bash
  npm run start:dev
  ```

  Aplikacja domyślnie uruchomi się na porcie `3000` lub innym, określonym w pliku `.env`.

- **Tryb produkcyjny**:
  1. Zbuduj aplikację:
     ```bash
     npm run build
     ```
  2. Uruchom z plików skompilowanych:
     ```bash
     npm run start:prod
     ```

**Uwaga:** Jeśli korzystasz z Docker i posiadasz plik `docker-compose.yml`, możesz podnieść aplikację wraz z bazą danych poleceniem:

```bash
docker-compose up --build
```

---

## 5. Konfiguracja

### Plik `.env`

W pliku `.env` możesz skonfigurować m.in.:

- `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASS`, `DATABASE_NAME` – parametry połączenia z bazą PostgreSQL.
- `JWT_SECRET` – klucz używany do podpisywania tokenów JWT.
- `PORT` – port, na którym nasłuchuje aplikacja backendowa.

Przykład:

```
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASS=secret
DATABASE_NAME=zalvira_db
JWT_SECRET=ultra-secret-key
```

### Pliki konfiguracyjne

- **`tsconfig.json`** – główna konfiguracja TypeScript.
- **`tsconfig.build.json`** – konfiguracja TypeScript dedykowana kompilacji (build).
- **`nest-cli.json`** – konfiguracja CLI NestJS (np. ścieżki do plików w `src`).
- **`ormconfig.json`** (jeśli występuje) – konfiguracja TypeORM i migracji (opcjonalnie w zależności od implementacji).

---

## 6. Skrypty npm

W pliku `package.json` zdefiniowano kilka przydatnych skryptów:

| Skrypt        | Opis                                                                    |
| ------------- | ----------------------------------------------------------------------- |
| `start`       | Uruchamia NestJS w trybie produkcyjnym (z plików skompilowanych).       |
| `start:dev`   | Uruchamia NestJS w trybie deweloperskim (watch mode).                   |
| `start:debug` | Uruchamia NestJS w trybie debugowania.                                  |
| `build`       | Kompiluje aplikację do folderu `dist/`.                                 |
| `test`        | Uruchamia zestaw testów jednostkowych i e2e.                            |
| `test:watch`  | Uruchamia testy w trybie ciągłego monitorowania zmian.                  |
| `test:cov`    | Generuje raport pokrycia kodu testami.                                  |
| `lint`        | Analizuje kod przy pomocy ESLint i automatycznie naprawia część błędów. |
| `format`      | Formatuje kod źródłowy przy użyciu Prettier.                            |

---

## 7. Testy i jakość kodu

- **Testy jednostkowe** (Jest): Każdy moduł powinien zawierać pliki testowe (`*.spec.ts`), w których weryfikujemy poprawność logiki w warstwie serwisów, kontrolerów, a także ewentualnych guardów i filtrów.
- **Testy e2e**: Można je uruchomić przez `npm run test:e2e` (lub analogicznie), aby przetestować cały przepływ żądań/odpowiedzi.
- **ESLint** i **Prettier**: Pomagają utrzymać spójny styl kodu i unikać błędów składniowych czy złych praktyk.

---

## 8. Najczęstsze problemy

1. **Brak połączenia z bazą danych**

   - Upewnij się, że w pliku `.env` lub w konfiguracji TypeORM masz poprawne dane do logowania.
   - Sprawdź, czy baza jest uruchomiona.

2. **Błędy przy migracjach**

   - Jeśli projekt wykorzystuje migracje w TypeORM, mogą wystąpić konflikty wersji bazy danych.
   - Upewnij się, że migracje są w właściwym folderze i używaj odpowiednich komend do ich uruchamiania (np. `typeorm migration:run` albo skryptu w `package.json`).

3. **Problemy z wersją Node.js**

   - NestJS 11 i TypeScript mogą wymagać nowszej wersji Node.js (min. 16+). Sprawdź `node -v`.

4. **Nieprawidłowe tokeny JWT**
   - Jeśli logowanie nie działa lub otrzymujesz błąd 401, sprawdź `JWT_SECRET` w pliku `.env`.
   - Pamiętaj o odpowiednich nagłówkach (np. `Authorization: Bearer <token>`).

---

## 9. Dalsze plany rozwoju

- **Wdrożenie microserwisów**: Rozbicie jednego monolitycznego backendu na zestaw mniejszych usług (np. osobny serwis do rozliczeń, osobny do obsługi gier) w celu lepszej skalowalności.
- **Wykorzystanie GraphQL**: Rozważ zastąpienie/uzupełnienie REST API bardziej elastycznym endpointem GraphQL (Apollo).
- **Cachowanie (Redis)**: Wprowadzenie cachowania niektórych danych (np. rankingów, list gier) w Redisie.
- **Komunikacja eventowa**: Implementacja systemu zdarzeń (np. z użyciem Kafka, RabbitMQ) do obsługi intensywnego ruchu w grach kasynowych.
- **CI/CD**: Udoskonalenie pipeline’ów continuous integration i continuous delivery, aby przyspieszyć proces wdrażania nowych funkcjonalności.

---

## 10. Autor

**Mateusz Popielarz**  
Projekt **Zalvira** – portfolio prezentujące zaawansowane techniki tworzenia aplikacji webowych (kasynowych i nie tylko).

W przypadku pytań lub sugestii dotyczących backendu Zalvira, skontaktuj się przez [GitHub Issues](https://github.com/UFEQ1337/Zalvira/issues) lub e-mail.

---

**Dziękujemy za korzystanie z Zalvira!**  
Mamy nadzieję, że ta dokumentacja pomoże w bezproblemowym uruchomieniu i rozwoju projektu. W razie pytań lub problemów zachęcamy do tworzenia zgłoszeń w repozytorium. Powodzenia!
