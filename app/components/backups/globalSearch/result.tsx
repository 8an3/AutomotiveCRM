import { SearchBar } from "~/components/shared/searchbar";
import { prisma } from "~/libs";
import { z } from "zod";
import { cn } from "~/utils";
import { useDelayedIsPending } from "~/utils/misc";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { DataFunctionArgs, json, redirect } from '@remix-run/node';
import { Link, Form, useLoaderData, useSubmit, useFetcher } from '@remix-run/react'


const UserSearchResultsSchema = z.array(financeFormSchema)

export async function loader({ request }: DataFunctionArgs) {
  const searchTerm = new URL(request.url).searchParams.get('search')
  const like = `%${searchTerm ?? ''}%`

  const rawUsers = await prisma.clientfile.findMany({
    where: {
      OR: [
        { phone: { contains: like } },
        { email: { contains: like } },
        { firstName: { contains: like } },
        { lastName: { contains: like } },
        { address: { contains: like } },
        { city: { contains: like } },
        { postal: { contains: like } },
        { province: { contains: like } },
        { dl: { contains: like } },
        { typeOfContact: { contains: like } },
        { timeToContact: { contains: like } },
      ],
    },
  });
  console.log(rawUsers)
  const result = UserSearchResultsSchema.safeParse(rawUsers)
  if (!result.success) {
    return json({ status: 'error', error: result.error.message } as const, {
      status: 400,
    })
  }
  return json({ status: 'idle', users: result.data } as const)
}


export default function SearchResult() {
  const data = useLoaderData<typeof loader>()
  const isPending = useDelayedIsPending({
    formMethod: 'GET',
    formAction: '/globalSearch/result',
  })

  if (data.status === 'error') {
    console.error(data.error)
  }

  type ListOfErrors = Array<string | null | undefined> | null | undefined

  function ErrorList({
    id,
    errors,
  }: {
    errors?: ListOfErrors
    id?: string
  }) {
    const errorsToRender = errors?.filter(Boolean)
    if (!errorsToRender?.length) return null
    return (
      <ul id={id} className="flex flex-col gap-1">
        {errorsToRender.map(e => (
          <li key={e} className="text-[10px] text-foreground-destructive">
            {e}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <>
      {data.status === 'idle' ? (
        data.users.length ? (
          <ul
            className={cn(
              'flex w-full flex-wrap items-center justify-center gap-4 delay-200',
              { 'opacity-50': isPending },
            )}
          >
            {data.users.map(user => (
              <ul key={user.id}>
                <a
                  href={`/${data.id}`}

                  className="flex h-36 w-44 flex-col items-center justify-center rounded-lg bg-muted px-5 py-3"
                >

                  {user.name ? (
                    <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-body-md">
                      {user.name}
                    </span>
                  ) : null}
                  <span className="w-full overflow-hidden text-ellipsis text-center text-body-sm text-muted-foreground">
                    {user.username}
                  </span>
                </a>
              </ul>
            ))}
          </ul>
        ) : (
          <p>No users found</p>
        )
      ) : data.status === 'error' ? (
        <ErrorList errors={['There was an error parsing the results']} />
      ) : null}
    </>
  )
}
