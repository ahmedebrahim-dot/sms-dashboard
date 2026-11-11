// ============================================================================
// 1. REAL-TIME GOOGLE SHEET CSV ENDPOINTS
// ============================================================================
const PUBLISHED_DOC_BASE = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQKGSPg_3YdMDT3SwzLtdq0xrfQkcOhSKJybGBnPymRghdp874-pQZTtkSkJ4-pORbX6b8nC04ONDzs";
const LIVE_DATA_CSV_URL = `${PUBLISHED_DOC_BASE}/pub?output=csv`;
const LIVE_PUBHTML_URL = `${PUBLISHED_DOC_BASE}/pubhtml`;

let currentLang = "en";
let isDarkMode = false;
let selectedApiPill = "ALL";
let deferredInstallPrompt = null;

// ============================================================================
// 2. BILINGUAL DICTIONARY (AR / EN)
// ============================================================================
const i18n = {
  en: {
    badgeQA: "Pharmaceutical QA & Supply Chain BI",
    liveSyncText: "Live Synced with Google Sheet",
    mainTitle: "Supplier Qualification Management System",
    subTitle: "Real-Time Google Sheets Pipeline — Active Pharmaceutical Ingredients (API), QC Lots & Matched Oracle ERP Codes",
    installAppBtn: "Install App",
    darkModeBtn: "Dark Mode",
    lightModeBtn: "Light Mode",
    syncBtn: "Fetch Live Sheet Now",
    exportBtn: "Export Excel/CSV",
    kpiTotal: "Total Suppliers",
    kpiClickAll: "View All",
    kpiCompliance: "Qualification Rate",
    kpiApproved: "Approved & New",
    kpiQualified: "Fully Qualified",
    kpiQualifiedSub: "Verified",
    kpiHold: "On Hold / Action",
    kpiHoldSub: "Docs / Quest.",
    kpiCodesCard: "Completed Codes",
    filterPanelTitle: "Advanced Multi-Criteria Search & Interactive BI Slicers",
    resetFiltersBtn: "Reset All Slicers",
    lblSearchMaterial: "1. Search by Active Material (API)",
    phSearchMaterial: "Type API (e.g. Carvedilol, Hydroquinone, Rifaximin)...",
    lblSearchCode: "2. Search by Code (RM / Oracle / QC# / Lot)",
    phSearchCode: "Type Code (e.g. RM101-012, 11DSJCVAAAA, R230196)...",
    lblSearchSupplier: "3. Search Supplier or Finished Product",
    phSearchSupplier: "e.g. CTX, Hetero, Medilux, Carvedilol...",
    lblStatusSlicer: "4. QA Status",
    lblNextEvalSlicer: "5. Next Eval",
    optAllStatuses: "All Statuses",
    optCompletedOnly: "Completed Only",
    optAllDates: "All Dates",
    quickApiPills: "Quick Active Material (API) Filter:",
    tab1Title: "1. Executive BI & Supplier Register",
    tab2Title: "2. Completed Material Codes (Sheet 2)",
    tab3Title: "3. QC Batch & Lot Traceability Explorer",
    chart1Title: "Qualification Status Breakdown",
    chart1Sub: "Click any slice to filter the dashboard",
    chart2Title: "Received QC Batches per Active Material",
    chart2Sub: "Click any bar to filter by Active Material",
    chart3Title: "2027 Re-Evaluation Schedule",
    chart3Sub: "Upcoming QA periodic re-evaluation months",
    masterTableTitle: "Master Supplier Qualification & Active Material Register (Live Synced)",
    masterTableSub: "Any new row added to your Google Sheet automatically appears here and links to its Sheet 2 RM & Oracle Code.",
    thSupplier: "Supplier Name & Origin",
    thMaterial: "Active Material (API)",
    thCodes: "RM Code & Oracle Code",
    thProduct: "Finished Product",
    thStatus: "QA Status",
    thBatches: "QC Batches / Lots",
    thDoneEval: "Done Eval",
    thNextEval: "Next Eval",
    thRemarks: "QA Remarks / Status",
    codesHeaderTitle: "Completed Material Codes Directory (Auto-Matched from Sheet 2: Codes)",
    codesHeaderSub: "Automatically matches any new material added in Sheet 1 with its RM Code and Oracle Code from Sheet 2.",
    chkStrictCompleted: "Strictly Completed Evaluations Only (Hide On-Hold)",
    thRMCode: "RM Code",
    thOracleCode: "Oracle Item Code",
    thSheet2Name: "Sheet 2 Official Material Name",
    thSheet1Name: "Data Sheet API Name",
    thLinkedProduct: "Finished Product",
    thLinkedSuppliers: "Qualified Supplier(s)",
    thCopyCode: "Copy Code",
    batchExplorerTitle: "Individual QC Batch & Supplier Lot Traceability Log",
    batchExplorerSub: "Searchable flat record of every single receiving date, QC number, and supplier batch number.",
    thQCNo: "QC Number",
    thLotNo: "Supplier Batch / Lot No.",
    thRecDate: "Receiving Date",
    printCertBtn: "Print QA Dossier",
    modalBatchHistoryTitle: "Complete Receiving Dates, QC Numbers & Supplier Batch History",
    closeBtn: "Close Window",
    statusApproved: "Approved",
    statusNewApproved: "New \\ Approved",
    statusQualified: "Qualified",
    statusHold: "On Hold",
    completedText: "Evaluation Completed",
    noBatchesText: "No Physical Batches (NA)",
    allPillsText: "All APIs"
  },
  ar: {
    badgeQA: "نظام توكيد الجودة وتأهيل الموردين — Live BI",
    liveSyncText: "متصل ومحدث تلقائياً من Google Sheet",
    mainTitle: "Supplier Qualification Management System",
    subTitle: "ربط حي ومباشر مع جوجل شيت — تأهيل موردي المواد الفعالة (API)، تتبع تشغيلات الـ QC، وأكواد أوراكل",
    installAppBtn: "تثبيت التطبيق",
    darkModeBtn: "الوضع الليلي",
    lightModeBtn: "الوضع النهاري",
    syncBtn: "تحديث فوري من الشيت",
    exportBtn: "تصدير Excel/CSV",
    kpiTotal: "إجمالي الموردين",
    kpiClickAll: "عرض الكل",
    kpiCompliance: "نسبة إنجاز التأهيل",
    kpiApproved: "معتمد (Approved & New)",
    kpiQualified: "مؤهل بالكامل (Qualified)",
    kpiQualifiedSub: "معتمد",
    kpiHold: "معلق / قيد الاستكمال",
    kpiHoldSub: "مستندات / استبيان",
    kpiCodesCard: "أكواد الخامات المكتملة",
    filterPanelTitle: "البحث المتقدم والفلاتر التفاعلية الذكية (Power BI Slicers)",
    resetFiltersBtn: "إعادة ضبط الفلاتر",
    lblSearchMaterial: "1. بحث باسم المادة الفعالة (Active Material)",
    phSearchMaterial: "اكتب اسم المادة (مثل Carvedilol, Hydroquinone, Rifaximin)...",
    lblSearchCode: "2. بحث بالكود (RM Code / Oracle / QC# / Batch)",
    phSearchCode: "اكتب الكود (مثل RM101-012 أو 11DSJCVAAAA أو R230196)...",
    lblSearchSupplier: "3. بحث باسم المورد أو المستحضر النهائي",
    phSearchSupplier: "مثال: CTX, Hetero, Medilux, Carvedilol...",
    lblStatusSlicer: "4. حالة التأهيل",
    lblNextEvalSlicer: "5. التقييم القادم",
    optAllStatuses: "كل الحالات",
    optCompletedOnly: "المكتمل فقط",
    optAllDates: "كل التواريخ",
    quickApiPills: "فلتر سريع بالمادة الفعالة (API):",
    tab1Title: "1. الداشبورد التنفيذية وسجل تأهيل الموردين",
    tab2Title: "2. أكواد المواد الفعالة المكتملة (الصفحة الثانية)",
    tab3Title: "3. سجل تتبع تشغيلات الـ QC وتواريخ الاستلام",
    chart1Title: "توزيع حالات تأهيل الموردين",
    chart1Sub: "اضغط على أي جزء لفلترة الجدول تلقائياً",
    chart2Title: "عدد التشغيلات المستلمة لكل مادة فعالة",
    chart2Sub: "اضغط على أي عمود للفلترة بالمادة الفعالة",
    chart3Title: "الجدول الزمني لإعادة التقييم (2027)",
    chart3Sub: "توزيع مواعيد إعادة تقييم الموردين حسب الشهر",
    masterTableTitle: "السجل الرئيسي لتأهيل الموردين والمواد الفعالة (مربوط لايف بالشيت)",
    masterTableSub: "أي صف جديد تضيفه في جوجل شيت يظهر هنا تلقائياً ويتربط بكود الخامة وكود أوراكل من الصفحة الثانية.",
    thSupplier: "اسم المورد والدولة",
    thMaterial: "المادة الفعالة (API)",
    thCodes: "كود الخامة وكود أوراكل",
    thProduct: "المستحضر (Product)",
    thStatus: "حالة الاعتماد",
    thBatches: "التشغيلات (QC Lots)",
    thDoneEval: "تاريخ التقييم",
    thNextEval: "التقييم القادم",
    thRemarks: "ملاحظات الجودة",
    codesHeaderTitle: "دليل أكواد المواد الفعالة المكتملة فقط (مفلتر تلقائياً من صفحة Codes)",
    codesHeaderSub: "يطابق تلقائياً أي مادة جديدة تضيفها في شيت الداتا مع الكود الخاص بها في صفحة الأكواد.",
    chkStrictCompleted: "عرض المواد المكتملة فقط (إخفاء المواد المعلقة Hold)",
    thRMCode: "كود المادة (RM Code)",
    thOracleCode: "كود أوراكل (Oracle Code)",
    thSheet2Name: "اسم الخامة في صفحة الأكواد",
    thSheet1Name: "المادة الفعالة في الداتا",
    thLinkedProduct: "المستحضر المرتبط",
    thLinkedSuppliers: "الموردين المعتمدين",
    thCopyCode: "نسخ الكود",
    batchExplorerTitle: "سجل تتبع كافة التشغيلات المستلمة وأرقام الـ QC",
    batchExplorerSub: "جدول تفصيلي مفرد لكل تشغيلة مستلمة وتاريخ استلامها ورقم الـ QC الخاص بها.",
    thQCNo: "رقم الرقابة (QC No)",
    thLotNo: "رقم تشغيلة المورد (Batch No)",
    thRecDate: "تاريخ الاستلام",
    printCertBtn: "طباعة شهادة المورد",
    modalBatchHistoryTitle: "سجل تواريخ الاستلام وأرقام الـ QC وتشغيلات المورد بالتفصيل",
    closeBtn: "إغلاق النافذة",
    statusApproved: "معتمد (Approved)",
    statusNewApproved: "معتمد جديد (New \\ Approved)",
    statusQualified: "مؤهل (Qualified)",
    statusHold: "معلق (On Hold)",
    completedText: "مكتمل ومعتمد",
    noBatchesText: "لا توجد تشغيلات (NA)",
    allPillsText: "كل المواد الفعالة"
  }
};

