import type { User } from "@/shared/hooks/useAuth"
import { useQuery } from "@tanstack/react-query"

export const useGetUserData = () => {
  return useQuery<User>({
    queryKey: ['user'],
    queryFn: ()
  })
}