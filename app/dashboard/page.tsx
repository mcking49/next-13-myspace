import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import ProfileForm from './ProfileForm'

export default async function page() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('api/auth/signin')
  }

  const currentUserEmail = session.user?.email

  const user = currentUserEmail
    ? await prisma.user.findUnique({
        where: { email: currentUserEmail },
      })
    : null

  return (
    <>
      <h1>Dashboard</h1>
      <ProfileForm user={user} />
    </>
  )
}