// ============================================================================
// 3. COMPLETE SHEET 2 CODES DIRECTORY
// ============================================================================
let sheet2CodesCatalog = [
  { code: "RM101-001", oracleCode: "11DSJSCAAAA", codeMaterialName: "Adapalene", matchKey: "adapalene" },
  { code: "RM101-005", oracleCode: "11DSJBRAAAA", codeMaterialName: "Anise Seed Oil", matchKey: "anise seed oil" },
  { code: "RM101-007", oracleCode: "11DSJAZAAAA", codeMaterialName: "Azelaic Acid", matchKey: "azelaic acid" },
  { code: "RM101-008", oracleCode: "11DSJBPAAAA", codeMaterialName: "Bisoprolol", matchKey: "bisoprolol" },
  { code: "RM101-009", oracleCode: "11DSJVZAAAA", codeMaterialName: "Butoconazole Nitrate", matchKey: "butoconazole" },
  { code: "RM101-010", oracleCode: "11DSJVFAAAE", codeMaterialName: "Calcium gluconate", matchKey: "calcium gluconate" },
  { code: "RM101-011", oracleCode: "11DSJVFAAAD", codeMaterialName: "Calcium phospholactate", matchKey: "calcium phospholactate" },
  { code: "RM101-012", oracleCode: "11DSJCVAAAA", codeMaterialName: "Carvedilol", matchKey: "carvedilol" },
  { code: "RM101-016", oracleCode: "11DSJVGAAAA", codeMaterialName: "Clindamycin Phosphate", matchKey: "clindamycin" },
  { code: "RM101-017", oracleCode: "11DSJBXAAAA", codeMaterialName: "D-Panthenol / Dexpanthenol", matchKey: "panthenol" },
  { code: "RM101-018", oracleCode: "11DSJDSAAAA", codeMaterialName: "Desloratadine", matchKey: "desloratadine" },
  { code: "RM101-019", oracleCode: "11DSJSMAAAB", codeMaterialName: "Dill Oil Natural", matchKey: "dill oil" },
  { code: "RM101-020", oracleCode: "11DSJDCAAAA", codeMaterialName: "Doxazosin Mesylate", matchKey: "doxazosin" },
  { code: "RM101-021", oracleCode: "11DSJCDAAAB", codeMaterialName: "Echinacea extract 4% Powder", matchKey: "echinacea" },
  { code: "RM101-023", oracleCode: "11DSJBZAAAA", codeMaterialName: "Esomeprazole Magnesium Trihydrate pellets 22.5%", matchKey: "esomeprazole" },
  { code: "RM101-024", oracleCode: "11DSJCDAAAC", codeMaterialName: "Eucalyptus Oil natural", matchKey: "eucalyptus" },
  { code: "RM101-026", oracleCode: "11DSJBRAAAB", codeMaterialName: "Bitter Fennel Oil Natural", matchKey: "fennel" },
  { code: "RM101-030", oracleCode: "11DSJMQAAAA", codeMaterialName: "Hydroquinone", matchKey: "hydroquinone" },
  { code: "RM101-033", oracleCode: "11DSJBRAAAE", codeMaterialName: "Licorice dry extract 20 % (Export)", matchKey: "licorice" },
  { code: "RM101-035", oracleCode: "11DSJMPAAAA", codeMaterialName: "Muprocin", matchKey: "mupirocin" },
  { code: "RM101-037", oracleCode: "11DSJVFAAAH", codeMaterialName: "Nicotinamide (Vitifect)", matchKey: "nicotinamide" },
  { code: "RM101-038", oracleCode: "11DSJBCAAAA", codeMaterialName: "Nigella sativa Oil", matchKey: "nigella" },
  { code: "RM101-041", oracleCode: "11DSJPVAAAA", codeMaterialName: "Pumpkin Oil", matchKey: "pumpkin" },
  { code: "RM101-046", oracleCode: "11DSJPVAAAB", codeMaterialName: "Sawpalmetto", matchKey: "sawpalmetto" },
  { code: "RM101-047", oracleCode: "11DSJSRAAAA", codeMaterialName: "Sertaconazole nitrate", matchKey: "sertaconazole" },
  { code: "RM101-049", oracleCode: "11DSJSMAAAA", codeMaterialName: "Simethicone Emulsion 30%", matchKey: "simethicone" },
  { code: "RM101-051", oracleCode: "11DSJBRAAAF", codeMaterialName: "Sucralose", matchKey: "sucralose" },
  { code: "RM101-052", oracleCode: "11DSJTZAAAA", codeMaterialName: "Tazarotene", matchKey: "tazarotene" },
  { code: "RM101-054", oracleCode: "11DSJFNAAAA", codeMaterialName: "Terpinoeol", matchKey: "terpinoeol" },
  { code: "RM101-055", oracleCode: "11DSJVFAAAF", codeMaterialName: "Thiamine hydrochloride (Vitamin B1)", matchKey: "thiamine" },
  { code: "RM101-056", oracleCode: "11DSJBRAAAD", codeMaterialName: "Thyme Extract", matchKey: "thyme" },
  { code: "RM101-061", oracleCode: "11DSJVDAAAA", codeMaterialName: "Vardenafil HCl", matchKey: "vardenafil" },
  { code: "RM101-064", oracleCode: "11DSJVFAAAG", codeMaterialName: "Vitamin E Acetate oily", matchKey: "vitamin e" },
  { code: "RM101-065", oracleCode: "11DSJPVAAAC", codeMaterialName: "Zinc Gluconate", matchKey: "zinc gluconate" },
  { code: "RM101-067", oracleCode: "11DSJNFAAAA", codeMaterialName: "Zinc Oxide", matchKey: "zinc oxide" },
  { code: "RM101-068", oracleCode: "11DSJVFAAAA", codeMaterialName: "Vitamin/Calcium Premix", matchKey: "vitamin/calcium" },
  { code: "RM101-071", oracleCode: "11DSJAPAAAA", codeMaterialName: "Eplerenone", matchKey: "eplerenone" },
  { code: "RM101-072", oracleCode: "11DSJPRAAAA", codeMaterialName: "Palonosetron", matchKey: "palonosetron" },
  { code: "RM101-074", oracleCode: "11DSJRVAAAA", codeMaterialName: "Rosuvastatin Calcium", matchKey: "rosuvastatin" },
  { code: "RM101-076", oracleCode: "11DSJCDAAAA", codeMaterialName: "Marshmallow Root Powdered Extract", matchKey: "marshmallow" },
  { code: "RM101-077", oracleCode: "11DSJRCAAAA", codeMaterialName: "Tadalafil", matchKey: "tadalafil" },
  { code: "RM101-078", oracleCode: "11DSJVRAAAA", codeMaterialName: "Levetiracetam", matchKey: "levetiracetam" },
  { code: "RM104-001", oracleCode: "11DCLVTAAAA", codeMaterialName: "Levetiracetam (Alt Line)", matchKey: "levetiracetam" },
  { code: "RM101-081", oracleCode: "11DSJPYAAAA", codeMaterialName: "Psyllium husk powder 99%", matchKey: "psyllium" },
  { code: "RM101-084", oracleCode: "11DSJSVAAA", codeMaterialName: "Oseltamivir Phosphate", matchKey: "oseltamivir" },
  { code: "RM101-085", oracleCode: "11DSJFXAAAA", codeMaterialName: "Rifaximin", matchKey: "rifaximin" },
  { code: "RM101-086", oracleCode: "11DSJVIAAAA", codeMaterialName: "Ferrous gluconate", matchKey: "ferrous gluconate" },
  { code: "RM101-087", oracleCode: "11DSJETAAAA", codeMaterialName: "Etoricoxib", matchKey: "etoricoxib" },
  { code: "RM101-089", oracleCode: "11DSJNDAAA", codeMaterialName: "Nadifloxacin", matchKey: "nadifloxacin" },
  { code: "RM101-090", oracleCode: "11DSJPZAAAA", codeMaterialName: "Piperacillin and tazobactam sodium", matchKey: "piperacillin" },
  { code: "RM103-003", oracleCode: "11DAWDFAAAA", codeMaterialName: "Diclofenac Diethylamine", matchKey: "diclofenac" },
  { code: "RM103-007", oracleCode: "11DAWDMAAAA", codeMaterialName: "Salicylic acid", matchKey: "salicylic" },
  { code: "RM103-009", oracleCode: "11DAWQPAAAA", codeMaterialName: "Ivermectin", matchKey: "ivermectin" },
  { code: "RM104-003", oracleCode: "11DCLBPAAAA", codeMaterialName: "Olanzapine", matchKey: "olanzapine" },
  { code: "RM104-005", oracleCode: "11DCLPCAAAA", codeMaterialName: "Procyclidine HCL", matchKey: "procyclidine" },
  { code: "RM104-006", oracleCode: "11DCLSBAAAA", codeMaterialName: "Baclofen", matchKey: "baclofen" },
  { code: "RM108-001", oracleCode: "11DMPMVAAAA", codeMaterialName: "Sevelamer Carbonate", matchKey: "sevelamer" },
  { code: "RM109-002", oracleCode: "11DSJMXAAAA", codeMaterialName: "Moxifloxacin Hydrochloride EP", matchKey: "moxifloxacin" },
  { code: "RM111-001", oracleCode: "11DPHPTAAAA", codeMaterialName: "Gabapentin", matchKey: "gabapentin" },
  { code: "RM115-001", oracleCode: "11DEPDLAAAA", codeMaterialName: "Dapagliflozin Propanediol monohydrate", matchKey: "dapagliflozin" }
];

