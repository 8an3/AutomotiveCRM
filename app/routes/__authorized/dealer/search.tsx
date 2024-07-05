import { json, type ActionFunction, type LoaderFunction } from '@remix-run/node';
import { getSession, commitSession } from '~/sessions/auth-session.server';
import { GetUser } from '~/utils/loader.server';
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import { Form, Link, useLoaderData, useLocation, Await, useFetcher, useSubmit, useNavigate } from '@remix-run/react';
import { prisma } from '~/libs';
import { useEffect, useRef, useState } from 'react';
import { Button } from '~/components';
import { Search } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"

export async function loader({ request, params }: LoaderFunction) {
  let q = new URL(request.url).searchParams.get('q')
  if (!q) return []
  q = q.toLowerCase();
  let result;
  console.log(q, 'q')
  const getit = await prisma.clientfile.findMany({})
  console.log(getit, 'getit')
  // const searchResults = await getit//searchCases(q)
  result = getit.filter(result =>
    result.email?.includes(q) ||
    result.phone?.includes(q) ||
    result.firstName?.includes(q) ||
    result.lastName?.includes(q)
  )
  console.log(getit, 'getit', result, 'results',)
  return result
};

export default function SearchFunction() {
  const location = useLocation()
  let [show, setShow] = useState(false)
  let ref = useRef()
  let search = useFetcher()

  useEffect(() => {
    if (show) {
      ref.current.select()
    }
  }, [show])

  useEffect(() => {
    setShow(false)
  }, [location])

  // bind command + k
  useEffect(() => {
    let listener = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setShow(true)
      }
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])
  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='ghost' size='icon' className="right-[175px] top-[25px] border-none fixed " onClick={() => {
              setShow(true)
            }}>
              <Search color="#ffffff" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Customer Search</p>
            <p>ctrl + k will also open this feature.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div
        onClick={() => {
          setShow(false)
        }}
        hidden={!show}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vw',
          margin: 'auto',
          background: 'hsla(0, 100%, 100%, 0.9)',
          zIndex: 100,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            background: 'white',
            width: 600,
            maxHeight: '900px',
            height: '900px',
            overflow: 'auto',
            margin: '20px auto',
            border: 'solid 1px #ccc',
            borderRadius: 10,
            boxShadow: '0 0 10px #ccc',
          }}
          onClick={(event) => {
            event.stopPropagation()
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setShow(false)
            }
          }}
        >
          <search.Form method="get" action="/dealer/search">

            <input
              ref={ref}
              placeholder="search"
              type="search"
              name="q"
              onKeyDown={(event) => {
                if (
                  event.key === 'Escape' &&
                  event.currentTarget.value === ''
                ) {
                  setShow(false)
                } else {
                  event.stopPropagation()
                }
              }}
              onChange={(event) => { search.submit(event.currentTarget.form) }}
              className="text-[#000] bg-white"
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                fontSize: '1.5em',
                position: 'sticky',
                top: 0,
                border: 'none',
                borderBottom: 'solid 1px #ccc',
                outline: 'none',
              }}
            />
            <ul style={{ padding: '0 20px', minHeight: '1rem' }}>
              {search.data &&
                search.data.map((result, index) => (
                  <Link
                    to={`/dealer/customer/${result.id}/check`}
                    className='mb-5 justify-start'
                    key={index}
                  >
                    <Button
                      variant='ghost'
                      className='w-[99%] hover:bg-[#e6e7e8] rounded-[6px] my-2 h-[75px] hover:text-black mx-auto'
                    >
                      <div>
                        <p className="text-2xl text-left text-[#000]">{result.firstName} {result.lastName}</p>
                        <p className='text-muted-foreground text-left '>{result.phone}</p>
                        <p className='text-muted-foreground text-left '>{result.email}</p>
                      </div>
                    </Button>
                  </Link>

                ))}
            </ul>
          </search.Form>

        </div>
      </div >
    </div>
  )
}
