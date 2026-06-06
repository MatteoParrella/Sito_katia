# Piano completo — Sito one-page + sistema prenotazioni automatiche

**Cliente:** Katia Teruzzi  
**Progetto:** Landing page per corsi Pilates/Mix con prenotazione automatica, limite massimo 12 posti e annullamento tramite link  
**Versione piano:** 2.0  
**Obiettivo:** creare una bozza funzionante da mostrare a Katia e poi completare il sito definitivo.

---

## 1. Obiettivo del progetto

Il sito deve permettere alle persone di:

- conoscere Katia e i suoi corsi;
- vedere gli orari settimanali delle lezioni;
- prenotare direttamente online senza login;
- ricevere conferma immediata se ci sono posti disponibili;
- vedere un messaggio di lezione completa se i 12 posti sono già occupati;
- annullare la propria prenotazione tramite un link personale ricevuto dopo la prenotazione.

Katia deve poter:

- vedere tutte le prenotazioni ricevute;
- controllare gli iscritti per ogni lezione;
- cancellare manualmente una prenotazione;
- liberare automaticamente un posto quando una prenotazione viene annullata;
- avere un sistema semplice, chiaro e poco impegnativo da usare.

Il sito non deve essere un gestionale complesso. Deve essere una prima versione efficace, semplice e professionale.

---

## 2. Idea generale del funzionamento

Il sito sarà composto da una landing page pubblica e da una piccola area di gestione per Katia.

### Lato utente

1. L’utente entra nel sito.
2. Legge le informazioni sui corsi.
3. Consulta gli orari disponibili.
4. Clicca su “Prenota”.
5. Sceglie la lezione.
6. Inserisce nome, cognome, email e telefono.
7. Il sistema controlla automaticamente i posti disponibili.
8. Se ci sono meno di 12 persone confermate, la prenotazione viene confermata subito.
9. Se la lezione è piena, la prenotazione viene rifiutata e l’utente viene invitato a scegliere un altro orario.
10. Dopo la prenotazione confermata, l’utente riceve una conferma con un link personale per annullare.

### Lato Katia

1. Katia accede a un’area gestione semplice.
2. Vede le lezioni settimanali.
3. Per ogni lezione vede il numero di iscritti, per esempio 8/12.
4. Può aprire l’elenco dei partecipanti.
5. Può cancellare una prenotazione se necessario.
6. Quando una prenotazione viene cancellata, il posto torna disponibile.

---

## 3. Funzioni principali incluse

### 3.1 Landing page one-page

La pagina principale deve contenere:

- sezione iniziale con nome e messaggio principale;
- presentazione dei corsi Pilates e Mix;
- calendario/orari delle lezioni;
- pulsante “Prenota la tua lezione”;
- sezione contatti;
- pulsante WhatsApp;
- eventuale mappa o indicazione della zona;
- grafica pulita, femminile, ordinata e coerente con il mondo Pilates/benessere;
- ottimizzazione per smartphone.

### 3.2 Prenotazione automatica

Il sistema deve:

- mostrare le lezioni disponibili;
- permettere all’utente di scegliere una lezione;
- raccogliere i dati essenziali dell’utente;
- controllare i posti in tempo reale;
- confermare automaticamente la prenotazione se ci sono posti;
- bloccare la prenotazione se la lezione è piena;
- salvare la prenotazione nel database;
- inviare o mostrare un link di annullamento personale.

### 3.3 Limite posti

Ogni lezione avrà massimo **12 partecipanti confermati**.

Regola:

- se i confermati sono da 0 a 11, il sistema accetta una nuova prenotazione;
- se i confermati sono 12, il sistema rifiuta nuove prenotazioni;
- le prenotazioni annullate non vengono conteggiate nei posti occupati;
- quando una prenotazione viene annullata, il posto torna libero.

### 3.4 Annullamento automatico tramite link

Ogni prenotazione confermata deve avere un codice univoco di annullamento.

Dopo la prenotazione, l’utente riceve o visualizza un link del tipo:

`/annulla-prenotazione?token=CODICE_UNIVOCO`

Quando l’utente apre il link:

1. il sistema verifica che il codice esista;
2. verifica che la prenotazione sia ancora confermata;
3. mostra una pagina di conferma annullamento;
4. l’utente clicca su “Conferma annullamento”;
5. la prenotazione passa da “confermata” ad “annullata”;
6. il posto torna disponibile per altri utenti.

