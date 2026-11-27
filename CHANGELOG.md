# Changelog / Änderungen

*Jede Version auf Deutsch und Englisch. / Every version in German and English.*

## 0.4.3

**Deutsch**

- Ersteinrichtung auf einer Seite: Name und vier Ja/Nein-Schalter (Batterien, Solar, dynamischer Tarif, E-Auto). Wattrio übernimmt die gefundenen Sensoren, die Grafik läuft sofort.
- Danach führt die Wattrio-Seite durch die Einstellungen: Abschnitt für Abschnitt prüfen und **Speichern**, ✓, der nächste klappt auf.
- Einstellungen in zugeklappten Abschnitten mit *Ja / Nein* und eigenem **Sensoren erkennen**, das nur Passendes vorschlägt. Reihenfolge: Netz, Batteriespeicher, Photovoltaik, Dynamischer Stromtarif, E-Auto / Wallbox, Verbraucher.
- Notstrom direkt bei jeder Batterie („Hat diese Batterie Notstrom-Steckdosen?“). Der Strompreis steht unter „Dynamischer Stromtarif“.
- Glas ist Standard; Klassik wählst du unter Einstellungen → Allgemein.

**English**

- First setup on one page: name and four yes/no switches (batteries, solar, dynamic tariff, EV). Wattrio applies the sensors it finds, the graphic runs right away.
- Afterwards the Wattrio page guides through the settings: check each section, **Speichern** (save), ✓, the next one opens.
- Settings in collapsed sections with *yes / no* and their own sensor detection that only suggests matching sensors. Order: grid, batteries, solar, dynamic tariff, EV / wallbox, loads.
- Backup power right at each battery. The electricity price moved to "Dynamischer Stromtarif".
- Glass is the default; Klassik is chosen under settings → Allgemein.

## 0.4.2

**Deutsch**

- Einrichtung Thema für Thema: Netz und Haus, dann jeweils mit Ja/Nein Photovoltaik, Batteriespeicher, Notstrom, Wallbox / E-Auto und dynamischer Stromtarif. Jedes Thema zeigt nur die dazu passenden Sensoren; fehlende kann man direkt selbst wählen.
- Glas-Karte: Mit Auto beginnt die Batteriereihe immer rechts neben Auto und Wallbox (bei 5 Speichern etwas schmaler), statt in das Auto zu ragen.

**English**

- Setup topic by topic: grid and house, then yes/no for solar, batteries, backup power, wallbox / EV and dynamic tariff. Each topic shows only its matching sensors; missing ones can be picked right there.
- Glass card: with a car, the battery row always starts right of the car and wallbox (a bit narrower with 5 batteries) instead of running into the car.

## 0.4.1

**Deutsch**

- Erkennung viel strenger: keine nicht verfügbaren Sensoren, keine Helfer wie Standby, Hauslast oder Überschuss, Batterien nur mit Ladestand, PV-Stränge statt doppelter Wechselrichter-Summe. Dieselbe Batterie über eine zweite Integration wird als doppelt markiert.
- Einrichtung: alles Gefundene als Häkchenliste mit aktuellen Werten. Bei mehr als 5 Batterien kommt ein klarer Hinweis statt eines stillen Fehlers.
- Die Seite **Wattrio** zeigt die Karte jetzt selbst, sofort und ohne Neuladen, mit Umschalter Glas/Klassik und Knopf **Einstellungen**. Das automatische Dashboard aus 0.4.0 entfällt (es blieb bis zum Neuladen leer).
- Wattrio steht nach der Einrichtung ganz oben in der Seitenleiste.
- Ohne zugeordnete Sensoren entstehen keine Sensoren mehr. „Alle leeren Felder füllen“ übernimmt höchstens 5 Batterien.

Wer 0.4.0 eingerichtet hat: das Dashboard „Energiefluss“ löschen, die Integration entfernen und neu hinzufügen.

**English**

