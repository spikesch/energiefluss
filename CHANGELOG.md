# Changelog / Änderungen

*Jede Version auf Deutsch und Englisch. / Every version in German and English.*

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
