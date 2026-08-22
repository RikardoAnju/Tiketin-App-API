export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Tiketin API</h1>
      <p className="mt-4 text-xl text-gray-600">
        Backend API for Tiketin Event Ticketing System
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-300 p-6">
          <h2 className="text-2xl font-bold">API Routes</h2>
          <ul className="mt-4 space-y-2">
            <li>POST /api/auth/register</li>
            <li>POST /api/auth/login</li>
            <li>GET /api/events</li>
            <li>POST /api/events</li>
            <li>GET /api/events/[id]</li>
            <li>GET /api/tickets</li>
            <li>POST /api/tickets</li>
            <li>GET /api/health</li>
          </ul>
        </div>

        <div className="rounded-lg border border-gray-300 p-6">
          <h2 className="text-2xl font-bold">Tech Stack</h2>
          <ul className="mt-4 space-y-2">
            <li>✅ Next.js 14</li>
            <li>✅ Supabase (PostgreSQL)</li>
            <li>✅ JWT Authentication</li>
            <li>✅ TypeScript</li>
            <li>✅ Zod Validation</li>
            <li>✅ Bcrypt Hashing</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
