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
        apartment: "Residential",
        bankaccounts: "Bank and accounts",
        car: "Car",
        carbusiness: "Company Vehicle",
        communication: "Communication",
        consumables: "Consumables",
        contracts: "Contracts",
        damage: "Damage",
        insurance: "Insurances",
        legals: "Legal cases",
        misc: "Miscellaneous",
        repair: "Repair and maintenance",
        studies: "Education and studies",
        taxes: "Taxes",
        work: "Work"
    },
    classify: {
        classes: {
            Banking_AccountReport: "Account report",
            Banking_AnnualMeeting: "Annual meeting",
            Banking_AnnualReport: "Annual report (account)",
            Banking_AnnualStmt: "Annual account statement",
            Banking_BuyOrders: "Securities purchase",
            Banking_CancelOrders: "Securities cancellation",
            Banking_CostStmt: "Statement of costs",
            Banking_DepositStatement: "Deposit statement",
            Banking_Earnings: "Income from banking/securities transactions",
            Banking_LossOffSetting: "Loss off-setting",
            Banking_SellOrders: "Securities sale",
            Banking_Stmt: "Bank Statement",
            Claim_Settlement: "Claims settlement",
            Contract_Adjustment: "Contract changes",
            Contract_Amendment: "Contract amendment",
            Contract_Application: "Contract application",
            Contract_Information: "General information",
            Contract_Proposal: "Contract proposal",
            Contract_Protocol: "Consultation protocol",
            Contract_Renewal: "Contract Renewal",
            Contract_Termination: "Confirmation of termination, dissolution",
            Contract_ToS: "Terms of Service",
            Contract: "Contract",
            Finance_CreditNote: "Credit note",
            Finance_Donation: "Donation receipt",
            Finance_Invoice: "Invoice",
            Finance_Reminder: "Reminder",
            General_AnnualReport: "Annual Report",
            General_Approval: "Release / Approval",
            General_DeliveryNote: "Delivery Note",
            General_DeviceInfo: "Device data, serial numbers, etc",
            General_IdDocuments: "Id card, etc.",
            General_Letter: "Cover letter",
            General_Manuals: "User manual",
            General_Order: "Order",
            General_OrderConfirmation: "Order/purchase confirmation",
            General_Unclassified: "General inbox",
            Health_Medication: "Prescription (remedies/medications)",
            Health_Report: "Medical report",
            Home_AnnualSettlement: "Settlement of incidental rental costs",
            Home_MeterReading: "Meter reading",
            Insurance_AnnualReport: "Annual report (insurance)",
            Insurance_Stmt: "Registration confirmation social security",
            Job_AnnualBonus: "Annual bonus, special payments, etc.",
            Job_AnnualPayroll: "Income tax certificate",
            Job_Application: "Application",
            Job_Certificate: "Certificate, certificate of attendance",
            Job_CoD: "Certificate of disability",
            Job_Expenses_Clearing: "Release/reimbursement expense report",
            Job_Incentives_Status: "Lead/Incentive Status",
            Job_PaySlip: "Payroll",
            Job_PaySlip2: "Payroll",
            Legal_Deed: "Notarized document",
            Legal_LayJudge_InvitationTrial: "Lay judge: Invitation to main hearing",
            Legal_LayJudge_ReservedDates: "Lay judge: Possible dates in the year",
            Legal_Mandate: "Power of attorney, mandate",
            Legal_Notice: "Notice of Proceedings",
            Pension_AnnualReport: "Annual report (pension)",
            Public_Application: "Application for public office",
            Public_BallotDocs: "Election documents",
            Security_Credentials: "Access data, credentials, passwords",
            In_PerformanceReport: "Performance Report",
            In_PostReceipt: "Proof of posting Post/Parcel",
            In_QuarterReport: "Quarterly financial statements",
            In_Receipt: "Receipt",
            In_Receipt2: "Receipt",
            In_Rejection: "Rejection, rejection notice",
            In_RepairOrder: "Repair Order",
            In_RepairReport: "Repair report",
            In_Request: "Application",
            In_Statement: "General statement",
            In_Stock_Info: "Stock information",
            In_TaxAssessment: "Tax assessment",
            In_TaxReceipt: "Tax Receipt",
            In_TaxReport: "Tax Report",
            In_TaxTravelDocumentation: "Travel documentation",
            In_TaxVL: "Tax return Annex VL",
            In_TicketEntrance: "Entrance Ticket",
            In_TicketTransport: "Transport Ticket",
            In_TrafficTicket: "Speed camera, parking ticket, traffic offense",
            In_VacationResp: "Vacation, sick, overtime",
            In_VaccinationCertificate: "Vaccination Certificate",
            In_Voucher: "Voucher",
            LeaseAgreement: "Lease Agreement",
            NewCard: "New card with cover letter",
            Out_ClaimReport: "Damage report",
            Out_Contradiction: "Contradiction",
            Out_ExpenseReport: "Expense report and receipts",
            Out_Inquiry: "Inquiry",
            Out_Questionnaire: "Questionnaire",
            Out_Revocation: "Revocation",
            Out_SepaMandate: "SEPA direct debit mandate",
            Out_TaxDeclaration: "Tax declaration",
            Out_Termination: "Termination",
            RentalAgreement: "Rental Agreement",
            Trash: "Trash"
        }
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
            notepad: "Notes",
            notepad2: "Notes (new)",
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
            month: "Monthly View",
            year: "Years",
            settings: "Settings",
            today: "Daily Booking"
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
        hideSidebar: "Hide"
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
            administration: "Administration",
            bugfixing: "Bug fixing",
            meeting: "Meeting",
            "non-canon": "Absent",
            implementation: "Implementation",
            presales: "Presales",
            support: "Support",
            trainingself: "Advanced training",
            travel: "Travel time",
            title: "Category"
        }
    },
    workday: {
        pagetitle: "Day bookings {0}",
        daycard: {
            title: "Summary",
            booked: "Tracked"
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
                break: "Minus break",
                breakShort: "Break",
                breakPlaceholder: "mm",
                customer: "Customer",
                description: "Description of the work carried out",
                duration: "Working hours",
                durationShort: "Total",
                from: "Of",
                project: "Customer project",
                recentTitle: "Click to apply",
                task: "Work package",
                timeCategory: "Category",
                timePlaceholder: "hh:mm | hmm | hmm",
                until: "To"
            },
            createCustomer: {
                title: "New customer",
                nameTitle: "Customer name",
                namePlaceholder: "Please specify..."
            },
            live: {}
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
                title: "Details for day {0}"
            },
            target: {
                title: "Info",
                businessDays: "Business days",
                offDays: "WE / HD",
                lastEdit: "Last Update",
                lastEditShort: "Last update"
            },
            time: {
                title: "Booked time",
                takeover: "Take-over",
                balance: "Balance",
                carryover: "Carry-over"
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
