import type { ClientLoaderFunctionArgs } from "@remix-run/react";


export async function clientLoader({
  request,
  serverLoader,
}: ClientLoaderFunctionArgs) {

  let q = new URL(request.url).searchParams.get("q");
  if (!q) return [];
  q = q.toLowerCase();

  const token = window.localStorage.getItem("remix-stutter-66-3145");

  const getit = await fetch('https://graph.microsoft.com/v1.0/me/messages', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const emailData = await getit.json();

  let result;
  result = emailData.filter(
    (result) =>
      result.from?.emailAddress.name?.toLowerCase().includes(q) ||
      result.subject?.toLowerCase().includes(q) ||
      result.from?.emailAddress.address?.toLowerCase().includes(q)
  );
  console.log(q, getit, result, token, ' in emailloader function')
  return result
}
/**  <search.Form method="get" action='/dealer/features/email/emailSearch/client'>
                    <div className="relative ml-auto flex-1 md:grow-0 ">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        ref={ref}
                        type="search"
                        name="q"
                        onChange={e => {
                          search.submit(e.currentTarget.form);
                        }}
                        autoFocus
                        placeholder="Search..."
                        className="w-full  bg-background pl-8"
                      />
                      <Button
                        onClick={() => {
                          navigate(0)
                        }}
                        size="icon"
                        className='bg-background mr-2 absolute right-2.5 top-2.5 h-4 w-4 text-foreground '>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </search.Form>
 */