// ============================================================================
// 4. INITIAL EMBEDDED DATASET (FALLBACK BEFORE FIRST NETWORK SYNC)
// ============================================================================
let supplierData = [
  { sn: 1, supplier: "Interquim, S.A, de C.V-Mexico", country: "Mexico", material: "Rifaximin", product: "Biofixamin", status: "Approved", receivingDates: ["25-08-2020"], qcNos: ["RM20080241"], batchNos: ["RIFA-102003"], doneEval: "20/10/2026", nextEval: "Nov-27", remarks: "" },
  { sn: 2, supplier: "Jiangxi Synergy Pharmaceutical Co, Ltd- China", country: "China", material: "Gabapentin", product: "Sajalipsy", status: "Approved", receivingDates: ["13-11-2022", "09-04-2025", "09-04-2025", "09-04-2025"], qcNos: ["RM22110598", "R250275", "R250276", "R250277"], batchNos: ["08-20200522D", "106-20240721D", "106-20240721D", "106-20240720D"], doneEval: "16/09/2026", nextEval: "Oct-27", remarks: "" },
  { sn: 3, supplier: "SMS pharmaceutical LTD", country: "India", material: "Vardenafil HCL", product: "Vardena 5mg - 20mg", status: "New \\ Approved", receivingDates: ["NA"], qcNos: ["NA"], batchNos: ["NA"], doneEval: "30/08/2026", nextEval: "Sep-27", remarks: "" },
  { sn: 4, supplier: "Global calcium private Limited.", country: "India", material: "Calcium Gluconate", product: "Vitifect", status: "New \\ Approved", receivingDates: ["NA"], qcNos: ["NA"], batchNos: ["NA"], doneEval: "5/8/2026", nextEval: "Sep-27", remarks: "" },
  { sn: 5, supplier: "Medilux laboratories PVT LTD", country: "India", material: "Hydroquinone", product: "Meloquin", status: "Qualified", receivingDates: ["06-08-2020", "17-11-2020", "17-11-2020", "17-11-2020", "18-1-2021", "01-05-2022", "22-2-2022", "10-05-2022", "16-05-2023", "29-08-2023", "11-05-2023", "11-05-2023", "11-01-2024", "18-08-2024", "18-08-2024", "17-11-2024", "17-11-2024", "19-01-2025", "05-11-2025", "12-01-2026"], qcNos: ["RM20080230", "RM20110328", "RM20110329", "RM20110330", "RM21010016", "RM22010010", "RM22020097", "RM22100533", "R230195", "R230363", "R230538-0", "R230539-0", "R240012", "R240541", "R240542", "R240800", "R240801", "R250055", "R250747", "R260021"], batchNos: ["HYD/002/20-21", "HYD/423//B/20-21", "HYD/424//B/20-21", "HYD/425//B/20-21", "HYD/041/20-21", "HYD/046/21-22", "HYD/051/21-22", "HYD/22-23/017", "HYD/22-23/029", "HYD/22-23/031", "HYD/23-24/005", "HYD/23-24/009", "HYD/23-24/011", "HYD/24-25/004", "HYD/24-25/005", "HYD/24-25/006", "HYD/24-25/011", "HYD/24-25/017", "HYD/25-26/009", "HYD/25-26/013"], doneEval: "21/09/2026", nextEval: "Oct-27", remarks: "" },
  { sn: 6, supplier: "Alivus life sciences limited (old name GLENMARK)", country: "India", material: "Sertaconazole Nitrate", product: "Biosertazol", status: "Qualified", receivingDates: ["NA", "01-07-2021", "12-01-2022"], qcNos: ["NA", "RM21010003", "RM22120620"], batchNos: ["83181037", "83190685", "83220633"], doneEval: "22/10/2026", nextEval: "Nov-27", remarks: "" },
  { sn: 7, supplier: "Riocare India PVT LTD - India", country: "India", material: "Simethicone Emulsion", product: "Simedill", status: "Approved", receivingDates: ["25-2-2019", "05-01-2021"], qcNos: ["RM19020044", "RM21010001"], batchNos: ["RSML16/048", "RSML20/224"], doneEval: "13/09/2026", nextEval: "Sep-27", remarks: "" },
  { sn: 8, supplier: "Apionex pharma private limited-India", country: "India", material: "Hydroquinone", product: "Meloquine cream", status: "Hold", receivingDates: [], qcNos: [], batchNos: [], doneEval: "-", nextEval: "-", remarks: "Hold on Quistionnair" },
  { sn: 9, supplier: "Lee pharma limited", country: "India", material: "Rosuvastatin", product: "Biorosuvin", status: "Hold", receivingDates: [], qcNos: [], batchNos: [], doneEval: "-", nextEval: "-", remarks: "hold on Receiving Docs" },
  { sn: 10, supplier: "Bill Biotech PVT", country: "India", material: "Mupirocin", product: "Mupirocin", status: "Approved", receivingDates: ["NA"], qcNos: ["NA"], batchNos: ["NA"], doneEval: "5/11/2026", nextEval: "Nov-27", remarks: "" },
  { sn: 11, supplier: "Hetero unit III labs limited India", country: "India", material: "Rosuvastatin calcium", product: "Biorosuvin", status: "Approved", receivingDates: ["NA"], qcNos: ["NA"], batchNos: ["NA"], doneEval: "8/11/2026", nextEval: "Nov-27", remarks: "" },
  { sn: 12, supplier: "hetero labs unit 1 Limited.", country: "India", material: "levetiracetam", product: "Vetracetam", status: "Approved", receivingDates: ["08-09-2020", "07-04-2021"], qcNos: ["RM20090253", "RM21070157"], batchNos: ["LE20050203", "LE20120608"], doneEval: "8/11/2026", nextEval: "Nov-27", remarks: "" },
  { sn: 13, supplier: "Hetero Labs limited Unit III", country: "India", material: "Eplerenone", product: "Aldospira", status: "New \\ Approved", receivingDates: ["NA"], qcNos: ["NA"], batchNos: ["NA"], doneEval: "10/11/2026", nextEval: "Nov-27", remarks: "" },
  { sn: 14, supplier: "CTX life science PVT.LTD.", country: "India", material: "Carvedilol", product: "Carvedilol", status: "New \\ Approved", receivingDates: ["17-05-2023"], qcNos: ["R230196"], batchNos: ["23CI000003"], doneEval: "11/11/2026", nextEval: "Nov-27", remarks: "" }
];

