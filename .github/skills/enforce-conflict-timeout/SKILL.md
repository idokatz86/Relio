# Enforce Conflict Timeout

## Objective
Automatically pause destructive interactions to prevent emotional damage — including digital-specific "cyberspace flooding" where text-based conflict removes natural structural pauses.

## Standard Timeout Protocol
1. Ingest rapid-frequency Tier 1 messages.
2. If text pattern matches flooding metrics, issue an interrupt.
3. Formulate Tier 3 response in CASUAL, warm language — like a caring friend:
   - EN: "Hey — things got pretty heated there. That's okay, it happens. Let's take a 20-minute breather."
   - ES: "Ey, las cosas se pusieron intensas. Tranqui, es normal. Vamos a tomar un respiro de 20 minutos."
   - PT: "Olha, a conversa esquentou — e tá tudo bem. Bora dar uma pausa de 20 minutos."
   - HE: "תשמעו, הדברים התלהטו פה — וזה בסדר, קורה לכולם. בואו ניקח הפסקה של 20 דקות."
   - NEVER use formal/clinical phrasing. See `israeli-hebrew-tone-guide` skill for HE.
4. Lock chat input for the duration unless it is an emergency bypass request.

## Cyberspace Flooding Timeout Extensions
5. Detect **late-night conflict** (messages after 11pm local time) → suggest pausing in casual tone:
   - EN: "Real talk — it's late and hard conversations hit different at night. How about we pick this up tomorrow when you're both rested?"
   - HE: "תשמעו, השעה מאוחרת ודברים כאלה נשמעים יותר גרועים בלילה. מה אומרים, נמשיך מחר כשהראש צלול?"
6. Detect **cross-platform spillover** (references to fights in other apps: "your text", "what you posted") → redirect: "It sounds like this started outside our space. Let's process what's happening here, where both perspectives can be heard safely."
7. Detect **message length explosion** (>500 chars after previously short exchanges) → suggest journaling: "It seems like there's a lot you need to express. Would it help to use your private journal first?"
8. Detect **screenshot/evidence-gathering language** ("I have proof", "look at this") → hard redirect: "Our focus here is on understanding each other's feelings, not building a case."
9. Detect **read-receipt anxiety** ("I know you read it", "why aren't you responding") → normalize: "Silence doesn't always mean what we fear. Your partner may need time to process."

## Post-Timeout Re-Entry (Digital-Specific)
10. After digital-triggered timeout, re-entry in casual tone:
   - EN: "So here's the thing with texting — you can't hear tone, and everything looks worse in writing. Before we jump back in, what's the one thing you want your partner to know you're feeling right now?"
   - HE: "נו תשמעו, הבעיה עם הודעות זה שאי אפשר לשמוע את הטון ואז הכל נשמע יותר גרוע. לפני שממשיכים — כל אחד אומר דבר אחד שחשוב לו שהשני ידע."
