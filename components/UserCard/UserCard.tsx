import styles from './UserCard.module.css'
import Link from 'next/link'
import { User } from '@prisma/client'

type Props = User

export default function UserCard({ id, name, age, image }: Props) {
  return (
    <div className={styles.card}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image ?? '/mememan.webp'}
        alt={`${name}'s profile`}
        className={styles.cardImage}
      />

      <div className={styles.cardContent}>
        <Link href={`/users/${id}`}>
          <h3>{name}</h3>
        </Link>
        <p>Age: {age}</p>
      </div>
    </div>
  )
}
