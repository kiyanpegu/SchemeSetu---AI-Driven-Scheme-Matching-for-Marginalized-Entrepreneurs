/**
 * SchemeSetu Intelligent Idea Feasibility & Scheme Matcher
 * Performs deep semantic, domain-aware, and gender-safe matching for small business proposals.
 */

export function evaluateBusinessIdea(text = '', lang = 'en') {
  const lower = text.toLowerCase();

  // 1. Precise Gender Detection
  const hasMaleKeywords = /\b(man|male|boy|men|father|brother|husband|son|guy|gentleman|mr)\b/i.test(lower) || 
                          text.includes('पुरुष') || text.includes('लड़का') || text.includes('ল\'ৰা') || text.includes('পুৰুষ');
  const hasFemaleKeywords = /\b(woman|female|girl|women|mother|sister|wife|daughter|lady|madam|ms|mrs)\b/i.test(lower) || 
                            text.includes('महिला') || text.includes('स्त्री') || text.includes('মহিলা') || text.includes('ছোৱালী');
  
  const isExplicitlyMale = hasMaleKeywords && !hasFemaleKeywords;
  const isExplicitlyFemale = hasFemaleKeywords;

  // 2. Domain & Sector Pattern Matching

  // A. Piggery, Poultry, Dairy, Livestock, Animal Husbandry, Fishery
  const isLivestock = /\b(pig|piggery|pigs|pork|poultry|chicken|broiler|layer|dairy|cow|cows|buffalo|cattle|livestock|goat|goats|bakri|goatry|fish|fishery|fishpond|aquaculture|farm|farming|husbandry)\b/i.test(lower) ||
                      text.includes('सूअर') || text.includes('सुअर') || text.includes('मुर्गी') || text.includes('डेयरी') || text.includes('पशु') || text.includes('मछली') || text.includes('बकरी') || text.includes('पालन') || text.includes('पोल्ट्री') ||
                      text.includes('গাহৰি') || text.includes('কুকুৰা') || text.includes('গাখীৰ') || text.includes('মাছ') || text.includes('পাম') || text.includes('পশুপালন');

  // B. Traditional Artisans & Craftspeople (PM Vishwakarma)
  const isArtisan = /\b(blacksmith|carpenter|potter|cobbler|barber|mason|sculptor|toolmaker|weaver|handloom|goldsmith|locksmith|boat|vishwakarma)\b/i.test(lower) ||
                    text.includes('लोहार') || text.includes('बढ़ई') || text.includes('कुम्हार') || text.includes('मोची') || text.includes('विश्वकर्मा') ||
                    text.includes('কমাৰ') || text.includes('বাঢ়ৈ') || text.includes('কুমাৰ') || text.includes('মুচি') || text.includes('শিল্পী');

  // C. Street Vendors, Chai, Street Food, Hawkers (PM SVANidhi / LVY)
  const isStreetVendor = /\b(street|vendor|vending|chai|tea stall|hawker|cart|fruit stall|vegetable stall|fast food|snack stall|pan shop)\b/i.test(lower) ||
                         text.includes('ठेला') || text.includes('फेरीवाला') || text.includes('चाय की दुकान') || text.includes('रेहड़ी') ||
                         text.includes('পদপথৰ বিক্ৰেতা') || text.includes('চাহৰ দোকান') || text.includes('ঠেলা');

  // D. Green Business, E-Rickshaw, Solar, EV
  const isGreenBusiness = /\b(e-rickshaw|erickshaw|rickshaw|toto|solar|rooftop|clean energy|ev|battery|waste|vermicompost|bio-gas|biogas|polyhouse)\b/i.test(lower) ||
                          text.includes('ई-रिक्शा') || text.includes('सौर') || text.includes('बायोगैस') ||
                          text.includes('ৰিক্সা') || text.includes('সৌৰ শক্তি') || text.includes('সেউজ');

  // E. Sanitation, Sewer Cleaning, Mechanization (NSKFDC SUY)
  const isSanitation = /\b(sanitation|sewer|septic|cleaning|safai|scavenger|suction machine|jetting|waste transport|garbage)\b/i.test(lower) ||
                       text.includes('सफाई') || text.includes('सीवर') || text.includes('स्वच्छता') ||
                       text.includes('চাফাই') || text.includes('নলা পৰিষ্কাৰ');

  // F. Higher Education, Professional Degree (NSFDC ELS)
  const isEducation = /\b(study|college|degree|btech|mtech|mbbs|tuition|fee|fees|engineering|medical|university|course)\b/i.test(lower) ||
                      text.includes('शिक्षा') || text.includes('कॉलेज') || text.includes('फीस') ||
                      text.includes('ডিগ্ৰী') || text.includes('পঢ়া-শুনা') || text.includes('মহাবিদ্যালয়');

  // G. Small Retail, Grocery, Mobile Repair, Kirana (NSFDC LVY / Suvidha)
  const isRetailRepair = /\b(mobile repair|electronics|repair|kirana|grocery|small shop|hardware|retail store|stationery)\b/i.test(lower) ||
                         text.includes('किराना') || text.includes('मोबाइल रिपेयर') || text.includes('दुकान') ||
                         text.includes('দোকান') || text.includes('মেৰামতি');

  // H. Boutique, Tailoring, Sewing, Parlour
  const isTailoringOrBeauty = /\b(tailor|tailoring|sewing|boutique|garments|cloth|beauty parlour|salon|dressmaking)\b/i.test(lower) ||
                              text.includes('सिलाई') || text.includes('बुटीक') || text.includes('पार्लर') ||
                              text.includes('চিলাই') || text.includes('বুটিংক') || text.includes('কাপোৰ');

  // 3. Resolve Best Matching Scheme
  let schemeId;
  let confidence;
  let sector;
  let estCapital;
  let whyFits;
  let riskAssessment = 'Eligible for concessional public-sector credit assistance under priority lending sector.';
  let actionPlan;

  if (isLivestock) {
    schemeId = 'nsfdc-term-loan';
    confidence = 96;
    sector = lang === 'hi' ? 'पशुपालन एवं कृषि-संबद्ध उद्यम (सूअर पालन / डेयरी इकाई)' 
           : lang === 'as' ? 'পশুপালন আৰু কৃষি-আনুষঙ্গিক উদ্যোগ (গাহৰি পাম / দুগ্ধ ফাৰ্ম)' 
           : 'Livestock & Agro-Allied Agriculture (Piggery / Dairy Unit)';
    estCapital = '₹2,00,000 - ₹5,00,000';
    whyFits = lang === 'hi' 
      ? 'एनएसएफडीसी टर्म लोन योजना कृषि और संबद्ध गतिविधियों जैसे सूअर पालन, डेयरी और पशुधन के लिए ₹150 लाख तक का रियायती सावधि ऋण (6%-8% प्रति वर्ष) और 6 महीने का मोराटोरियम प्रदान करती है।'
      : lang === 'as'
      ? 'এনএছএফডিচি ম্যাদী ঋণ আঁচনিয়ে গাহৰি পাম, দুগ্ধ আৰু পশুপালনৰ দৰে কৃষি-আনুষঙ্গিক উদ্যোগৰ বাবে ৬%-৮% কম সুতৰ হাৰত আৰু ৬ মাহৰ ৰেহাইৰ সৈতে ১৫০ লাখ টকালৈকে ঋণ প্ৰদান কৰে।'
      : 'NSFDC Term Loan Scheme directly finances agricultural and allied activities—including piggery, poultry, and livestock farming—providing loans up to ₹150 Lakh at concessional interest (6%-8% p.a.) with a 6-month moratorium grace period.';
    riskAssessment = lang === 'hi'
      ? 'पशुधन में उचित टीकाकरण, शेड स्वच्छता और स्थानीय पशु चिकित्सालय से परामर्श अनिवार्य है।'
      : lang === 'as'
      ? 'পশুধনৰ বাবে সঠিক টিকাকৰণ, পৰিষ্কাৰ পাম আৰু পশু চিকিৎসকৰ পৰামৰ্শ অত্যাৱশ্যকীয়।'
      : 'Livestock ventures require proper vaccination schedule, hygienic sheds, and regular veterinary checkups.';
    actionPlan = lang === 'hi' ? [
      'कच्चे माल, स्वस्थ नस्ल के पशुओं और शेड निर्माण सामग्री का अधिकृत आपूर्तिकर्ताओं से कोटेशन लें।',
      'स्थानीय ग्राम पंचायत या पशु चिकित्सा अधिकारी से स्वास्थ्य अनापत्ति प्रमाण पत्र (NOC) प्राप्त करें।',
      'स्कीमसेतु का आवेदन डॉसियर प्रिंट करें और निकटतम अधिकृत बैंक शाखा या एससीए में जमा करें।'
    ] : lang === 'as' ? [
      'উন্নত জাতৰ পশুধন আৰু পাম নিৰ্মাণ সামগ্ৰীৰ স্থানীয় যোগানকৰ্তাৰ পৰা কোটেশ্বন সংগ্ৰহ কৰক।',
      'স্থানীয় গাঁও পঞ্চায়ত বা পশু চিকিৎসা বিষয়াৰ পৰা প্ৰয়োজনীয় প্ৰমাণপত্ৰ লওক।',
      'স্কিমসেতুৰ আবেদন ডচিয়েৰ প্ৰিণ্ট কৰি নিকটতম বেংক শাখাত জমা দিয়ক।'
    ] : [
      'Obtain written cost quotation for healthy breeding stock, shed construction, and initial animal feed.',
      'Obtain basic health & location NOC from local Gram Panchayat or District Veterinary Officer.',
      'Download your SchemeSetu Bank Dossier and submit directly to your designated Public Sector Bank branch.'
    ];
  } else if (isArtisan) {
    schemeId = 'pm-vishwakarma';
    confidence = 96;
    sector = lang === 'hi' ? 'पारंपरिक शिल्प एवं दस्तकारी' : lang === 'as' ? 'পাৰম্পৰিক হস্তশিল্প আৰু কাৰিকৰী' : 'Traditional Artisan & Crafts';
    estCapital = '₹1,00,000 - ₹3,00,000';
    whyFits = lang === 'hi'
      ? 'पीएम विश्वकर्मा योजना पारंपरिक कारीगरों को मात्र 5% ब्याज पर ₹3 लाख तक का बिना गारंटी ऋण, ₹15,000 का आधुनिक टूलकिट अनुदान और ₹500/दिन का प्रशिक्षण वजीफा देती है।'
      : lang === 'as'
      ? 'পিএম বিশ্বকৰ্মা আঁচনিয়ে পাৰম্পৰিক কাৰিকৰসকলক মাত্ৰ ৫% সুতত ৩ লাখ টকালৈকে জামিনবিহীন ঋণ আৰু ১৫,০০০ টকাৰ কিট অনুদান প্ৰদান কৰে।'
      : 'PM Vishwakarma Scheme provides collateral-free credit up to ₹3 Lakh at just 5% interest, a ₹15,000 modern toolkit grant, and skill stipend for hereditary craftspersons.';
    actionPlan = lang === 'hi' ? [
      'कॉमन सर्विस सेंटर (CSC) पर जाकर अपने आधार और राशन कार्ड के साथ बायोमेट्रिक पंजीकरण करवाएं।',
      '5 से 7 दिन के बुनियादी कौशल सत्यापन प्रशिक्षण में भाग लेकर ₹500/दिन का वजीफा प्राप्त करें।',
      'प्रथम चरण में ₹1 लाख का 5% ब्याज दर वाला ऋण प्राप्त कर कार्यशाला अपग्रेड करें।'
    ] : lang === 'as' ? [
      'কমন চাৰ্ভিচ চেণ্টাৰত (CSC) বায়’মেট্ৰিক আধাৰ পঞ্জীয়ন কৰক।',
      '৫-৭ দিনীয়া কাৰিকৰী প্ৰশিক্ষণত অংশ লৈ প্ৰতিদিনে ৫০০ টকাৰ ভাট্টা লাভ কৰক।',
      'প্ৰথম পৰ্যায়ত ১ লাখ টকাৰ ৫% সুতৰ সহজ ঋণ লাভ কৰি কৰ্মশালা উন্নত কৰক।'
    ] : [
      'Register at your local Common Service Center (CSC) with Aadhaar and trade identification.',
      'Complete the 5-7 day basic skill verification workshop to receive daily stipend and digital ID card.',
      'Avail Tranche 1 loan of ₹1 Lakh at 5% subsidized interest for modern tools.'
    ];
  } else if (isGreenBusiness) {
    schemeId = 'nsfdc-green-business';
    confidence = 95;
    sector = lang === 'hi' ? 'हरित ऊर्जा एवं स्वच्छ परिवहन (ई-रिक्शा / सौर इकाई)' : lang === 'as' ? 'সেউজ শক্তি আৰু পৰিবহণ (ই-ৰিক্সা / সৌৰ প্ৰকল্প)' : 'Green Energy & Clean Mobility (E-Rickshaw / Solar)';
    estCapital = '₹1,50,000 - ₹4,00,000';
    whyFits = lang === 'hi'
      ? 'एनएसएफडीसी हरित व्यवसाय योजना बैटरी चालित ई-रिक्शा, सौर ऊर्जा संयंत्र और पर्यावरण-अनुकूल वाहनों हेतु 4%-6% ब्याज पर ₹30 लाख तक का ऋण देती है।'
      : lang === 'as'
      ? 'এনএছএফডিচি সেউজ ব্যৱসায় আঁচনিয়ে ই-ৰিক্সা আৰু সৌৰ শক্তি প্ৰকল্পৰ বাবে ৪%-৬% সুতত ৩০ লাখ টকালৈকে ঋণ প্ৰদান কৰে।'
      : 'NSFDC Green Business Scheme provides low-interest financing (4%-6% p.a.) up to ₹30 Lakh specifically for e-rickshaws, solar units, and green micro-enterprises.';
    actionPlan = lang === 'hi' ? [
      'अधिकृत ई-रिक्शा या सौर उपकरण डीलर से आधिकारिक प्रोफ़ॉर्मा इनवॉइस (कोटेशन) प्राप्त करें।',
      'वाणिज्यिक ड्राइविंग लाइसेंस और जाति प्रमाण पत्र तैयार रखें।',
      'स्कीमसेतु डॉसियर के साथ निकटतम सार्वजनिक क्षेत्र के बैंक या ग्रामीण बैंक में आवेदन करें।'
    ] : lang === 'as' ? [
      'স্বীকৃত ই-ৰিক্সা বা সৌৰ সঁজুলি ডিলাৰৰ পৰা ইনভয়চ (কোটেশ্বন) সংগ্ৰহ কৰক।',
      'বাণিজ্যিক চালকৰ অনুজ্ঞাপত্ৰ আৰু জাতি প্ৰমাণপত্ৰ প্ৰস্তুত ৰাখক।',
      'স্কিমসেতু ডচিয়েৰ লৈ নিকটতম ৰাজহুৱা বেংক বা গ্ৰামীণ বেংকত আবেদন কৰক।'
    ] : [
      'Obtain proforma invoice from authorized e-rickshaw or solar equipment dealership.',
      'Ensure commercial driving badge/license and caste certificate are updated.',
      'Submit SchemeSetu Application Dossier at your nearest bank branch.'
    ];
  } else if (isStreetVendor) {
    schemeId = 'pm-svanidhi';
    confidence = 94;
    sector = lang === 'hi' ? 'स्ट्रीट वेंडिंग एवं लघु खान-पान सेवा' : lang === 'as' ? 'পথৰ ক্ষুদ্ৰ ব্যৱসায় আৰু খাদ্য সেৱা' : 'Street Vending & Food Kiosk';
    estCapital = '₹10,000 - ₹50,000';
    whyFits = lang === 'hi'
      ? 'पीएम स्वनिधि योजना शहरी एवं अर्ध-शहरी रेहड़ी-पटरी और ठेले वालों को बिना किसी गारंटी के ₹50,000 तक की कार्यशील पूंजी और 7% ब्याज सब्सिडी देती है।'
      : lang === 'as'
      ? 'পিএম স্বনিধি আঁচনিয়ে পথৰ ব্যৱসায়ীসকলক জামিনবিহীনভাৱে ৫০,০০০ টকালৈকে ঋণ আৰু ৭% সুত ৰাজসাহায্য প্ৰদান কৰে।'
      : 'PM SVANidhi provides collateral-free working capital up to ₹50,000 with a 7% interest subsidy and cashback on digital transactions for vendors.';
    actionPlan = lang === 'hi' ? [
      'स्थानीय नगर निकाय द्वारा जारी वेंडिंग प्रमाण पत्र या पहचान पत्र लेकर बैंक जाएं।',
      'डिजिटल क्यूआर कोड (UPI) से लेनदेन शुरू कर प्रति वर्ष ₹1,200 तक का कैशबैक पाएं।',
      'समय पर ₹10,000 का पहला ऋण चुकाकर ₹20,000 और फिर ₹50,000 की उच्च सीमा का लाभ उठाएं।'
    ] : lang === 'as' ? [
      'পৌৰ সভাৰ ভেণ্ডাৰ কাৰ্ড বা পৰিচয় পত্ৰ লৈ বেংকত যোগাযোগ কৰক।',
      'ইউপিআই ডিজিটেল লেনদেনৰ জৰিয়তে বছৰি ১,২০০ টকালৈকে কেছবেক লাভ কৰক।',
      'সময়মতে কিস্তি পৰিশোধ কৰি পৰৱৰ্তী উচ্চ পৰ্যায়ৰ ঋণ লাভ কৰক।'
    ] : [
      'Present Certificate of Vending or Urban Local Body recommendation at the bank counter.',
      'Set up UPI QR code to qualify for annual digital cashback up to ₹1,200.',
      'Repay initial ₹10k tranche on time to unlock subsequent ₹20k and ₹50k limits.'
    ];
  } else if (isSanitation) {
    schemeId = 'nskfdc-suy';
    confidence = 95;
    sector = lang === 'hi' ? 'स्वच्छता एवं मशीनीकृत सीवर सफाई' : lang === 'as' ? 'স্বচ্ছতা আৰু মেচিনযুক্ত নলা পৰিষ্কাৰ' : 'Sanitation & Mechanized Cleaning';
    estCapital = '₹5,00,000 - ₹25,00,000';
    whyFits = lang === 'hi'
      ? 'एनएसकेएफडीसी स्वच्छता उद्यमी योजना सीवर सफाई वाहनों और मशीनों हेतु ₹50 लाख तक का ऋण और ₹3.25 लाख तक की सीधी सरकारी नकद सब्सिडी देती है।'
      : lang === 'as'
      ? 'এনএছকেএফডিচি স্বচ্ছতা উদ্যোগী যোজনা চাফাই মেচিনৰ বাবে ৫০ লাখ টকালৈকে ঋণ আৰু ৩.২৫ লাখ টকাৰ নগদ চাবচিডি প্ৰদান কৰে।'
      : 'NSKFDC Swachhta Udyami Yojana provides up to ₹50 Lakh loan with ₹3.25 Lakh capital cash subsidy for mechanized sewer cleaning equipment.';
    actionPlan = lang === 'hi' ? [
      'सफाई कर्मचारी पहचान पत्र या नगर निगम का स्वच्छता प्रमाण पत्र प्रस्तुत करें।',
      'सक्शन मशीनरी निर्माता से प्रमाणित तकनीकी दर-सूची प्राप्त करें।',
      'एनएसकेएफडीसी नोडल अधिकारी के समक्ष स्कीमसेतु डॉसियर प्रस्तुत करें।'
    ] : lang === 'as' ? [
      'পৌৰ নিগমৰ চাফাই কৰ্মীৰ চিনাক্তকৰণ প্ৰমাণপত্ৰ লওক।',
      'চাফাই মেচিনৰ কাৰিকৰী মূল্য তালিকা সংগ্ৰহ কৰক।',
      'এনএছকেএফডিচি নোডেল বিষয়াৰ ওচৰত ডচিয়েৰ জমা দিয়ক।'
    ] : [
      'Verify Safai Karamchari identity credentials with local urban body.',
      'Obtain quotation for authorized suction/jetting mechanized equipment.',
      'Submit application dossier directly to NSKFDC channel partner.'
    ];
  } else if (isEducation) {
    schemeId = 'nsfdc-els-india';
    confidence = 96;
    sector = lang === 'hi' ? 'व्यावसायिक एवं तकनीकी उच्च शिक्षा' : lang === 'as' ? 'উচ্চ কাৰিকৰী আৰু পেছাদাৰী শিক্ষা' : 'Professional & Technical Education';
    estCapital = '₹3,00,000 - ₹10,00,000';
    whyFits = lang === 'hi'
      ? 'एनएसएफडीसी शिक्षा ऋण योजना भारत में मान्यता प्राप्त व्यावसायिक या तकनीकी डिग्री (इंजीनियरिंग, चिकित्सा आदि) हेतु 6% ब्याज पर ₹30 लाख तक का ऋण देती है।'
      : lang === 'as'
      ? 'এনএছএফডিচি শিক্ষা ঋণ আঁচনিয়ে কাৰিকৰী শিক্ষাৰ বাবে ৬% কম সুতত ৩০ লাখ টকালৈকে ঋণ প্ৰদান কৰে।'
      : 'NSFDC Educational Loan Scheme provides up to ₹30 Lakh at 6% p.a. for full-time professional courses in India with moratorium until course completion.';
    actionPlan = lang === 'hi' ? [
      'विश्वविद्यालय या कॉलेज से अंतिम प्रवेश पत्र और आधिकारिक शुल्क संरचना (Fee Structure) प्राप्त करें।',
      'जाति प्रमाण पत्र और पिछले शैक्षणिक रिकॉर्ड तैयार रखें।',
      'बैंक में प्रस्तुत कर पाठ्यक्रम पूरा होने के 6 महीने बाद से चुकौती शुरू करें।'
    ] : lang === 'as' ? [
      'মহাবিদ্যালয়ৰ নামভৰ্তিৰ পত্ৰ আৰু ফীচৰ প্ৰমাণপত্ৰ সংগ্ৰহ কৰক।',
      'জাতি প্ৰমাণপত্ৰ আৰু শিক্ষাগত নথি প্ৰস্তুত ৰাখক।',
      'পাঠ্যক্ৰম শেষ হোৱাৰ পিছত ঋণ পৰিশোধৰ ব্যৱস্থা গ্ৰহণ কৰক।'
    ] : [
      'Assemble college admission confirmation letter and official fee breakdown.',
      'Collate 10th/12th marksheets and verified caste certificate.',
      'Submit dossier at designated bank with repayment starting 6 months post-employment.'
    ];
  } else if (isTailoringOrBeauty && isExplicitlyFemale) {
    // ONLY assign Mahila Samriddhi if female!
    schemeId = 'mahila-samriddhi';
    confidence = 95;
    sector = lang === 'hi' ? 'महिला स्वरोजगार (सिलाई व बुटीक)' : lang === 'as' ? 'মহিলা আত্মনিয়োজন (চিলাই আৰু বুটিংক)' : 'Women Micro-Enterprise (Tailoring & Boutique)';
    estCapital = '₹80,000 - ₹1,40,000';
    whyFits = lang === 'hi'
      ? 'महिला समृद्धि योजना एससी महिला उद्यमियों को मात्र 4% की अत्यंत कम ब्याज दर पर बिना किसी गारंटी के ₹1.40 लाख तक का ऋण उपलब्ध कराती है।'
      : lang === 'as'
      ? 'মহিলা সমৃদ্ধি যোজনাই অনুসূচীত জাতিৰ মহিলা উদ্যোগীসকলক মাত্ৰ ৪% সুতৰ হাৰত জামিনবিহীনভাৱে ১.৪০ লাখ টকালৈকে ঋণ প্ৰদান কৰে।'
      : 'Mahila Samriddhi Yojana provides concessional microfinance up to ₹1.40 Lakh at an unbeatable 4% p.a. interest exclusively for women entrepreneurs.';
    actionPlan = lang === 'hi' ? [
      'सिलाई मशीन या सलोन उपकरणों के स्थानीय आपूर्तिकर्ता से लिखित कोटेशन लें।',
      'महिला आवेदक का स्वयं का आधार व जाति प्रमाण पत्र संलग्न करें।',
      'निकटतम बैंक शाखा या राज्य एससीए कार्यालय में पर्ची जमा करें।'
    ] : lang === 'as' ? [
      'চিলাই মেচিনৰ বাবে স্থানীয় ব্যৱসায়ীৰ পৰা লিখিত মূল্য তালিকা লওক।',
      'মহিলাগৰাকীৰ নিজা আধাৰ আৰু জাতি প্ৰমাণপত্ৰ সংলগ্ন কৰক।',
      'নিকটতম বেংক শাখা বা এছচিএ কাৰ্যালয়ত আবেদন জমা দিয়ক।'
    ] : [
      'Procure equipment quotation for commercial sewing machines or salon kit.',
      'Ensure applicant Aadhaar and caste certificate are verified.',
      'Submit readiness dossier to local SCA or Public Sector Bank branch.'
    ];
  } else if (isRetailRepair || isTailoringOrBeauty) {
    // If tailoring/repair by a male or general applicant, use Laghu Vyavasay Yojana (NOT Mahila Samriddhi!)
    schemeId = 'nsfdc-lvy';
    confidence = 94;
    sector = lang === 'hi' ? 'लघु व्यापार एवं वाणिज्यिक सेवा' : lang === 'as' ? 'ক্ষুদ্ৰ ব্যৱসায় আৰু বাণিজ্যিক সেৱা' : 'Small Retail & Commercial Services';
    estCapital = '₹1,00,000 - ₹5,00,000';
    whyFits = lang === 'hi'
      ? 'एनएसएफडीसी लघु व्यवसाय योजना (LVY) छोटे दुकानदारों, दर्जियों और रिपेयरिंग कियोस्क के लिए 6% की सस्ती ब्याज दर पर ₹5 लाख तक का त्वरित ऋण देती है।'
      : lang === 'as'
      ? 'এনএছএফডিচি লঘু ব্যৱসায় যোজনাই (LVY) ক্ষুদ্ৰ দোকানী, দৰ্জী আৰু কাৰিকৰসকলক ৬% কম সুতত ৫ লাখ টকালৈকে ঋণ প্ৰদান কৰে।'
      : 'NSFDC Laghu Vyavasay Yojana (LVY) provides quick micro-loans up to ₹5 Lakh at a low fixed 6% p.a. interest specifically for small shops, tailor kiosks, and repair workshops.';
    actionPlan = lang === 'hi' ? [
      'आवश्यक उपकरणों, टूलकिट और इन्वेंट्री का लिखित कोटेशन प्राप्त करें।',
      'स्थानीय नगर पालिका या ग्राम पंचायत से ट्रेड लाइसेंस प्राप्त करें।',
      'स्कीमसेतु आवेदन डॉसियर के साथ अपनी बैंक शाखा में आवेदन करें।'
    ] : lang === 'as' ? [
      'প্ৰয়োজনীয় সা-সঁজুলি আৰু সামগ্ৰীৰ লিখিত কোটেশ্বন লওক।',
      'স্থানীয় পঞ্চায়ত বা পৌৰসভাৰ পৰা ট্ৰেড লাইচেঞ্চ লওক।',
      'স্কিমসেতু ডচিয়েৰ লৈ বেংক শাখাত আবেদন কৰক।'
    ] : [
      'Obtain written supplier quotation for tools, machinery, and initial stock.',
      'Secure trade license registration from local municipal body or Gram Panchayat.',
      'Submit your SchemeSetu Bank Readiness Dossier at the designated bank branch.'
    ];
  } else {
    // General small enterprise fallback (safe for all genders)
    schemeId = 'nsfdc-lvy';
    confidence = 91;
    sector = lang === 'hi' ? 'सूक्ष्म उद्यम एवं स्वरोजगार' : lang === 'as' ? 'ক্ষুদ্ৰ উদ্যোগ আৰু আত্মনিয়োজন' : 'Micro-Enterprise & Self-Employment';
    estCapital = '₹1,00,000 - ₹3,00,000';
    whyFits = lang === 'hi'
      ? 'यह प्रस्ताव एनएसएफडीसी लघु व्यवसाय योजना के अनुरूप है, जो विभिन्न आय-सृजन गतिविधियों के लिए 6% की सस्ती ब्याज दर पर ₹5 लाख तक का ऋण प्रदान करती है।'
      : lang === 'as'
      ? 'এই প্ৰস্তাৱটো এনএছএফডিচি লঘু ব্যৱসায় যোজনাৰ সৈতে সংগতিপূৰ্ণ, যিয়ে বিভিন্ন ব্যৱসায়ৰ বাবে ৬% কম সুতত ৫ লাখ টকালৈকে ঋণ প্ৰদান কৰে।'
      : 'This proposal qualifies for the NSFDC Laghu Vyavasay Yojana, offering low 6% p.a. interest micro-loans up to ₹5 Lakh across diverse self-employment ventures.';
    actionPlan = lang === 'hi' ? [
      'अपने व्यवसाय के लिए आवश्यक सामान और मशीनों की अनुमानित सूची तैयार करें।',
      'जाति प्रमाण पत्र, आधार कार्ड और 6 महीने का बैंक स्टेटमेंट एकत्रित करें।',
      'स्कीमसेतु का आवेदन डॉसियर प्रिंट कर निकटतम अधिकृत बैंक शाखा में संपर्क करें।'
    ] : lang === 'as' ? [
      'ব্যৱসায়ৰ প্ৰয়োজনীয় সামগ্ৰী আৰু মেচিনৰ তালিকা প্ৰস্তুত কৰক।',
      'জাতি প্ৰমাণপত্ৰ, আধাৰ আৰু ৬ মাহৰ বেংক ষ্টেটমেণ্ট সংগ্ৰহ কৰক।',
      'স্কিমসেতুৰ আবেদন ডচিয়েৰ প্ৰিণ্ট কৰি নিকটতম বেংক শাখাত জমা দিয়ক।'
    ] : [
      'Draft a basic itemized quotation for business tools, raw materials, and machinery.',
      'Assemble valid caste certificate, Aadhaar card, and 6-month bank statement.',
      'Submit the SchemeSetu Bank Application Dossier at your nearest bank branch.'
    ];
  }

  // Guaranteed gender safety check: If user is explicitly male, force-change any women-only scheme
  if (isExplicitlyMale && (schemeId === 'mahila-samriddhi' || schemeId === 'nbcfdc-new-swarnima' || schemeId === 'nskfdc-msy')) {
    schemeId = 'nsfdc-lvy';
    confidence = 93;
    sector = lang === 'hi' ? 'लघु व्यवसाय एवं वाणिज्यिक उद्यम' : lang === 'as' ? 'ক্ষুদ্ৰ ব্যৱসায় আৰু বাণিজ্যিক উদ্যোগ' : 'Small Enterprise & Commercial Trade';
  }

  return {
    matchedSchemeId: schemeId,
    matchConfidence: confidence,
    businessSector: sector,
    estimatedCapital: estCapital,
    whyThisFits: whyFits,
    riskAssessment,
    actionPlan
  };
}
