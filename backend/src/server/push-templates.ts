/**
 * Push Notification Templates (i18n)
 *
 * Issue #145: Push notification templates in 4 languages.
 * All templates are privacy-safe — no Tier 1/2/3 content in push payloads.
 */

export interface PushTemplate {
  title: string;
  body: string;
}

const templates: Record<string, Record<string, PushTemplate>> = {
  invite_accepted: {
    en: { title: 'Partner Joined! 🎉', body: 'Your partner has accepted your invite. Start your first session!' },
    es: { title: '¡Tu pareja se unió! 🎉', body: 'Tu pareja aceptó tu invitación. ¡Comienza tu primera sesión!' },
    pt: { title: 'Parceiro(a) entrou! 🎉', body: 'Seu(sua) parceiro(a) aceitou seu convite. Comece sua primeira sessão!' },
    he: { title: 'בן/בת הזוג הצטרף/ה! 🎉', body: 'בן/בת הזוג קיבל/ה את ההזמנה שלך. התחל/י את הפגישה הראשונה!' },
  },
  new_message: {
    en: { title: 'New Message', body: 'You have a new mediated message waiting.' },
    es: { title: 'Nuevo Mensaje', body: 'Tienes un nuevo mensaje mediado esperando.' },
    pt: { title: 'Nova Mensagem', body: 'Você tem uma nova mensagem mediada esperando.' },
    he: { title: 'הודעה חדשה', body: 'יש לך הודעה מתווכת חדשה ממתינה.' },
  },
  consent_update: {
    en: { title: 'Terms Updated', body: 'We have updated our terms. Please review and accept to continue.' },
    es: { title: 'Términos Actualizados', body: 'Hemos actualizado nuestros términos. Revisa y acepta para continuar.' },
    pt: { title: 'Termos Atualizados', body: 'Atualizamos nossos termos. Revise e aceite para continuar.' },
    he: { title: 'תנאים עודכנו', body: 'עדכנו את התנאים שלנו. אנא עיין/י ואשר/י להמשך.' },
  },
  session_reminder: {
    en: { title: 'Time for a Check-in', body: "It's been a while since your last session. Your partner might appreciate a conversation." },
    es: { title: 'Hora de un Check-in', body: 'Ha pasado un tiempo desde tu última sesión. Tu pareja apreciaría una conversación.' },
    pt: { title: 'Hora de um Check-in', body: 'Faz tempo desde sua última sessão. Seu(sua) parceiro(a) pode apreciar uma conversa.' },
    he: { title: 'זמן לצ׳ק-אין', body: 'עבר זמן מהפגישה האחרונה שלך. בן/בת הזוג שלך עשוי/ה להעריך שיחה.' },
  },
};

/**
 * Get a localized push notification template.
 * Falls back to English if the requested locale is not available.
 */
export function getPushTemplate(
  type: keyof typeof templates,
  locale: string = 'en',
): PushTemplate {
  const lang = locale.split('-')[0]; // 'pt-BR' → 'pt'
  const typeTemplates = templates[type];
  if (!typeTemplates) {
    return { title: 'Relio', body: 'You have a new notification.' };
  }
  return typeTemplates[lang] || typeTemplates.en;
}

export { templates as pushTemplates };