- Much stricter detection: no unavailable sensors, no helpers like standby, house load or surplus, batteries only with a state of charge, PV strings instead of a double-counted inverter total. The same battery seen through a second integration is marked as a duplicate.
- Setup: everything found as a checklist with current values. More than 5 batteries gives a clear message instead of a silent failure.
- The **Wattrio** page now shows the card itself, right away without reloading, with a Glas/Klassik switch and a **Einstellungen** (settings) button. The automatic dashboard of 0.4.0 is gone (it stayed empty until a reload).
- After setup Wattrio is at the top of the sidebar.
- No sensors are created while nothing is assigned. "Fill all empty fields" takes at most 5 batteries.

If you set up 0.4.0: delete the "Energiefluss" dashboard, remove the integration and add it again.

## 0.4.0

**Deutsch**

- Einrichtung ohne Anleitung: Nach dem Namen sucht Wattrio selbst die Sensoren und zeigt, was es gefunden hat. Danach wählst du *Glas*, *Klassik* oder *kein Dashboard*, und Wattrio legt ein Dashboard **Energiefluss** mit laufender Karte an.
- Nach der Einrichtung sagt eine Benachrichtigung, wo Dashboard, Einstellungen und Karten zu finden sind.
- Es entstehen nur noch Sensoren für das, was eingerichtet ist, statt einer langen Liste „nicht verfügbar“. Sensoren von entfernten Teilen werden aufgeräumt.

**English**

- Setup without reading a manual: after the name, Wattrio detects the sensors itself and shows what it found. Then pick *Glas*, *Klassik* or *no dashboard*, and Wattrio creates a dashboard **Energiefluss** with the card running.
- After setup, a notification says where the dashboard, the settings and the cards are.
- Sensors are only created for what is set up, no more long "unavailable" list. Sensors of removed parts are cleaned up.

## 0.3.3

**Deutsch**

- Die Integration bringt jetzt auch ein Logo mit (`logo.png`, `logo@2x.png`), wie die SmartFlow Preisampel.

**English**

- The integration now also ships a logo (`logo.png`, `logo@2x.png`).

## 0.3.2

**Deutsch**

- Icon der Integration wird mitgeliefert (für HACS und Home Assistant); erfüllt alle Prüfungen für die HACS-Standardliste.

**English**

- The integration ships its icon (for HACS and Home Assistant); passes all checks for the HACS default list.

## 0.3.1

**Deutsch**

- Neuer Name: **Wattrio Energiefluss** (Wattrio = Watt + Trio: PV, Akku, Netz). Karten heißen jetzt *Wattrio Energiefluss Glas* und *Wattrio Energiefluss Klassik*, die Seitenleiste *Wattrio*. Die technische Kennung `energiefluss` bleibt, bestehende Einrichtungen laufen unverändert weiter.

**English**

- New name: **Wattrio Energiefluss** (Wattrio = watt + trio: PV, battery, grid). The cards are now called *Wattrio Energiefluss Glas* and *Wattrio Energiefluss Klassik*, the sidebar page *Wattrio*. The technical id `energiefluss` stays, existing setups keep working unchanged.

## 0.3.0

**Deutsch**

- Haus-Box und Hausleitung zeigen das Hausnetz ohne die Notstrom-Geräte, die Akkus direkt versorgen; eine kleine „Gesamt“-Box über den Verbrauchern zeigt den vollen Verbrauch inkl. Notstrom.
- Akkus mit Notstrom-Abgang: Ihre Leitung zum Speicher zeigt nur den Rest über ihre Notstrom-Last; Notstrom wird über die Wirkleistung der Geräte abgezogen.
- Eingeklappte Listen: „+ N weitere“ zeigt die Summe der eingeklappten Verbraucher und bekommt ihren Zug.
- Züge fahren nach dem Abschalten eines Verbrauchers noch bis zum Ziel.
- Glas-Karte: größeres Glashaus, kleinere Netz-Kachel, Auto mit Werten am Sockel.
- Anleitung vollständig auf Deutsch und Englisch: Grundlast und Zusatzverbraucher, was die Integration selbst berechnet und wie man fehlende Sensoren als Helfer anlegt.
- Fällt ein eingetragener Hausverbrauch-Sensor aus, wird das Haus aus der Bilanz berechnet; der Tageswert am Haus zählt ohne Notstrom.

