"use client";
import AppShell from "@/components/app-shell";
import { useAuthGuard } from "@/components/auth-guard";
import { getUser } from "@/lib/utils";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [user, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [currentPage, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(100);
  const [limit, setLimit] = useState<number>(10);
  const router = useRouter()
  useAuthGuard();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      const fetchUsers = async () => {
        const response = await fetch(
          `/api/users/search?q=${query}&limit=${limit}&page=${currentPage}`
        );
        const data = await response.json();
        console.log("users", data.users);
        setUsers(data.users);
        setTotal(data.total);
      };
      fetchUsers();
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [query, currentPage, limit]);
  const totalPages = total / limit;
  const currentUser = getUser();

const action =
  currentUser?.role === "Owner" ? (<>
    <a
      href="/users/new"
      className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-primary-foreground text-sm hover:opacity-90"
    >
      Create User
    </a>
    <button
            onClick={() => {
              localStorage.removeItem("token");
              sessionStorage.removeItem("token");

              router.push("/login");
            }}
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-primary-foreground text-sm hover:opacity-90"
          >
            Logout
          </button></>
  ) : ( <>
    <button
      disabled
      aria-disabled="true"
      className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-primary-foreground text-sm opacity-30 cursor-not-allowed"
    >
      Create User
      </button>
      <button
            onClick={() => {
              localStorage.removeItem("token");
              sessionStorage.removeItem("token");

              router.push("/login");
            }}
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-primary-foreground text-sm hover:opacity-90"
          >
            Logout
          </button></>
  )

  return (
    <AppShell
      title="Users"
      subtitle="Create and list users (static preview)"
      actions={action}
    >
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="border-b border-border p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="w-full md:max-w-sm">
              <label className="sr-only" htmlFor="user-search">
                Search users
              </label>
              <input
                id="user-search"
                placeholder="Search by name or email"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              RBAC preview: Admin can create/edit/delete; Member read-only.
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-secondary-foreground">
              <tr className="[&>th]:px-3 [&>th]:py-2 text-left">
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                {/* <th className="text-right">Actions</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {user.map((u) => {
                return (
                  <tr key={u.id} className="[&>td]:px-3 [&>td]:py-3">
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className="rounded-full bg-secondary px-2 py-1 text-xs">
                        {u.role}
                      </span>
                    </td>
                    {/* <td className="text-right">
                      <div className="inline-flex gap-2">
                        <button
                          className="rounded-md bg-accent px-2 py-1 text-xs"
                          disabled={currentUser?.role !== 'Owner'}
                        >
                          Edit
                        </button>
                        <button
                          className="rounded-md bg-destructive/10 px-2 py-1 text-xs"
                          disabled
                          aria-disabled="true"
                        >
                          Delete
                        </button>
                      </div>
                    </td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {user.length > 0 && (
          <footer className="border-t border-border p-3">
            <nav className="flex items-center justify-between text-sm">
              <button
                disabled={currentPage <= 1 || loading}
                onClick={() => {
                  setLoading(true);
                  if (currentPage > 1) setPage(currentPage - 1);
                }}
                className={`rounded-md px-2 py-1 border border-input cursor-pointer ${
                  currentPage <= 1 || loading || loading
                    ? "text-muted-foreground"
                    : ""
                }`}
              >
                {loading ? "Loading..." : "Previous"}
              </button>
              <button className="rounded-md px-3 py-1" disabled>
                Page {currentPage} of {Math.ceil(totalPages) || 1}
              </button>
              {/* <ul className="flex items-center gap-1">
              <li>
              <button className="rounded-md px-3 py-1 bg-primary text-primary-foreground" disabled>
              1
              </button>
              </li>
              <li>
              <button className="rounded-md px-3 py-1 border border-input" disabled>
              2
              </button>
              </li>
              <li>
              <button className="rounded-md px-3 py-1 border border-input" disabled>
              3
              </button>
              </li>
              <li className="px-2 text-muted-foreground">…</li>
              <li>
                <button className="rounded-md px-3 py-1 border border-input" disabled>
                10
                </button>
                </li>
            </ul> */}
              <button
                disabled={currentPage >= totalPages || loading}
                onClick={() => {
                  setLoading(true);
                  if (currentPage < total) setPage(currentPage + 1);
                }}
                className={`rounded-md px-2 py-1 border border-input cursor-pointer ${
                  currentPage >= totalPages || loading
                    ? "text-muted-foreground"
                    : ""
                }`}
              >
                {loading ? "Loading..." : "Next"}
              </button>
            </nav>
          </footer>
        )}
      </div>
    </AppShell>
  );
}
