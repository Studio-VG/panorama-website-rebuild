export function AuthProviders({ nextPath }: { nextPath: string }) {
  const query = `?next=${encodeURIComponent(nextPath)}`;
  return (
    <div className="auth-providers">
      <a className="btn btn-provider" href={`/api/auth/google${query}`}>Google</a>
      <a className="btn btn-provider" href={`/api/auth/apple${query}`}>Apple</a>
    </div>
  );
}
