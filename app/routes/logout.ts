import { redirect, data } from 'react-router';
import type { Route } from './+types/logout';
import { clearTokenCookie } from '~/lib/auth';

export async function action({ request }: Route.ActionArgs) {
  return data(null, {
    status: 302,
    headers: {
      'Set-Cookie': clearTokenCookie(),
      Location: '/login',
    } as Record<string, string>,
  } as ResponseInit);
}

export async function loader({ request }: Route.LoaderArgs) {
  return redirect('/login');
}
