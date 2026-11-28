# Changelog / Änderungen

*Jede Version auf Deutsch und Englisch. / Every version in German and English.*

## 0.6.3

**Deutsch**

- Karten auf eigenen Dashboards laufen weiter, auch wenn die Integration entfernt und neu hinzugefügt wurde: Gibt es die gespeicherte Anlage nicht mehr, zeigt die Karte die erste vorhandene statt „Keine Wattrio-Instanz gefunden“.

**English**

- Cards on your own dashboards keep working even after the integration was removed and added again: if the saved system no longer exists, the card shows the first one instead of "Keine Wattrio-Instanz gefunden" (no instance found).

## 0.6.2

**Deutsch**

- Klassik-Karte: Der Preis am Netzmast ist jetzt wirklich farbig (blassrot beim Bezug, blassgrün beim Einspeisen) – in 0.6.1 blieb er grau.
- Klassik-Karte: Lange Gruppentitel wie „Notstrom – Speicher 4“ laufen nicht mehr in die Zahlen; sie werden gekürzt, der volle Name steht im Tooltip.
- Neue Screenshots mit fünf Batterien, Wallbox und zwei Notstrom-Boxen.

**English**

- Classic card: the price at the grid pylon is now really coloured (pale red while buying, pale green while selling) – in 0.6.1 it stayed grey.
- Classic card: long group titles such as "Notstrom – Speicher 4" no longer run into the numbers; they are shortened, the full name is in the tooltip.
- New screenshots with five batteries, a wallbox and two backup boxes.

## 0.6.1

**Deutsch**

- Die Box mit den Notstrom-Geräten heißt jetzt „Notstrom“ statt nach der Batterie; bei zwei Notstrom-Batterien „Notstrom – <Batterie>“.
- Speicher-Übersicht: zusätzlich die Leistung, die alle Batterien zusammen gerade aufnehmen (+) oder abgeben (−).
- Preis am Netzmast farbig und dezent: blassrot beim Bezug, blassgrün bei der Einspeisevergütung.
- Glas-Karte: Ändert sich die Leistung, springen die Kugeln nicht mehr – die laufenden fahren bis zur nächsten Station weiter, der neue Zug startet am Anfang der Leitung.
- Glas-Solarmodul passt sich der Zahl der Stränge an: 4 (oder 3) in Vierteln, 2 links und rechts, bei einem Strang stehen die Zahlen direkt auf dem Glas.

**English**

- The box with the backup loads is now called "Notstrom" (backup) instead of after the battery; with two backup batteries "Notstrom – <battery>".
- Storage overview: also the power all batteries together take in (+) or give out (−) right now.
- Price at the grid pylon in subtle colours: pale red while buying, pale green for the feed-in tariff.
- Glass card: when the power changes, the balls no longer jump – those on their way ride on to the next station, the new train starts at the beginning of the line.
- Glass solar panel follows the number of strings: 4 (or 3) in quarters, 2 left and right, with one string the numbers sit right on the glass.

## 0.6.0

**Deutsch**

- Klick auf ein Feld der Grafik, während die Einstellungen offen sind: der passende Abschnitt klappt auf, scrollt ins Bild und das Feld leuchtet kurz auf – PV-Strang, PV gesamt, Batterie, Netz, Wallbox, Hausverbrauch, jeder Verbraucher. Bei Verbrauchern steht der Cursor gleich im Namensfeld. Außerhalb der Einstellungen zeigt ein Klick wie bisher den Sensor.
- Photovoltaik: optional **PV-Gesamtleistung** – ein eigener Sensor (z. B. vom Wechselrichter) statt der Summe der Stränge. Er gilt für „PV gesamt“, die Energiebilanz und den PV-Ertrag heute; die Stränge bleiben einzeln auf dem Modul.
- Gefundene Verbraucher haben einen dritten Knopf **Jetzt nicht**: ausgeblendet bis zum nächsten *Sensoren erkennen*.

**English**

- Click a field of the graphic while the settings are open: the matching section opens, scrolls into view and the field lights up briefly – PV string, PV total, battery, grid, wallbox, house consumption, every load. For loads the cursor is already in the name field. Outside the settings a click shows the sensor as before.
- Solar: optional **PV-Gesamtleistung** (total PV power) – a sensor of its own (e.g. from the inverter) instead of the sum of the strings. It is used for "PV gesamt", the energy balance and today's PV yield; the strings stay on the panel one by one.
- Suggested loads get a third button **Jetzt nicht** (not now): hidden until the next *Sensoren erkennen*.

## 0.5.0

**Deutsch**

- *Sensoren erkennen* zeigt jetzt, wo ein Sensor in Home Assistant schon vorkommt – Energie-Dashboard, Dashboards, Helfer, Automationen, Skripte, Szenen, Gruppen – und wie er dort heißt (auch Aliasse für Sprachassistenten).
- Bei möglichen Verbrauchern stehen zusätzlich Entität, aktuelle Leistung, Raum und Gerät.
- Verbraucher können einen eigenen Namen bekommen: einen gefundenen anklicken oder selbst eintragen (Abschnitt *Verbraucher* → *Namen auf der Karte*). Er gilt für die Karte und die Tageswert-Sensoren; der Sensor selbst wird nicht umbenannt.

**English**

- *Detect sensors* now shows where else a sensor is used in Home Assistant – energy dashboard, dashboards, helpers, automations, scripts, scenes, groups – and what it is called there (voice assistant aliases included).
- Suggested loads also show the entity id, current power, area and device.
- Loads can have their own name: click one that was found or type it (section *Verbraucher* → *Namen auf der Karte*). It is used on the card and for the daily energy sensors; your sensor itself is not renamed.

## 0.4.6

**Deutsch**

- Glas-Karte: Die Kugeln zu den Verbrauchern zeigen jetzt immer ihre Herkunft – gelb PV, grün Batterie, blau Netz, so wie der Strom gerade ins Haus kommt – statt der Farbe der Gruppe.
- Glas-Karte: Eingerückte Geräte (z. B. Wasserkocher in Neubau) bekommen ihren eigenen Zug; der Zug des Elterngeräts zählt nur, was bei ihm selbst bleibt.

**English**

- Glass card: the balls to the loads now always show where the power comes from – yellow PV, green battery, blue grid, as it flows into the house right now – instead of the group colour.
- Glass card: contained loads (e.g. a kettle inside a sub-meter) get their own train; the parent's train counts only what stays with it.

## 0.4.5

**Deutsch**

- Glas-Karte: Auf der gemeinsamen Leitung vom Haus zu einer Verbraucher-Gruppe fährt jetzt ein zusammengefasster Zug für die ganze Gruppe – mit großen Kugeln je volle 1000 W. Erst an der Verteilung teilt er sich auf die einzelnen Geräte auf.

**English**

- Glass card: on the shared pipe from the house to a load group one combined train now runs for the whole group – with big balls per full 1000 W. It splits up into the single loads only at the bracket.

## 0.4.4

**Deutsch**

- Glas-Karte: Die mittlere Kugel der Züge (je volle 100 W) ist etwas größer.
- Glas-Karte: Die Box „Zusätzlich“ und ihre Leitungen sind klar blau statt lavendel.

**English**

- Glass card: the medium train balls (per full 100 W) are a bit bigger.
- Glass card: the "Zusätzlich" box and its pipes are clear blue instead of lavender.

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