// ============================================================================
// 5. REAL-TIME GOOGLE SHEETS LIVE PARSER & CLIENT CACHE
// ============================================================================
function splitMultilineCell(val) {
  if (!val) return [];
  return String(val).split(/\r?\n|\s{2,}/).map(s => s.trim()).filter(Boolean);
}

function detectCountry(supplierName) {
  const s = (supplierName || "").toLowerCase();
  if (s.includes("mexico")) return "Mexico";
  if (s.includes("china")) return "China";
  return "India";
}

function parseSheetRowsIntoSuppliers(rows) {
  const parsed = [];
  let startIdx = 0;
  for (let i = 0; i < rows.length; i++) {
    const rowStr = rows[i].join(" ").toLowerCase();
    if (rowStr.includes("supplier name") && rowStr.includes("material name")) {
      startIdx = i + 1;
      break;
    }
  }

  for (let i = startIdx; i < rows.length; i++) {
    const r = rows[i];
    if (!r || r.length < 3) continue;
    const supplier = (r[1] || "").trim();
    const material = (r[2] || "").trim();
    const product = (r[3] || "").trim();
    if (!supplier && !material) continue;

    const sn = parseInt(r[0], 10) || (parsed.length + 1);
    let rawStatus = (r[4] || "").trim();
    const remarks = (r[10] || "").trim();
    if (!rawStatus) rawStatus = "Hold";

    parsed.push({
      sn,
      supplier,
      country: detectCountry(supplier),
      material,
      product: product || "-",
      status: rawStatus,
      receivingDates: splitMultilineCell(r[5]),
      qcNos: splitMultilineCell(r[6]),
      batchNos: splitMultilineCell(r[7]),
      doneEval: (r[8] || "").trim() || "-",
      nextEval: (r[9] || "").trim() || "-",
      remarks
    });
  }
  return parsed;
}

function updateLastSyncBadge() {
  const badge = document.getElementById("lastSyncBadge");
  const savedTime = localStorage.getItem("sms_last_sync_v1");
  if (badge && savedTime) {
    badge.textContent = currentLang === "ar" ? `آخر تحديث: ${savedTime}` : `Synced: ${savedTime}`;
  }
}

function loadCachedDataOnBoot() {
  try {
    const cached = localStorage.getItem("sms_cached_suppliers_v1");
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) supplierData = parsed;
    }
  } catch (e) {}
  updateLastSyncBadge();
}

