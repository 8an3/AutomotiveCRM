import { json, type ActionFunction, type LoaderFunction } from '@remix-run/node';
import { getSession, commitSession } from '~/sessions/auth-session.server';
import { GetUser } from '~/utils/loader.server';
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import { Form, Link, useLoaderData, useLocation, Await, useFetcher, useSubmit, useNavigate, useNavigation } from '@remix-run/react';

export async function loader({ request, params }: LoaderAction) {

  return null
};



export default function Spinner() {
  const { user } = useLoaderData()
  const navigation = useNavigation()
  const active = navigation.state !== "idle";

  return (
    <div>
      {active && (
        <section className="b-[25px] left-[25px] absolute">
          <div className="spinner icon-spinner-2" aria-hidden="true"></div>
        </section>
      )}
    </div>
  )
}
