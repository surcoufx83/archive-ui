import { L10nArchiveLocale } from "../l10n.types";

export const L10nArchiveEnLocale: L10nArchiveLocale = {
    accounts: {
        pagetitle: "Accounts"
    },
    authService: {
        apiError: {
            title: "Error",
            message: "Error retrieving data: {0}"
        },
        notModified: {
            title: "Info",
            message: "No changes have been made: {0}"
        }
    },
    calendar: {
        showAsGridTitle: "Display as calendar",
        showAsListTitle: "Show as list",
        showWeek: "week#",
        showWeekTitle: "Show week number",
        showWeekend: "Weekend",
        showWeekendTitle: "Show weekend days in calendar",
        weekday: "Day of week",
        duration: {
            short: "{0} hr"
        },
        holidays: {
            ascension_day: "Ascension Day",
            boxing_day: "Christmas",
            christmas_day: "Christmas Day",
            easter_goodFriday: "Good Friday",
            easter_monday: "Easter Monday",
            easter_sunday: "Easter Day",
            labor_day: "Labour Day",
            newYearsDay: "New Year's Day",
            reformation_day: "Day of Reformation",
            unity_day: "Unity Day",
            whit_monday: "Whit Monday",
            whit_sunday: "Whit Sunday"
        }
    },
    case: {
        title: "{0} (Case)",
        pagetitleNocase: "Record view",
        pagetitle_: "Record view: {0}",
        pagetitle_childs: "Subordinate records of: {0}",
        pagetitle_files: "Files of the record: {0}",
        pagetitle_times: "Periods of the record: {0}",
        metacard: {
            title: "General information",
            shorttitle: "General",
            name: "Name of case",
            parent: "Parent case",
            noparent: "None",
            created: "Created",
            deleted: "Deleted",
            filecount: "Files",
            followup: "Followed by",
            type: "Category",
            status: "Status",
            nextstatus: "Next state",
            client: "Client",
            party: "Main participant",
            comment: "Description"
        },
        childscard: {
            title: "Related cases"
        },
        filescard: {
            title: "Files"
        },
        timecard: {
            title: "Periods",
            notifyUpcoming: "Notify if end in less than three months",
            notifyForecast: "Notify if end in less than nine months",
            start: "Start",
            end: "End",
            minperiod: "Min. duration",
            period: "Fixed duration",
            termination: "Termination"
        }
    },
    casefilestatus: {
        approved: "Approved",
        checked: "Checked",
        new: "New"
    },
    casefiletypes: {
        draft: "Draft",
        signed_draft: "Draft (signed)",
        contract: "Contract",
        termination_draft: "Draft termination",
        termination: "Termination"
    },
    cases: {
        title: "Cases",
        pagetitle: "Overall record structure",
        filescount: [
            "1 file",
            "{0} files"
        ],
        reference: "Reference {0}",
        showDeleted: "del.",
        showInRetention: "retention"
    },
    casestatus: {
        created: "Created",
        draft: "Draft",
        draftsign: "Signed",
        entered: "Received",
        active: "Active",
        activeexpiring: "Expires",
        activenoncontributory: "Active (non-contributory)",
        activeterminated: "Terminated",
        activeterminating: "Terminating",
        cancelled: "Discarded",
        expired: "Expired",
        terminated: "Ended",
        retentiondeletion: "Retention",
        retentionhidden: "Hidden",
        todelete: "To delete",
        waitforstart: "Waiting for start"
    },
    casetype: {
        apartment: "Living",
        associations: "Associations",
        bankaccounts: "Bank and Accounts",
        car: "Car",
        carbusiness: "Company Car",
        communication: "Communication",
        consumables: "Utilities / Consumables",
        contracts: "Contracts",
        damage: "Damage and Claims",
        insurance: "Insurance",
        legals: "Legal Proceedings (Authorities/Courts)",
        misc: "Miscellaneous",
        repair: "Repairs and Maintenance",
        studies: "Education and Studies",
        taxes: "Taxes",
        work: "Employment"
    },
    classify: {
        classes: {
            Banking_AccountReport: "Account Report",
            Banking_AnnualMeeting: "Annual Meeting",
            Banking_AnnualReport: "Annual Report (Account)",
            Banking_AnnualStmt: "Annual Account Statement",
            Banking_BuyOrders: "Securities Purchase",
            Banking_CancelOrders: "Securities Cancellation",
            Banking_CostStmt: "Cost Statement",
            Banking_DepositStatement: "Portfolio Statement",
            Banking_Earnings: "Earnings from Bank/Securities Transactions",
            Banking_LossOffSetting: "Loss Offset",
            Banking_Order: "Securities Order",
            Banking_SellOrders: "Securities Sale",
            Banking_Stmt: "Account Statement",
            Claim_Settlement: "Claim Settlement",
            Contract_Adjustment: "Contract Adjustment",
            Contract_Amendment: "Contract Addendum",
            Contract_Application: "Application for Contract Conclusion",
            Contract_Information: "General Information",
            Contract_Proposal: "Contract Draft",
            Contract_Protocol: "Consultation Protocol",
            Contract_Renewal: "Contract Renewal",
            Contract_Termination: "Termination Confirmation, Dissolution",
            Contract_ToS: "Terms and Conditions",
            Contract: "Contract",
            Finance_CreditNote: "Credit Note",
            Finance_Donation: "Donation Receipt",
            Finance_Invoice: "Invoice",
            Finance_Reminder: "Payment Reminder",
            General_AnnualReport: "Annual Report",
            General_Approval: "Approval / Authorization",
            General_DeliveryNote: "Delivery Note",
            General_DeviceInfo: "Device Data",
            General_IdDocuments: "ID Documents etc.",
            General_Letter: "General Letter",
            General_Mailbody: "Email",
            General_Manuals: "Manual",
            General_Order: "Order",
            General_OrderConfirmation: "Order / Purchase / Confirmation",
            General_Unclassified: "General Mail Inbox",
            Health_Medication: "Prescription (Remedy/Medication)",
            Health_Report: "Medical Report",
            Home_AnnualSettlement: "Utility Cost Settlement",
            Home_MeterReading: "Meter Reading",
            In_PerformanceReport: "Investment Performance Info",
            In_PostReceipt: "Mail/Parcel Submission Receipt",
            In_QuarterReport: "Quarterly Report",
            In_Receipt: "Cash Receipt",
            In_Receipt2: "Receipt",
            In_Rejection: "Rejection, Rejection Notice",
            In_RepairOrder: "Repair Order",
            In_RepairReport: "Repair Report",
            In_Request: "Application",
            In_Statement: "General Certificate",
            In_Stock_Info: "Securities Information",
            In_TaxAssessment: "Tax Assessment",
            In_TaxReceipt: "Tax Certificate",
            In_TaxReport: "Tax Report",
            In_TaxTravelDocumentation: "Travel Documentation",
            In_TaxVL: "Tax Return VL Annex",
            In_TicketEntrance: "Admission Ticket",
            In_TicketTransport: "Travel Ticket",
            In_TrafficTicket: "Speeding/Traffic Violation",
            In_VacationResp: "Vacation, Sick Leave, Overtime",
            In_VaccinationCertificate: "Vaccination Certificate",
            In_Voucher: "Voucher",
            Insurance_AnnualReport: "Annual Report (Insurance)",
            Insurance_Stmt: "Social Security Confirmation",
            Job_AnnualBonus: "Annual Bonus, Special Payments, etc.",
            Job_AnnualPayroll: "Income Tax Certificate",
            Job_Application: "Application",
            Job_Certificate: "Certificate, Diploma, Confirmation of Participation",
            Job_CoD: "Sick Leave Certificate",
            Job_Expenses_Clearing: "Approval/Reimbursement Expense Report",
            Job_Incentives_Status: "Lead/Incentive Status",
            Job_PaySlip: "Payslip",
            Job_PaySlip2: "Payslip",
            LeaseAgreement: "Lease Agreement",
            Legal_Deed: "Certified Deed",
            Legal_LayJudge_CompensationForm: "Lay Judge: Compensation Form",
            Legal_LayJudge_InvitationTrial: "Lay Judge: Trial Invitation",
            Legal_LayJudge_ReservedDates: "Lay Judge: Possible Dates This Year",
            Legal_Mandate: "Power of Attorney, Mandate",
            Legal_Notice: "Procedural Notice",
            NewCard: "New Card with Letter",
            Out_ClaimReport: "Damage Report",
            Out_Contradiction: "Objection",
            Out_ExpenseReport: "Expense Report and Receipts",
            Out_Inquiry: "Inquiry",
            Out_Questionnaire: "Questionnaire",
            Out_Revocation: "Revocation",
            Out_SepaMandate: "SEPA Direct Debit Mandate",
            Out_TaxDeclaration: "Tax Return",
            Out_Termination: "Termination",
            Pension_AnnualReport: "Annual Report (Pension)",
            Public_Application: "Application (Public Office)",
            Public_BallotDocs: "Voting Documents",
            RentalAgreement: "Rental Agreement",
            Security_Credentials: "Login Credentials, Passwords",
            Trash: "Trash",
        },
    },
    common: {
        add: "New",
        back: "Back",
        cancel: "Cancel",
        change: "Modify",
        confirm: {
            askDeletion: "Are you sure you want to remove record {0}?",
            delete: {
                title: "Saved",
                message: "The record was deleted from the database."
            },
            deletion: {
                title: "Confirm deletion",
                message: "Are you sure you want to delete the note?",
                closeModal: "Close dialog",
                confirm: "Yes, delete!",
                cancel: "Back"
            },
            save: {
                title: "Saved",
                message: "Changes have been saved successfully."
            }
        },
        date: "Date",
        day: "Day",
        days: "Days",
        default: "System Default",
        delete: "Delete",
        edit: "Edit",
        goto: "Jump to",
        hour: "Hour",
        hours: "Hours",
        minute: "Minute",
        minutes: "Minutes",
        month: "Month",
        months: "Months",
        no: "No",
        none: "None",
        novalue: "---",
        pcs: "pcs.",
        period: {
            placeholder: "0y 0m 0d 0:0:0",
            patternYears: "{0}y",
            patternMonths: "{0}m",
            patternDays: "{0}d",
            patternTime: "{0}h:{1}m:{2}s"
        },
        save: "Save",
        second: "Second",
        seconds: "Seconds",
        select: {
            pickOne: "Please select",
            pickedNone: "None selected"
        },
        switchTo: "Switch to",
        today: "Today",
        warn: {
            formInvalid: {
                title: "Warning",
                message: "This form contains errors."
            },
            notYetSaved: {
                message: "Changes not yet saved!"
            },
            saved: {
                message: "Changes saved."
            }
        },
        year: "Year",
        years: "Years",
        yes: "Yes"
    },
    contacttypes: {
        phone: "Phone",
        email: "E-Mail",
        mobile: "Mobile phone",
        fax: "Fax"
    },
    country: {
        germany: "Germany",
        japan: "Japan",
        nederlands: "Netherlands",
        unitedStates: "United States"
    },
    db: {
        accounts: {
            title: "Bank accounts",
            mandates: {
                title: "SEPA direct debit mandates"
            },
            orders: {
                title: "Standing orders"
            }
        },
        articles: {
            title: "Receipt articles",
            categories: {
                title: "Article categories"
            }
        },
        cases: {
            title: "Cases",
            status: {
                title: "Case status"
            },
            types: {
                title: "Case types"
            }
        },
        classes: {
            title: "Document types",
            techname: "Technical name",
            localized: "Localized name",
            pattern: "Name pattern",
            default: "System Default",
            editor: {
                title: "Edit Document type",
                localized: "Localisation via json files",
                description: "Description",
                descriptionPlaceholder: "Full description",
                namepattern: "Filename pattern",
                namepatternPlaceholder: "Use placeholder {...} to create filenames automatically"
            }
        },
        contacts: {
            types: {
                title: "Contact Types",
                name: "Technical name",
                i18nname: "Localized name",
                icon: "Icon",
                editor: {
                    title: "Edit contact types",
                    localized: "Localisation via json files",
                    name: "Technical name",
                    icon: "Icon"
                }
            }
        },
        countries: {
            title: "Countries",
            default: "System Default",
            name: "Technical name",
            i18nname: "Localized name",
            currency: "Currency",
            key2: "Code-2",
            key3: "Code-3",
            taxrates: {
                title: "Tax rates"
            },
            editor: {
                key2: "2-digits code",
                key3: "3-digits code",
                title: "Edit countries",
                localized: "Localisation via json files"
            }
        },
        cronjobs: {
            title: "Cronjobs"
        },
        currencies: {
            title: "Currencies",
            default: "System Default",
            name: "Name",
            shortname: "Short name",
            sign: "Symbol",
            editor: {
                name: "Full Name",
                shortname: "3-digits code",
                sign: "Sign",
                title: "Edit currency"
            }
        },
        directories: {
            title: "Root directories",
            id: "Id",
            name: "Name",
            mtime: "Last Update"
        },
        expenses: {
            title: "Expenses",
            categories: {
                title: "Expense types"
            },
            templates: {
                title: "Templates"
            },
            types: {
                title: "Expense types"
            }
        },
        extensions: {
            title: "File types",
            ext: "Ext",
            options: "Options",
            displayable: "View in browser",
            downloadable: "Download",
            indexable: "Content readable (OCR)",
            isofficefile: "Office file",
            mimetype: "Mime type",
            unknownMimetype: "Unknown mime type",
            editor: {
                title: "Edit file type",
                gscommand: "GhostScript command",
                ocrcommand: "OCR command",
                returnImg: "GhostScript returns image",
                returnMimetype: "Mime type after conversion"
            }
        },
        manager: {
            title: "Data management",
            countries: "Countries",
            filesystem: "File system",
            finance: "Finance",
            files: "Files and classification",
            living: "Housing",
            parties: "Correspondents",
            system: "Administrative",
            work: "Worktime management"
        },
        meters: {
            title: "Counters"
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
            title: "Correspondents",
            addresses: {
                title: "Addresses"
            },
            banks: {
                title: "Banks"
            },
            clients: {
                title: "Clients"
            },
            contacts: {
                title: "Contact Information"
            },
            roles: {
                title: "Roles",
                name: "Technical name",
                i18nname: "Localized name"
            }
        },
        stocks: {
            title: "Stocks",
            apis: {
                title: "APIs"
            }
        },
        tags: {
            title: "Tags"
        },
        units: {
            title: "Units of measurement"
        },
        user: {
            title: "Site Users"
        },
        work: {
            customers: {
                title: "Customer"
            },
            holidays: {
                title: "Holidays"
            },
            offcategories: {
                title: "Time off types"
            },
            timecategories: {
                title: "Expense types"
            }
        }
    },
    file: {
        title: "File {0}",
        downloadButton: "Download",
        previewButton: "Preview",
        main: {
            title: "File-Information",
            dir: "Parent directory",
            name: "File name",
            created: "Created",
            deleted: "Deleted",
            size: "File size",
            pages: "Page count",
            tags: "Tags",
            tagsInputPlaceholder: "Enter any tag...",
            words: "Word count"
        },
        classify: {
            title: "Classification",
            nextFile: "Next",
            date: "Date",
            class: "Document type",
            suggestion: "Suggestion: {0} {1}%",
            case: "Case",
            caseFiletype: "Case filetype",
            caseFilestatus: "Status",
            caseFilename: "Display name",
            caseFiledesc: "Description",
            client: "Client",
            party: "Correspondent",
            taxreceipt: "Tax document",
            taxyear: "Tax year"
        },
        housekeeping: {
            title: "Organization",
            move: {
                title: "Move file",
                description: "Moves the file to another directory.",
                btn: "Select destination"
            },
            delete: {
                title: "Delete File",
                description: "Deletes the file irrevocably from the archive.",
                btn: "Delete",
                confirm: "Confirm file deletion?"
            }
        },
        errors: {
            noNextFile: {
                title: "No records",
                message: "There are no more files that require classification."
            }
        }
    },
    finance: {
        pagetitle: "Financial Dashboard"
    },
    folderbrowser: {
        title: "Browse folders",
        selected: "Selected: {0}",
        newFolder: {
            title: "New folder..."
        }
    },
    home: {
        title: "Archive home page",
        banking: {
            title: "Aktiendepot",
            pricesLink: "Kurse",
        },
        cases: {
            title: "Cases for review"
        },
        database: {
            title: "Master data",
            dbmanager: "To the database management"
        },
        inbox: {
            title: "New Documents"
        },
        readings: {
            title: "Counters",
            readingsLink: "Meter reading capture"
        },
        recentFiles: {
            title: "Latest archived Files"
        },
        special: {
            title: "Additional Features",
            notepadLink: "Notes",
            warehouseLink: "Storage",
            movingBoxesLink: "Moving boxes",
            wineCellarLink: "Wine Cellar"
        },
        stats: {
            title: "Quick Stats...",
            files1: "The archive currently manages {0} files in {1} directories with a total of {2}.",
            files2: "{0} of the files are classified, {1} are assigned to a file. No OCR text could be generated for {2} files.",
            files3: "This month {0} new files have been added.",
            casesLink: "Cases",
            filesLink: "All files",
            noclassFilesLink: "Not yet classified",
            noocrFilesLink: "No OCR",
            storageLink: "Storage"
        },
        supermarket: {
            title: "In the super market",
            priceComparison: "Price comparison and history",
            receiptsLink: "Recording of receipts",
            shoppingLink: "Shopping list"
        }
    },
    lead: {
        title: "Lead #{0}",
        common: {
            title: "General information",
            party: "Company"
        }
    },
    leads: {
        title: "Leads + Incentives",
        table: {
            head: {
                key: "[LI]",
                customer: "Customer",
                project: "Project",
                created: "Created",
                completed: "Finished",
                payed: "Paid"
            },
            data: {
                lead: "Lead",
                incentive: "Incentive"
            }
        }
    },
    listManager: {
        title: "Lists",
        filterPlaceholder: "🔍 Filter lists...",
        toggleSidebar: "Overview",
        noListSelected: {
            title: "Your Lists",
            introduction: "Select one of the lists from the bar on the left to read, check off, or edit it. Unlike notes, lists can be reset, so all checkboxes are empty again."
        },
        list: {
            addItem: "New list item",
            blankListTitle: "New List",
            checkedBelowUncheckedItems: "Move checked items below unchecked items",
            checkedBy: "Completed by {0} {1}",
            completed: "{0} completed",
            dropzone: "Drag here",
            incomplete: "{0} incomplete",
            lastModified: "Last modified: {0}",
            resetCron: "Will reset: {0}",
            resetDate: "Will reset on {0}",
            resetDateAndCron: "Will reset on {0} and {1}",
            resetManually: "Reset list"
        },
        textEditor: {
            titlePlaceholder: "Name of the list",
            descriptionPlaceholder: "Optional, detailed description for the list",
            cronResetTitle: "Automatically reset checkboxes?",
            cronResetPlaceholder: "e.g., 0 0 1 * * (Every 1st of the month)",
            cronResult: {
                never: "Never reset",
                invalid: "Invalid expression",
                valid: "Repeats: {0}"
            },
            dateResetTitle: "Reset on specific date?",
            manualResetTitle: "Manually resettable?",
            listStyle: "List type",
            listStyleUl: "Simple",
            listStyleOl: "Numbered",
            listStyleCb: "Checks"
        }
    },
    locales: {
        de: {
            title: "German"
        },
        en: {
            title: "English"
        },
        fr: {
            title: "French"
        }
    },
    login: {
        title: "User login",
        subtitle: "This website requires the input of credentials. Please login with your username and password.",
        button: "Login",
        password: "Password",
        passwordPlaceholder: "*********",
        username: "Username",
        usernamePlaceholder: "pete@archive.org",
        failed: "Error during login. Please check input and try again.",
        sessioncheck: {
            title: "User login",
            subtitle: "Please wait, the login is being checked..."
        },
        oauth2: {
            title: "User login",
            subtitle: "This website requires a login via Nextcloud. Please click on the button to proceed.",
            button: "Login"
        }
    },
    meter: {
        readings: {
            title: "Meter reading capture",
            meter: "Counters",
            value: "Value",
            modal: {
                title: "Meter reading",
                description: "In the following fields you can enter the values for the counters. Only filled fields will be saved."
            }
        },
        title: "Counters"
    },
    navbar: {
        brand: {
            title: "Archive"
        },
        finance: {
            accounts: "Accounts",
            stocks: "Stocks",
            taxYear: "Taxes in {0}"
        },
        items: {
            account: "Account",
            cases: "Cases",
            dashboard: "Dashboard",
            finance: "Finance",
            home: "Home",
            lists: "Lists",
            notepad: "Notepad",
            settings: "Settings",
            work: "Work"
        },
        search: {
            label: "Search archive",
            placeholder: "Search topic",
            submit: "Search"
        },
        showNavigationItems: {
            btnTitle: "Show navigation"
        },
        switchLocale: {
            btnTitle: "Change display language",
            smTitle: "Language"
        },
        user: {
            btnTitle: "User profile {0}",
            userProfileLink: "Show profile",
            userSettingsLink: "Settings",
            clearCacheLink: "Clear cache",
            logoutLink: "Logout"
        },
        workitems: {
            leads: "Leads",
            month: "Month View",
            year: "Years",
            settings: "Settings",
            today: "Daily Booking",
            travel: "Business Trips"
        }
    },
    notepad: {
        title: "Notes",
        filterPlaceholder: "Filter",
        markdownGuide: "Formatting using Markdown",
        notYetSaved: "Saving in {0} seconds."
    },
    notepad2: {
        title: "Notes",
        filterPlaceholder: "🔍 Search note...",
        toggleSidebar: "Overview",
        noNoteSelected: {
            title: "Your Notebook",
            introduction: "Select one of the notes from the bar on the left to read or edit it. Notes can now also be marked as private and will only be visible to the owner."
        },
        note: {
            lastModified: "Last modified: {0}"
        },
        textEditor: {
            increaseLevel: "Indent list one level",
            makeLink: "Insert link at the current position",
            makeOList: "Turn current line into a list item",
            makeUList: "Turn current line into a numbered list item",
            reduceLevel: "Outdent list one level",
            textBold: "Bold text",
            textItalic: "Italicize text",
            textStrikethrough: "Strikethrough text"
        },
        blankNoteTitle: "New note"
    },
    notifications: {
        filecreated: {
            title: "New file",
            message: "The new file {1} has just been added to the archive.",
            action: "Open"
        }
    },
    partyroles: {
        authority: "Authority",
        bank: "Bank",
        borrower: "Borrower",
        buyer: "Buyer",
        doctor: "Doctor",
        employee: "Employee",
        employer: "Employer",
        insuredperson: "Insured person",
        insurer: "Insurer",
        landlord: "Landlord",
        lender: "Lender",
        main: "Main participant",
        patient: "Patient",
        renter: "Renter",
        vendor: "Vendor"
    },
    pricecomparison: {
        title: "Price comparison and history",
        chart: "Trend over 180 days",
        time: "Period",
        range: "Price range",
        article: "Product"
    },
    receipts: {
        title: "Voucher registration",
        pagetitle: "Recording of receipts",
        client: "Buyer",
        currency: "Currency",
        date: "Date",
        party: "Trader",
        amount: "Amount",
        items: {
            title: "Items",
            article: "Product",
            quantity: "Quantity",
            singleprice: "Price",
            discount: "Discount",
            deposit: "Deposit",
            totalnet: "Total",
            summary: "Totals",
            organic: "Organic"
        },
        edit: {
            title: "Record a new receipt",
            noitems1: "No items added yet.",
            noitems2: "No item fully entered yet."
        },
        select: {
            stillediting: {
                title: "Receipt selection canceled",
                message: "The receipt change was canceled because a new receipt is currently being entered. The receipt to be entered must be saved or canceled."
            }
        }
    },
    search: {
        title: "Search",
        setup: {
            phrase: "Search terms",
            helpSearching: "More information on search strategies at mariadb.com",
            groups: {
                accounts: "Accounts",
                cases: "Cases",
                directories: "Directories",
                files: "Files (meta data)",
                pages: "File Content",
                notepad: "Notes",
                tags: "Tags"
            },
            groupstitle: "Search scope",
            runSearch: "Start search"
        },
        result: {
            title: "{0} hits",
            subtitle: "{0} hits for {1}",
            group: {
                accounts: "Accounts",
                cases: "Cases",
                directories: "Directories",
                files: "Files",
                notes: "Notes",
                tags: "Tags",
                pages: "File Content",
                onPageNo: "Page {0}",
                downloadFileTitle: "Download file",
                gotoPreviewTitle: "Jump directly to the file view"
            },
            points: "{0} P.",
            showHistoric: "hist.",
            showHistoricTooltip: "Also show older entries from history?"
        }
    },
    shopping: {
        pagetitle: "Shopping list",
        cart: {
            title: "Shopping list"
        }
    },
    stocks: {
        title: "Stocks and Crypto",
        pagetitle: "Securities overview",
        api: "API",
        bought: "Purchased",
        boughtValue: "{0} {1} each {2}",
        currency: "Currency",
        dif: "Changes",
        difrel: "in %",
        isin: "ISIN",
        isinWithValue: "ISIN: {0}",
        name: "Name",
        ordercount: "Orders",
        quantity: "Quantity",
        rate: "Price",
        rate2: "Last price",
        rate3: "Last: {0} ({1})",
        rateInputModal: {
            title: "Update rates",
            description: "Stock values can be entered manually using this form.",
            ignoreWithApi: "Ignore automatically updated stocks"
        },
        symbol: "Symbol",
        symbolWithValue: "Symbol: {0}",
        total: "Total",
        transactionsLink: "Transactions",
        updateRates: "Prices",
        value: "Value",
        wkn: "WKN"
    },
    travel: {
        createReportBtn: "Annual Report",
        pagetitle: "Business Trips",
        colActions: "Actions",
        colBegin: "Start Date",
        colEnd: "End Date",
        colLocation: "Location",
        colPerson: "Person",
        colReason: "Reason",
        pagetitleWithObj: "{0} Reise nach {1}",
        deleteTravelBtn: "Reise löschen",
        editor: {
            city: "Ort",
            country: "Land",
            location: "Ziel",
            person: "Person",
            reason: "Anlass",
            travelStart: "Von",
            travelEnd: "Bis",
            travelDuration: "Dauer",
        },
    },
    warehouse: {
        pagetitle: "Storage management",
        rooms: {
            pagetitle: "Room {0}",
            metacard: {
                title: "Settings",
                name: "Label",
                icon: "Icon"
            },
            spacescard: {
                title: "Sections"
            }
        }
    },
    work: {
        pagetitle: "Documentation of work",
        offcategories: {
            educationalLeave: "Educational leave",
            holidays: "Public Holiday",
            sick: "Sick Leave",
            specialLeave: "Special leave",
            vacation: "Vacation",
            weekend: "Weekend",
            none: "None",
            title: "Absence"
        },
        timecategories: {
            administration: "Administrative tasks",
            bugfixing: "Bug fixing",
            healthwork: "Clinic",
            meeting: "Internal meeting",
            "non-canon": "Absent",
            implementation: "Implementation",
            presales: "Presales",
            support: "Support",
            trainingself: "Further training",
            travel: "Travel",
            title: "Time category",
            ntw_travel: "Travel",
            ntw_work: "Work",
            judge: "Jury duty",
        },
    },
    workday: {
        pagetitle: "Day bookings {0}",
        daycard: {
            title: "Summary",
            booked: "Tracked"
        },
        templatescard: {
            description: "This day can be defined as a template. Saved templates can be used in the month view.",
            disabledHoliday: "This day cannot be used as a template because it is assigned as a holiday.",
            disabledOffday: "This day cannot be used as a template because it is assigned as an absence.",
            existingItem: "The selected day is saved as the template «{0}». Saving again will overwrite the existing entry.",
            pickFlexItemLabel: "Select Flex Item",
            templateNamePlaceholder: "🖋️ Template Name",
            title: "Template Management",
            weekLink: "To Month View"
        },
        tracked: {
            title: "Today's tracked time",
            description: "Description",
            fromUntil: "{0} to {1}",
            fromUntilTitle: "From - To"
        },
        tracking: {
            title: "Time tracking",
            liveTitle: "Live time tracking",
            livebtn: "Live",
            livebtnTitle: "Live tracking function",
            common: {
                break: "Start Break",
                breakShort: "Break",
                breakPlaceholder: "mm",
                customer: "Customer",
                description: "Description of the work performed",
                duration: "Work Time",
                durationLong: "Work Time (hours)",
                durationShort: "Total",
                from: "From",
                project: "Customer Project",
                recentTitle: "Click to adopt this data",
                task: "Task Package",
                timeCategory: "Category",
                timePlaceholder: "hh:mm | hhmm | hmm",
                until: "Until"
            },
            createCustomer: {
                title: "New customer",
                nameTitle: "Customer name",
                namePlaceholder: "Please specify..."
            },
            live: {},
            recentBookings: {
                title: "Frequently Used (60 Days)",
                filter: "🔍 Filter...",
            }
        }
    },
    workmonth: {
        pagetitle: "Monthly calendar {0}",
        pagetitleShort: "{0}",
        calendar: {
            title: "Calendar"
        },
        cards: {
            day: {
                title: "Details for day {0}",
                noBookings: "No entries"
            },
            target: {
                title: "Info",
                businessDays: "Business days",
                offDays: "WE / HD",
                lastEdit: "Last Update",
                lastEditShort: "Last update"
            },
            time: {
                title: "Logged Hours",
                takeover: "Carry Forward",
                balance: "Balance",
                carryover: "Carryover",
                booked: "Logged",
                target: "Target"
            }
        },
        offtime: {
            title: "Submit time off",
            subtitle: "Daily off time resets the day's target hours to 0.\nThere are no bookings allowed for off time days."
        }
    },
    workyear: {
        pagetitle: "Overview of All Years",
        addYear: {
            btnText: "Create {0}",
            yearOpenToastTitle: "Notice",
            yearOpenToastMessage: "Please complete the year {0} before creating a new one."
        },
        table: {
            yearHeader: {
                year: "Year",
                closetime: "Closing"
            },
            monthHeader: {
                month: "Month",
                days: "Days",
                holidays: "Holidays",
                weekenddays: "WE",
                starttime: "Start",
                diftime: "Diff",
                closetime: "Closing"
            }
        },
        incompleteYear: {
            warnMessage: "Not all months are configured!",
            btnText: "Generate Now"
        }
    }
}
