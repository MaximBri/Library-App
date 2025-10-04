import type { User } from "@/shared/hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import { userApi } from "../../user/userApi"

export const useGetUserData = () => {
  return useQuery<User>({
    queryKey: ['user'],
    queryFn: () => userApi.getUserData()
  })
}