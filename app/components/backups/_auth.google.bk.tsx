import { type ActionArgs, redirect } from "@remix-run/node"
import { authenticator } from '~/services/auth-service.server';

export let loader = () => redirect('/login');

export let action = ({ request, params }: ActionArgs) => {
  return authenticator.authenticate('google', request);
};