### 3.5 Area gestione Katia

L’area gestione deve essere semplice.

Funzioni minime:

- accesso protetto per Katia;
- elenco lezioni;
- conteggio posti: per esempio 7/12;
- elenco partecipanti per ogni lezione;
- possibilità di cancellare una prenotazione;
- visualizzazione dati partecipante: nome, email, telefono;
- stato prenotazione: confermata o annullata.

Per la prima versione non serve un pannello complesso. Basta una dashboard essenziale.

---

## 4. Orari lezioni da settembre

Le lezioni iniziali da inserire sono:

| Giorno | Orario | Corso | Posti massimi |
|---|---:|---|---:|
| Lunedì | 18:00 | Mix | 12 |
| Lunedì | 19:00 | Pilates | 12 |
| Martedì | 10:00 | Pilates | 12 |
| Mercoledì | 18:00 | Pilates | 12 |
| Mercoledì | 19:00 | Mix | 12 |
| Giovedì | 10:00 | Pilates | 12 |
| Giovedì | 18:00 | Mix, da concordare | 12 |
| Giovedì | 19:00 | Pilates | 12 |

La voce “Mix, da concordare” può essere gestita in due modi:

1. visibile ma con testo “da confermare”; oppure
2. nascosta finché Katia non conferma l’orario.

Per una bozza iniziale si può mostrarla come “Mix — da concordare”.

---

## 5. Contenuti della pagina

### 5.1 Hero iniziale

Titolo suggerito:

**Pilates e movimento consapevole con Katia Teruzzi**

Sottotitolo suggerito:

**Lezioni di Pilates e Mix in piccoli gruppi, con prenotazione online semplice e immediata.**

Pulsanti:

- Prenota una lezione
- Scrivimi su WhatsApp

### 5.2 Sezione corsi

Corsi da mostrare:

- Pilates
- Mix

Testo suggerito:

“Le lezioni sono pensate per aiutarti a migliorare postura, mobilità, forza e benessere generale, rispettando il ritmo del tuo corpo.”

### 5.3 Sezione orari

Mostrare una tabella semplice con giorni, orari e tipo di corso.

Ogni riga può avere un pulsante “Prenota”.

### 5.4 Sezione prenotazione

Il form deve chiedere:

- nome;
- cognome;
- email;
- telefono;
- lezione scelta;
- accettazione privacy.

Campi opzionali:

- note;
- prima volta sì/no.

### 5.5 Sezione contatti

Inserire:

- WhatsApp;
- email;
- Instagram;
- indirizzo o zona;
- eventuale mappa.

---

## 6. Database e struttura dati

Per realizzare il blocco automatico dei posti serve un database o un sistema equivalente.

Soluzione consigliata per una prima versione:

- database leggero, per esempio Supabase/Firebase/SQLite/MySQL;
- oppure Google Sheets + Apps Script, ma solo se gestito con attenzione.

Per un sistema più stabile, è preferibile usare un vero database.

### 6.1 Tabella lezioni

Nome tabella: `lessons`

Campi:

| Campo | Tipo | Descrizione |
|---|---|---|
| id | string/uuid | Identificativo lezione |
| day_of_week | string | Giorno della settimana |
| time | string | Orario lezione |
| course_name | string | Pilates o Mix |
| max_seats | number | Posti massimi, default 12 |
| is_active | boolean | Lezione visibile o nascosta |
| notes | string | Eventuali note, es. da concordare |

### 6.2 Tabella prenotazioni

Nome tabella: `bookings`

Campi:

| Campo | Tipo | Descrizione |
|---|---|---|
| id | uuid | Identificativo prenotazione |
| lesson_id | string/uuid | Collegamento alla lezione |
| first_name | string | Nome utente |
| last_name | string | Cognome utente |
| email | string | Email utente |
| phone | string | Telefono utente |
| status | string | confirmed/cancelled |
| cancel_token | string | Codice sicuro per annullamento |
| created_at | datetime | Data prenotazione |
| cancelled_at | datetime/null | Data annullamento |
| cancellation_source | string/null | user/admin |

### 6.3 Stati prenotazione

Gli stati minimi sono:

- `confirmed` = prenotazione confermata;
- `cancelled` = prenotazione annullata.

