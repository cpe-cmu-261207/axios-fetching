import { FC, useEffect, useState } from 'react'
import { IUser } from '../../libs/user'
import Axios from 'axios'

type UserProps = Pick<IUser, 'id' | 'firstName' | 'lastName'>

interface UsersResponse {
  data: UserProps[]
  total: number
  page: number
  limit: number
  offset: number
}

const User: FC<UserProps> = ({ id, firstName, lastName }) => {
  return (
    <div>
      <a href={`/users/${id}`}>
        <p>{firstName} {lastName}</p>
      </a>
    </div>
  )
}

const Users = () => {
  const [users, setUsers] = useState<UserProps[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      const response = await Axios.get<UsersResponse>(
        'https://dummyapi.io/data/api/user', {
          headers: {
            'app-id': '5ffd1117af6833ab2dd0a2b4',
          }
        })
      const { data: users } = response.data
      setUsers(users)
      setLoading(false)
    }

    fetch()
  }, [])

  return (
    <div style={{ maxWidth: 325, margin: 'auto' }}>
      {loading 
        ? <p>Loading...</p> 
        : users.map(user => <User key={user.id} {...user}/>)}
    </div>
  )
}

export default Users