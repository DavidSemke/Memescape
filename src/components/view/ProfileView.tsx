import { UserCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { NestedUser } from "@/data/api/types/model/types";

type ProfileViewProps = {
    user: NestedUser
    profileAlt: string
}

export default function ProfileView({ user, profileAlt }: ProfileViewProps) {
    return (
        <div className="flex flex-col gap-4 justify-center items-center">
            {
                user.profile_image ? (
                    <Image 
                        src={user.profile_image.base64}
                        width={128}
                        height={128}
                        alt={profileAlt}
                        className='rounded-full'
                    />
                ): (
                    <UserCircleIcon 
                        className="w-32 h-32"
                        title={profileAlt}
                    />
                )
            }
            <div className="text-2xl">{user.name}</div>
        </div>
    )
}