In futuro si possono aggiungere:

- `waiting_list` = lista d’attesa;
- `no_show` = persona non presentata;
- `rescheduled` = spostata.

---

## 7. Logica di prenotazione

### 7.1 Regola principale

Prima di salvare una nuova prenotazione, il sistema deve contare quante prenotazioni confermate esistono per quella lezione.

Pseudo-logica:

```text
posti_occupati = numero prenotazioni con:
- lesson_id uguale alla lezione scelta
- status = confirmed

se posti_occupati < 12:
    crea prenotazione con status confirmed
    genera cancel_token
    mostra conferma
altrimenti:
    rifiuta prenotazione
    mostra messaggio lezione completa
```

### 7.2 Evitare overbooking

Problema possibile:

due utenti prenotano nello stesso momento quando rimane un solo posto.

Soluzione:

- usare una transazione database;
- oppure un controllo lato backend immediatamente prima del salvataggio;
- evitare che il conteggio sia solo lato frontend;
- il frontend non deve decidere da solo se c’è posto.

La regola dei 12 posti deve stare nel backend o nello script server-side.

---

## 8. Flussi utente

### 8.1 Prenotazione riuscita

1. Utente apre sito.
2. Clicca su “Prenota”.
3. Sceglie lezione.
4. Compila dati.
5. Accetta privacy.
6. Clicca “Conferma prenotazione”.
7. Sistema controlla posti.
8. Sistema salva prenotazione.
9. Sistema mostra messaggio:

“Prenotazione confermata! Il tuo posto è stato riservato. Se non puoi partecipare, puoi annullare usando il link ricevuto.”

10. Sistema mostra o invia link di annullamento.

### 8.2 Lezione piena

1. Utente prova a prenotare una lezione.
2. Il sistema trova già 12 prenotazioni confermate.
3. Il sistema non salva la prenotazione.
4. Mostra messaggio:

“Questa lezione ha raggiunto il numero massimo di 12 partecipanti. Scegli un altro orario o contatta Katia.”

### 8.3 Annullamento utente

1. Utente apre il link di annullamento.
2. Sistema verifica il token.
3. Se il token è valido, mostra i dati principali della prenotazione.
4. Utente clicca “Annulla prenotazione”.
5. Sistema cambia stato da `confirmed` a `cancelled`.
6. Sistema mostra messaggio:

“La tua prenotazione è stata annullata correttamente.”

7. Il posto torna disponibile.

### 8.4 Token non valido

Se il link è sbagliato o inesistente:

“Link non valido. Contatta Katia per assistenza.”

### 8.5 Prenotazione già annullata

Se l’utente prova ad annullare una prenotazione già annullata:

“Questa prenotazione risulta già annullata.”

### 8.6 Cancellazione da parte di Katia

1. Katia entra nell’area gestione.
2. Apre una lezione.
3. Vede l’elenco dei partecipanti.
4. Clicca “Cancella prenotazione”.
5. Conferma l’azione.
6. Il sistema cambia stato in `cancelled`.
7. Il posto torna disponibile.

---

## 9. Area gestione Katia

### 9.1 Accesso

Per la bozza si può usare una protezione semplice.

Per la versione definitiva è meglio usare:

- email e password;
- oppure password unica per l’area admin;
- sessione protetta;
- logout.

### 9.2 Dashboard

La dashboard deve mostrare:

| Giorno | Orario | Corso | Prenotati | Azione |
|---|---:|---|---:|---|
| Lunedì | 18:00 | Mix | 8/12 | Vedi |
| Lunedì | 19:00 | Pilates | 12/12 | Vedi |

### 9.3 Dettaglio lezione

Per ogni lezione Katia vede:

| Nome | Cognome | Email | Telefono | Stato | Azione |
|---|---|---|---|---|---|
| Laura | Rossi | email | telefono | Confermata | Cancella |

### 9.4 Azioni disponibili

Nella prima versione:

- vedere prenotazioni;
- cancellare prenotazione;
- vedere posti occupati/liberi.

In futuro:

- modificare orari;
- aggiungere lezioni;
- esportare elenco;
- segnare assenze;
- lista d’attesa;
- pacchetti lezioni.

---

## 10. Notifiche

### 10.1 Notifica a utente

