import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '../auth/[...nextauth]/route'

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.redirect('/api/auth/signin')
  }

  const currentUserEmail = session.user?.email

  if (!currentUserEmail) {
    throw new Error('No user email found in session')
  }

  const data = await req.json()
  data.age = Number(data.age)

  const user = await prisma.user.update({
    where: { email: currentUserEmail },
    data,
  })

  return NextResponse.json(user)
}
