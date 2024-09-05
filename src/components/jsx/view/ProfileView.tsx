import { UserCircleIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import { NestedUser } from "@/data/api/types/model/types"

type ProfileViewProps = {
  user: NestedUser
  profileAlt: string
}

export default function ProfileView({ user, profileAlt }: ProfileViewProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {user.profile_image ? (
        <Image
          src={user.profile_image.base64}
          width={128}
          height={128}
          alt={profileAlt}
          className="rounded-full"
        />
      ) : (
        <UserCircleIcon className="h-32 w-32" title={profileAlt} />
      )}
      <div className="text-2xl">{user.name}</div>
    </div>
  )
}