Alla prenotazione confermata, l’utente deve ricevere conferma.

Opzioni:

1. mostrare la conferma a schermo con link di annullamento;
2. inviare anche email automatica con riepilogo e link annullamento.

Per una versione più professionale è consigliata l’email.

Contenuto email suggerito:

```text
Ciao [Nome],
la tua prenotazione è confermata.

Lezione: [Corso]
Giorno: [Giorno]
Orario: [Orario]

Se non puoi partecipare, annulla la prenotazione da questo link:
[link annullamento]

A presto,
Katia
```

### 10.2 Notifica a Katia

Alla nuova prenotazione, Katia può ricevere una email:

```text
Nuova prenotazione ricevuta

Nome: [Nome Cognome]
Telefono: [Telefono]
Email: [Email]
Lezione: [Corso]
Giorno/ora: [Giorno Orario]
```

### 10.3 Notifica annullamento

Quando un utente annulla, Katia può ricevere:

```text
Prenotazione annullata

Nome: [Nome Cognome]
Lezione: [Corso]
Giorno/ora: [Giorno Orario]
```

---

## 11. Privacy e dati personali

Il sito raccoglie dati personali, quindi deve avere almeno:

- checkbox privacy obbligatoria;
- testo breve vicino al form;
- pagina o sezione privacy policy;
- uso dei dati limitato alla gestione prenotazioni;
- accesso ai dati solo a Katia/amministratore;
- nessun dato sensibile richiesto.

Testo breve vicino al form:

“Compilando il modulo accetti che i dati inseriti vengano utilizzati per gestire la tua prenotazione.”

Dati da evitare:

- informazioni sanitarie dettagliate;
- codice fiscale;
- indirizzo di casa;
- dati di pagamento, perché i pagamenti online non sono previsti.

---

## 12. Cosa è incluso nel progetto

Incluso nella versione attuale:

- landing page one-page;
- grafica responsive;
- sezione corsi;
- sezione orari;
- form prenotazione;
- prenotazione automatica senza login;
- limite massimo 12 posti per lezione;
- blocco automatico se la lezione è piena;
- salvataggio prenotazioni;
- link automatico di annullamento;
- area gestione Katia base;
- cancellazione prenotazioni da parte di Katia;
- pulsante WhatsApp;
- sezione contatti;
- test principali;
- una bozza dimostrativa da mostrare a Katia.

---

## 13. Cosa non è incluso nella prima versione

Non incluso:

- login utenti/clienti;
- area personale utenti;
- pagamenti online;
- gestione abbonamenti;
- pacchetti da 5/10 lezioni;
- crediti residui;
- lista d’attesa avanzata;
- calendario dinamico complesso;
- app mobile;
- automazioni WhatsApp;
- logo nuovo;
- servizio fotografico;
- gestione marketing/social;
- modifiche illimitate;
- sistema multi-istruttore.

Queste funzioni potranno essere aggiunte in una fase successiva.

---

## 14. Iterazioni di sviluppo

### Iterazione 0 — Raccolta informazioni ✅ COMPLETATA (2025-06-05)

Obiettivo: raccogliere tutto il materiale necessario.

Da ottenere da Katia:

