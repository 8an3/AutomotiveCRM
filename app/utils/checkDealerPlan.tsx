export default async function CheckingDealerPlan() {

  const email = await resend.emails.send({
    from: "Admin <admin@resend.dev>",//`${user?.name} <${user?.email}>`,
    reply_to: 'skylerzanth@gmail.com',
    to: [dealer.dealerContact, dealer.dealerEmailAdmin],
    subject: `Welcome to the DSA team, ${dealer.dealerName}.`,
    react: <DealerOnboarding dealer={dealer} />
  });

  return null
}