async function fetchLiveGoogleSheet(showToast = false) {
  const icon = document.getElementById("syncIcon");
  const statusText = document.getElementById("syncStatusText");
  const skel = document.getElementById("syncSkeletonBar");
  if (icon) icon.classList.add("animate-spin");
  if (skel) skel.classList.remove("hidden");

  const cacheBusterUrl = `${LIVE_DATA_CSV_URL}&t=${Date.now()}`;

  try {
    Papa.parse(cacheBusterUrl, {
      download: true,
      skipEmptyLines: true,
      complete: function(results) {
        if (results && results.data && results.data.length > 1) {
          const liveParsed = parseSheetRowsIntoSuppliers(results.data);
          if (liveParsed.length > 0) {
            supplierData = liveParsed;
            try {
              localStorage.setItem("sms_cached_suppliers_v1", JSON.stringify(supplierData));
              localStorage.setItem("sms_last_sync_v1", new Date().toLocaleTimeString());
            } catch (err) {}
            updateLastSyncBadge();
            populateSearchHelpers();
            applyAllFilters();
            renderCharts();
            statusText.textContent = currentLang === "ar"
              ? `متصل لايف بالشيت (${supplierData.length} مورد)`
              : `Live Synced (${supplierData.length} Records)`;
            if (showToast) {
              showNotification(currentLang === "ar"
                ? `تم سحب أحدث البيانات من الشيت بنجاح (${supplierData.length} مورد)!`
                : `Live Sheet Synced (${supplierData.length} suppliers loaded)!`);
            }
          }
        }
        if (icon) icon.classList.remove("animate-spin");
        if (skel) skel.classList.add("hidden");
      },
      error: async function() {
        try {
          const res = await fetch(`${LIVE_PUBHTML_URL}?t=${Date.now()}`);
          const htmlText = await res.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlText, "text/html");
          const tables = doc.querySelectorAll("table.waffle");
          if (tables.length > 0) {
            const trs = tables[0].querySelectorAll("tbody tr");
            const matrix = [];
            trs.forEach(tr => {
              const cells = [...tr.querySelectorAll("td")].map(td => td.innerText.trim());
              if (cells.length > 0) matrix.push(cells);
            });
            const liveParsed = parseSheetRowsIntoSuppliers(matrix);
            if (liveParsed.length > 0) {
              supplierData = liveParsed;
              populateSearchHelpers();
              applyAllFilters();
              renderCharts();
            }
          }
        } catch (err) {}
        if (icon) icon.classList.remove("animate-spin");
        if (skel) skel.classList.add("hidden");
      }
    });
  } catch (e) {
    if (icon) icon.classList.remove("animate-spin");
    if (skel) skel.classList.add("hidden");
  }
}

// ============================================================================
// 6. HELPER FUNCTIONS: CODE MATCHING, HIGHLIGHTING & BADGES
// ============================================================================
function getCodesForMaterial(matName) {
  if (!matName) return [];
  const lower = matName.toLowerCase().trim();
  return sheet2CodesCatalog.filter(c => lower.includes(c.matchKey) || c.matchKey.includes(lower));
}

function highlightText(text, query) {
  const str = String(text || "");
  if (!query || !query.trim()) return str;
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return str.replace(new RegExp(`(${escaped})`, "gi"), `<mark class="hl">$1</mark>`);
}

function getStatusBadgeHTML(status) {
  const t = i18n[currentLang];
  const s = (status || "").toLowerCase();
  if (s === "approved") {
    return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>${t.statusApproved}</span>`;
  }
  if (s.includes("new")) {
    return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700"><span class="w-1.5 h-1.5 rounded-full bg-teal-500"></span>${t.statusNewApproved}</span>`;
  }
  if (s === "qualified") {
    return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700"><span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>${t.statusQualified}</span>`;
  }
  return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>${t.statusHold}</span>`;
}

function showNotification(msg) {
  const toast = document.getElementById("toastNotice");
  document.getElementById("toastText").textContent = msg;
  toast.classList.remove("hidden");
  toast.classList.add("flex");
  setTimeout(() => {
    toast.classList.add("hidden");
    toast.classList.remove("flex");
  }, 2400);
}

function copyTextToClipboard(txt) {
  navigator.clipboard.writeText(txt);
  showNotification(currentLang === "ar" ? `تم نسخ الكود: ${txt}` : `Copied Code: ${txt}`);
}

// ============================================================================
// 7. POPULATE AUTOCOMPLETE & API SLICER PILLS
// ============================================================================
function populateSearchHelpers() {
  const uniqueMaterials = [...new Set(supplierData.map(s => s.material))];
  document.getElementById("materialAutocompleteList").innerHTML = uniqueMaterials.map(m => `<option value="${m}"></option>`).join("");

  const allCodesSet = new Set();
  sheet2CodesCatalog.forEach(c => {
    allCodesSet.add(c.code);
    allCodesSet.add(c.oracleCode);
  });
  supplierData.forEach(s => s.qcNos.forEach(q => { if (q && q !== "NA") allCodesSet.add(q); }));
  document.getElementById("codeAutocompleteList").innerHTML = [...allCodesSet].map(c => `<option value="${c}"></option>`).join("");

  renderApiSlicerPills();
}

function renderApiSlicerPills() {
  const container = document.getElementById("apiSlicerContainer");
  const uniqueApis = [...new Set(supplierData.map(s => s.material))];
  const allLabel = `${i18n[currentLang].allPillsText} (${supplierData.length})`;

  let html = `<button onclick="selectApiPill('ALL')" class="slicer-pill ${selectedApiPill === 'ALL' ? 'active' : ''} px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">${allLabel}</button>`;

  uniqueApis.forEach(api => {
    const isAct = selectedApiPill.toLowerCase() === api.toLowerCase();
    const codes = getCodesForMaterial(api);
    const codeTag = codes.length ? codes[0].code : "";
    html += `<button onclick="selectApiPill('${api.replace(/'/g, "\\'")}')" class="slicer-pill ${isAct ? 'active' : ''} px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1"><span>${api}</span>${codeTag ? `<span class="text-[9px] font-mono opacity-75">(${codeTag})</span>` : ''}</button>`;
  });
  container.innerHTML = html;
}

function selectApiPill(apiName) {
  selectedApiPill = apiName;
  document.getElementById("materialSearchInput").value = apiName === "ALL" ? "" : apiName;
  renderApiSlicerPills();
  applyAllFilters();
}

// ============================================================================
// 8. FILTERING & TABLE RENDERING
// ============================================================================
function getFilteredSuppliers() {
  const matQuery = document.getElementById("materialSearchInput").value.toLowerCase().trim();
  const codeQuery = document.getElementById("codeSearchInput").value.toLowerCase().trim();
  const supQuery = document.getElementById("supplierSearchInput").value.toLowerCase().trim();
  const statusVal = document.getElementById("statusSelect").value;
  const evalVal = document.getElementById("evalSelect").value;

  return supplierData.filter(item => {
    const matchedCodes = getCodesForMaterial(item.material);
    const rmCodesStr = matchedCodes.map(c => `${c.code} ${c.oracleCode} ${c.codeMaterialName}`).join(" ").toLowerCase();
    const qcAndLotsStr = `${item.qcNos.join(" ")} ${item.batchNos.join(" ")}`.toLowerCase();

    const matchMaterial = !matQuery || item.material.toLowerCase().includes(matQuery) || matchedCodes.some(c => c.codeMaterialName.toLowerCase().includes(matQuery));
    const matchCode = !codeQuery || rmCodesStr.includes(codeQuery) || qcAndLotsStr.includes(codeQuery);
    const matchSupplier = !supQuery || item.supplier.toLowerCase().includes(supQuery) || item.product.toLowerCase().includes(supQuery) || item.country.toLowerCase().includes(supQuery) || (item.remarks && item.remarks.toLowerCase().includes(supQuery));

    let matchStatus = true;
    if (statusVal === "COMPLETED_ONLY") matchStatus = item.status !== "Hold" && item.status !== "";
    else if (statusVal !== "ALL") matchStatus = item.status.toLowerCase() === statusVal.toLowerCase();

    let matchEval = true;
    if (evalVal !== "ALL") matchEval = item.nextEval === evalVal;

    return matchMaterial && matchCode && matchSupplier && matchStatus && matchEval;
  });
}

