import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const { targetUserId } = await req.json()

  if (!session) {
    return NextResponse.redirect('/api/auth/signin')
  }

  const currentUserEmail = session.user?.email

  if (!currentUserEmail) {
    throw new Error('No user email found')
  }

  const currentUserId = await prisma.user
    .findUnique({ where: { email: currentUserEmail } })
    .then((user) => user?.id)

  if (!currentUserId) {
    throw new Error('No user id found')
  }

  const record = await prisma.follows.create({
    data: {
      followerId: currentUserId,
      followingId: targetUserId,
    },
  })

  return NextResponse.json(record)
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const targetUserId = req.nextUrl.searchParams.get('targetUserId')

  if (!targetUserId) {
    throw new Error('No target user id found')
  }

  if (!session) {
    return NextResponse.redirect('/api/auth/signin')
  }

  const currentUserEmail = session.user?.email

  if (!currentUserEmail) {
    throw new Error('No user email found')
  }

  const currentUserId = await prisma.user
    .findUnique({ where: { email: currentUserEmail } })
    .then((user) => user?.id)

  if (!currentUserId) {
    throw new Error('No user id found')
  }

  const record = await prisma.follows.delete({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    },
  })

  return NextResponse.json(record)
}
