import {
  ErrorComponent,
  Link,
  useLocation,
  useRouter,
} from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { Button } from "~/components/ui/button"

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isRoot = useLocation({
    select: (location) => location.pathname === '/',
  })

  console.error('DefaultCatchBoundary Error:', error)

  return (
    <div className="min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6">
      <ErrorComponent error={error} />
      <div className="flex gap-2 items-center flex-wrap">
        <Button
          onClick={() => {
            router.invalidate()
          }}
          variant="vapor"
          className="uppercase font-pixel text-xxs px-4 py-1.5 h-auto cursor-pointer text-vapor-dark bg-[#c9858e] shadow-win98-out"
        >
          Try Again
        </Button>
        {isRoot ? (
          <Button
            asChild
            variant="vapor"
            className="uppercase font-pixel text-xxs px-4 py-1.5 h-auto cursor-pointer text-vapor-cream bg-vapor-rose shadow-win98-out"
          >
            <Link to="/">Home</Link>
          </Button>
        ) : (
          <Button
            asChild
            variant="vapor"
            className="uppercase font-pixel text-xxs px-4 py-1.5 h-auto cursor-pointer text-vapor-cream bg-vapor-rose shadow-win98-out"
          >
            <Link
              to="/"
              onClick={(e) => {
                e.preventDefault()
                window.history.back()
              }}
            >
              Go Back
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
