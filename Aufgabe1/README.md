

## Checkliste

Zur Übersicht folgen noch mal alle Anforderungen in kompakter Form als Checkliste.

### Teil A: Formulare fertigstellen

- [ ] `Input` Elemente im Tagging- und Discovery-Formular ergänzen
  - [ ] Felder im Tagging Formular: `latitude`, `longitude`, `name` und `hashtag`
  - [ ] Felder im Discovery Formular: `searchterm` sowie `latitude` und `longitude` als versteckte Eingaben
  - [ ] Eindeutige `id` Attribute für die Felder
  - [ ] Für alle Felder jeweils ein `label`
  - [ ] Platzhalter für alle Felder
- [ ] `fieldset` und `legend` zur Begrenzung des Formulars
- [ ] Für jedes Formular ein Element zum Absenden
- [ ] Formular-Validierung
  - [ ] Latitude und Longitude mit festen Werten
  - [ ] Im Tagging-Formular: Name obligatorisch, Hashtag optional
  - [ ] Namen: max. 10 Buchstaben lang
  - [ ] Hashtags: beginnen mit `#`, max. 10 Buchstaben

### Teil B: Seite mit CSS3 gestalten

- [ ] Layout als verschachteltes zweispaltiges Grid realisieren
  - [ ] Klassen `.row` und `.col-x` verwenden
- [ ] Seitengestaltung
  - [ ] Farbig abgesetzte Header- und Footer-Bereiche
  - [ ] Vertikale Anordnung der Eingaben im Tagging Formular
  - [ ] Größere Boxen für die Eingaben aller Formulare
  - [ ] Discovery Ergebnisliste mit farbigen Boxen
- [ ] Responsives Verhalten
  - [ ] Spalten relativ zur Bildschirmbreite anpassen
  - [ ] Ab min. Bildschirmbreite Spalten untereinander klappen
    - [ ] Mit Media Query realisieren 