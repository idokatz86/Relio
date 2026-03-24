/**
 * Relio Market Validation — Google Forms Auto-Generator (v2)
 * 
 * HOW TO USE:
 * 1. Go to https://script.google.com
 * 2. Click "New Project"
 * 3. Delete the default code and paste this entire file
 * 4. Click "Run" (▶) — select createBothForms()
 * 5. Authorize when prompted (first time only)
 * 6. Check the Execution Log for both form URLs
 * 
 * Two forms will be created in your Google Drive:
 *   - "Relationship Communication Survey" (English)
 *   - "סקר תקשורת זוגית" (Hebrew)
 */

function createBothForms() {
  var enUrl = createEnglishForm();
  var heUrl = createHebrewForm();

  Logger.log('=== FORMS CREATED SUCCESSFULLY ===');
  Logger.log('English Form: ' + enUrl);
  Logger.log('Hebrew Form:  ' + heUrl);
  Logger.log('==================================');
  Logger.log('Share these links on Facebook!');
}

// ─────────────────────────────────────────────
// ENGLISH FORM (14 Questions)
// ─────────────────────────────────────────────
function createEnglishForm() {
  var form = FormApp.create('Relationship Communication Survey — Help Us Build Something Better');

  form.setDescription(
    "We're researching how couples handle difficult conversations. " +
    "This anonymous 3-minute survey helps us understand real communication challenges. " +
    "No selling, no spam — just honest research by two founders building a tool to help couples communicate better. " +
    "Your answers are completely anonymous."
  );

  form.setConfirmationMessage('Thank you! Your response helps us build a better tool for couples. 💙');
  form.setAllowResponseEdits(false);
  form.setLimitOneResponsePerUser(true);
  form.setShowLinkToRespondAgain(false);
  form.setProgressBar(true);
  form.setCollectEmail(false);

  // Q1 — Relationship status
  form.addMultipleChoiceItem()
    .setTitle('What is your current relationship status?')
    .setChoiceValues([
      'Dating (less than 6 months)',
      'Dating (6–18 months)',
      'In a committed relationship / living together',
      'Engaged',
      'Married (0–5 years)',
      'Married (5+ years)',
      'Separated / Divorcing',
      'Co-parenting after separation',
      'Single (but interested in relationship tools)'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // Q2 — Disagreement patterns
  form.addCheckboxItem()
    .setTitle('When you and your partner disagree, what typically happens? (Select all that apply)')
    .setChoiceValues([
      'One of us shuts down / goes silent',
      'We raise our voices or argue heatedly',
      'We text/message instead of talking face to face',
      'One of us brings up past issues',
      'We avoid the topic entirely',
      'We talk it out calmly (most of the time)',
      'We involve friends or family',
      'We take a break and come back to it'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // Q3 — Holding back
  form.addMultipleChoiceItem()
    .setTitle('Have you ever wanted to say something important to your partner but couldn\'t?')
    .setChoiceValues([
      'Yes, often — I hold back a lot',
      'Sometimes — on sensitive topics',
      'Rarely — I usually say what I mean',
      'Never — we communicate openly'
    ])
    .setRequired(true);

  // Q4 — What stops you
  form.addCheckboxItem()
    .setTitle('What stops you from saying what you really feel? (Select all that apply)')
    .setChoiceValues([
      'Fear of their reaction (anger, crying, shutting down)',
      'I don\'t know how to phrase it without sounding hurtful',
      'It feels too vulnerable',
      'Past attempts went badly',
      'Timing is never right',
      'I\'m afraid it will lead to a breakup',
      'Nothing stops me — I express myself freely'
    ])
    .showOtherOption(true)
    .setRequired(false);

  // Q5 — Previous attempts
  form.addCheckboxItem()
    .setTitle('Have you tried any of the following to improve communication? (Select all that apply)')
    .setChoiceValues([
      'Couples therapy / counseling',
      'Self-help books (Gottman, Chapman, etc.)',
      'Relationship apps (Lasting, Paired, etc.)',
      'Online courses or workshops',
      'Talking to friends / family',
      'Journaling',
      'Nothing specific'
    ])
    .showOtherOption(true)
    .setRequired(false);

  // Q6 — Why didn't it work
  form.addCheckboxItem()
    .setTitle('If the above didn\'t fully solve the problem — why not? (Select all that apply)')
    .setChoiceValues([
      'Too expensive (therapy costs $150–300/session)',
      'Scheduling was difficult (conflicting work/life schedules)',
      'My partner refused to participate',
      'It felt awkward or uncomfortable',
      'Didn\'t see results fast enough',
      'The advice felt generic / not personalized',
      'I didn\'t stick with it long enough',
      'It helped somewhat but didn\'t fix the core issue',
      'I haven\'t tried anything yet'
    ])
    .showOtherOption(true)
    .setRequired(false);

  // Q7 — Interest (1-10)
  form.addScaleItem()
    .setTitle(
      'Imagine an AI tool that could help you express a difficult feeling to your partner — ' +
      'translated into words they can actually hear — while keeping your raw, private thoughts completely confidential. ' +
      'Only the constructive version reaches your partner.\n\n' +
      'How interested would you be in using this?'
    )
    .setBounds(1, 10)
    .setLabels('Not at all interested', 'Extremely interested')
    .setRequired(true);

  // Q8 — Feature priority
  form.addCheckboxItem()
    .setTitle('Which features would matter most to you? (Select up to 3)')
    .setChoiceValues([
      '🔒 My private venting stays private — partner never sees it',
      '🤖 AI translates my frustration into something constructive',
      '💬 Real-time mediated conversation between both partners',
      '📊 Tracking communication patterns over time',
      '🧠 Understanding my attachment style',
      '📱 Available on my phone anytime (not just therapy hours)',
      '💰 Much cheaper than therapy ($15/mo vs $200/session)',
      '🚨 Safety detection if things escalate',
      '🌐 Available in my language'
    ])
    .setRequired(true);

  // Q9 — Willingness to pay
  form.addMultipleChoiceItem()
    .setTitle('How much would you pay monthly for a tool like this?')
    .setChoiceValues([
      'I wouldn\'t pay — free only',
      '$4.99/month',
      '$9.99/month',
      '$14.99/month (both partners included)',
      '$24.99/month (premium with crisis support)',
      'I\'d pay more if it really works'
    ])
    .setRequired(true);

  // Q10 — Urgency (1-10)
  form.addScaleItem()
    .setTitle('On a scale of 1–10, how urgent is improving communication in your relationship RIGHT NOW?')
    .setBounds(1, 10)
    .setLabels('Not urgent at all', 'Extremely urgent — affecting my daily life')
    .setRequired(true);

  // Q11 — Age
  form.addMultipleChoiceItem()
    .setTitle('Your age range')
    .setChoiceValues([
      '18–24',
      '25–34',
      '35–44',
      '45–54',
      '55+'
    ])
    .setRequired(true);

  // Q12 — Country
  form.addListItem()
    .setTitle('What country do you live in?')
    .setChoiceValues([
      'United States',
      'United Kingdom',
      'Canada',
      'Australia',
      'Israel',
      'Germany',
      'France',
      'Spain',
      'Brazil',
      'Mexico',
      'India',
      'Netherlands',
      'Sweden',
      'Italy',
      'South Africa',
      'New Zealand',
      'Ireland',
      'Portugal',
      'Argentina',
      'Colombia',
      'Chile',
      'Singapore',
      'Japan',
      'South Korea',
      'Philippines',
      'Nigeria',
      'Kenya',
      'UAE',
      'Saudi Arabia',
      'Egypt',
      'Turkey',
      'Poland',
      'Czech Republic',
      'Romania',
      'Greece',
      'Switzerland',
      'Austria',
      'Belgium',
      'Denmark',
      'Norway',
      'Finland'
    ])
    .setRequired(true);

  // Q13 — Launch notification
  form.addMultipleChoiceItem()
    .setTitle('Would you like to be notified when we launch?')
    .setChoiceValues([
      'Yes — I\'d love early access (please enter email below)',
      'Maybe — keep me updated but no commitment',
      'No thanks — just wanted to share my opinion'
    ])
    .setRequired(false);

  // Q13b — Email
  form.addTextItem()
    .setTitle('If yes, leave your email here')
    .setHelpText('Completely optional — we\'ll never share it.')
    .setRequired(false);

  // Q14 — What would make you try
  form.addCheckboxItem()
    .setTitle('What would make you most likely to try a tool like this? (Select all that apply)')
    .setChoiceValues([
      'If my therapist recommended it',
      'If I could try it free first',
      'If I saw real reviews from other couples',
      'If my partner agreed to use it with me',
      'If it was completely anonymous / private',
      'If it was available in my language',
      'If it worked on my phone (not just desktop)',
      'If it was backed by real psychology research',
      'If a friend recommended it',
      'Nothing — I wouldn\'t try an AI tool for relationships'
    ])
    .showOtherOption(true)
    .setRequired(false);

  Logger.log('✅ English form created: ' + form.getPublishedUrl());
  return form.getPublishedUrl();
}

// ─────────────────────────────────────────────
// HEBREW FORM (14 Questions)
// ─────────────────────────────────────────────
function createHebrewForm() {
  var form = FormApp.create('סקר תקשורת זוגית — עזרו לנו לבנות משהו טוב יותר');

  form.setDescription(
    'אנחנו חוקרים איך זוגות מתמודדים עם שיחות קשות. ' +
    'הסקר האנונימי הזה לוקח 3 דקות ועוזר לנו להבין אתגרי תקשורת אמיתיים. ' +
    'בלי מכירות, בלי ספאם — רק מחקר כנה של שני מייסדים שבונים כלי שיעזור לזוגות לתקשר טוב יותר. ' +
    'התשובות שלכם אנונימיות לחלוטין.'
  );

  form.setConfirmationMessage('תודה רבה! התשובה שלכם עוזרת לנו לבנות כלי טוב יותר לזוגות. 💙');
  form.setAllowResponseEdits(false);
  form.setLimitOneResponsePerUser(true);
  form.setShowLinkToRespondAgain(false);
  form.setProgressBar(true);
  form.setCollectEmail(false);

  // ש1 — מצב זוגיות
  form.addMultipleChoiceItem()
    .setTitle('מה מצב הזוגיות שלך כרגע?')
    .setChoiceValues([
      'מתחיל/ה לצאת עם מישהו (פחות מ-6 חודשים)',
      'בזוגיות (6–18 חודשים)',
      'בזוגיות מחויבת / גרים יחד',
      'מאורסים',
      'נשואים (0–5 שנים)',
      'נשואים (5+ שנים)',
      'בהליך פרידה / גירושין',
      'הורות משותפת אחרי פרידה',
      'רווק/ה (אבל מעוניין/ת בכלים לזוגיות)'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // ש2 — דפוסי מחלוקת
  form.addCheckboxItem()
    .setTitle('כשאתם לא מסכימים, מה בדרך כלל קורה? (בחרו את כל מה שמתאים)')
    .setChoiceValues([
      'אחד מאיתנו נסגר / שותק',
      'אנחנו מרימים את הקול או רבים בחום',
      'אנחנו שולחים הודעות במקום לדבר פנים אל פנים',
      'אחד מאיתנו מעלה עניינים מהעבר',
      'אנחנו נמנעים מהנושא לגמרי',
      'אנחנו מדברים על זה ברוגע (רוב הזמן)',
      'אנחנו מערבים חברים או משפחה',
      'אנחנו לוקחים הפסקה וחוזרים לזה'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // ש3 — החזקה בפנים
  form.addMultipleChoiceItem()
    .setTitle('האם אי פעם רצית להגיד משהו חשוב לבן/בת הזוג שלך אבל לא יכולת?')
    .setChoiceValues([
      'כן, לעיתים קרובות — אני מחזיק/ה הרבה בפנים',
      'לפעמים — בנושאים רגישים',
      'לעיתים רחוקות — בדרך כלל אני אומר/ת את מה שאני חושב/ת',
      'אף פעם — אנחנו מתקשרים בגלוי'
    ])
    .setRequired(true);

  // ש4 — מה מונע
  form.addCheckboxItem()
    .setTitle('מה מונע ממך להגיד את מה שאתה באמת מרגיש? (בחרו את כל מה שמתאים)')
    .setChoiceValues([
      'פחד מהתגובה שלהם (כעס, בכי, הסתגרות)',
      'אני לא יודע/ת איך לנסח את זה בלי שזה ישמע פוגע',
      'זה מרגיש פגיע מדי',
      'ניסיונות קודמים נגמרו רע',
      'התזמון אף פעם לא מתאים',
      'אני חושש/ת שזה יוביל לפרידה',
      'שום דבר לא מונע ממני — אני מביע/ה את עצמי בחופשיות'
    ])
    .showOtherOption(true)
    .setRequired(false);

  // ש5 — ניסיונות קודמים
  form.addCheckboxItem()
    .setTitle('האם ניסית משהו מהדברים הבאים כדי לשפר תקשורת? (בחרו את כל מה שמתאים)')
    .setChoiceValues([
      'טיפול זוגי / ייעוץ',
      'ספרי עזרה עצמית',
      'אפליקציות לזוגיות',
      'קורסים או סדנאות אונליין',
      'שיחות עם חברים / משפחה',
      'כתיבה ביומן',
      'שום דבר ספציפי'
    ])
    .showOtherOption(true)
    .setRequired(false);

  // ש6 — למה לא עבד
  form.addCheckboxItem()
    .setTitle('אם הנ"ל לא פתר את הבעיה לגמרי — למה? (בחרו את כל מה שמתאים)')
    .setChoiceValues([
      'יקר מדי (טיפול עולה ₪500–₪900 לפגישה)',
      'קשה לתאם זמנים (לוחות זמנים מתנגשים)',
      'בן/בת הזוג סירב/ה להשתתף',
      'זה הרגיש מביך או לא נוח',
      'לא ראיתי תוצאות מספיק מהר',
      'העצות הרגישו גנריות / לא מותאמות אישית',
      'לא התמדתי מספיק זמן',
      'זה עזר קצת אבל לא פתר את הבעיה המרכזית',
      'עדיין לא ניסיתי שום דבר'
    ])
    .showOtherOption(true)
    .setRequired(false);

  // ש7 — עניין (1-10)
  form.addScaleItem()
    .setTitle(
      'דמיינו כלי AI שיכול לעזור לכם לבטא רגש קשה לבן/בת הזוג — ' +
      'מתורגם למילים שהם באמת יכולים לשמוע — ' +
      'בזמן שהמחשבות הפרטיות והגולמיות שלכם נשארות חסויות לחלוטין. ' +
      'רק הגרסה הבונה מגיעה לבן/בת הזוג.\n\n' +
      'כמה היית מעוניין/ת להשתמש בזה?'
    )
    .setBounds(1, 10)
    .setLabels('בכלל לא מעוניין/ת', 'מאוד מעוניין/ת')
    .setRequired(true);

  // ש8 — תכונות חשובות
  form.addCheckboxItem()
    .setTitle('אילו תכונות הכי חשובות לך? (בחרו עד 3)')
    .setChoiceValues([
      '🔒 הפריקה הפרטית שלי נשארת פרטית — בן/בת הזוג אף פעם לא רואים',
      '🤖 ה-AI מתרגם את התסכול שלי למשהו בונה',
      '💬 שיחת גישור בזמן אמת בין שני בני הזוג',
      '📊 מעקב אחרי דפוסי תקשורת לאורך זמן',
      '🧠 הבנת סגנון ההיקשרות שלי',
      '📱 זמין בטלפון בכל זמן (לא רק בשעות הטיפול)',
      '💰 הרבה יותר זול מטיפול (₪55/חודש לעומת ₪700/פגישה)',
      '🚨 זיהוי בטיחות אם דברים מסלימים',
      '🌐 זמין בשפה שלי'
    ])
    .setRequired(true);

  // ש9 — נכונות לשלם
  form.addMultipleChoiceItem()
    .setTitle('כמה היית מוכן/ה לשלם בחודש עבור כלי כזה?')
    .setChoiceValues([
      'לא הייתי משלם/ת — רק בחינם',
      '₪19/חודש',
      '₪39/חודש',
      '₪55/חודש (שני בני הזוג כלולים)',
      '₪89/חודש (פרימיום עם תמיכת משבר)',
      'הייתי משלם/ת יותר אם זה באמת עובד'
    ])
    .setRequired(true);

  // ש10 — דחיפות (1-10)
  form.addScaleItem()
    .setTitle('בסולם 1–10, כמה דחוף לך לשפר את התקשורת בזוגיות שלך עכשיו?')
    .setBounds(1, 10)
    .setLabels('בכלל לא דחוף', 'מאוד דחוף — משפיע על החיים היומיומיים שלי')
    .setRequired(true);

  // ש11 — גיל
  form.addMultipleChoiceItem()
    .setTitle('טווח גילאים')
    .setChoiceValues([
      '18–24',
      '25–34',
      '35–44',
      '45–54',
      '55+'
    ])
    .setRequired(true);

  // ש12 — מדינה
  form.addListItem()
    .setTitle('באיזו מדינה אתם גרים?')
    .setChoiceValues([
      'ישראל',
      'ארצות הברית',
      'בריטניה',
      'קנדה',
      'אוסטרליה',
      'גרמניה',
      'צרפת',
      'ספרד',
      'ברזיל',
      'מקסיקו',
      'הודו',
      'הולנד',
      'שוודיה',
      'איטליה',
      'דרום אפריקה',
      'ניו זילנד',
      'אירלנד',
      'פורטוגל',
      'ארגנטינה',
      'קולומביה',
      'צ\'ילה',
      'סינגפור',
      'יפן',
      'דרום קוריאה',
      'פיליפינים',
      'ניגריה',
      'קניה',
      'איחוד האמירויות',
      'ערב הסעודית',
      'מצרים',
      'טורקיה',
      'פולין',
      'צ\'כיה',
      'רומניה',
      'יוון',
      'שוויץ',
      'אוסטריה',
      'בלגיה',
      'דנמרק',
      'נורווגיה',
      'פינלנד'
    ])
    .setRequired(true);

  // ש13 — הודעת השקה
  form.addMultipleChoiceItem()
    .setTitle('רוצים לקבל הודעה כשנשיק?')
    .setChoiceValues([
      'כן — אשמח לגישה מוקדמת (אשאיר מייל למטה)',
      'אולי — תעדכנו אותי בלי התחייבות',
      'לא תודה — רק רציתי לשתף את הדעה שלי'
    ])
    .setRequired(false);

  // ש13b — מייל
  form.addTextItem()
    .setTitle('אם כן, השאירו מייל כאן')
    .setHelpText('לגמרי אופציונלי — לעולם לא נשתף את המייל שלכם.')
    .setRequired(false);

  // ש14 — מה יגרום לנסות
  form.addCheckboxItem()
    .setTitle('מה הכי יגרום לך לנסות כלי כזה? (בחרו את כל מה שמתאים)')
    .setChoiceValues([
      'אם המטפל/ת שלי ימליץ על זה',
      'אם אוכל לנסות בחינם קודם',
      'אם אראה ביקורות אמיתיות מזוגות אחרים',
      'אם בן/בת הזוג יסכים/תסכים להשתמש בזה איתי',
      'אם זה לגמרי אנונימי / פרטי',
      'אם זה זמין בשפה שלי',
      'אם זה עובד על הטלפון (לא רק מחשב)',
      'אם זה מבוסס על מחקר פסיכולוגי אמיתי',
      'אם חבר/ה ימליץ על זה',
      'שום דבר — לא הייתי מנסה כלי AI לזוגיות'
    ])
    .showOtherOption(true)
    .setRequired(false);

  Logger.log('✅ Hebrew form created: ' + form.getPublishedUrl());
  return form.getPublishedUrl();
}
