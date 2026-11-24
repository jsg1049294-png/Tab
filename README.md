# TAP – Ultimate All-in-One iPad Control Center

Schwebendes Neon-Control-Center für iPad (Safari / Chrome).

**Repository:** https://github.com/jsg1049294-png/Tab  
**Live (GitHub Pages):** https://jsg1049294-png.github.io/Tab/

## Funktionen

| Modul | Status |
|--------|--------|
| Schwebendes Fenster (Drag, Min, Close, Restore) | ✅ |
| AutoClicker (aus `autoclicker` übernommen: Multi-Pos, Marker, Puls, Intervalle, Start/Pause/Stop) | ✅ |
| Musikplayer – **exakt 19 Songs** (Spotify-Suche öffnen) | ✅ |
| Taschenrechner | ✅ |
| Adblocker (EIN/AUS, Filter in dieser App) | ⚠️ begrenzt |
| Screen Awake (Wake Lock API) | ⚠️ abhängig vom Browser |
| Browser (iframe + Fallback neuer Tab) | ⚠️ viele Sites blockieren iframes |

## Musikplaylist (genau 19)

1. coachlim (Blackberrysky) – coacheslimes  
2. BMW3 – 2hermanoz  
3. AKON – Jazeek  
4. 3ER BMW – Tream, treamiboii  
5. 500 PS – Bonez MC, RAF Camora  
6. Coachlim (Azet 9 Milly parodie) – coacheslimes  
7. Coachlim (Fast Life) – coacheslimes  
8. Coachlim - Lelele (Azet) – coacheslimes  
9. panzerknacker.wav – LENNSKO  
10. VERLIEBT IN MICH – FAYAN, Dalton  
11. Leck Sibbi – Nimo  
12. Bamba (feat. Aitch & BIA) – Luciano, Aitch, BIA  
13. Chabos wissen wer der Babo ist – Haftbefehl  
14. Show Me Love – WizTheMc, bees & honey  
15. H&K – LACAZETTE  
16. Hin und Her – AK AUSSERKONTROLLE  
17. Von hier an blind – Wir sind Helden  
18. All The Way Up (feat. Infared) – Fat Joe, Remy Ma, French Montana, InfaRed  
19. Eligella Fick Mich – Lil Koassy  

Wiedergabe: Tippen öffnet die Spotify-Suche (legal, kein Streaming ohne API-Key).

## AutoClicker

Logik und UX orientieren sich am bestehenden Repo **autoclicker** (nur gelesen, nicht verändert):

- Klickposition antippen  
- Mehrere Positionen + nummerierte Marker  
- Puls-Animation bei jedem Klick  
- Intervalle 0,1s–10s + eigene Zeit  
- Anzahl / unendlich, Start / Pause / Stop  

**Limit:** Wirkt nur innerhalb der Seite (bzw. per Bookmarklet auf anderen Seiten). Keine systemweiten Klicks auf iPadOS.

## GitHub Pages

Settings → Pages → Branch `main` → `/ (root)`.

## Einschränkungen (ehrlich)

- Kein systemweiter AutoClicker / Adblocker ohne Safari-Extension  
- Wake Lock kann vom System überschrieben werden  
- Viele Websites erlauben kein iframe (Browser-Fallback: neuer Tab)  
- Spotify-Tracks werden nicht lokal gestreamt – Link zu Spotify  

## Lizenz

Frei nutzbar. Original-AutoClicker-Repo bleibt unverändert.
