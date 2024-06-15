export type L10nArchiveLocale = {
    accounts: {
        pagetitle: string,
    },
    authService: {
        apiError: {
            title: string,
            message: string
        },
        notModified: {
            title: string,
            message: string
        }
    },
    calendar: {
        showAsGridTitle: string,
        showAsListTitle: string,
        showWeek: string,
        showWeekTitle: string,
        showWeekend: string,
        showWeekendTitle: string,
        weekday: string,
        duration: {
            short: string
        },
        holidays: {
            ascension_day: string,
            boxing_day: string,
            christmas_day: string,
            easter_goodFriday: string,
            easter_monday: string,
            easter_sunday: string,
            labor_day: string,
            newYearsDay: string,
            reformation_day: string,
            unity_day: string,
            whit_monday: string,
            whit_sunday: string
        }
    },
    case: {
        title: string,
        pagetitleNocase: string,
        pagetitle_: string,
        pagetitle_childs: string,
        pagetitle_files: string,
        pagetitle_times: string,
        metacard: {
            title: string,
            shorttitle: string,
            name: string,
            parent: string,
            noparent: string,
            created: string,
            deleted: string,
            filecount: string,
            followup: string,
            type: string,
            status: string,
            nextstatus: string,
            client: string,
            party: string,
            comment: string
        },
        childscard: {
            title: string
        },
        filescard: {
            title: string
        },
        timecard: {
            title: string,
            notifyUpcoming: string,
            notifyForecast: string,
            start: string,
            end: string,
            minperiod: string,
            period: string,
            termination: string
        }
    },
    casefilestatus: {
        approved: string,
        checked: string,
        new: string
    },
    casefiletypes: {
        draft: string,
        signed_draft: string,
        contract: string,
        termination_draft: string,
        termination: string
    },
    cases: {
        title: string,
        pagetitle: string,
        filescount: string[],
        reference: string,
        showDeleted: string,
        showInRetention: string
    },
    casestatus: {
        created: string,
        draft: string,
        draftsign: string,
        entered: string,
        active: string,
        activeexpiring: string,
        activenoncontributory: string,
        activeterminated: string,
        activeterminating: string,
        cancelled: string,
        expired: string,
        terminated: string,
        retentiondeletion: string,
        retentionhidden: string,
        todelete: string,
        waitforstart: string
    },
    casetype: {
        apartment: string,
        bankaccounts: string,
        car: string,
        carbusiness: string,
        communication: string,
        consumables: string,
        contracts: string,
        damage: string,
        insurance: string,
        legals: string,
        misc: string,
        repair: string,
        studies: string,
        taxes: string,
        work: string
    },
    classify: {
        classes: {
            Banking_AccountReport: string,
            Banking_AnnualMeeting: string,
            Banking_AnnualReport: string,
            Banking_AnnualStmt: string,
            Banking_BuyOrders: string,
            Banking_CancelOrders: string,
            Banking_CostStmt: string,
            Banking_DepositStatement: string,
            Banking_Earnings: string,
            Banking_LossOffSetting: string,
            Banking_SellOrders: string,
            Banking_Stmt: string,
            Claim_Settlement: string,
            Contract_Adjustment: string,
            Contract_Amendment: string,
            Contract_Application: string,
            Contract_Information: string,
            Contract_Proposal: string,
            Contract_Protocol: string,
            Contract_Renewal: string,
            Contract_Termination: string,
            Contract_ToS: string,
            Contract: string,
            Finance_CreditNote: string,
            Finance_Donation: string,
            Finance_Invoice: string,
            Finance_Reminder: string,
            General_AnnualReport: string,
            General_Approval: string,
            General_DeliveryNote: string,
            General_DeviceInfo: string,
            General_IdDocuments: string,
            General_Letter: string,
            General_Manuals: string,
            General_Order: string,
            General_OrderConfirmation: string,
            General_Unclassified: string,
            Health_Medication: string,
            Health_Report: string,
            Home_AnnualSettlement: string,
            Home_MeterReading: string,
            Insurance_AnnualReport: string,
            Insurance_Stmt: string,
            Job_AnnualBonus: string,
            Job_AnnualPayroll: string,
            Job_Application: string,
            Job_Certificate: string,
            Job_CoD: string,
            Job_Expenses_Clearing: string,
            Job_Incentives_Status: string,
            Job_PaySlip: string,
            Job_PaySlip2: string,
            Legal_Deed: string,
            Legal_LayJudge_CompensationForm: string,
            Legal_LayJudge_InvitationTrial: string,
            Legal_LayJudge_ReservedDates: string,
            Legal_Mandate: string,
            Legal_Notice: string,
            Pension_AnnualReport: string,
            Public_Application: string,
            Public_BallotDocs: string,
            Security_Credentials: string,
            In_PerformanceReport: string,
            In_PostReceipt: string,
            In_QuarterReport: string,
            In_Receipt: string,
            In_Receipt2: string,
            In_Rejection: string,
            In_RepairOrder: string,
            In_RepairReport: string,
            In_Request: string,
            In_Statement: string,
            In_Stock_Info: string,
            In_TaxAssessment: string,
            In_TaxReceipt: string,
            In_TaxReport: string,
            In_TaxTravelDocumentation: string,
            In_TaxVL: string,
            In_TicketEntrance: string,
            In_TicketTransport: string,
            In_TrafficTicket: string,
            In_VacationResp: string,
            In_VaccinationCertificate: string,
            In_Voucher: string,
            LeaseAgreement: string,
            NewCard: string,
            Out_ClaimReport: string,
            Out_Contradiction: string,
            Out_ExpenseReport: string,
            Out_Inquiry: string,
            Out_Questionnaire: string,
            Out_Revocation: string,
            Out_SepaMandate: string,
            Out_TaxDeclaration: string,
            Out_Termination: string,
            RentalAgreement: string,
            Trash: string
        }
    },
    common: {
        add: string,
        back: string,
        cancel: string,
        change: string,
        confirm: {
            askDeletion: string,
            delete: {
                title: string,
                message: string
            },
            deletion: {
                title: string,
                message: string,
                closeModal: string,
                confirm: string,
                cancel: string
            },
            save: {
                title: string,
                message: string
            }
        },
        date: string,
        day: string,
        days: string,
        default: string,
        delete: string,
        goto: string,
        hour: string,
        hours: string,
        minute: string,
        minutes: string,
        month: string,
        months: string,
        no: string,
        none: string,
        novalue: string,
        pcs: string,
        period: {
            placeholder: string,
            patternYears: string,
            patternMonths: string,
            patternDays: string,
            patternTime: string
        },
        save: string,
        second: string,
        seconds: string,
        select: {
            pickOne: string,
            pickedNone: string
        },
        switchTo: string,
        today: string,
        warn: {
            formInvalid: {
                title: string,
                message: string
            },
            notYetSaved: {
                message: string
            },
            saved: {
                message: string
            }
        },
        year: string,
        years: string,
        yes: string
    },
    contacttypes: {
        phone: string,
        email: string,
        mobile: string,
        fax: string
    },
    country: {
        germany: string,
        japan: string,
        nederlands: string,
        unitedStates: string
    },
    db: {
        accounts: {
            title: string,
            mandates: {
                title: string
            },
            orders: {
                title: string
            }
        },
        articles: {
            title: string,
            categories: {
                title: string
            }
        },
        cases: {
            title: string,
            status: {
                title: string
            },
            types: {
                title: string
            }
        },
        classes: {
            title: string,
            techname: string,
            localized: string,
            pattern: string,
            default: string,
            editor: {
                title: string,
                localized: string,
                description: string,
                descriptionPlaceholder: string,
                namepattern: string,
                namepatternPlaceholder: string
            }
        },
        contacts: {
            types: {
                title: string,
                name: string,
                i18nname: string,
                icon: string,
                editor: {
                    title: string,
                    localized: string,
                    name: string,
                    icon: string
                }
            }
        },
        countries: {
            title: string,
            default: string,
            name: string,
            i18nname: string,
            currency: string,
            key2: string,
            key3: string,
            taxrates: {
                title: string
            },
            editor: {
                key2: string,
                key3: string,
                title: string,
                localized: string
            }
        },
        cronjobs: {
            title: string
        },
        currencies: {
            title: string,
            default: string,
            name: string,
            shortname: string,
            sign: string,
            editor: {
                name: string,
                shortname: string,
                sign: string,
                title: string
            }
        },
        directories: {
            title: string,
            id: string,
            name: string,
            mtime: string
        },
        expenses: {
            title: string,
            categories: {
                title: string
            },
            templates: {
                title: string
            },
            types: {
                title: string
            }
        },
        extensions: {
            title: string,
            ext: string,
            options: string,
            displayable: string,
            downloadable: string,
            indexable: string,
            isofficefile: string,
            mimetype: string,
            unknownMimetype: string,
            editor: {
                title: string,
                gscommand: string,
                ocrcommand: string,
                returnImg: string,
                returnMimetype: string
            }
        },
        manager: {
            title: string,
            countries: string,
            filesystem: string,
            finance: string,
            files: string,
            living: string,
            parties: string,
            system: string,
            work: string
        },
        meters: {
            title: string
        },
        mimetypes: {
            title: string
        },
        oauth: {
            services: {
                title: string
            }
        },
        parties: {
            title: string,
            addresses: {
                title: string
            },
            banks: {
                title: string
            },
            clients: {
                title: string
            },
            contacts: {
                title: string
            },
            roles: {
                title: string,
                name: string,
                i18nname: string
            }
        },
        stocks: {
            title: string,
            apis: {
                title: string
            }
        },
        tags: {
            title: string
        },
        units: {
            title: string
        },
        user: {
            title: string
        },
        work: {
            customers: {
                title: string
            },
            holidays: {
                title: string
            },
            offcategories: {
                title: string
            },
            timecategories: {
                title: string
            }
        }
    },
    file: {
        title: string,
        downloadButton: string,
        previewButton: string,
        main: {
            title: string,
            dir: string,
            name: string,
            created: string,
            deleted: string,
            size: string,
            pages: string,
            tags: string,
            tagsInputPlaceholder: string,
            words: string
        },
        classify: {
            title: string,
            nextFile: string,
            date: string,
            class: string,
            suggestion: string,
            case: string,
            caseFiletype: string,
            caseFilestatus: string,
            caseFilename: string,
            caseFiledesc: string,
            client: string,
            party: string,
            taxreceipt: string,
            taxyear: string
        },
        housekeeping: {
            title: string,
            move: {
                title: string,
                description: string,
                btn: string
            },
            delete: {
                title: string,
                description: string,
                btn: string,
                confirm: string
            }
        },
        errors: {
            noNextFile: {
                title: string,
                message: string
            }
        }
    },
    finance: {
        pagetitle: string
    },
    folderbrowser: {
        title: string,
        selected: string,
        newFolder: {
            title: string
        }
    },
    home: {
        title: string,
        cases: {
            title: string
        },
        database: {
            title: string,
            dbmanager: string
        },
        inbox: {
            title: string
        },
        readings: {
            title: string,
            readingsLink: string
        },
        recentFiles: {
            title: string,
        },
        special: {
            title: string,
            notepadLink: string,
            warehouseLink: string,
            movingBoxesLink: string,
            wineCellarLink: string
        },
        stats: {
            title: string,
            files1: string,
            files2: string,
            files3: string,
            casesLink: string,
            filesLink: string,
            noclassFilesLink: string,
            noocrFilesLink: string,
            storageLink: string
        },
        supermarket: {
            title: string,
            priceComparison: string,
            receiptsLink: string,
            shoppingLink: string
        }
    },
    lead: {
        title: string,
        common: {
            title: string,
            party: string
        }
    },
    leads: {
        title: string,
        table: {
            head: {
                key: string,
                customer: string,
                project: string,
                created: string,
                completed: string,
                payed: string
            },
            data: {
                lead: string,
                incentive: string
            }
        }
    },
    listManager: {
        title: string,
        filterPlaceholder: string,
        toggleSidebar: string,
        noListSelected: {
            title: string,
            introduction: string
        },
        list: {
            lastModified: string,
            resetManually: string,
            checkedBy: string
        },
        textEditor: {
            titlePlaceholder: string,
            descriptionPlaceholder: string,
            cronResetTitle: string,
            cronResetPlaceholder: string,
            dateResetTitle: string,
            dateResetPlaceholder: string,
            manualResetTitle: string,
            listStyle: string,
            listStyleUl: string,
            listStyleOl: string,
            listStyleCb: string
        }
    },
    locales: {
        de: {
            title: string
        },
        en: {
            title: string
        },
        fr: {
            title: string
        }
    },
    login: {
        title: string,
        subtitle: string,
        button: string,
        password: string,
        passwordPlaceholder: string,
        username: string,
        usernamePlaceholder: string,
        failed: string,
        sessioncheck: {
            title: string,
            subtitle: string
        },
        oauth2: {
            title: string,
            subtitle: string,
            button: string
        }
    },
    meter: {
        readings: {
            title: string,
            meter: string,
            value: string,
            modal: {
                title: string,
                description: string
            }
        },
        title: string
    },
    navbar: {
        brand: {
            title: string
        },
        finance: {
            accounts: string,
            stocks: string,
            taxYear: string
        },
        items: {
            account: string,
            cases: string,
            dashboard: string,
            finance: string,
            home: string,
            lists: string,
            notepad: string,
            settings: string,
            work: string
        },
        search: {
            label: string,
            placeholder: string,
            submit: string
        },
        showNavigationItems: {
            btnTitle: string
        },
        switchLocale: {
            btnTitle: string,
            smTitle: string
        },
        user: {
            btnTitle: string,
            userProfileLink: string,
            userSettingsLink: string,
            clearCacheLink: string,
            logoutLink: string
        },
        workitems: {
            leads: string,
            month: string,
            year: string,
            settings: string,
            today: string
        }
    },
    notepad: {
        title: string,
        filterPlaceholder: string,
        markdownGuide: string,
        notYetSaved: string
    },
    notepad2: {
        title: string,
        filterPlaceholder: string,
        toggleSidebar: string,
        noNoteSelected: {
            title: string,
            introduction: string,
        },
        note: {
            lastModified: string,
        },
        textEditor: {
            increaseLevel: string,
            makeLink: string,
            makeOList: string,
            makeUList: string,
            reduceLevel: string,
            textBold: string,
            textItalic: string,
            textStrikethrough: string,
        }
    },
    notifications: {
        filecreated: {
            title: string,
            message: string,
            action: string
        }
    },
    partyroles: {
        authority: string,
        bank: string,
        borrower: string,
        buyer: string,
        doctor: string,
        employee: string,
        employer: string,
        insuredperson: string,
        insurer: string,
        landlord: string,
        lender: string,
        main: string,
        patient: string,
        renter: string,
        vendor: string
    },
    pricecomparison: {
        title: string,
        chart: string,
        time: string,
        range: string,
        article: string
    },
    receipts: {
        title: string,
        pagetitle: string,
        client: string,
        currency: string,
        date: string,
        party: string,
        amount: string,
        items: {
            title: string,
            article: string,
            quantity: string,
            singleprice: string,
            discount: string,
            deposit: string,
            totalnet: string,
            summary: string,
            organic: string
        },
        edit: {
            title: string,
            noitems1: string,
            noitems2: string
        },
        select: {
            stillediting: {
                title: string,
                message: string
            }
        }
    },
    search: {
        title: string,
        setup: {
            phrase: string,
            helpSearching: string,
            groups: {
                accounts: string,
                cases: string,
                directories: string,
                files: string,
                pages: string,
                notepad: string,
                tags: string
            },
            groupstitle: string,
            runSearch: string
        },
        result: {
            title: string,
            subtitle: string,
            group: {
                accounts: string,
                cases: string,
                directories: string,
                files: string,
                notes: string,
                tags: string,
                pages: string,
                onPageNo: string,
                downloadFileTitle: string,
                gotoPreviewTitle: string
            },
            points: string,
            showHistoric: string,
            showHistoricTooltip: string
        }
    },
    shopping: {
        pagetitle: string,
        cart: {
            title: string
        }
    },
    stocks: {
        title: string,
        pagetitle: string,
        api: string,
        bought: string,
        boughtValue: string,
        currency: string,
        dif: string,
        difrel: string,
        isin: string,
        isinWithValue: string,
        name: string,
        ordercount: string,
        quantity: string,
        rate: string,
        rate2: string,
        rate3: string,
        rateInputModal: {
            title: string,
            description: string,
            ignoreWithApi: string
        },
        symbol: string,
        symbolWithValue: string,
        total: string,
        transactionsLink: string,
        updateRates: string,
        value: string,
        wkn: string
    },
    warehouse: {
        pagetitle: string,
        rooms: {
            pagetitle: string,
            metacard: {
                title: string,
                name: string,
                icon: string
            },
            spacescard: {
                title: string
            }
        }
    },
    work: {
        pagetitle: string,
        offcategories: {
            educationalLeave: string,
            holidays: string,
            sick: string,
            specialLeave: string,
            vacation: string,
            weekend: string,
            none: string,
            title: string
        },
        timecategories: {
            administration: string,
            bugfixing: string,
            meeting: string,
            "non-canon": string,
            implementation: string,
            presales: string,
            support: string,
            trainingself: string,
            travel: string,
            title: string
        }
    },
    workday: {
        pagetitle: string,
        daycard: {
            title: string,
            booked: string
        },
        tracked: {
            title: string,
            description: string,
            fromUntil: string,
            fromUntilTitle: string
        },
        tracking: {
            title: string,
            liveTitle: string,
            livebtn: string,
            livebtnTitle: string,
            common: {
                break: string,
                breakShort: string,
                breakPlaceholder: string,
                customer: string,
                description: string,
                duration: string,
                durationShort: string,
                from: string,
                project: string,
                recentTitle: string,
                task: string,
                timeCategory: string,
                timePlaceholder: string,
                until: string
            },
            createCustomer: {
                title: string,
                nameTitle: string,
                namePlaceholder: string
            },
            live: {}
        }
    },
    workmonth: {
        pagetitle: string,
        pagetitleShort: string,
        calendar: {
            title: string
        },
        cards: {
            day: {
                title: string
            },
            target: {
                title: string,
                businessDays: string,
                offDays: string,
                lastEdit: string,
                lastEditShort: string
            },
            time: {
                title: string,
                takeover: string,
                balance: string,
                carryover: string
            }
        },
        offtime: {
            title: string,
            subtitle: string
        }
    },
    workyear: {
        pagetitle: string,
        addYear: {
            btnText: string,
            yearOpenToastTitle: string,
            yearOpenToastMessage: string,
        },
        table: {
            yearHeader: {
                year: string,
                closetime: string,
            },
            monthHeader: {
                month: string,
                days: string,
                holidays: string,
                weekenddays: string,
                starttime: string,
                diftime: string,
                closetime: string,
            },
        },
        incompleteYear: {
            warnMessage: string,
            btnText: string,
        }
    }
}