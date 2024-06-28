import { L10nArchiveLocale } from "../l10n.types";

export const L10nArchiveFrLocale: L10nArchiveLocale = {
    accounts: {
        pagetitle: "Comptes"
    },
    authService: {
        apiError: {
            title: "Erreur",
            message: "Erreur lors de la récupération des données : {0}"
        },
        notModified: {
            title: "Info",
            message: "Aucune modification n'a été apportée : {0}"
        }
    },
    calendar: {
        showAsGridTitle: "Représenter sous forme de calendrier",
        showAsListTitle: "Présenter sous forme de liste",
        showWeek: "semaine",
        showWeekTitle: "Afficher la semaine calendaire",
        showWeekend: "week-end",
        showWeekendTitle: "Afficher le week-end",
        weekday: "Jour de la semaine",
        duration: {
            short: "{0} heures"
        },
        holidays: {
            ascension_day: "Jour de l'Ascension",
            boxing_day: "Jour suivant Noël",
            christmas_day: "Jour de Noël",
            easter_goodFriday: "Vendredi Saint",
            easter_monday: "Lundi de Pâques",
            easter_sunday: "Dimanche de Pâques",
            labor_day: "Fête du Travail",
            newYearsDay: "Jour de l'An",
            reformation_day: "Jour de la Réforme",
            unity_day: "Jour de l'unité allemande",
            whit_monday: "Lundi de Pentecôte",
            whit_sunday: "Dimanche de Pentecôte"
        }
    },
    case: {
        title: "{0} (dossier)",
        pagetitleNocase: "Vue du dossier",
        pagetitle_: "Vue du dossier : {0}",
        pagetitle_childs: "Enregistrements subordonnés de : {0}",
        pagetitle_files: "Fichiers du dossier : {0}",
        pagetitle_times: "Périodes du dossier : {0}",
        metacard: {
            title: "Informations générales",
            shorttitle: "Généralités",
            name: "Nom du dossier",
            parent: "Dossier supérieur",
            noparent: "Aucun",
            created: "Créé",
            deleted: "Supprimé",
            filecount: "Fichiers",
            followup: "Successeur",
            type: "Catégorie",
            status: "Statut",
            nextstatus: "Prochain statut",
            client: "Mandant",
            party: "Principaux acteurs",
            comment: "Description"
        },
        childscard: {
            title: "Dossiers associés"
        },
        filescard: {
            title: "Fichiers"
        },
        timecard: {
            title: "Périodes",
            notifyUpcoming: "Avertir si fin dans moins de 3 mois",
            notifyForecast: "Avertir si fin dans moins de 9 mois",
            start: "Début",
            end: "Fin",
            minperiod: "Durée minimale",
            period: "Durée fixe",
            termination: "Préavis de résiliation"
        }
    },
    casefilestatus: {
        approved: "Partagé",
        checked: "Vérifié",
        new: "Nouveau"
    },
    casefiletypes: {
        draft: "Brouillon",
        signed_draft: "Brouillon (signé)",
        contract: "Contrat",
        termination_draft: "Ébauche de résiliation",
        termination: "Résiliation"
    },
    cases: {
        title: "Structure des dossiers",
        pagetitle: "Structure globale des dossiers",
        filescount: [
            "1 fichier",
            "Fichiers : {0}"
        ],
        reference: "Référence {0}",
        showDeleted: "supprimé",
        showInRetention: "masqué"
    },
    casestatus: {
        created: "Créé",
        draft: "Brouillon",
        draftsign: "Signé",
        entered: "Reçu",
        active: "Actif",
        activeexpiring: "En cours d'expiration",
        activenoncontributory: "Actif sans cotisation",
        activeterminated: "Résilié",
        activeterminating: "Est résilié",
        cancelled: "Rejeté",
        expired: "Expiré",
        terminated: "Terminé",
        retentiondeletion: "Rétention",
        retentionhidden: "Masqué",
        todelete: "Pour supprimer",
        waitforstart: "Attendre la date de lancement"
    },
    casetype: {
        apartment: "Habitation",
        associations: "Associations",
        bankaccounts: "Banque et Comptes",
        car: "Voiture",
        carbusiness: "Voiture de Fonction",
        communication: "Communication",
        consumables: "Charges / Consommables",
        contracts: "Contrats",
        damage: "Dommages et Réclamations",
        insurance: "Assurances",
        legals: "Procédures Légales (Autorités/Tribunaux)",
        misc: "Divers",
        repair: "Réparations et Maintenance",
        studies: "Éducation et Études",
        taxes: "Impôts",
        work: "Emploi"
    },
    classify: {
        classes: {
            Banking_AccountReport: "Rapport de compte",
            Banking_AnnualMeeting: "Assemblée annuelle",
            Banking_AnnualReport: "Rapport annuel (compte)",
            Banking_AnnualStmt: "Relevé de compte annuel",
            Banking_BuyOrders: "Achat de titres",
            Banking_CancelOrders: "Annulation de titres",
            Banking_CostStmt: "État des coûts",
            Banking_DepositStatement: "Relevé de dépôt",
            Banking_Earnings: "Recettes provenant d'opérations bancaires/de titres",
            Banking_LossOffSetting: "Compensation des pertes",
            Banking_SellOrders: "Vente de titres",
            Banking_Stmt: "Relevé de compte",
            Claim_Settlement: "Règlement des dommages",
            Contract_Adjustment: "Modification du contrat",
            Contract_Amendment: "Complément de contrat",
            Contract_Application: "Application du contrat",
            Contract_Information: "Informations générales",
            Contract_Proposal: "Proposition de contrat",
            Contract_Protocol: "Protocole de consultation",
            Contract_Renewal: "Renouvellement de contrat",
            Contract_Termination: "Confirmation de la résiliation, dissolution",
            Contract_ToS: "Conditions générales de vente",
            Contract: "Contrat",
            Finance_CreditNote: "Crédit",
            Finance_Donation: "Reçu de dons",
            Finance_Invoice: "Facture",
            Finance_Reminder: "Rappel",
            General_AnnualReport: "Rapport annuel",
            General_Approval: "Validation / autorisation",
            General_DeliveryNote: "Bon de livraison",
            General_DeviceInfo: "Données de l'appareil",
            General_IdDocuments: "Carte d'identité, etc.",
            General_Letter: "Lettre de motivation générale",
            General_Manuals: "Manuel",
            General_Order: "Ordre",
            General_OrderConfirmation: "Confirmation de commande / d'achat / de commande",
            General_Unclassified: "Boîte de réception générale",
            Health_Medication: "Prescription (remèdes/médicaments)",
            Health_Report: "Rapport médical",
            Home_AnnualSettlement: "Décompte des charges locatives",
            Home_MeterReading: "Relevé des compteurs",
            Insurance_AnnualReport: "Rapport annuel (assurance)",
            Insurance_Stmt: "Attestation de déclaration à la sécurité sociale",
            Job_AnnualBonus: "Prime annuelle, paiements spéciaux, etc.",
            Job_AnnualPayroll: "Attestation d'impôt sur le salaire",
            Job_Application: "Candidature",
            Job_Certificate: "Acte, certificat, attestation de participation",
            Job_CoD: "Certificat d'invalidité",
            Job_Expenses_Clearing: "Validation ou remboursement de la note de frais",
            Job_Incentives_Status: "Statut de Lead/Incentive",
            Job_PaySlip: "Fiche de paie",
            Job_PaySlip2: "Fiche de paie",
            Legal_Deed: "Document notarié",
            Legal_LayJudge_CompensationForm: "Juge laïc: Formulaire de compensation",
            Legal_LayJudge_InvitationTrial: "Juge laïc : Invitation à l'audience principale",
            Legal_LayJudge_ReservedDates: "Juge laïc : Dates possibles dans l'année",
            Legal_Mandate: "Procuration, mandat",
            Legal_Notice: "Avis juridique",
            Pension_AnnualReport: "Rapport annuel (pensions)",
            Public_Application: "Candidature à une fonction publique",
            Public_BallotDocs: "Documents électoraux",
            Security_Credentials: "Données d'accès, credentials, mots de passe",
            In_PerformanceReport: "Information sur la performance",
            In_PostReceipt: "Preuve de dépôt poste/colis",
            In_QuarterReport: "Clôture trimestrielle",
            In_Receipt: "Pièce de caisse",
            In_Receipt2: "Reçu",
            In_Rejection: "Refus, décision de refus",
            In_RepairOrder: "Ordre de réparation",
            In_RepairReport: "Rapport de réparation",
            In_Request: "Demande",
            In_Statement: "Attestation générale",
            In_Stock_Info: "Informations sur les titres",
            In_TaxAssessment: "Avis d'impôt",
            In_TaxReceipt: "Attestation fiscale",
            In_TaxReport: "Relevé fiscal",
            In_TaxTravelDocumentation: "Documentation de voyage",
            In_TaxVL: "Déclaration d'impôts Annexe VL",
            In_TicketEntrance: "Ticket d'Entrée",
            In_TicketTransport: "Titre de transport, billet",
            In_TrafficTicket: "Radars, PV, infraction au code de la route",
            In_VacationResp: "Congés, maladie, heures supplémentaires",
            In_VaccinationCertificate: "Certificat de vaccination",
            In_Voucher: "Coupon",
            LeaseAgreement: "Contrat de bail",
            NewCard: "Nouvelle carte avec lettre de présentation",
            Out_ClaimReport: "Déclaration de sinistre",
            Out_Contradiction: "Contradiction",
            Out_ExpenseReport: "Décompte et justificatifs de frais",
            Out_Inquiry: "Demande",
            Out_Questionnaire: "Questionnaire",
            Out_Revocation: "Révocation",
            Out_SepaMandate: "Mandat de prélèvement automatique",
            Out_TaxDeclaration: "Déclaration d'impôts",
            Out_Termination: "Résiliation",
            RentalAgreement: "Contrat de location",
            Trash: "Poubelle"
        }
    },
    common: {
        add: "Nouveau",
        back: "Retour",
        cancel: "Annuler",
        change: "Modifier",
        confirm: {
            askDeletion: "Es-tu sûr que l'enregistrement {0} doit être supprimé ?",
            delete: {
                title: "Enregistré",
                message: "Cet enregistrement a déjà été supprimé."
            },
            deletion: {
                title: "Confirmer la suppression",
                message: "Êtes-vous sûr de vouloir supprimer le mémo ?",
                closeModal: "Fermer le dialogue",
                confirm: "Oui, supprimer !",
                cancel: "Retour"
            },
            save: {
                title: "Enregistré",
                message: "Les modifications ont été enregistrées avec succès."
            }
        },
        date: "Date",
        day: "Jour",
        days: "Jours",
        default: "Standard",
        delete: "Supprimer",
        edit: "Éditer",
        goto: "Ouvrir",
        hour: "Heure",
        hours: "Heures",
        minute: "Minute",
        minutes: "Minutes",
        month: "Mois",
        months: "Mois",
        no: "Non",
        none: "Aucun",
        novalue: "---",
        pcs: "pièces",
        period: {
            placeholder: "0a 0m 0j 0:0:0",
            patternYears: "{0} ans",
            patternMonths: "{0} mois",
            patternDays: "{0} jours",
            patternTime: "{0}h:{1}m:{2}s"
        },
        save: "Enregistrer",
        second: "Seconde",
        seconds: "Secondes",
        select: {
            pickOne: "Veuillez choisir",
            pickedNone: "Aucun sélectionné"
        },
        switchTo: "Aller à",
        today: "Aujourd'hui",
        warn: {
            formInvalid: {
                title: "Attention",
                message: "Le formulaire contient encore des erreurs."
            },
            notYetSaved: {
                message: "Modifications non encore enregistrées !"
            },
            saved: {
                message: "Changements sauvegardés."
            }
        },
        year: "Année",
        years: "Années",
        yes: "Oui"
    },
    contacttypes: {
        phone: "Téléphone",
        email: "E-mail",
        mobile: "Téléphone mobile",
        fax: "Fax"
    },
    country: {
        germany: "Allemagne",
        japan: "Japon",
        nederlands: "Pays-Bas",
        unitedStates: "États-Unis"
    },
    db: {
        accounts: {
            title: "Comptes bancaires",
            mandates: {
                title: "Mandats de prélèvement automatique"
            },
            orders: {
                title: "Ordres permanents"
            }
        },
        articles: {
            title: "Articles (pour les factures)",
            categories: {
                title: "Catégories d'articles"
            }
        },
        cases: {
            title: "Structure des dossiers",
            status: {
                title: "Statut des dossiers"
            },
            types: {
                title: "Types des dossiers"
            }
        },
        classes: {
            title: "Types de documents",
            techname: "Nom technique",
            localized: "Nom localisé",
            pattern: "Nom par défaut",
            default: "Standard",
            editor: {
                title: "Modifier le type de document",
                localized: "Localisation par fichiers json",
                description: "Description",
                descriptionPlaceholder: "Texte descriptif détaillé",
                namepattern: "Modèle de nom de fichier",
                namepatternPlaceholder: "Caractère de remplacement avec {...} pour générer automatiquement des noms de fichiers"
            }
        },
        contacts: {
            types: {
                title: "Types de contacts",
                name: "Nom technique",
                i18nname: "Nom localisé",
                icon: "Icône",
                editor: {
                    title: "Modifier les types de contact",
                    localized: "Localisation par fichiers json",
                    name: "Nom technique",
                    icon: "Icône"
                }
            }
        },
        countries: {
            title: "Pays",
            default: "Standard",
            name: "Nom technique",
            i18nname: "Nom localisé",
            currency: "Devise",
            key2: "Code-2",
            key3: "Code-3",
            taxrates: {
                title: "Taux d'imposition"
            },
            editor: {
                key2: "Code à 2 chiffres",
                key3: "Code à 3 chiffres",
                title: "Modifier les pays",
                localized: "Localisation par fichiers json"
            }
        },
        cronjobs: {
            title: "Cronjobs"
        },
        currencies: {
            title: "Monnaies",
            default: "Standard",
            name: "Nom",
            shortname: "Abréviation",
            sign: "Symbole",
            editor: {
                name: "Nom complet",
                shortname: "Code à 3 chiffres",
                sign: "Signe international",
                title: "Modifier la monnaie"
            }
        },
        directories: {
            title: "Répertoires racines",
            id: "Id",
            name: "Nom",
            mtime: "Dernière modification"
        },
        expenses: {
            title: "Dépenses",
            categories: {
                title: "Types des dépenses"
            },
            templates: {
                title: "Modèles"
            },
            types: {
                title: "Types de réservation"
            }
        },
        extensions: {
            title: "Types de fichiers",
            ext: "Ext",
            options: "Options",
            displayable: "Affichage dans le navigateur",
            downloadable: "Télécharger",
            indexable: "Contenu lisible (OCR)",
            isofficefile: "Fichier Office",
            mimetype: "Type de mime",
            unknownMimetype: "Type de mime inconnu",
            editor: {
                title: "Modifier les types de fichiers",
                gscommand: "Commande GhostScript",
                ocrcommand: "Commande OCR",
                returnImg: "GhostScript fournit un fichier image",
                returnMimetype: "Type de mime après conversion"
            }
        },
        manager: {
            title: "Gestion des données de base",
            countries: "Pays",
            filesystem: "Système de fichiers",
            finance: "Finances",
            files: "Fichiers et classification",
            living: "Appartement",
            parties: "Correspondants",
            system: "Administration",
            work: "Gestion du temps de travail"
        },
        meters: {
            title: "Compteur"
        },
        mimetypes: {
            title: "Types de mime"
        },
        oauth: {
            services: {
                title: "OAuth-Services"
            }
        },
        parties: {
            title: "Correspondants",
            addresses: {
                title: "Jeux de données Address"
            },
            banks: {
                title: "Établissements bancaires"
            },
            clients: {
                title: "Mandants"
            },
            contacts: {
                title: "Coordonnées"
            },
            roles: {
                title: "Rôles",
                name: "Nom technique",
                i18nname: "Nom localisé"
            }
        },
        stocks: {
            title: "Titres et crypto-monnaies",
            apis: {
                title: "APIs"
            }
        },
        tags: {
            title: "Tags"
        },
        units: {
            title: "Unités de mesure"
        },
        user: {
            title: "Utilisateurs"
        },
        work: {
            customers: {
                title: "Clients"
            },
            holidays: {
                title: "Jours fériés"
            },
            offcategories: {
                title: "Type d'absences"
            },
            timecategories: {
                title: "Type de comptabilisation"
            }
        }
    },
    file: {
        title: "Fichier {0}",
        downloadButton: "Téléchargement",
        previewButton: "Aperçu",
        main: {
            title: "Détails des fichiers",
            dir: "Répertoire supérieur",
            name: "Nom de fichier",
            created: "Créé",
            deleted: "Supprimé",
            size: "Taille du fichier",
            pages: "Nombre de pages",
            tags: "Tags",
            tagsInputPlaceholder: "Saisir n'importe quel mot...",
            words: "Nombre de mots"
        },
        classify: {
            title: "Classification et attribution",
            nextFile: "Suivant",
            date: "Date",
            class: "Type de document",
            suggestion: "Suggestion : {0} {1}%",
            case: "Dossier",
            caseFiletype: "Type de document dans le dossier",
            caseFilestatus: "Statut",
            caseFilename: "Nom d'affichage",
            caseFiledesc: "Description",
            client: "Mandant",
            party: "Correspondant",
            taxreceipt: "Document fiscal",
            taxyear: "Année fiscale"
        },
        housekeeping: {
            title: "Organisation ",
            move: {
                title: "Déplacer le fichier",
                description: "Déplace le fichier de l'archive vers un autre répertoire.",
                btn: "Choisir la destination"
            },
            delete: {
                title: "Supprimer le fichier",
                description: "Supprime le fichier de l'archive de manière irréversible.",
                btn: "Supprimer",
                confirm: "Supprimer vraiment le fichier ?"
            }
        },
        errors: {
            noNextFile: {
                title: "Pas de données",
                message: "Il n'y a pas d'autres fichiers qui nécessitent une classification."
            }
        }
    },
    finance: {
        pagetitle: "Tableau de bord financier"
    },
    folderbrowser: {
        title: "Rechercher dans les répertoires",
        selected: "Sélectionné : {0}",
        newFolder: {
            title: "Nouveau répertoire..."
        }
    },
    home: {
        title: "Page d'accueil de l'archive",
        cases: {
            title: "Dossiers pour vérification"
        },
        database: {
            title: "Données de base",
            dbmanager: "Vers la gestion des données de base"
        },
        inbox: {
            title: "Nouveaux documents"
        },
        readings: {
            title: "Compteur",
            readingsLink: "Saisie des relevés de compteurs"
        },
        recentFiles: {
            title: "Derniers fichiers archivés"
        },
        special: {
            title: "Fonctions supplémentaires",
            notepadLink: "Notes",
            warehouseLink: "Entrepôt",
            movingBoxesLink: "Cartons de déménagement",
            wineCellarLink: "Cave à vin"
        },
        stats: {
            title: "Statistiques rapides...",
            files1: "L'archive gère actuellement {0} fichiers dans {1} répertoires avec un total de {2}.",
            files2: "{0} des fichiers ont été classés, {1} ont été attribués à un dossier. Aucun texte OCR n'a pu être généré pour {2}.",
            files3: "Ce mois-ci, {0} nouveaux fichiers ont été ajoutés.",
            casesLink: "Dossiers",
            filesLink: "Tous les fichiers",
            noclassFilesLink: "Non classé",
            noocrFilesLink: "Pas de texte",
            storageLink: "Espace disque"
        },
        supermarket: {
            title: "Au supermarché",
            priceComparison: "Comparaison et historique des prix",
            receiptsLink: "Saisie des achats",
            shoppingLink: "Liste d'achats"
        }
    },
    lead: {
        title: "Lead #{0}",
        common: {
            title: "Informations générales",
            party: "Société"
        }
    },
    leads: {
        title: "Leads + Incentives",
        table: {
            head: {
                key: "[LI]",
                customer: "Client",
                project: "Projet",
                created: "Créé",
                completed: "Terminé",
                payed: "Payé"
            },
            data: {
                lead: "Lead",
                incentive: "Incentive"
            }
        }
    },
    listManager: {
        title: "Listes",
        filterPlaceholder: "🔍 Filtrer les listes...",
        toggleSidebar: "Aperçu",
        noListSelected: {
            title: "Vos Listes",
            introduction: "Sélectionnez l'une des listes dans la barre de gauche pour la lire, la cocher ou la modifier. Contrairement aux notes, les listes peuvent être réinitialisées, de sorte que toutes les cases sont de nouveau vides."
        },
        list: {
            addItem: "Nouvel élément de liste",
            blankListTitle: "Nouvelle Liste",
            checkedBelowUncheckedItems: "Déplacer les éléments cochés sous les éléments non cochés",
            checkedBy: "Réalisé par {0} {1}",
            lastModified: "Dernière modification : {0}",
            resetCron: "Sera réinitialisé : {0}",
            resetDate: "Sera réinitialisé le {0}",
            resetDateAndCron: "Sera réinitialisé le {0} et {1}",
            resetManually: "Réinitialiser la liste"
        },
        textEditor: {
            titlePlaceholder: "Nom de la liste",
            descriptionPlaceholder: "Description détaillée facultative pour la liste",
            cronResetTitle: "Réinitialiser automatiquement les cases à cocher ?",
            cronResetPlaceholder: "par ex., 0 0 1 * * (Chaque 1er du mois)",
            cronResult: {
                never: "Ne jamais réinitialiser",
                invalid: "Expression invalide",
                valid: "Répète: {0}"
            },
            dateResetTitle: "Réinitialiser à une date spécifique?",
            manualResetTitle: "Réinitialisable manuellement?",
            listStyle: "Type de liste",
            listStyleUl: "Simple",
            listStyleOl: "Numéroté",
            listStyleCb: "Cases à cocher"
        }
    },
    locales: {
        de: {
            title: "Allemand"
        },
        en: {
            title: "Anglais"
        },
        fr: {
            title: "Français"
        }
    },
    login: {
        title: "Connexion d'utilisateur",
        subtitle: "Ce site web nécessite la saisie de données d'accès. Veuillez vous connecter avec votre nom d'utilisateur et votre mot de passe.",
        button: "Se connecter",
        password: "Mot de passe",
        passwordPlaceholder: "*********",
        username: "Nom d'utilisateur",
        usernamePlaceholder: "pete@archive.org",
        failed: "Erreur lors de l'inscription. Veuillez vérifier votre saisie et réessayer.",
        sessioncheck: {
            title: "Connexion d'utilisateur",
            subtitle: "Veuillez patienter, l'inscription est en cours de vérification..."
        },
        oauth2: {
            title: "Connexion d'utilisateur",
            subtitle: "Ce site web nécessite une inscription via Nextcloud. Veuillez cliquer sur le bouton pour vous inscrire.",
            button: "Se connecter"
        }
    },
    meter: {
        readings: {
            title: "Saisie des relevés de compteurs",
            meter: "Compteur",
            value: "Valeur",
            modal: {
                title: "Relevé des compteurs",
                description: "Dans les champs suivants, tu peux saisir les valeurs des compteurs. Seuls les champs remplis seront enregistrés."
            }
        },
        title: "Compteur"
    },
    navbar: {
        brand: {
            title: "Archive"
        },
        finance: {
            accounts: "Comptes",
            stocks: "Titres",
            taxYear: "Impôts {0}"
        },
        items: {
            account: "Compte",
            cases: "Dossiers",
            dashboard: "Tableau de bord",
            finance: "Finances",
            home: "Accueil",
            lists: "Listes",
            notepad: "Bloc-notes",
            settings: "Paramètres",
            work: "Travail"
        },
        search: {
            label: "Rechercher dans l'archive",
            placeholder: "Terme de recherche",
            submit: "Rechercher"
        },
        showNavigationItems: {
            btnTitle: "Afficher la navigation"
        },
        switchLocale: {
            btnTitle: "Changer la langue d'affichage",
            smTitle: "Langue"
        },
        user: {
            btnTitle: "Profil de l'utilisateur {0}",
            userProfileLink: "Afficher le profil",
            userSettingsLink: "Paramètres",
            clearCacheLink: "Effacer le cache",
            logoutLink: "Se déconnecter"
        },
        workitems: {
            leads: "Prospects",
            month: "Vue Mensuelle",
            year: "Années",
            settings: "Paramètres",
            today: "Réservation Quotidienne"
        }
    },
    notepad: {
        title: "Notes",
        filterPlaceholder: "Filtrer",
        markdownGuide: "Mise en forme avec Markdown",
        notYetSaved: "Sauvegarde dans {0} secondes."
    },
    notepad2: {
        title: "Notes",
        filterPlaceholder: "🔍 Rechercher une note...",
        toggleSidebar: "Aperçu",
        noNoteSelected: {
            title: "Votre carnet",
            introduction: "Sélectionnez l'une des notes dans la barre de gauche pour la lire ou la modifier. Les notes peuvent désormais être marquées comme privées et ne seront visibles que par le propriétaire."
        },
        note: {
            lastModified: "Dernière modification : {0}"
        },
        textEditor: {
            increaseLevel: "Indenter la liste d'un niveau",
            makeLink: "Insérer un lien à la position actuelle",
            makeOList: "Transformer la ligne actuelle en un élément de liste",
            makeUList: "Transformer la ligne actuelle en un élément de liste numérotée",
            reduceLevel: "Désindenter la liste d'un niveau",
            textBold: "Mettre le texte en gras",
            textItalic: "Mettre le texte en italique",
            textStrikethrough: "Barrer le texte"
        },
        blankNoteTitle: "Nouvelle note"
    },
    notifications: {
        filecreated: {
            title: "Nouveau fichier",
            message: "Le nouveau fichier {1} vient d'être ajouté à l'archive.",
            action: "Ouvrir"
        }
    },
    partyroles: {
        authority: "Autorité",
        bank: "Banque",
        borrower: "Emprunteur",
        buyer: "Acheteur",
        doctor: "Médecin",
        employee: "Travailleur",
        employer: "Employeur",
        insuredperson: "Assuré",
        insurer: "Assureur",
        landlord: "Bailleur",
        lender: "Prêteur",
        main: "Principal acteur",
        patient: "Patient",
        renter: "Locataire",
        vendor: "Vendeur"
    },
    pricecomparison: {
        title: "Comparaison et historique des prix",
        chart: "Historique (180 jours)",
        time: "Période",
        range: "Fourchette de prix",
        article: "Article"
    },
    receipts: {
        title: "Saisie des documents",
        pagetitle: "Saisie des achats",
        client: "Acheteur",
        currency: "Devise",
        date: "Date",
        party: "Revendeurs",
        amount: "Montant",
        items: {
            title: "Positions",
            article: "Article",
            quantity: "Quantité",
            singleprice: "Prix à l'unité",
            discount: "Réduction",
            deposit: "Consigne",
            totalnet: "Prix total",
            summary: "Totaux",
            organic: "Organique"
        },
        edit: {
            title: "Saisie d'un document",
            noitems1: "Pas encore de position saisie.",
            noitems2: "Aucune position n'a encore été entièrement saisie."
        },
        select: {
            stillediting: {
                title: "Sélection de documents annulée",
                message: "Le changement de document a été annulé, car un document est encore en cours de saisie. Le document à saisir doit être enregistré ou annulé."
            }
        }
    },
    search: {
        title: "Rechercher",
        setup: {
            phrase: "Termes de recherche",
            helpSearching: "Plus d'informations sur les stratégies de recherche sur mariadb.com",
            groups: {
                accounts: "Comptes",
                cases: "Dossiers",
                directories: "Répertoires",
                files: "Fichiers (métadonnées)",
                pages: "Contenu des fichiers",
                notepad: "Notes",
                tags: "Tags"
            },
            groupstitle: "Domaines de recherche",
            runSearch: "Lancer la recherche"
        },
        result: {
            title: "{0} résultats",
            subtitle: "{0} résultats dans {1}",
            group: {
                accounts: "Comptes",
                cases: "Dossiers",
                directories: "Répertoires",
                files: "Fichiers",
                notes: "Notes",
                tags: "Tags",
                pages: "Contenu des fichiers",
                onPageNo: "Page {0}",
                downloadFileTitle: "Télécharger le fichier",
                gotoPreviewTitle: "Aller directement à l'affichage du fichier"
            },
            points: "{0} p.",
            showHistoric: "hist.",
            showHistoricTooltip: "Afficher également les valeurs plus anciennes de l'historique ?"
        }
    },
    shopping: {
        pagetitle: "Liste d'achats",
        cart: {
            title: "Liste d'achats"
        }
    },
    stocks: {
        title: "Actions et Crypto",
        pagetitle: "Aperçu des titres",
        api: "API",
        bought: "Acheté",
        boughtValue: "{0} {1} chacun à {2}",
        currency: "Devise",
        dif: "Changements",
        difrel: "en %",
        isin: "ISIN",
        isinWithValue: "ISIN : {0}",
        name: "Nom",
        ordercount: "Ordres",
        quantity: "Quantité",
        rate: "Prix",
        rate2: "Dernier prix",
        rate3: "Dernier : {0} ({1})",
        rateInputModal: {
            title: "Mettre à jour les taux",
            description: "Les valeurs des actions peuvent être saisies manuellement à l'aide de ce formulaire.",
            ignoreWithApi: "Ignorer les actions mises à jour automatiquement"
        },
        symbol: "Symbole",
        symbolWithValue: "Symbole : {0}",
        total: "Total",
        transactionsLink: "Transactions",
        updateRates: "Mettre à jour les prix",
        value: "Valeur",
        wkn: "WKN"
    },
    warehouse: {
        pagetitle: "Gestion de stocks",
        rooms: {
            pagetitle: "L'espace {0}",
            metacard: {
                title: "Paramètres",
                name: "Libellé",
                icon: "Icône"
            },
            spacescard: {
                title: "Sections"
            }
        }
    },
    work: {
        pagetitle: "Documentation des travaux",
        offcategories: {
            educationalLeave: "Congé de formation",
            holidays: "Jour férié",
            sick: "Déclaré malade",
            specialLeave: "Congé spécial",
            vacation: "Congé",
            weekend: "Week-end",
            none: "Aucun",
            title: "Absence"
        },
        timecategories: {
            administration: "Activités administratives",
            bugfixing: "Bugfixing",
            meeting: "Meeting",
            "non-canon": "Absent",
            implementation: "Implémentation",
            presales: "Presales",
            support: "Support",
            trainingself: "Perfectionnement professionnel",
            travel: "Voyage",
            title: "Catégorie de temps"
        }
    },
    workday: {
        pagetitle: "Réservations journalières {0}",
        daycard: {
            title: "Aperçu",
            booked: "Réservé"
        },
        tracked: {
            title: "Réservations d'aujourd'hui",
            description: "Description",
            fromUntil: "{0} a {1}",
            fromUntilTitle: "De à"
        },
        tracking: {
            title: "Réservation de temps",
            liveTitle: "Réservation de temps en direct",
            livebtn: "En direct",
            livebtnTitle: "Fonction de suivi en direct",
            common: {
                break: "Pause",
                breakShort: "Pause",
                breakPlaceholder: "minutes",
                customer: "Client",
                description: "Description des travaux effectués",
                duration: "Temps de travail",
                durationShort: "Total",
                from: "Du",
                project: "Projet client",
                recentTitle: "Cliquer pour reprendre ces données",
                task: "Tâche",
                timeCategory: "Сatégorie",
                timePlaceholder: "hh:mm | hhmm | hmm",
                until: "Jusqu'à"
            },
            createCustomer: {
                title: "Nouveau client",
                nameTitle: "Nom du client",
                namePlaceholder: "Veuillez préciser..."
            },
            live: {}
        }
    },
    workmonth: {
        pagetitle: "Aperçu mensuel {0}",
        pagetitleShort: "{0}",
        calendar: {
            title: "Calendrier"
        },
        cards: {
            day: {
                title: "Détails pour le jour {0}"
            },
            target: {
                title: "Info mensuelle",
                businessDays: "Jours ouvrables",
                offDays: "Week-end / Jour férié",
                lastEdit: "Dernière modification",
                lastEditShort: "Dernier mod."
            },
            time: {
                title: "Temps réservés",
                takeover: "Reprise",
                balance: "Différence",
                carryover: "Retenir"
            }
        },
        offtime: {
            title: "Enregistrer les absences",
            subtitle: "Les marqueurs d'absence fixent en général le débit journalier à 0 heure.\nIl n'est pas possible de comptabiliser des heures pour les jours d'absence."
        }
    },
    workyear: {
        pagetitle: "Aperçu de Toutes les Années",
        addYear: {
            btnText: "Créer {0}",
            yearOpenToastTitle: "Avis",
            yearOpenToastMessage: "Veuillez compléter l'année {0} avant d'en créer une nouvelle."
        },
        table: {
            yearHeader: {
                year: "Année",
                closetime: "Clôture"
            },
            monthHeader: {
                month: "Mois",
                days: "Jours",
                holidays: "JF",
                weekenddays: "WE",
                starttime: "Début",
                diftime: "Diff",
                closetime: "Clôture"
            }
        },
        incompleteYear: {
            warnMessage: "Tous les mois ne sont pas configurés !",
            btnText: "Générer Maintenant"
        }
    }
}