export type Segment = "customer" | "welper";
export type EmailLocale = "en" | "fr";

const brandGreen = "#79C000";
const textPrimary = "#1a1a1a";
const textMuted = "#4a4a4a";
const bgBody = "#f0f4ed";
const bgCard = "#ffffff";
const borderLight = "#e5e9e2";

function getLogoHtml(): string {
  const baseUrl = (process.env.PUBLIC_APP_URL || "").replace(/\/$/, "");
  const logoUrl = baseUrl ? `${baseUrl}/logos/logo-green.png` : "";
  if (logoUrl) {
    return `<img src="${logoUrl}" alt="Welpco" width="140" border="0" style="display:block; max-width:140px; height:auto; outline:none; text-decoration:none;" />`;
  }
  return `<span style="font-size:1.5rem; font-weight:700; color:${brandGreen};">Welpco</span>`;
}

const footerCopy: Record<EmailLocale, { questions: string; rights: string }> = {
  en: {
    questions: "Questions? Contact us at",
    rights: "&copy; Welpco. All rights reserved.",
  },
  fr: {
    questions: "Des questions\u00a0? Contactez-nous \u00e0",
    rights: "&copy; Welpco. Tous droits r\u00e9serv\u00e9s.",
  },
};

function wrapEmail(content: string, locale: EmailLocale): string {
  const logoHtml = getLogoHtml();
  const footer = footerCopy[locale];
  const title = locale === "fr" ? "Qu\u2019est-ce que Welpco\u00a0?" : "What is Welpco?";
  return `
<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0; padding:0; background-color:${bgBody}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: ${textPrimary};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${bgBody};">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color:${bgCard}; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid ${borderLight};">
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 3px solid ${brandGreen};">
              ${logoHtml}
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 32px 32px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 32px; border-top: 1px solid ${borderLight}; background-color: #fafbf9;">
              <p style="margin:0; font-size: 13px; color: ${textMuted};">
                ${footer.questions} <a href="mailto:support@welpco.com" style="color:${brandGreen}; text-decoration:none;">support@welpco.com</a>
              </p>
              <p style="margin: 8px 0 0; font-size: 12px; color: ${textMuted};">
                ${footer.rights}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

const pStyle = "margin: 0 0 1em; font-size: 16px; color: #1a1a1a;";
const h2Style = "margin: 1.75em 0 0.5em; font-size: 1.2rem; font-weight: 600; color: #1a1a1a;";
const listStyle = "margin: 0.5em 0 1em 1.25em; padding: 0;";
const liStyle = "margin-bottom: 0.35em;";

function getCustomerContentEn(): string {
  return `
<p style="${pStyle}">Hi,</p>
<p style="${pStyle}">Thank you for your interest in Welpco! We can't wait to get you connected to trusted Welpers in your community that could help you with a wide range of domestic services, so that you will have more free time doing the things you love with the people you love.</p>
<p style="${pStyle}">You're probably wondering how it works, so let us give you a brief explanation.</p>

<h2 style="${h2Style}">What is it?</h2>
<p style="${pStyle}">Welpco is a platform that connects you to trusted service providers in your community, which we refer to as Welpers. Welpers go through a background check and provide services to fulfill your domestic service needs.</p>

<h2 style="${h2Style}">Which services are offered?</h2>
<ul style="${listStyle}">
<li style="${liStyle}"><strong>Care:</strong> babysitter, child care, elderly care, special needs</li>
<li style="${liStyle}"><strong>Pet care:</strong> dog walks, pet grooming, aquarium and terrarium cleaning/maintenance, dog training</li>
<li style="${liStyle}"><strong>Education:</strong> tutoring, music lessons</li>
<li style="${liStyle}"><strong>In-home maintenance:</strong> housekeeping, painting, organizing, moving (packing/unpacking), furniture assembly, appliance installation, technological setup (smart tv, smart home, etc.), tv/shelf mounting</li>
<li style="${liStyle}"><strong>Exterior maintenance:</strong> lawn-mowing, tree-planting, gardening, car washing, gutter cleaning, window cleaning, exterior property cleaning, snow removal, pool opening/closing, raking leaves, summer/winter preparation</li>
<li style="${liStyle}"><strong>Health and wellness:</strong> meal preparation, personal trainer, dietician, nutritionist</li>
<li style="${liStyle}"><strong>Entertainment:</strong> catering, party-planning, magician, clown, server, assistant for party, bartender</li>
</ul>
<p style="${pStyle}">*If there is a service you need that you don't see specified in the list above, you will be able to post the service you need in our want ads where Welpers can apply.</p>

<h2 style="${h2Style}">How does it work?</h2>
<p style="${pStyle}">It's simple! You search for the service you need, view the bios of Welpers available in your community who offer that service and their rates, then select the Welper and confirm your booking. Once the Welper confirms, you will submit your payment via our secure platform. You will be able to communicate with the Welper via our platform, and once the service is completed, your payment will be released to the Welper and you can leave them a review and rating.</p>
<p style="${pStyle}">If you have any questions, you can contact us directly at <a href="mailto:support@welpco.com" style="color:${brandGreen}; text-decoration:none;">support@welpco.com</a>. We are looking forward to the launch of our platform and we will send you an email once we do!</p>
<p style="${pStyle}">Sincerely,<br><strong>The Welpco Team</strong></p>`;
}

function getWelperContentEn(): string {
  return `
<p style="${pStyle}">Thank you for your interest in Welpco! We can't wait to have you on board as one of our trusted Welpers and get you connected to customers in your community who are in need of domestic services.</p>
<p style="${pStyle}">You're probably wondering how it works, so let us give you a brief explanation.</p>

<h2 style="${h2Style}">What is it?</h2>
<p style="${pStyle}">Welpco is a platform that connects Welpers to customers in or around their community. Welpers go through a background check and provide services to fulfill domestic service needs.</p>

<h2 style="${h2Style}">Which services are offered?</h2>
<ul style="${listStyle}">
<li style="${liStyle}"><strong>Care:</strong> babysitter, child care, elderly care, special needs</li>
<li style="${liStyle}"><strong>Pet care:</strong> dog walks, pet grooming, aquarium and terrarium cleaning/maintenance, dog training</li>
<li style="${liStyle}"><strong>Education:</strong> tutoring, music lessons</li>
<li style="${liStyle}"><strong>In-home maintenance:</strong> housekeeping, painting, organizing, moving (packing/unpacking), furniture assembly, appliance installation, technological setup (smart tv, smart home, etc.), tv/shelf mounting</li>
<li style="${liStyle}"><strong>Exterior maintenance:</strong> lawn-mowing, tree-planting, gardening, car washing, gutter cleaning, window cleaning, exterior property cleaning, snow removal, pool opening/closing, raking leaves, summer/winter preparation</li>
<li style="${liStyle}"><strong>Health and wellness:</strong> meal preparation, personal trainer, dietician, nutritionist</li>
<li style="${liStyle}"><strong>Entertainment:</strong> catering, party-planning, magician, clown, server, assistant for party, bartender</li>
</ul>
<p style="${pStyle}">*Customers will also be able to post want ads for services that may not be categorized on our platform, which you can browse through and apply for, as well.</p>

<h2 style="${h2Style}">How does it work?</h2>
<p style="${pStyle}">It's simple! You create your bio as a Welper on our platform. You choose the services you'd like to offer, as well as your availability. That's right! You have the flexibility to choose your own schedule. You also choose your hourly rate for the services you'd like to offer, and we will add 25% to that fee plus tax (paid by the customer), which covers operational costs and support provided by Welpco. You will also have to pass a background check before you start earning, which insures our customers that you are trustworthy enough to be on their property. This background check is provided by Certn within our platform.</p>
<p style="${pStyle}">Once you complete your bio, schedule, and background check, you will be ready to start earning! Customers will browse for the services they need, view the Welpers in their area who provide those services, and select the Welper they wish to hire. When you are selected, you will be able to confirm the booking and communicate with the customer via our platform. Once you complete the service, your earnings will be viewable in your Welpco account and payout will be issued on a weekly basis.</p>

<h2 style="${h2Style}">How are you paid?</h2>
<p style="${pStyle}">You earn the hourly rate you chose, and the fees are deducted from the customer's total. There are no hidden fees or deductions from your earnings. We will provide you with an annual T4A tax form, which you are responsible for submitting for your provincial and federal taxes, if you meet the required threshold of annual earnings. Payout will be issued on a weekly basis via direct deposit to your bank account.</p>
<p style="${pStyle}">If you have any questions, you can contact us directly at <a href="mailto:support@welpco.com" style="color:${brandGreen}; text-decoration:none;">support@welpco.com</a>. We are looking forward to the launch of our platform and we will send you an email once we do!</p>
<p style="${pStyle}">Sincerely,<br><strong>The Welpco Team</strong></p>`;
}

function getCustomerContentFr(): string {
  return `
<p style="${pStyle}">Bonjour,</p>
<p style="${pStyle}">Merci pour votre int\u00e9r\u00eat envers Welpco\u00a0! Nous avons h\u00e2te de vous mettre en relation avec des Welpers de confiance dans votre communaut\u00e9 qui pourront vous aider avec un large \u00e9ventail de services \u00e0 domicile, afin que vous ayez plus de temps libre pour faire ce que vous aimez avec les personnes qui vous sont ch\u00e8res.</p>
<p style="${pStyle}">Vous vous demandez probablement comment \u00e7a fonctionne, alors laissez-nous vous donner une br\u00e8ve explication.</p>

<h2 style="${h2Style}">Qu\u2019est-ce que c\u2019est\u00a0?</h2>
<p style="${pStyle}">Welpco est une plateforme qui vous connecte \u00e0 des prestataires de services de confiance dans votre communaut\u00e9, que nous appelons des Welpers. Les Welpers passent une v\u00e9rification des ant\u00e9c\u00e9dents et offrent des services pour r\u00e9pondre \u00e0 vos besoins en services domestiques.</p>

<h2 style="${h2Style}">Quels services sont offerts\u00a0?</h2>
<ul style="${listStyle}">
<li style="${liStyle}"><strong>Soins\u00a0:</strong> garde d\u2019enfants, garderie, soins aux personnes \u00e2g\u00e9es, besoins sp\u00e9ciaux</li>
<li style="${liStyle}"><strong>Soins aux animaux\u00a0:</strong> promenades de chiens, toilettage, nettoyage/entretien d\u2019aquariums et terrariums, dressage de chiens</li>
<li style="${liStyle}"><strong>\u00c9ducation\u00a0:</strong> tutorat, cours de musique</li>
<li style="${liStyle}"><strong>Entretien int\u00e9rieur\u00a0:</strong> m\u00e9nage, peinture, organisation, d\u00e9m\u00e9nagement (emballage/d\u00e9ballage), assemblage de meubles, installation d\u2019appareils, configuration technologique (t\u00e9l\u00e9vision intelligente, maison intelligente, etc.), installation murale de t\u00e9l\u00e9viseur/\u00e9tag\u00e8re</li>
<li style="${liStyle}"><strong>Entretien ext\u00e9rieur\u00a0:</strong> tonte de pelouse, plantation d\u2019arbres, jardinage, lavage de voiture, nettoyage de goutti\u00e8res, lavage de vitres, nettoyage ext\u00e9rieur, d\u00e9neigement, ouverture/fermeture de piscine, ramassage de feuilles, pr\u00e9paration estivale/hivernale</li>
<li style="${liStyle}"><strong>Sant\u00e9 et bien-\u00eatre\u00a0:</strong> pr\u00e9paration de repas, entra\u00eeneur personnel, di\u00e9t\u00e9ticien, nutritionniste</li>
<li style="${liStyle}"><strong>Divertissement\u00a0:</strong> traiteur, organisation de f\u00eates, magicien, clown, serveur, assistant de f\u00eate, barman</li>
</ul>
<p style="${pStyle}">*Si vous avez besoin d\u2019un service qui ne figure pas dans la liste ci-dessus, vous pourrez publier votre demande dans nos petites annonces o\u00f9 les Welpers pourront postuler.</p>

<h2 style="${h2Style}">Comment \u00e7a fonctionne\u00a0?</h2>
<p style="${pStyle}">C\u2019est simple\u00a0! Vous recherchez le service dont vous avez besoin, consultez les profils des Welpers disponibles dans votre communaut\u00e9 qui offrent ce service ainsi que leurs tarifs, puis s\u00e9lectionnez le Welper et confirmez votre r\u00e9servation. Une fois que le Welper confirme, vous soumettez votre paiement via notre plateforme s\u00e9curis\u00e9e. Vous pourrez communiquer avec le Welper via notre plateforme, et une fois le service termin\u00e9, votre paiement sera lib\u00e9r\u00e9 au Welper et vous pourrez lui laisser un avis et une note.</p>
<p style="${pStyle}">Si vous avez des questions, vous pouvez nous contacter directement \u00e0 <a href="mailto:support@welpco.com" style="color:${brandGreen}; text-decoration:none;">support@welpco.com</a>. Nous avons h\u00e2te de lancer notre plateforme et nous vous enverrons un courriel d\u00e8s que ce sera fait\u00a0!</p>
<p style="${pStyle}">Cordialement,<br><strong>L\u2019\u00e9quipe Welpco</strong></p>`;
}

function getWelperContentFr(): string {
  return `
<p style="${pStyle}">Merci pour votre int\u00e9r\u00eat envers Welpco\u00a0! Nous avons h\u00e2te de vous accueillir parmi nos Welpers de confiance et de vous mettre en relation avec des clients de votre communaut\u00e9 qui ont besoin de services \u00e0 domicile.</p>
<p style="${pStyle}">Vous vous demandez probablement comment \u00e7a fonctionne, alors laissez-nous vous donner une br\u00e8ve explication.</p>

<h2 style="${h2Style}">Qu\u2019est-ce que c\u2019est\u00a0?</h2>
<p style="${pStyle}">Welpco est une plateforme qui connecte les Welpers aux clients dans leur communaut\u00e9 ou aux alentours. Les Welpers passent une v\u00e9rification des ant\u00e9c\u00e9dents et offrent des services pour r\u00e9pondre aux besoins en services domestiques.</p>

<h2 style="${h2Style}">Quels services sont offerts\u00a0?</h2>
<ul style="${listStyle}">
<li style="${liStyle}"><strong>Soins\u00a0:</strong> garde d\u2019enfants, garderie, soins aux personnes \u00e2g\u00e9es, besoins sp\u00e9ciaux</li>
<li style="${liStyle}"><strong>Soins aux animaux\u00a0:</strong> promenades de chiens, toilettage, nettoyage/entretien d\u2019aquariums et terrariums, dressage de chiens</li>
<li style="${liStyle}"><strong>\u00c9ducation\u00a0:</strong> tutorat, cours de musique</li>
<li style="${liStyle}"><strong>Entretien int\u00e9rieur\u00a0:</strong> m\u00e9nage, peinture, organisation, d\u00e9m\u00e9nagement (emballage/d\u00e9ballage), assemblage de meubles, installation d\u2019appareils, configuration technologique (t\u00e9l\u00e9vision intelligente, maison intelligente, etc.), installation murale de t\u00e9l\u00e9viseur/\u00e9tag\u00e8re</li>
<li style="${liStyle}"><strong>Entretien ext\u00e9rieur\u00a0:</strong> tonte de pelouse, plantation d\u2019arbres, jardinage, lavage de voiture, nettoyage de goutti\u00e8res, lavage de vitres, nettoyage ext\u00e9rieur, d\u00e9neigement, ouverture/fermeture de piscine, ramassage de feuilles, pr\u00e9paration estivale/hivernale</li>
<li style="${liStyle}"><strong>Sant\u00e9 et bien-\u00eatre\u00a0:</strong> pr\u00e9paration de repas, entra\u00eeneur personnel, di\u00e9t\u00e9ticien, nutritionniste</li>
<li style="${liStyle}"><strong>Divertissement\u00a0:</strong> traiteur, organisation de f\u00eates, magicien, clown, serveur, assistant de f\u00eate, barman</li>
</ul>
<p style="${pStyle}">*Les clients pourront \u00e9galement publier des petites annonces pour des services qui ne sont pas cat\u00e9goris\u00e9s sur notre plateforme, que vous pourrez consulter et auxquelles vous pourrez postuler.</p>

<h2 style="${h2Style}">Comment \u00e7a fonctionne\u00a0?</h2>
<p style="${pStyle}">C\u2019est simple\u00a0! Vous cr\u00e9ez votre profil de Welper sur notre plateforme. Vous choisissez les services que vous souhaitez offrir, ainsi que vos disponibilit\u00e9s. Eh oui\u00a0! Vous avez la flexibilit\u00e9 de cr\u00e9er votre propre horaire. Vous choisissez \u00e9galement votre taux horaire pour les services que vous souhaitez offrir, et nous ajouterons 25\u00a0% \u00e0 ce tarif plus taxes (pay\u00e9 par le client), ce qui couvre les co\u00fbts op\u00e9rationnels et le soutien fourni par Welpco. Vous devrez \u00e9galement passer une v\u00e9rification des ant\u00e9c\u00e9dents avant de commencer \u00e0 gagner, ce qui assure \u00e0 nos clients que vous \u00eates digne de confiance. Cette v\u00e9rification est fournie par Certn au sein de notre plateforme.</p>
<p style="${pStyle}">Une fois votre profil, votre horaire et votre v\u00e9rification des ant\u00e9c\u00e9dents compl\u00e9t\u00e9s, vous serez pr\u00eat \u00e0 commencer \u00e0 gagner\u00a0! Les clients parcourront les services dont ils ont besoin, consulteront les Welpers de leur r\u00e9gion qui offrent ces services et s\u00e9lectionneront le Welper qu\u2019ils souhaitent engager. Lorsque vous serez s\u00e9lectionn\u00e9, vous pourrez confirmer la r\u00e9servation et communiquer avec le client via notre plateforme. Une fois le service termin\u00e9, vos gains seront visibles dans votre compte Welpco et le versement sera effectu\u00e9 sur une base hebdomadaire.</p>

<h2 style="${h2Style}">Comment \u00eates-vous pay\u00e9\u00a0?</h2>
<p style="${pStyle}">Vous gagnez le taux horaire que vous avez choisi, et les frais sont d\u00e9duits du total du client. Il n\u2019y a pas de frais cach\u00e9s ni de d\u00e9ductions sur vos gains. Nous vous fournirons un formulaire fiscal annuel T4A, que vous \u00eates responsable de soumettre pour vos imp\u00f4ts provinciaux et f\u00e9d\u00e9raux, si vous atteignez le seuil requis de gains annuels. Le versement sera effectu\u00e9 sur une base hebdomadaire par d\u00e9p\u00f4t direct dans votre compte bancaire.</p>
<p style="${pStyle}">Si vous avez des questions, vous pouvez nous contacter directement \u00e0 <a href="mailto:support@welpco.com" style="color:${brandGreen}; text-decoration:none;">support@welpco.com</a>. Nous avons h\u00e2te de lancer notre plateforme et nous vous enverrons un courriel d\u00e8s que ce sera fait\u00a0!</p>
<p style="${pStyle}">Cordialement,<br><strong>L\u2019\u00e9quipe Welpco</strong></p>`;
}

export function getWhatIsWelpcoHtml(segment: Segment, locale: EmailLocale = "en"): string {
  const isFr = locale === "fr";
  if (segment === "customer") {
    return wrapEmail(isFr ? getCustomerContentFr() : getCustomerContentEn(), locale);
  }
  return wrapEmail(isFr ? getWelperContentFr() : getWelperContentEn(), locale);
}

export function getEmailSubject(locale: EmailLocale = "en"): string {
  return locale === "fr" ? "Qu\u2019est-ce que Welpco\u00a0?" : "What is Welpco?";
}

/** @deprecated Use getEmailSubject(locale) instead */
export const EMAIL_SUBJECT = "What is Welpco?";
