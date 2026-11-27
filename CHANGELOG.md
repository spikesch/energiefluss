# Changelog

## Unreleased

- House value and line show what the house net supplies, without the backup loads batteries feed directly; a small "Gesamt" box above the load groups shows the total consumption incl. backup loads.
- Batteries with backup loads: their line to the storage box shows only what goes beyond their own backup load; backup loads are subtracted by their own (active power) sensors.
- Folded load lists: the "+ N weitere" row shows the sum of the hidden loads and gets their train.
- Glass card: bigger glass house, placed higher.

## 0.2.0

- Batteries can be marked *only via backup* (e.g. EcoFlow): their input counts on the house side, their output only feeds their backup loads; the house line and source colours follow.
- Glass card: three ball sizes counting full values (1000 W / 100 W / 10 W, nothing below 10 W).
- Glass card: PV strings on a glass solar panel, wider PV collector, smaller grid tile, small gap between load groups, no "heute" label.
- Click a value to open its sensor's dialog.
- Logo and Home Assistant brand icons.

## 0.1.0 – first public version

**Integration**

- Visual setup (sidebar page and card dialog) with sensor detection.
- PV strings, up to 5 batteries (combined or separate charge / discharge sensors), grid (combined or separate import / export), price and feed-in tariff, wallbox with car state of charge.
- Loads as *Grundlast* and *Zusatzverbraucher*, contained loads counted once, backup outputs for up to 2 batteries.
- Calculates one missing value (house, grid, PV or one battery) from the energy balance.
- Own sensors for group totals, *not measured*, surplus, battery totals and daily energy (since midnight or rolling 24 h), kept across restarts.

**Cards**

- *Energiefluss*: classic flat look.
- *Energiefluss Glas*: 2.5D glass look with counted ball trains (big = 1000 W, small = 100 W), source colours (PV / battery / grid), mercury drops at junctions, liquid-filled batteries and car, foldable load lists, automatic line routing.
