# AE Raumklima Bootcamp – Codebase (dein Fork)

!!! danger "KI ist komplett verboten"
    Während des Bootcamps darfst du **keine KI-Tools** verwenden – nicht für Fragen, nicht für Code, nicht für Erklärungen. Siehe [`app/QUELLEN.md`](app/QUELLEN.md) für die erlaubten Alternativen (W3Schools, MDN).

## Was ist das hier?

Das ist dein **eigener Fork** des Codebase-Repos vom AE Raumklima
Bootcamp. Hier arbeitest du **alleine** an deiner
Raumklima-Monitor-Web-App.

Du arbeitest im Ordner `app/` und schreibst dort:

- `index.html` – Struktur der Seite
- `style.css` – Layout und Farben
- `script.js` – Logik und Daten laden
- `data.json` *(ab Tag 2)* – Initial-Seed

Alles andere in diesem Repo lässt du in Ruhe.

## Setup (einmalig)

Falls du das noch nicht gemacht hast:

1. **Auf GitHub forken:** Klicke oben rechts auf der
   [Original-Repo-Seite](https://github.com/HeiligerG/ae-raumklima-bootcamp-codebase)
   auf **Fork** und wähle deinen Account als Ziel.
2. **Deinen Fork klonen:**
   ```bash
   git clone https://github.com/<DEIN-USERNAME>/ae-raumklima-bootcamp-codebase.git
   ```
3. **VS Code öffnen:**
   ```bash
   cd ae-raumklima-bootcamp-codebase
   code .
   ```
4. **Live Server starten:** Rechtsklick auf `app/index.html` →
   **Open with Live Server** (Extension installieren falls nötig)

Du brauchst nur **drei** Git-Befehle:

```bash
git add .                    # Änderungen vormerken
git commit -m "Was ich gemacht habe"   # Commit erstellen
git push                     # Auf deinen Fork hochladen
```

Mehr brauchst du nicht. Keine Pull Requests, kein Branch-Workflow.
Du arbeitest direkt auf `main` in deinem Fork.

## Wann bist du fertig?

Nach Tag 5 (Donnerstag) hast du eine funktionierende App. Der
Trainer schaut in alle Forks rein. Keine Bewertung – nur eine
gemeinsame Demo am Ende der Woche.

## Hilfe

In dieser Reihenfolge:

1. **W3Schools** – [`app/QUELLEN.md`](app/QUELLEN.md) hat eine
   vollständige Liste mit direkten Links zu HTML, CSS, JS, DOM,
   Fetch, JSON, LocalStorage
2. **MDN** (Mozilla Developer Network) – für tiefergehende Details
3. **DevTools (F12)** – Konsole zeigt oft die Antwort
4. **Trainer fragen** – 1:1, kurze präzise Frage

**Was du NICHT tust:** KI-Tools verwenden (verboten), von
Mitlernenden Code abschreiben (Einzelarbeit).

## Inhalt

| Pfad | Zweck |
|------|-------|
| `app/` | **Hier arbeitest du.** Enthält `index.html`, `style.css`, `script.js`, `data.json` und Notizen. |
| `app/QUELLEN.md` | **Lies das zuerst.** W3Schools-Links + KI-Verbot. |
| `app/README.md` | Setup deines `app/`-Ordners im Detail. |
| `app/snapshot-strategie.md` | Wie dein Code mit dem Backend funktioniert (Snapshot-Fallback). |
| `CODE_OF_CONDUCT.md` | Verhaltensregeln (auch im Lernleitfaden). |
| `README.md` | Diese Datei. |

## Weitere Dokumentation

Der vollständige Lernleitfaden (Theorie, Übungen, Projekte) ist
online verfügbar unter:
<https://heiligerg.github.io/ae-raumklima-bootcamp/>

!!! tip "Erste Schritte"
    1. Lies [`app/QUELLEN.md`](app/QUELLEN.md) – KI-Verbot und
       W3Schools-Links
    2. Lies [`app/README.md`](app/README.md) – Setup deines `app/`-Ordners
    3. Fang an mit Tag 1: erstelle `app/index.html` und `app/style.css`