- [x] conferma orari definitivi
- [x] durata delle lezioni (60 min)
- [x] indirizzo o zona (La Ca', Arcore — Monza e Brianza, Milano)
- [x] numero WhatsApp (+39 348 5525084)
- [x] email (katiaterruzzi@gmail.com)
- [x] foto (dal volantino)
- [x] logo (iniziali RT)
- [x] colori preferiti (beige, rosa cipria, verde oliva — dal volantino)
- [x] testo di presentazione (dal volantino e Instagram)
- [x] regole di annullamento (via email, con ragionevole anticipo — placeholder 12h)
- [x] Instagram (@katia.terruzzi)
- [x] notifiche reali → +39 3318867681 / parrellamatteo24@gmail.com (UI mostra dati Katia)

Output:

- [x] checklist materiali completa
- [x] struttura contenuti approvata

### Iterazione 1 — Bozza grafica statica ✅ COMPLETATA (2026-06-06)

Obiettivo: creare una prima bozza visiva del sito.

Attività:

- creare layout one-page;
- inserire testi provvisori;
- inserire orari;
- inserire pulsanti;
- creare sezione prenotazione finta/non collegata;
- ottimizzare mobile.

Output:

- link o anteprima locale della bozza;
- screenshot da mostrare a Katia.

Test:

- verificare leggibilità mobile;
- verificare ordine delle sezioni;
- verificare chiarezza pulsanti;
- verificare che la pagina sembri professionale.

### Iterazione 2 — Database e lezioni

Obiettivo: predisporre la struttura dati.

Attività:

- creare tabella lezioni;
- inserire gli 8 slot settimanali;
- impostare max 12 posti;
- creare tabella prenotazioni;
- predisporre stati confirmed/cancelled;
- generare struttura token annullamento.

Output:

- database funzionante;
- lezioni iniziali salvate.

Test:

- verificare che tutte le lezioni siano presenti;
- verificare max_seats = 12;
- verificare creazione prenotazione test;
- verificare stato prenotazione.

### Iterazione 3 — Form prenotazione funzionante

Obiettivo: collegare il form al database.

Attività:

- creare form reale;
- validare campi obbligatori;
- controllare email e telefono;
- collegare scelta lezione;
- salvare prenotazione confermata;
- generare cancel_token.

Output:

- prenotazione funzionante.

Test:

- prenotazione con dati corretti;
- prenotazione con dati mancanti;
- email non valida;
- telefono mancante;
- lezione non selezionata;
- privacy non accettata;
- generazione token annullamento.

### Iterazione 4 — Blocco automatico 12 posti ✅ COMPLETATA (2026-06-06)

Obiettivo: impedire prenotazioni oltre il limite.

Attività:

- contare prenotazioni confirmed per ogni lezione;
- accettare solo se posti occupati < 12;
- rifiutare se posti occupati = 12;
- mostrare messaggi corretti;
- assicurarsi che le prenotazioni cancelled non contino.

Output:

- controllo posti funzionante.

Test:

- prenotare 1 posto;
- prenotare fino a 12 posti;
- tentare la 13ª prenotazione;
- annullare una prenotazione;
- verificare che dopo annullamento si possa prenotare di nuovo;
- testare due prenotazioni ravvicinate.

### Iterazione 5 — Link annullamento automatico ✅ COMPLETATA (2026-06-06)

Obiettivo: permettere all’utente di annullare in autonomia.

Attività:

- creare pagina annullamento;
- leggere token da URL;
- verificare validità token;
- mostrare riepilogo prenotazione;
- confermare annullamento;
- cambiare stato in cancelled;
- liberare posto.

Output:

- annullamento utente funzionante.

Test:

- annullamento con token valido;
- annullamento con token non valido;
- annullamento prenotazione già annullata;
- verifica posto liberato;
- tentativo annullamento senza token;
- link copiato e aperto da altro browser.

### Iterazione 6 — Area gestione Katia ✅ COMPLETATA (2026-06-06)

Obiettivo: permettere a Katia di vedere e cancellare prenotazioni.

Attività:

- creare accesso admin;
- creare dashboard lezioni;
- mostrare conteggio posti;
- mostrare elenco partecipanti;
- aggiungere pulsante cancella;
- conferma prima della cancellazione;
- cambiare stato prenotazione in cancelled.

Output:

- area gestione base funzionante.

Test:

- accesso corretto;
- accesso negato senza password;
- visualizzazione lezioni;
- visualizzazione prenotati;
- cancellazione prenotazione;
- posto liberato dopo cancellazione;
- prenotazione annullata non conteggiata.

### Iterazione 7 — Notifiche ✅ COMPLETATA (2026-06-06)

Obiettivo: inviare conferme e avvisi.

Attività:

- email conferma a utente;
- email nuova prenotazione a Katia;
- email annullamento a Katia;
- eventuale email annullamento a utente.

Output:

- notifiche funzionanti.

Test:

- email conferma ricevuta;
- link annullamento presente;
- email Katia ricevuta;
- email annullamento ricevuta;
- controllo contenuto email;
- controllo spam/promozioni.

### Iterazione 8 — Rifinitura e contenuti finali

Obiettivo: preparare il sito per la presentazione finale.

Attività:

- correggere testi;
- inserire immagini definitive;
- controllare colori;
- controllare spaziature;
- migliorare mobile;
- aggiungere privacy base;
- collegare WhatsApp;
- inserire contatti definitivi.

Output:

- sito pronto per revisione Katia.

Test:

- controllo desktop;
- controllo mobile;
- controllo tablet;
- controllo link WhatsApp;
- controllo form;
- controllo testi.

### Iterazione 9 — Revisione con Katia

Obiettivo: raccogliere feedback e fare un giro di modifiche.

Attività:

- mostrare bozza;
- raccogliere modifiche;
- correggere testi/orari;
- aggiornare immagini;
- confermare funzionamento prenotazioni.

Output:

- versione approvata.

Test:

- Katia prova una prenotazione;
- Katia prova una cancellazione;
- Katia accede all’area gestione;
- verifica che il flusso sia comprensibile.

### Iterazione 10 — Pubblicazione

Obiettivo: mettere il sito online.

Attività:

- scelta dominio;
- configurazione hosting;
- caricamento sito;
- configurazione database online;
- configurazione email;
- test finale in produzione.

Output:

- sito online.

Test:

- apertura dominio;
- certificato HTTPS;
- prenotazione reale test;
- annullamento reale test;
- accesso area Katia;
- controllo da smartphone.

---

## 15. Test completi del sistema

### 15.1 Test grafici

- La pagina si legge bene da smartphone.
- I pulsanti sono ben visibili.
- Gli orari sono chiari.
- Il form è facile da compilare.
- I testi non sono troppo lunghi.
- Le sezioni sono ordinate.

### 15.2 Test funzionali prenotazione

- Prenotazione con tutti i campi corretti.
- Prenotazione senza nome.
- Prenotazione senza email.
- Prenotazione senza telefono.
- Prenotazione senza lezione.
- Prenotazione senza privacy accettata.
- Prenotazione con email errata.
- Prenotazione su lezione attiva.
- Tentativo su lezione non attiva.

### 15.3 Test limite posti

- Prima prenotazione accettata.
- Dodicesima prenotazione accettata.
- Tredicesima prenotazione rifiutata.
- Prenotazione annullata libera posto.
- Dopo annullamento, nuova prenotazione accettata.
- Prenotazioni annullate non contano.

### 15.4 Test annullamento

- Link valido funziona.
- Link non valido mostra errore.
- Link già usato mostra prenotazione già annullata.
- Annullamento cambia stato nel database.
- Annullamento libera posto.
- Katia riceve eventuale notifica annullamento.

### 15.5 Test area Katia

- Katia entra con credenziali corrette.
- Accesso negato con credenziali errate.
- Katia vede lezioni.
- Katia vede conteggio posti.
- Katia vede partecipanti.
- Katia cancella prenotazione.
- La cancellazione libera il posto.

### 15.6 Test sicurezza base

- Non si accede all’area admin senza password.
- Il token di annullamento non è facile da indovinare.
- Il form non accetta campi vuoti.
- Il sistema non mostra dati di altri utenti nella pagina pubblica.
- I dati dei partecipanti sono visibili solo a Katia.

### 15.7 Test notifiche

- Email conferma inviata all’utente.
- Email contiene dati corretti.
- Email contiene link annullamento.
- Email nuova prenotazione inviata a Katia.
- Email annullamento inviata a Katia.

### 15.8 Test responsive

- iPhone/schermo piccolo.
- Android/schermo medio.
- Tablet.
- Desktop.
- Controllo pulsanti touch.

### 15.9 Test browser

- Chrome.
- Safari.
- Edge.
- Firefox, se possibile.

### 15.10 Test produzione

- Dominio funzionante.
- HTTPS attivo.
- Database collegato.
- Form funzionante online.
- Email funzionanti online.
- Area Katia funzionante online.

---

## 16. Messaggi da mostrare nel sito

### Prenotazione confermata

“Prenotazione confermata! Il tuo posto è stato riservato. Riceverai il riepilogo con il link per annullare la prenotazione se non potrai partecipare.”

### Lezione piena

“Questa lezione ha raggiunto il numero massimo di 12 partecipanti. Ti invitiamo a scegliere un altro orario o a contattare Katia.”

### Annullamento riuscito

“La tua prenotazione è stata annullata correttamente. Il posto è stato liberato.”

### Link non valido

“Il link di annullamento non è valido. Contatta Katia per assistenza.”

### Prenotazione già annullata

“Questa prenotazione risulta già annullata.”

### Errore generico

“Si è verificato un problema. Riprova tra qualche minuto o contatta Katia.”

---

## 17. Costi previsti

### Costo progetto

Prezzo lancio proposto:

**250 € una tantum**

Nota importante: con prenotazione automatica, limite posti, area gestione e link annullamento, il valore reale del progetto è più alto. Il prezzo di 250 € è sostenibile solo come primo progetto/portfolio.

### Costi tecnici annuali

Dominio + hosting:

**circa 60–120 € all’anno**

Sistema booking esterno:

**0 €**, perché il sistema viene sviluppato internamente.

Eventuali servizi email/database potrebbero essere gratuiti nella fase iniziale, ma vanno scelti con attenzione in base agli strumenti usati.

---

## 18. Rischi e soluzioni

### Rischio: overbooking

Due utenti prenotano quasi nello stesso momento.

Soluzione:

- controllo posti lato backend;
- transazione o controllo immediato prima del salvataggio;
- test specifico su prenotazioni simultanee.

### Rischio: email non ricevuta

L’utente non trova il link di annullamento.

Soluzione:

- mostrare anche il link a schermo dopo la prenotazione;
- consigliare di salvare la conferma;
- permettere a Katia di cancellare manualmente.

### Rischio: token annullamento condiviso

Chi ha il link può annullare.

Soluzione:

- token lungo e casuale;
- pagina di conferma prima dell’annullamento;
- nessun dato sensibile mostrato.

### Rischio: Katia non usa bene il pannello

Soluzione:

- area gestione molto semplice;
- mini formazione;
- guida breve con screenshot.

### Rischio: modifiche frequenti agli orari

Soluzione:

- per la prima versione orari modificabili da sviluppatore;
- in futuro pannello per modificare lezioni.

---

## 19. Roadmap futura

Funzioni che si possono aggiungere dopo:

1. lista d’attesa automatica;
2. modifica prenotazione da parte dell’utente;
3. pagamenti online;
4. pacchetti lezioni;
5. abbonamenti mensili;
6. area personale utente;
7. promemoria automatici;
8. calendario mensile avanzato;
9. esportazione partecipanti in Excel/CSV;
10. gestione assenze;
11. notifiche WhatsApp;
12. pannello per modificare orari e lezioni.

---

## 20. Versione bozza da mostrare a Katia

Per la prima bozza da mostrare a Katia, non è necessario completare subito tutto.

La bozza deve far capire:

- come sarà la pagina;
- dove saranno gli orari;
- come si prenota;
- come appare il messaggio di conferma;
- come appare il messaggio di lezione piena;
- come sarà l’area gestione in modo semplificato.

### Funzioni minime della bozza

- homepage visibile;
- tabella orari;
- form prenotazione simulato o funzionante;
- esempio messaggio conferma;
- esempio messaggio pieno;
- esempio link annullamento;
- mockup area Katia.

### Funzioni definitive da completare dopo approvazione

- database reale;
- controllo posti reale;
- annullamento reale;
- area Katia reale;
- notifiche email;
- pubblicazione online.

---

## 21. Riassunto semplice per Katia

Il sito permetterà alle persone di prenotare online le lezioni di Pilates e Mix. Ogni lezione avrà massimo 12 posti. Quando una persona prenota, il sistema controllerà automaticamente la disponibilità: se ci sono posti liberi, la prenotazione sarà confermata subito; se la lezione è piena, l’utente non potrà prenotarsi.

Ogni utente riceverà un link personale per annullare la prenotazione. Se annulla, il posto torna disponibile. Katia potrà vedere l’elenco delle prenotazioni e cancellare manualmente una prenotazione quando necessario.

La prima versione sarà semplice, chiara e pensata per partire senza login utenti, senza pagamenti online e senza gestione abbonamenti.

---

## 22. Definizione di progetto completato

Il progetto può considerarsi completato quando:

- la landing page è online;
- gli orari sono corretti;
- il form prenotazione funziona;
- il limite di 12 posti funziona;
- la 13ª prenotazione viene rifiutata;
- il link di annullamento funziona;
- Katia può vedere e cancellare prenotazioni;
- i messaggi all’utente sono chiari;
- il sito funziona da smartphone;
- sono stati eseguiti i test principali;
- Katia ha ricevuto una spiegazione base sull’utilizzo.

