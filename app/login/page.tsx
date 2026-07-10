import Link from "next/link";
import { login } from "@/app/login/actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main className="auth-page"><section className="panel auth-panel"><p className="eyebrow">COACH ACCESS</p><h1>Admin login</h1><p className="muted">Sign in with a Supabase Auth account that has an admin profile.</p>{error ? <div className="notice negative-notice">{error}</div> : null}<form action={login} className="stacked-form"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required /><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required /><button className="primary-button" type="submit">Log in</button></form><Link className="text-button" href="/">Return to public dashboard</Link></section></main>;
}
