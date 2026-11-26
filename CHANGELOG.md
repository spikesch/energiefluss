# Changelog

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
