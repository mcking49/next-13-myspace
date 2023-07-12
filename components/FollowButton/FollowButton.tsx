import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import FollowClient from './FollowClient'

interface Props {
  targetUserId: string
}

export default async function FollowButton({ targetUserId }: Props) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <></>
  }

  const currentUserEmail = session.user?.email

  if (!currentUserEmail) {
    return <></>
  }

  const currentUserId = await prisma.user
    .findFirst({ where: { email: currentUserEmail } })
    .then((user) => user?.id)

  if (!currentUserId) {
    return <></>
  }

  const isFollowing = await prisma.follows.findFirst({
    where: {
      followerId: currentUserId,
      followingId: targetUserId,
    },
  })

  return (
    <FollowClient targetUserId={targetUserId} isFollowing={!!isFollowing} />
  )
}
