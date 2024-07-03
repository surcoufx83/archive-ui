import { L10nArchiveLocale } from "../l10n.types";

export const L10nArchiveDeLocale: L10nArchiveLocale = {
    accounts: {
        pagetitle: "Konten"
    },
    authService: {
        apiError: {
            title: "Fehler",
            message: "Fehler beim Abrufen von Daten: {0}"
        },
        notModified: {
            title: "Info",
            message: "Keine Anderungen vorgenommen: {0}"
        }
    },
    calendar: {
        showAsGridTitle: "Als Kalender darstellen",
        showAsListTitle: "Als Liste darstellen",
        showWeek: "KW",
        showWeekTitle: "Kalenderwoche anzeigen",
        showWeekend: "WE",
        showWeekendTitle: "Wochenende anzeigen",
        weekday: "Wochentag",
        duration: {
            short: "{0} h"
        },
        holidays: {
            ascension_day: "Himmelfahrt",
            boxing_day: "2. Weihnachtstag",
            christmas_day: "1. Weihnachtstag",
            easter_goodFriday: "Karfreitag",
            easter_monday: "Ostermontag",
            easter_sunday: "Ostersonntag",
            labor_day: "Tag der Arbeit",
            newYearsDay: "Neujahr",
            reformation_day: "Reformationstag",
            unity_day: "Tag der dt. Einheit",
            whit_monday: "Pfingstmontag",
            whit_sunday: "Pfingstsonntag"
        }
    },
    case: {
        title: "{0} (Akte)",
        pagetitleNocase: "Aktenansicht",
        pagetitle_: "Aktenansicht: {0}",
        pagetitle_childs: "Untergeordnete Akten von: {0}",
        pagetitle_files: "Dateien der Akte: {0}",
        pagetitle_times: "Zeiträume der Akte: {0}",
        metacard: {
            title: "Allgemeine Informationen",
            shorttitle: "Allgemeines",
            name: "Name der Akte",
            parent: "Übergeordnete Akte",
            noparent: "Keine",
            created: "Erstellt",
            deleted: "Gelöscht",
            filecount: "Dateien",
            followup: "Nachfolgend",
            type: "Kategorie",
            status: "Status",
            nextstatus: "Nächster Status",
            client: "Mandant",
            party: "Hauptbeteiligte",
            comment: "Beschreibung"
        },
        childscard: {
            title: "Zugehörige Akten"
        },
        filescard: {
            title: "Dateien"
        },
        timecard: {
            title: "Zeiträume",
            notifyUpcoming: "Benachrichtigen, wenn Ende in weniger als 3 Monaten",
            notifyForecast: "Benachrichtigen, wenn Ende in weniger als 9 Monaten",
            start: "Beginn",
            end: "Ende",
            minperiod: "Mindestlaufzeit",
            period: "Feste Laufzeit",
            termination: "Kündigungsfrist"
        }
    },
    casefilestatus: {
        approved: "Freigegeben",
        checked: "Geprüft",
        new: "Neu"
    },
    casefiletypes: {
        draft: "Entwurf",
        signed_draft: "Entwurf (unterschrieben)",
        contract: "Vertrag",
        termination_draft: "Kündigungsentwurf",
        termination: "Kündigung"
    },
    cases: {
        title: "Aktenstruktur",
        pagetitle: "Gesamte Aktenstruktur",
        filescount: [
            "1 Datei",
            "{0} Dateien"
        ],
        reference: "Referenz {0}",
        showDeleted: "Gel.",
        showInRetention: "Ausgebl."
    },
    casestatus: {
        created: "Erstellt",
        draft: "Entwurf",
        draftsign: "Unterschrieben",
        entered: "Eingegangen",
        active: "Aktiv",
        activeexpiring: "Läuft aus",
        activenoncontributory: "Beitragsfrei aktiv",
        activeterminated: "Gekündigt",
        activeterminating: "Wird gekündigt",
        cancelled: "Verworfen",
        expired: "Ausgelaufen",
        terminated: "Beendet",
        retentiondeletion: "Aufbewahrung",
        retentionhidden: "Ausgeblendet",
        todelete: "Zum Löschen",
        waitforstart: "Warten auf Startdatum"
    },
    casetype: {
        apartment: "Wohnen",
        associations: "Vereine",
        bankaccounts: "Bank und Konten",
        car: "Auto",
        carbusiness: "Firmenwagen",
        communication: "Kommunikation",
        consumables: "Nebenkosten / Verbraucher",
        contracts: "Verträge",
        damage: "Schäden und Schadensmeldungen",
        insurance: "Versicherungen",
        legals: "Verfahren (Behörden/Gerichte)",
        misc: "Sonstige",
        repair: "Reparaturen und Wartung",
        studies: "Ausbildung und Studium",
        taxes: "Steuern",
        work: "Beschäftigungsverhältnis"
    },
    classify: {
        classes: {
            Banking_AccountReport: "Kontoreport",
            Banking_AnnualMeeting: "Hauptversammlung",
            Banking_AnnualReport: "Jahresbericht (Konto)",
            Banking_AnnualStmt: "Jahreskontoauszug",
            Banking_BuyOrders: "Wertpapier Kauf",
            Banking_CancelOrders: "Wertpapier Storno",
            Banking_CostStmt: "Kostenaufstellung",
            Banking_DepositStatement: "Depotauszug",
            Banking_Earnings: "Einnahmen aus Bank/Wertpapiergeschäften",
            Banking_LossOffSetting: "Verlustverrechnung",
            Banking_SellOrders: "Wertpapier Verkauf",
            Banking_Stmt: "Kontoauszug",
            Claim_Settlement: "Schadensregulierung",
            Contract_Adjustment: "Vertragsänderung",
            Contract_Amendment: "Vertragsergänzung",
            Contract_Application: "Antrag auf Abschluss eines Vertrages",
            Contract_Information: "Allgemeine Informationen",
            Contract_Proposal: "Vertragsentwurf",
            Contract_Protocol: "Beratungsprotokoll",
            Contract_Renewal: "Vertragsverlängerung",
            Contract_Termination: "Kündigungsbestätigung, Auflösung",
            Contract_ToS: "AGBs",
            Contract: "Vertrag",
            Finance_CreditNote: "Gutschrift",
            Finance_Donation: "Spendenquittung",
            Finance_Invoice: "Rechnung",
            Finance_Reminder: "Mahnung",
            General_AnnualReport: "Jahresbericht",
            General_Approval: "Freigabe / Bewilligung",
            General_DeliveryNote: "Lieferschein",
            General_DeviceInfo: "Gerätedaten",
            General_IdDocuments: "Ausweis uä.",
            General_Letter: "Allgemeines Anschreiben",
            General_Manuals: "Handbuch",
            General_Order: "Auftrag",
            General_OrderConfirmation: "Bestell-/ Kauf-/ Auftragsbestätigung",
            General_Unclassified: "Allgemeiner Posteingang",
            Health_Medication: "Verordnung (Heilmittel/Medikamente)",
            Health_Report: "Befund",
            Home_AnnualSettlement: "Abrechnung Mietnebenkosten",
            Home_MeterReading: "Zählerablesung",
            Insurance_AnnualReport: "Jahresbericht (Versicherung)",
            Insurance_Stmt: "Meldebestätigung Sozialversicherung",
            Job_AnnualBonus: "Jahresbonus, Sonderzahlungen, etc.",
            Job_AnnualPayroll: "Lohnsteuerbescheinigung",
            Job_Application: "Bewerbung",
            Job_Certificate: "Urkunde, Zertifikat, Teilnahmebescheinigung",
            Job_CoD: "Arbeitsunfähigkeitsbescheinigung",
            Job_Expenses_Clearing: "Freigabe/Erstattung Spesenabrechnung",
            Job_Incentives_Status: "Lead/Incentive Status",
            Job_PaySlip: "Lohnzettel",
            Job_PaySlip2: "Lohnzettel",
            Legal_Deed: "Beglaubigte Urkunde",
            Legal_LayJudge_CompensationForm: "Schöffe: Entschädigungsformular",
            Legal_LayJudge_InvitationTrial: "Schöffe: Einladung Hauptverhandlung",
            Legal_LayJudge_ReservedDates: "Schöffe: Mögliche Termine im Jahr",
            Legal_Mandate: "Vollmacht, Mandat",
            Legal_Notice: "Verfahrensmitteilung",
            Pension_AnnualReport: "Jahresbericht (Rente)",
            Public_Application: "Bewerbung (öffentl. Ämter)",
            Public_BallotDocs: "Wahlunterlagen",
            Security_Credentials: "Zugangsdaten, Credentials, Passwörter",
            In_PerformanceReport: "Information Wertentwicklung",
            In_PostReceipt: "Einlieferungsbeleg Post/Paket",
            In_QuarterReport: "Quartalsabschluss",
            In_Receipt: "Kassenbeleg",
            In_Receipt2: "Quittung",
            In_Rejection: "Ablehnung, Ablehnungsbescheid",
            In_RepairOrder: "Reparaturauftrag",
            In_RepairReport: "Reparaturbericht",
            In_Request: "Antrag",
            In_Statement: "Bescheinigung allgemein",
            In_Stock_Info: "Wertpapier Information",
            In_TaxAssessment: "Steuerbescheid",
            In_TaxReceipt: "Steuerbescheinigung",
            In_TaxReport: "Steuerauszug",
            In_TaxTravelDocumentation: "Reisedokumentation",
            In_TaxVL: "Steuererklärung Anlage VL",
            In_TicketEntrance: "Eintrittskarte",
            In_TicketTransport: "Fahrschein, Ticket",
            In_TrafficTicket: "Blitzer, Knöllchen, Verkehrsordnungswidrigkeit",
            In_VacationResp: "Urlaub, Krank, Mehrarbeit",
            In_VaccinationCertificate: "Impfbescheinigung",
            In_Voucher: "Gutschein",
            LeaseAgreement: "Pachtvertrag",
            NewCard: "Neue Karte mit Anschreiben",
            Out_ClaimReport: "Schadensmeldung",
            Out_Contradiction: "Widerspruch",
            Out_ExpenseReport: "Spesenabrechnung und -belege",
            Out_Inquiry: "Anfrage",
            Out_Questionnaire: "Fragebogen",
            Out_Revocation: "Widerruf",
            Out_SepaMandate: "SEPA Lastschriftmandat",
            Out_TaxDeclaration: "Steuererklärung",
            Out_Termination: "Kündigung",
            RentalAgreement: "Mietvertrag",
            Trash: "Papierkorb"
        }
    },
    common: {
        add: "Neu",
        back: "Zurück",
        cancel: "Abbruch",
        change: "Ändern",
        confirm: {
            askDeletion: "Bist du sicher, dass der Datensatz {0} gelöscht werden soll?",
            delete: {
                title: "Gespeichert",
                message: "Der Datensatz wurde aus der Datenbank gelöscht."
            },
            deletion: {
                title: "Löschen bestätigen",
                message: "Bist du sicher, dass die Notiz gelöscht werden soll?",
                closeModal: "Dialog schließen",
                confirm: "Ja, löschen!",
                cancel: "Zurück"
            },
            save: {
                title: "Gespeichert",
                message: "Die Änderungen wurden erfolgreich gespeichert."
            }
        },
        date: "Datum",
        day: "Tag",
        days: "Tage",
        default: "Standard",
        delete: "Löschen",
        edit: "Bearbeiten",
        goto: "Gehe zu",
        hour: "Stunde",
        hours: "Stunden",
        minute: "Minute",
        minutes: "Minuten",
        month: "Monat",
        months: "Monate",
        no: "Nein",
        none: "Keine",
        novalue: "---",
        pcs: "St.",
        period: {
            placeholder: "0j 0m 0t 0:0:0",
            patternYears: "{0}j",
            patternMonths: "{0}m",
            patternDays: "{0}t",
            patternTime: "{0}h:{1}m:{2}s"
        },
        save: "Speichern",
        second: "Sekunde",
        seconds: "Sekunden",
        select: {
            pickOne: "Bitte wählen",
            pickedNone: "Keine gewählt"
        },
        switchTo: "Wechseln zu",
        today: "Heute",
        warn: {
            formInvalid: {
                title: "Warnung",
                message: "Das Formular enthält noch Fehler."
            },
            notYetSaved: {
                message: "Änderungen noch nicht gespeichert!"
            },
            saved: {
                message: "Änderungen gespeichert."
            }
        },
        year: "Jahr",
        years: "Jahre",
        yes: "Ja"
    },
    contacttypes: {
        phone: "Telefon",
        email: "E-Mail",
        mobile: "Mobil",
        fax: "Fax"
    },
    country: {
        germany: "Deutschland",
        japan: "Japan",
        nederlands: "Niederlande",
        unitedStates: "Vereinigte Staaten"
    },
    db: {
        accounts: {
            title: "Bankkonten",
            mandates: {
                title: "Lastschriftmandate"
            },
            orders: {
                title: "Daueraufträge"
            }
        },
        articles: {
            title: "Artikel (für Rechnungen)",
            categories: {
                title: "Artikel-Kategorien"
            }
        },
        cases: {
            title: "Aktenstruktur",
            status: {
                title: "Akten-Status"
            },
            types: {
                title: "Aktenarten"
            }
        },
        classes: {
            title: "Dokumentarten",
            techname: "Technischer Name",
            localized: "Lokalisierter Name",
            pattern: "Namensvorgabe",
            default: "Standard",
            editor: {
                title: "Dokumentenart bearbeiten",
                localized: "Lokalisierung per json-Dateien",
                description: "Beschreibung",
                descriptionPlaceholder: "Ausführlicher Beschreibungstext",
                namepattern: "Vorgabe für Dateinamen",
                namepatternPlaceholder: "Platzhalter mit {...} um Dateinamen automatisch zu erzeugen"
            }
        },
        contacts: {
            types: {
                title: "Kontaktarten",
                name: "Technischer Name",
                i18nname: "Lokalisierter Name",
                icon: "Icon",
                editor: {
                    title: "Kontaktarten bearbeiten",
                    localized: "Lokalisierung per json-Dateien",
                    name: "Technischer Name",
                    icon: "Icon"
                }
            }
        },
        countries: {
            title: "Länder",
            default: "Standard",
            name: "Technischer Name",
            i18nname: "Lokalisierter Name",
            currency: "Währung",
            key2: "Code-2",
            key3: "Code-3",
            taxrates: {
                title: "Steuersätze"
            },
            editor: {
                key2: "2-stelliger Code",
                key3: "3-stelliger Code",
                title: "Länder bearbeiten",
                localized: "Lokalisierung per json-Dateien"
            }
        },
        cronjobs: {
            title: "Cronjobs"
        },
        currencies: {
            title: "Währungen",
            default: "Standard",
            name: "Name",
            shortname: "Kürzel",
            sign: "Zeichen",
            editor: {
                name: "Vollständiger Name",
                shortname: "3-stelliger Code",
                sign: "Internationales Zeichen",
                title: "Währung bearbeiten"
            }
        },
        directories: {
            title: "Root-Verzeichnisse",
            id: "Id",
            name: "Name",
            mtime: "Letzte Änderung"
        },
        expenses: {
            title: "Ausgaben",
            categories: {
                title: "Ausgabearten"
            },
            templates: {
                title: "Vorlagen"
            },
            types: {
                title: "Buchungsarten"
            }
        },
        extensions: {
            title: "Dateitypen",
            ext: "Ext",
            options: "Optionen",
            displayable: "Anzeige im Browser",
            downloadable: "Herunterladen",
            indexable: "Inhalt lesbar (OCR)",
            isofficefile: "Office Datei",
            mimetype: "Mimetype",
            unknownMimetype: "Unbekannter Mimetype",
            editor: {
                title: "Dateitypen bearbeiten",
                gscommand: "GhostScript Kommando",
                ocrcommand: "OCR Kommando",
                returnImg: "GhostScript liefert Bilddatei",
                returnMimetype: "Mimetype nach Konvertierung"
            }
        },
        manager: {
            title: "Stammdatenverwaltung",
            countries: "Länder",
            filesystem: "Dateisystem",
            finance: "Finanzen",
            files: "Dateien und Klassifizierung",
            living: "Wohnung",
            parties: "Korrespondenten",
            system: "Verwaltung",
            work: "Arbeitszeitverwaltung"
        },
        meters: {
            title: "Zähler"
        },
        mimetypes: {
            title: "Mime types"
        },
        oauth: {
            services: {
                title: "OAuth-Services"
            }
        },
        parties: {
            title: "Korrespondenten",
            addresses: {
                title: "Addressdatensätze"
            },
            banks: {
                title: "Nur Kreditinstitute"
            },
            clients: {
                title: "Nur eigene Mandanten"
            },
            contacts: {
                title: "Kontaktdaten"
            },
            roles: {
                title: "Rollen",
                name: "Technischer Name",
                i18nname: "Lokalisierter Name"
            }
        },
        stocks: {
            title: "Wertpapiere und CC",
            apis: {
                title: "APIs"
            }
        },
        tags: {
            title: "Tags"
        },
        units: {
            title: "Maßeinheiten"
        },
        user: {
            title: "Benutzer"
        },
        work: {
            customers: {
                title: "Kunden"
            },
            holidays: {
                title: "Feiertage"
            },
            offcategories: {
                title: "Abwesenheitsarten"
            },
            timecategories: {
                title: "Buchungsarten"
            }
        }
    },
    file: {
        title: "Datei {0}",
        downloadButton: "Download",
        previewButton: "Vorschau",
        main: {
            title: "Dateiinformationen",
            dir: "Übergeordnetes Verzeichnis",
            name: "Dateiname",
            created: "Erstellt",
            deleted: "Gelöscht",
            size: "Dateigröße",
            pages: "Seitenzahl",
            tags: "Tags",
            tagsInputPlaceholder: "Beliebigen Tag eingeben...",
            words: "Anzahl Wörter"
        },
        classify: {
            title: "Klassifizierung und Zuordnung",
            nextFile: "Nächste",
            date: "Datum",
            class: "Dokumentenart",
            suggestion: "Vorschlag: {0} {1}%",
            case: "Akte",
            caseFiletype: "Dokumentart in Akte",
            caseFilestatus: "Status",
            caseFilename: "Anzeigename",
            caseFiledesc: "Beschreibung",
            client: "Mandant",
            party: "Korrespondent",
            taxreceipt: "Steuerbeleg",
            taxyear: "Steuerjahr"
        },
        housekeeping: {
            title: "Organisation",
            move: {
                title: "Datei Verschieben",
                description: "Verschiebt die Datei im Archiv in ein anderes Verzeichnis.",
                btn: "Ziel wählen"
            },
            delete: {
                title: "Datei Löschen",
                description: "Löscht die Datei unwiderruflich aus dem Archiv.",
                btn: "Löschen",
                confirm: "Datei wirklich löschen?"
            }
        },
        errors: {
            noNextFile: {
                title: "Keine Daten",
                message: "Es gibt keine weiteren Dateien die eine Klassifizierung erfordern."
            }
        }
    },
    finance: {
        pagetitle: "Finanz-Dashboard"
    },
    folderbrowser: {
        title: "Ordner durchsuchen",
        selected: "Gewählt: {0}",
        newFolder: {
            title: "Neuer Ordner..."
        }
    },
    home: {
        title: "Archiv Startseite",
        cases: {
            title: "Akten zur Prüfung"
        },
        database: {
            title: "Stammdaten",
            dbmanager: "Zur Stammdatenverwaltung"
        },
        inbox: {
            title: "Neue Dokumente"
        },
        readings: {
            title: "Zähler",
            readingsLink: "Erfassung von Zählerständen"
        },
        recentFiles: {
            title: "Neueste, archivierte Dateien"
        },
        special: {
            title: "Zusatzfunktionen",
            notepadLink: "Notepad",
            warehouseLink: "Lager",
            movingBoxesLink: "Umzugskartons",
            wineCellarLink: "Weinkeller"
        },
        stats: {
            title: "Schnelle Statistiken...",
            files1: "Das Archiv verwaltet aktuell {0} Dateien in {1} Verzeichnissen mit insgesamt {2}.",
            files2: "{0} der Dateien wurden klassifiziert, {1} wurden einer Akte zugeordnert. Für {2} konnte kein OCR-Text erzeugt werden.",
            files3: "Diesen Monat wurden {0} neue Dateien hinzugefügt.",
            casesLink: "Akten",
            filesLink: "Alle Dateien",
            noclassFilesLink: "Nicht klassifiziert",
            noocrFilesLink: "Kein OCR",
            storageLink: "Speicher"
        },
        supermarket: {
            title: "Im Supermark",
            priceComparison: "Preisvergleich und -historie",
            receiptsLink: "Erfassung von Einkäufen",
            shoppingLink: "Einkaufsliste"
        }
    },
    lead: {
        title: "Lead #{0}",
        common: {
            title: "Allgemeine Angaben",
            party: "Firma"
        }
    },
    leads: {
        title: "Leads + Incentives",
        table: {
            head: {
                key: "[LI]",
                customer: "Kunde",
                project: "Projekt",
                created: "Erstellt",
                completed: "Abgeschlossen",
                payed: "Ausgezahlt"
            },
            data: {
                lead: "Lead",
                incentive: "Incentive"
            }
        }
    },
    listManager: {
        title: "Listen",
        filterPlaceholder: "🔍 Listen filtern...",
        toggleSidebar: "Übersicht",
        noListSelected: {
            title: "Deine Listen",
            introduction: "Wähle eine der Listen aus der Leiste links aus, um diese zu lesen, abzuhaken, zu bearbeiten. Listen können im Gegensatz zu Notizen zurückgesetzt werden, sodass alle Checkboxen wieder leer sind."
        },
        list: {
            addItem: "Neuer Listeneintrag",
            blankListTitle: "Neue Liste",
            checkedBelowUncheckedItems: "Abgehaktes nach unten verschieben",
            checkedBy: "Erledigt durch {0} {1}",
            completed: "{0} erledigt",
            dropzone: "Hierher ziehen",
            incomplete: "{0} offen",
            lastModified: "Zuletzt geändert: {0}",
            resetCron: "Wird zurückgesetzt: {0}",
            resetDate: "Wird zurückgesetzt am {0}",
            resetDateAndCron: "Wird zurückgesetzt am {0} und {1}",
            resetManually: "Liste zurücksetzen"
        },
        textEditor: {
            titlePlaceholder: "Name der Liste",
            descriptionPlaceholder: "Optionale, detailierte Beschreibung für die Liste",
            cronResetTitle: "Checkboxen automatisch zurücksetzen?",
            cronResetPlaceholder: "z.B. 0 0 1 * * (Jeder Monats-1.)",
            cronResult: {
                never: "Nie zurücksetzen",
                invalid: "Ungültiger Ausdruck",
                valid: "Wiederholt: {0}"
            },
            dateResetTitle: "An Datum zurücksetzen",
            manualResetTitle: "Manuell zurücksetzen",
            listStyle: "Listentyp",
            listStyleUl: "Einfach",
            listStyleOl: "Zahl",
            listStyleCb: "Checks"
        }
    },
    locales: {
        de: {
            title: "Deutsch"
        },
        en: {
            title: "Englisch"
        },
        fr: {
            title: "Französisch"
        }
    },
    login: {
        title: "Benutzeranmeldung",
        subtitle: "Diese Webseite erfordert die Eingabe von Zugangsdaten. Bitte mit Benutzername und Passwort anmelden.",
        button: "Anmelden",
        password: "Passwort",
        passwordPlaceholder: "*********",
        username: "Benutzername",
        usernamePlaceholder: "pete@archive.org",
        failed: "Fehler bei der Anmeldung. Bitte Eingabe prüfen und nochmal versuchen.",
        sessioncheck: {
            title: "Benutzeranmeldung",
            subtitle: "Bitte warten, die Anmeldung wird überprüft..."
        },
        oauth2: {
            title: "Benutzeranmeldung",
            subtitle: "Diese Webseite erfordert eine Anmeldung via Nextcloud. Bitte klicke auf den Button um die Anmeldung vorzunehmen.",
            button: "Anmelden"
        }
    },
    meter: {
        readings: {
            title: "Erfassung von Zählerständen",
            meter: "Zähler",
            value: "Wert",
            modal: {
                title: "Zählerablesung",
                description: "In den folgenden Feldern kannst du die Werte für die Zähler eingeben. Nur ausgefüllte Felder werden gespeichert."
            }
        },
        title: "Zähler"
    },
    navbar: {
        brand: {
            title: "Archiv"
        },
        finance: {
            accounts: "Konten",
            stocks: "Wertpapiere",
            taxYear: "Steuern {0}"
        },
        items: {
            account: "Konto",
            cases: "Akten",
            dashboard: "Dashboard",
            finance: "Finanzen",
            home: "Start",
            lists: "Listen",
            notepad: "Notepad",
            settings: "Einstellungen",
            work: "Arbeit"
        },
        search: {
            label: "Durchsuchen des Archivs",
            placeholder: "Suchbegriff",
            submit: "Suchen"
        },
        showNavigationItems: {
            btnTitle: "Navigation anzeigen"
        },
        switchLocale: {
            btnTitle: "Ändern der Anzeigesprache",
            smTitle: "Sprache"
        },
        user: {
            btnTitle: "Benutzerprofil {0}",
            userProfileLink: "Profil anzeigen",
            userSettingsLink: "Einstellungen",
            clearCacheLink: "Cache leeren",
            logoutLink: "Abmelden"
        },
        workitems: {
            leads: "Leads",
            month: "Monatsansicht",
            year: "Jahre",
            settings: "Einstellungen",
            today: "Tagesbuchung",
            travel: "Geschäftsreisen"
        }
    },
    notepad: {
        title: "Notizen",
        filterPlaceholder: "Filtern",
        markdownGuide: "Formatierung mit Markdown",
        notYetSaved: "Speichern in {0}s."
    },
    notepad2: {
        title: "Notizen",
        filterPlaceholder: "🔍 Notiz suchen...",
        toggleSidebar: "Übersicht",
        noNoteSelected: {
            title: "Dein Notizbuch",
            introduction: "Wähle eine der Notizen aus der Leiste links aus, um diese zu lesen oder bearbeiten. Notizen können nun auch privat markiert werden und werden damit nur noch dem Besitzer angezeigt."
        },
        note: {
            lastModified: "Zuletzt geändert: {0}"
        },
        textEditor: {
            increaseLevel: "Liste eine Ebene weiter einrücken",
            makeLink: "Link einfügen an der aktuellen Stelle",
            makeOList: "Aktuelle Zeile in einen Listenpunkt wandeln",
            makeUList: "Aktuelle Zeile in einen nummerierten Listenpunkt wandeln",
            reduceLevel: "Liste eine Ebene zurück",
            textBold: "Text fett markieren",
            textItalic: "Text kursiv schreiben",
            textStrikethrough: "Text durchstreichen"
        },
        blankNoteTitle: "Neue Notiz"
    },
    notifications: {
        filecreated: {
            title: "Neue Datei",
            message: "Die neue Datei {1} wurde soeben dem Archiv hinzugefügt.",
            action: "Öffnen"
        }
    },
    partyroles: {
        authority: "Behörde",
        bank: "Bank",
        borrower: "Kreditnehmer",
        buyer: "Käufer",
        doctor: "Arzt",
        employee: "Arbeitnehmer",
        employer: "Arbeitgeber",
        insuredperson: "Versicherter",
        insurer: "Versicherer",
        landlord: "Vermieter",
        lender: "Kreditgeber",
        main: "Hauptbeteiligter",
        patient: "Patient",
        renter: "Mieter",
        vendor: "Verkäufer"
    },
    pricecomparison: {
        title: "Preisvergleich und -historie",
        chart: "Verlauf (180 Tage)",
        time: "Zeitraum",
        range: "Preisspanne",
        article: "Artikel"
    },
    receipts: {
        title: "Belegerfassung",
        pagetitle: "Erfassung von Einkäufen",
        client: "Käufer",
        currency: "Währung",
        date: "Datum",
        party: "Händler",
        amount: "Betrag",
        items: {
            title: "Positionen",
            article: "Artikel",
            quantity: "Menge",
            singleprice: "E-Preis",
            discount: "Rabatt",
            deposit: "Pfand",
            totalnet: "G-Preis",
            summary: "Summen",
            organic: "Bio"
        },
        edit: {
            title: "Erfassung eines Belegs",
            noitems1: "Noch keine Position erfasst.",
            noitems2: "Noch keine Position vollständig erfasst."
        },
        select: {
            stillediting: {
                title: "Belegauswahl abgebrochen",
                message: "Der Wechsel des Belegs wurde abgebrochen, da aktuell noch ein Beleg erfasst wird. Der zu erfassende Beleg muss gespeichert oder abgebrochen werden."
            }
        }
    },
    search: {
        title: "Suchen",
        setup: {
            phrase: "Suchbegriff(e)",
            helpSearching: "Mehr Informationen zu den Suchstrategien auf mariadb.com",
            groups: {
                accounts: "Konten",
                cases: "Akten",
                directories: "Verzeichnisse",
                files: "Dateien (Metadaten)",
                pages: "Dateiinhalte",
                notepad: "Notizen",
                tags: "Tags"
            },
            groupstitle: "Suchbereiche",
            runSearch: "Suche starten"
        },
        result: {
            title: "{0} Treffer",
            subtitle: "{0} Treffer in {1}",
            group: {
                accounts: "Konten",
                cases: "Akten",
                directories: "Verzeichnisse",
                files: "Dateien",
                notes: "Notizen",
                tags: "Tags",
                pages: "Dateiinhalte",
                onPageNo: "Seite {0}",
                downloadFileTitle: "Datei herunterladen",
                gotoPreviewTitle: "Direkt zur Dateianzeige springen"
            },
            points: "{0} P.",
            showHistoric: "Hist.",
            showHistoricTooltip: "Auch ältere Werte aus der Historie anzeigen?"
        }
    },
    shopping: {
        pagetitle: "Einkaufsliste",
        cart: {
            title: "Einkaufsliste"
        }
    },
    stocks: {
        title: "Aktien und Krypto",
        pagetitle: "Wertpapierübersicht",
        api: "API",
        bought: "Gekauft",
        boughtValue: "{0} {1} á {2}",
        currency: "Währung",
        dif: "Änderung",
        difrel: "in %",
        isin: "ISIN",
        isinWithValue: "ISIN: {0}",
        name: "Name",
        ordercount: "Orders",
        quantity: "Anzahl",
        rate: "Kurs",
        rate2: "Letzter Kurs",
        rate3: "Zuletzt: {0} ({1})",
        rateInputModal: {
            title: "Werte nacherfassen",
            description: "Über dieses Formular können Aktienwerte manuell nacherfasst werden.",
            ignoreWithApi: "Automatisch aktualisierte ignorieren"
        },
        symbol: "Symbol",
        symbolWithValue: "Symbol: {0}",
        total: "Gesamt",
        transactionsLink: "Transaktionen",
        updateRates: "Kurse",
        value: "Wert",
        wkn: "WKN"
    },
    travel: {
        colActions: "Aktionen",
        colBegin: "Am / Vom",
        colEnd: "Bis",
        colLocation: "Ort",
        colPerson: "Person",
        colReason: "Grund",
        createReportBtn: "Jahresbericht",
        deleteTravelBtn: "Reise löschen",
        editor: {
            city: "Ort",
            country: "Land",
            location: "Ziel",
            person: "Person",
            reason: "Anlass",
        },
        pagetitle: "Geschäftsreisen",
        pagetitleWithObj: "{0} Reise nach {1}",
    },
    warehouse: {
        pagetitle: "Lagerverwaltung",
        rooms: {
            pagetitle: "Raumverwaltung {0}",
            metacard: {
                title: "Einstellungen",
                name: "Bezeichnung",
                icon: "Icon"
            },
            spacescard: {
                title: "Abschnitte"
            }
        }
    },
    work: {
        pagetitle: "Arbeitsdokumentation",
        offcategories: {
            educationalLeave: "Bildungsurlaub",
            holidays: "Feiertag",
            sick: "Krank",
            specialLeave: "Sonderurlaub",
            vacation: "Urlaub",
            weekend: "Wochenende",
            none: "Keine",
            title: "Abwesenheit"
        },
        timecategories: {
            administration: "Administratives",
            bugfixing: "Bugfixing",
            meeting: "Meeting intern",
            "non-canon": "Abwesend",
            implementation: "Implementierung",
            presales: "Presales",
            support: "Support",
            trainingself: "Fortbildung",
            travel: "Reise",
            title: "Zeitart"
        }
    },
    workday: {
        pagetitle: "Tagesbuchungen {0}",
        daycard: {
            title: "Übersicht",
            booked: "Gebucht"
        },
        tracked: {
            title: "Heutige Buchungen",
            description: "Beschreibung",
            fromUntil: "{0} bis {1}",
            fromUntilTitle: "Von Bis"
        },
        tracking: {
            title: "Zeitbuchung",
            liveTitle: "Live Zeitbuchung",
            livebtn: "Live",
            livebtnTitle: "Livetracking Funktion",
            common: {
                break: "Ab Pause",
                breakShort: "Pause",
                breakPlaceholder: "mm",
                customer: "Kunde",
                description: "Beschreibung der durchgeführten Arbeiten",
                duration: "Arbeitszeit",
                durationShort: "Gesamt",
                from: "Von",
                project: "Kundenprojekt",
                recentTitle: "Anklicken um diese Daten zu übernehmen",
                task: "Arbeitspaket",
                timeCategory: "Kategorie",
                timePlaceholder: "hh:mm | hhmm | hmm",
                until: "Bis"
            },
            createCustomer: {
                title: "Neuer Kunde",
                nameTitle: "Kundenname",
                namePlaceholder: "Bitte angeben..."
            },
            live: {}
        }
    },
    workmonth: {
        pagetitle: "Monatsübersicht {0}",
        pagetitleShort: "{0}",
        calendar: {
            title: "Kalender"
        },
        cards: {
            day: {
                title: "Tagesdetails {0}"
            },
            target: {
                title: "Monatsinfo",
                businessDays: "Arbeitstage",
                offDays: "WE / FT",
                lastEdit: "Letzte Änderung",
                lastEditShort: "Letzte Änd."
            },
            time: {
                title: "Gebuchte Zeiten",
                takeover: "Übernahme",
                balance: "Differenz",
                carryover: "Übertrag"
            }
        },
        offtime: {
            title: "Abwesenheiten buchen",
            subtitle: "Abwesenheitsmarker setzen das Tagessoll generell auf 0 Stunden.\r\nEs können für Abwesenheitstage keine Zeiten gebucht werden."
        }
    },
    workyear: {
        pagetitle: "Alle Jahre im Überblick",
        addYear: {
            btnText: "{0} erstellen",
            yearOpenToastTitle: "Hinweis",
            yearOpenToastMessage: "Bitte zuerst das Jahr {0} vervollständigen, bevor ein neues Jahr angelegt wird."
        },
        table: {
            yearHeader: {
                year: "Jahr",
                closetime: "Abschluss"
            },
            monthHeader: {
                month: "Monat",
                days: "Tage",
                holidays: "FT",
                weekenddays: "WE",
                starttime: "Start",
                diftime: "Diff",
                closetime: "Abschluss"
            }
        },
        incompleteYear: {
            warnMessage: "Nicht alle Monate sind konfiguriert!",
            btnText: "Jetzt erzeugen"
        }
    }
}