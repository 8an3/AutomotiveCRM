import forGoogle from './logos/forgoogle.png'


export default function ForGoogle() {
  return (
    <>
      <p className='mt-[100px] w-1/2 mx-auto text-center'>In the application there was a mention of me not being an owner of the site but here is a screen shot of the account informatoin from the providor. Personal information is kept hidden because I don't want to be harrased all day long by Indian telemarkerters looking to sell me products about my site. I've done that once before and they called me for years while I had that IP up, I will never do that again. If this is not sufficient evidence for you I am more than happy to provide more details just let me know what you would like.</p>
      <p className='mt-[100px] w-1/2 mx-auto text-center'>I apoligize about the css of the privacy statement page(the text and background were white), once testing on the site is done the main page and secondary pages will be re stylized and re worked. </p>
      <p className='mt-[100px] w-1/2 mx-auto text-center'>
        For authentication, I made it so anyone who logs in does NOT need a subscription in order to access the services on the site, instead of subbing just continue and you will have full access to everything. Once the verification process has concluded I will reverse this so a subscription is needed for individuals. If at any time you need to review this again let me know and I will make it so. If needed, I can also invite you, or make the repo public for a code review.
      </p>
      <br />
      <img alt="logo" src={forGoogle} className='mt-[50px] mx-auto' />

    </>
  )
}