**English**

- House value and line show what the house net supplies, without the backup loads batteries feed directly; a small "Gesamt" box above the load groups shows the total consumption incl. backup loads.
- Batteries with backup loads: their line to the storage box shows only what goes beyond their own backup load; backup loads are subtracted by their own (active power) sensors.
- Folded load lists: the "+ N weitere" row shows the sum of the hidden loads and gets their train.
- Glass card: bigger glass house, placed higher.
- Trains finish their way when a load switches off.
- Glass card: smaller grid tile, car with its values on the plate.
- README fully in German and English: base load vs. additional loads, what the integration calculates itself, how to create missing sensors as helpers.
- If a configured house sensor has no value, the house is calculated from the balance; the house's daily value excludes backup loads.

## 0.2.0

**Deutsch**

- Akkus lassen sich als *entlädt nur über Notstrom* markieren (z. B. EcoFlow): Ihr Eingang zählt auf der Hausseite, ihr Ausgang versorgt nur die Notstrom-Geräte; Hausleitung und Herkunftsfarben richten sich danach.
- Glas-Karte: drei Kugelgrößen nach vollen Werten (1000 W / 100 W / 10 W, unter 10 W keine Kugel).
- Glas-Karte: PV-Strings auf einem Glas-Solarmodul, breiterer PV-Sammler, kleinere Netz-Kachel, schmaler Abstand zwischen den Verbrauchergruppen, ohne „heute“.
- Ein Klick auf einen Wert öffnet den zugehörigen Sensor.
- Logo und Icons für Home Assistant.

**English**

- Batteries can be marked *only via backup* (e.g. EcoFlow): their input counts on the house side, their output only feeds their backup loads; the house line and source colours follow.
- Glass card: three ball sizes counting full values (1000 W / 100 W / 10 W, nothing below 10 W).
- Glass card: PV strings on a glass solar panel, wider PV collector, smaller grid tile, small gap between load groups, no "heute" label.
- Click a value to open its sensor's dialog.
- Logo and Home Assistant brand icons.

## 0.1.0 – erste Version / first public version

**Deutsch**

- Integration: visuelle Einrichtung (Seitenleiste und Kartendialog) mit Sensor-Erkennung; PV-Strings, bis zu 5 Akkus, Netz mit Preis und Einspeisevergütung, Wallbox mit Ladestand; Verbraucher als Grundlast und Zusatzverbraucher, enthaltene Verbraucher zählen einmal, Notstrom für bis zu 2 Akkus; berechnet einen fehlenden Wert aus der Energiebilanz; eigene Sensoren für Summen, *nicht erfasst*, Überschuss und Tagesenergie.
- Karten: *Energiefluss* (klassisch) und *Energiefluss Glas* (2.5D-Glasoptik mit Kugelzügen, Herkunftsfarben, Quecksilbertropfen, Akkus und Auto mit Flüssigkeit, einklappbaren Listen, automatischer Leitungsführung).

**English**

**Integration**

- Visual setup (sidebar page and card dialog) with sensor detection.
- PV strings, up to 5 batteries (combined or separate charge / discharge sensors), grid (combined or separate import / export), price and feed-in tariff, wallbox with car state of charge.
- Loads as *Grundlast* and *Zusatzverbraucher*, contained loads counted once, backup outputs for up to 2 batteries.
- Calculates one missing value (house, grid, PV or one battery) from the energy balance.
- Own sensors for group totals, *not measured*, surplus, battery totals and daily energy (since midnight or rolling 24 h), kept across restarts.

**Cards**

- *Energiefluss*: classic flat look.
- *Energiefluss Glas*: 2.5D glass look with counted ball trains (big = 1000 W, small = 100 W), source colours (PV / battery / grid), mercury drops at junctions, liquid-filled batteries and car, foldable load lists, automatic line routing.