function applyAllFilters() {
  const matVal = document.getElementById("materialSearchInput").value.trim();
  selectedApiPill = matVal ? matVal : "ALL";
  renderApiSlicerPills();
  renderMasterSupplierTable();
  renderCompletedCodesTable();
  renderFlatBatchesTable();
  updateDynamicKPIs();
}

function resetAllFilters() {
  document.getElementById("materialSearchInput").value = "";
  document.getElementById("codeSearchInput").value = "";
  document.getElementById("supplierSearchInput").value = "";
  document.getElementById("statusSelect").value = "ALL";
  document.getElementById("evalSelect").value = "ALL";
  selectedApiPill = "ALL";
  applyAllFilters();
}

function filterByStatusCard(statusKey) {
  document.getElementById("statusSelect").value = statusKey;
  switchTab("overview");
  applyAllFilters();
}

function renderMasterSupplierTable() {
  const tbody = document.getElementById("supplierTableBody");
  const filtered = getFilteredSuppliers();
  const matQuery = document.getElementById("materialSearchInput").value;
  const codeQuery = document.getElementById("codeSearchInput").value;
  const supQuery = document.getElementById("supplierSearchInput").value;
  const t = i18n[currentLang];

  document.getElementById("activeResultCounter").textContent = currentLang === "ar"
    ? `عرض ${filtered.length} من أصل ${supplierData.length} مورد`
    : `Showing ${filtered.length} of ${supplierData.length} Suppliers`;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" class="py-12 text-center text-slate-400 font-semibold">No matching records found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    const codes = getCodesForMaterial(item.material);
    const realLots = item.qcNos.filter(q => q && q !== "NA");
    const lotCount = realLots.length;

    const codesBadgesHTML = codes.map(c => `
      <div class="flex items-center gap-1 mb-1">
        <span onclick="event.stopPropagation(); copyTextToClipboard('${c.code}')" class="px-2 py-0.5 text-[11px] font-mono font-extrabold bg-sky-50 dark:bg-sky-950/90 text-[#034f84] dark:text-sky-300 rounded border border-sky-200 dark:border-sky-800 hover:bg-sky-100 cursor-pointer">${highlightText(c.code, codeQuery)}</span>
        <span onclick="event.stopPropagation(); copyTextToClipboard('${c.oracleCode}')" class="px-2 py-0.5 text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-200 cursor-pointer">${highlightText(c.oracleCode, codeQuery)}</span>
      </div>
    `).join("");

    return `
      <tr onclick="openDossierModal(${item.sn})" class="hover:bg-sky-50/50 dark:hover:bg-slate-800/60 cursor-pointer transition group">
        <td class="py-3.5 px-3 font-mono font-bold text-slate-400">#${item.sn}</td>
        <td class="py-3.5 px-3">
          <div class="font-bold text-slate-900 dark:text-white group-hover:text-[#0077b6] dark:group-hover:text-sky-400 transition">${highlightText(item.supplier, supQuery)}</div>
          <span class="inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded">${item.country}</span>
        </td>
        <td class="py-3.5 px-3"><span class="font-extrabold text-[#034f84] dark:text-sky-300 text-xs sm:text-sm">${highlightText(item.material, matQuery)}</span></td>
        <td class="py-3.5 px-3">${codesBadgesHTML || '<span class="text-slate-400">-</span>'}</td>
        <td class="py-3.5 px-3 font-bold text-slate-700 dark:text-slate-200">${highlightText(item.product, supQuery)}</td>
        <td class="py-3.5 px-3">${getStatusBadgeHTML(item.status)}</td>
        <td class="py-3.5 px-3">
          ${lotCount > 0 ? `<button onclick="event.stopPropagation(); openDossierModal(${item.sn})" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] border border-emerald-200 dark:border-emerald-800 transition"><span>${lotCount} ${currentLang === 'ar' ? 'تشغيلة' : (lotCount > 1 ? 'Batches' : 'Batch')}</span><span class="opacity-40">|</span><span class="font-mono text-[10px]">${highlightText(realLots[realLots.length - 1], codeQuery)}</span></button>` : `<span class="text-slate-400 dark:text-slate-500 text-[11px] font-medium">${t.noBatchesText}</span>`}
        </td>
        <td class="py-3.5 px-3 font-mono font-semibold text-slate-700 dark:text-slate-300">${item.doneEval}</td>
        <td class="py-3.5 px-3">${item.nextEval !== "-" ? `<span class="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-slate-800 font-mono font-bold text-[#034f84] dark:text-sky-300 text-[11px] border border-sky-200/60 dark:border-slate-700">${item.nextEval}</span>` : `<span class="text-slate-400">-</span>`}</td>
        <td class="py-3.5 px-3">${item.remarks ? `<span class="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-bold text-[11px] border border-amber-200 dark:border-amber-800">${highlightText(item.remarks, supQuery)}</span>` : `<span class="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] flex items-center gap-1">&#10003; ${t.completedText}</span>`}</td>
      </tr>
    `;
  }).join("");
}

function renderCompletedCodesTable() {
  const tbody = document.getElementById("codesTableBody");
  const strictCompleted = document.getElementById("strictCompletedToggle").checked;
  const matQuery = document.getElementById("materialSearchInput").value.toLowerCase().trim();
  const codeQuery = document.getElementById("codeSearchInput").value.toLowerCase().trim();
  const supQuery = document.getElementById("supplierSearchInput").value.toLowerCase().trim();

  const eligibleSuppliers = supplierData.filter(s => !strictCompleted || (s.status !== "Hold" && s.status !== "" && s.doneEval !== "-"));
  const matchedRows = [];

  sheet2CodesCatalog.forEach(codeItem => {
    const linkedSuppliers = eligibleSuppliers.filter(s => s.material.toLowerCase().includes(codeItem.matchKey) || codeItem.matchKey.includes(s.material.toLowerCase()));
    if (linkedSuppliers.length > 0) {
      const matchMat = !matQuery || codeItem.codeMaterialName.toLowerCase().includes(matQuery) || linkedSuppliers.some(s => s.material.toLowerCase().includes(matQuery));
      const matchCode = !codeQuery || codeItem.code.toLowerCase().includes(codeQuery) || codeItem.oracleCode.toLowerCase().includes(codeQuery);
      const matchSup = !supQuery || linkedSuppliers.some(s => s.supplier.toLowerCase().includes(supQuery) || s.product.toLowerCase().includes(supQuery));
      if (matchMat && matchCode && matchSup) matchedRows.push({ codeItem, linkedSuppliers });
    }
  });

  document.getElementById("badgeCodesTab").textContent = matchedRows.length;
  document.getElementById("kpiCodesCountVal").textContent = matchedRows.length;

  if (matchedRows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="py-10 text-center text-slate-400 font-semibold">No matched material codes for the current search.</td></tr>`;
    return;
  }

  tbody.innerHTML = matchedRows.map(({ codeItem, linkedSuppliers }) => {
    const products = [...new Set(linkedSuppliers.map(s => s.product))].join(" | ");
    const suppliersHtml = linkedSuppliers.map(s => `<div class="font-semibold text-slate-800 dark:text-slate-200 py-0.5">${highlightText(s.supplier, supQuery)}</div>`).join("");
    const statusHtml = linkedSuppliers.map(s => getStatusBadgeHTML(s.status)).join(" ");
    return `
      <tr class="hover:bg-sky-50/30 dark:hover:bg-slate-800/50 transition">
        <td class="py-3.5 px-4"><span class="px-2.5 py-1 rounded-lg font-mono font-extrabold text-xs bg-sky-50 dark:bg-sky-950 text-[#034f84] dark:text-sky-300 border border-sky-200 dark:border-sky-800">${highlightText(codeItem.code, codeQuery)}</span></td>
        <td class="py-3.5 px-4 font-mono font-extrabold text-slate-800 dark:text-slate-200 text-xs">${highlightText(codeItem.oracleCode, codeQuery)}</td>
        <td class="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">${highlightText(codeItem.codeMaterialName, matQuery)}</td>
        <td class="py-3.5 px-4 font-bold text-[#0077b6] dark:text-sky-400">${highlightText(linkedSuppliers[0].material, matQuery)}</td>
        <td class="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">${highlightText(products, supQuery)}</td>
        <td class="py-3.5 px-4">${suppliersHtml}</td>
        <td class="py-3.5 px-4">${statusHtml}</td>
        <td class="py-3.5 px-4"><button onclick="copyTextToClipboard('${codeItem.code} | ${codeItem.oracleCode}')" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#034f84] hover:text-white text-slate-700 dark:text-slate-300 font-bold text-[11px] transition">Copy</button></td>
      </tr>
    `;
  }).join("");
}

