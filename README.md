# Digitaler Schülerausweis

## Installation

1. Neustes Release herunterladen und entpacken
2. Abhängigkeiten installieren
```
npm install
```
3. Konfiguration bearbeiten

    ``.env.example`` in ``.env`` umbenennen und Daten eintragen (siehe [.env Konfiguration](#env-konfiguration))
4. Server starten
```
npm start
```

## .env Konfiguration
| Einstellung           | Beschreibung                                                 |
|-----------------------|--------------------------------------------------------------|
| PORT                  | Port des Webservers                                          |
| APP_URL               | URL, unter der die App erreichbar ist                        |
| INITIAL_ADMIN_USER_ID | OpenIDConnect Account ID des initialen Administratoraccounts |
| OIDC_ISSUER           | OpenIDConnect Server URL                                     |
| OIDC_CLIENT_ID        | OpenIDConnect Client ID                                      |
| OIDC_CLIENT_SECRET    | OpenIDConnect Client Schlüssel                               |
| UNTIS_SCHOOL          | Untis Schulname                                              |
| UNTIS_USERNAME        | Untis Benutzername                                           |
| UNTIS_SECRET          | Untis Schlüssel (abrufbar über die WebUntis Einstellungen)   |
| UNTIS_SERVER          | Domain des WebUntis Servers                                  |
 