function renderFlatBatchesTable() {
  const tbody = document.getElementById("flatBatchTableBody");
  const filteredSuppliers = getFilteredSuppliers();
  const codeQuery = document.getElementById("codeSearchInput").value.trim();
  const matQuery = document.getElementById("materialSearchInput").value.trim();

  const flatLots = [];
  filteredSuppliers.forEach(s => {
    const codes = getCodesForMaterial(s.material);
    const rmCode = codes.length ? codes[0].code : "-";
    const oracleCode = codes.length ? codes[0].oracleCode : "-";
    const maxLen = Math.max(s.receivingDates.length, s.qcNos.length, s.batchNos.length);
    for (let i = 0; i < maxLen; i++) {
      const qc = s.qcNos[i] || "NA";
      const lot = s.batchNos[i] || "NA";
      const rDate = s.receivingDates[i] || "NA";
      if (qc !== "NA" || lot !== "NA") {
        if (!codeQuery || qc.toLowerCase().includes(codeQuery.toLowerCase()) || lot.toLowerCase().includes(codeQuery.toLowerCase()) || rmCode.toLowerCase().includes(codeQuery.toLowerCase()) || oracleCode.toLowerCase().includes(codeQuery.toLowerCase())) {
          flatLots.push({ sn: s.sn, qc, lot, rDate, material: s.material, rmCode, oracleCode, product: s.product, supplier: s.supplier });
        }
      }
    }
  });

  document.getElementById("batchExplorerCount").textContent = `${flatLots.length} QC Batches`;
  document.getElementById("badgeLotsTab").textContent = `${flatLots.length} Lots`;
  document.getElementById("kpiTotalBatchesLabel").textContent = `${flatLots.length} QC Lots`;

  if (flatLots.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="py-10 text-center text-slate-400 font-semibold">No physical QC batches match the current filter.</td></tr>`;
    return;
  }

  tbody.innerHTML = flatLots.map((b, idx) => `
    <tr onclick="openDossierModal(${b.sn})" class="hover:bg-emerald-50/40 dark:hover:bg-slate-800/50 cursor-pointer transition">
      <td class="py-2.5 px-4 font-mono text-slate-400 font-bold">${idx + 1}</td>
      <td class="py-2.5 px-4 font-mono font-extrabold text-emerald-700 dark:text-emerald-400">${highlightText(b.qc, codeQuery)}</td>
      <td class="py-2.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">${highlightText(b.lot, codeQuery)}</td>
      <td class="py-2.5 px-4 font-mono text-slate-600 dark:text-slate-400">${b.rDate}</td>
      <td class="py-2.5 px-4 font-extrabold text-[#034f84] dark:text-sky-300">${highlightText(b.material, matQuery)}</td>
      <td class="py-2.5 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-300">${highlightText(b.rmCode, codeQuery)} / ${highlightText(b.oracleCode, codeQuery)}</td>
      <td class="py-2.5 px-4 font-semibold text-slate-700 dark:text-slate-300">${b.product}</td>
      <td class="py-2.5 px-4 text-slate-600 dark:text-slate-400">${b.supplier}</td>
    </tr>
  `).join("");
}

function updateDynamicKPIs() {
  const filtered = getFilteredSuppliers();
  const total = filtered.length;
  const completed = filtered.filter(s => s.status !== "Hold" && s.status !== "").length;
  const appOnly = filtered.filter(s => s.status.toLowerCase() === "approved").length;
  const newApp = filtered.filter(s => s.status.toLowerCase().includes("new")).length;
  const qualified = filtered.filter(s => s.status.toLowerCase() === "qualified").length;
  const hold = filtered.filter(s => s.status.toLowerCase() === "hold").length;
  const rate = total > 0 ? ((completed / total) * 100).toFixed(1) : "0.0";

  document.getElementById("kpiTotalVal").textContent = total;
  document.getElementById("kpiComplianceVal").textContent = `${rate}%`;
  document.getElementById("kpiCompletedCount").textContent = `${completed} / ${total}`;
  document.getElementById("kpiComplianceBar").style.width = `${rate}%`;
  document.getElementById("kpiApprovedVal").textContent = appOnly + newApp;
  document.getElementById("kpiApprovedSub").textContent = `${appOnly} App + ${newApp} New`;
  document.getElementById("kpiQualifiedVal").textContent = qualified;
  document.getElementById("kpiHoldVal").textContent = hold;
}

// ============================================================================
// 9. CHARTS, MODAL & EXPORT
// ============================================================================
let chartStatusInstance = null;
let chartBatchesInstance = null;
let chartEvalInstance = null;

function renderCharts() {
  const textColor = isDarkMode ? "#cbd5e1" : "#475569";
  const gridColor = isDarkMode ? "rgba(148, 163, 184, 0.12)" : "rgba(148, 163, 184, 0.25)";

  if (chartStatusInstance) chartStatusInstance.destroy();
  if (chartBatchesInstance) chartBatchesInstance.destroy();
  if (chartEvalInstance) chartEvalInstance.destroy();

  const statusLabels = ["Approved", "New \\ Approved", "Qualified", "Hold"];
  const statusCounts = [
    supplierData.filter(s => s.status === "Approved").length,
    supplierData.filter(s => s.status.toLowerCase().includes("new")).length,
    supplierData.filter(s => s.status === "Qualified").length,
    supplierData.filter(s => s.status === "Hold").length
  ];

  chartStatusInstance = new Chart(document.getElementById("statusDonutChart"), {
    type: "doughnut",
    data: {
      labels: statusLabels,
      datasets: [{ data: statusCounts, backgroundColor: ["#10b981", "#14b8a6", "#0077b6", "#f59e0b"], borderColor: isDarkMode ? "#111827" : "#ffffff", borderWidth: 3 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "64%",
      onClick: (evt, el) => { if (el.length > 0) { document.getElementById("statusSelect").value = statusLabels[el[0].index]; applyAllFilters(); } },
      plugins: { legend: { position: "bottom", labels: { color: textColor, boxWidth: 11, font: { size: 11, weight: "600" } } } }
    }
  });

  const materialsWithLots = supplierData.filter(s => s.qcNos.filter(q => q !== "NA").length > 0);
  chartBatchesInstance = new Chart(document.getElementById("materialBatchBarChart"), {
    type: "bar",
    data: {
      labels: materialsWithLots.map(s => s.material),
      datasets: [{ data: materialsWithLots.map(s => s.qcNos.filter(q => q !== "NA").length), backgroundColor: ["#034f84", "#10b981", "#0077b6", "#0ea5e9", "#14b8a6", "#f59e0b", "#6366f1"], borderRadius: 6 }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      onClick: (evt, el) => { if (el.length > 0) selectApiPill(materialsWithLots[el[0].index].material); },
      scales: { x: { ticks: { color: textColor }, grid: { color: gridColor } }, y: { ticks: { color: textColor, font: { size: 11, weight: "bold" } }, grid: { display: false } } },
      plugins: { legend: { display: false } }
    }
  });

  const evalPeriods = [...new Set(supplierData.map(s => s.nextEval).filter(x => x && x !== "-"))];
  chartEvalInstance = new Chart(document.getElementById("evalTimelineChart"), {
    type: "bar",
    data: {
      labels: evalPeriods,
      datasets: [{ data: evalPeriods.map(p => supplierData.filter(s => s.nextEval === p).length), backgroundColor: "#0077b6", borderRadius: 8, barThickness: 34 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      onClick: (evt, el) => { if (el.length > 0) { document.getElementById("evalSelect").value = evalPeriods[el[0].index]; applyAllFilters(); } },
      scales: { x: { ticks: { color: textColor, font: { weight: "bold" } }, grid: { display: false } }, y: { beginAtZero: true, ticks: { stepSize: 1, color: textColor }, grid: { color: gridColor } } },
      plugins: { legend: { display: false } }
    }
  });
}

function openDossierModal(sn) {
  const item = supplierData.find(s => s.sn === sn);
  if (!item) return;
  const codes = getCodesForMaterial(item.material);
  const realLots = item.qcNos.filter(q => q && q !== "NA");

  document.getElementById("modalSN").textContent = `Record #${item.sn} (${item.country})`;
  document.getElementById("modalTitle").textContent = `${item.material} — ${item.product}`;
  document.getElementById("modalSupplier").textContent = item.supplier;
  document.getElementById("modalStatusPill").textContent = item.status === "Hold" ? `ON HOLD (${item.remarks})` : item.status;
  document.getElementById("mRMCode").textContent = codes.length ? codes.map(c => c.code).join(", ") : "N/A";
  document.getElementById("mOracleCode").textContent = codes.length ? codes.map(c => c.oracleCode).join(", ") : "N/A";
  document.getElementById("mProduct").textContent = item.product;
  document.getElementById("mDoneEval").textContent = item.doneEval;
  document.getElementById("mNextEval").textContent = item.nextEval;
  document.getElementById("mLotCount").textContent = `${realLots.length} Historical Lots`;

  const tbody = document.getElementById("modalBatchesBody");
  const maxLen = Math.max(item.receivingDates.length, item.qcNos.length, item.batchNos.length);

  if (maxLen === 0 || (maxLen === 1 && item.qcNos[0] === "NA")) {
    tbody.innerHTML = `<tr><td colspan="5" class="py-8 text-center text-slate-400 font-semibold">No physical batches logged in Data Sheet (NA / Hold).</td></tr>`;
  } else {
    let html = "";
    for (let i = 0; i < maxLen; i++) {
      html += `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/60">
          <td class="py-2.5 px-4 font-mono font-bold text-slate-400">${i + 1}</td>
          <td class="py-2.5 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">${item.receivingDates[i] || "-"}</td>
          <td class="py-2.5 px-4 font-mono font-extrabold text-[#0077b6] dark:text-sky-400">${item.qcNos[i] || "-"}</td>
          <td class="py-2.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-100">${item.batchNos[i] || "-"}</td>
          <td class="py-2.5 px-4"><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">QC Released</span></td>
        </tr>
      `;
    }
    tbody.innerHTML = html;
  }
  const modal = document.getElementById("dossierModal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeDossierModal() {
  const modal = document.getElementById("dossierModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.documentElement.classList.toggle("dark", isDarkMode);
  const t = i18n[currentLang];
  document.getElementById("themeBtnText").textContent = isDarkMode ? t.lightModeBtn : t.darkModeBtn;
  renderCharts();
}

function toggleLanguage() {
  currentLang = currentLang === "en" ? "ar" : "en";
  const htmlEl = document.documentElement;
  htmlEl.setAttribute("lang", currentLang);
  htmlEl.setAttribute("dir", currentLang === "ar" ? "rtl" : "ltr");
  document.getElementById("langBtnText").textContent = currentLang === "ar" ? "English (EN)" : "العربية (AR)";

  const t = i18n[currentLang];
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key]) el.textContent = t[key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (t[key]) el.setAttribute("placeholder", t[key]);
  });
  document.getElementById("themeBtnText").textContent = isDarkMode ? t.lightModeBtn : t.darkModeBtn;
  updateLastSyncBadge();
  applyAllFilters();
  renderCharts();
}

function switchTab(tabKey) {
  ["overview", "codes", "batches"].forEach(k => {
    document.getElementById(`tabPanel-${k}`).classList.toggle("hidden", k !== tabKey);
    document.getElementById(`tabBtn-${k}`).classList.toggle("active", k === tabKey);
  });
}

function exportFilteredCSV() {
  const filtered = getFilteredSuppliers();
  const headers = ["S.N", "Supplier Name", "Country", "Active Material (API)", "RM Code", "Oracle Code", "Product Name", "Status", "Total QC Batches", "Done Evaluation", "Next Evaluation", "Remarks"];
  const rows = [headers.join(",")];

  filtered.forEach(item => {
    const codes = getCodesForMaterial(item.material);
    const rmCode = codes.length ? codes[0].code : "";
    const oracleCode = codes.length ? codes[0].oracleCode : "";
    const batchCount = item.qcNos.filter(q => q !== "NA").length;
    rows.push([item.sn, `"${item.supplier.replace(/"/g, '""')}"`, item.country, `"${item.material}"`, rmCode, oracleCode, `"${item.product}"`, `"${item.status}"`, batchCount, item.doneEval, item.nextEval, `"${item.remarks}"`].join(","));
  });

  const blob = new Blob(["\uFEFF" + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "Supplier_Qualification_Live_BI.csv";
  a.click();
}

// ============================================================================
// 10. PWA INSTALL PROMPT & CAPACITOR NATIVE BRIDGE
// ============================================================================
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  const btn = document.getElementById("installAppBtn");
  if (btn) {
    btn.classList.remove("hidden");
    btn.classList.add("flex");
  }
});

async function triggerInstallApp() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  const { outcome } = await deferredInstallPrompt.userChoice;
  if (outcome === "accepted") {
    const btn = document.getElementById("installAppBtn");
    if (btn) btn.classList.add("hidden");
  }
  deferredInstallPrompt = null;
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}

document.addEventListener("deviceready", () => {
  if (window.Capacitor && window.Capacitor.Plugins) {
    const { App, StatusBar } = window.Capacitor.Plugins;
    if (StatusBar) {
      StatusBar.setBackgroundColor({ color: "#034f84" }).catch(() => {});
      StatusBar.setStyle({ style: "DARK" }).catch(() => {});
    }
    if (App) {
      App.addListener("backButton", () => {
        const modal = document.getElementById("dossierModal");
        if (modal && !modal.classList.contains("hidden")) closeDossierModal();
        else App.exitApp();
      });
    }
  }
});

window.addEventListener("DOMContentLoaded", () => {
  loadCachedDataOnBoot();
  lucide.createIcons();
  populateSearchHelpers();
  applyAllFilters();
  renderCharts();
  fetchLiveGoogleSheet(false);
});
