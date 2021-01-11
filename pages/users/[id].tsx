import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Axios from 'axios'
import { IUser } from '../../libs/user'

const User: FC<IUser> = ({ firstName, lastName, picture, email, phone }) => {
  return (
    <>
      <img src={picture} alt=""/>
      <p>{firstName} {lastName}</p>
      <p>Phone: {phone}</p>
      <p>Email: {email}</p>
    </>
  )
}

const UserPage = () => {
  const { query } = useRouter()
  const [user, setUser] = useState<IUser>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const { id } = query

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      const response = await Axios.get<IUser>(
        `https://dummyapi.io/data/api/user/${id}`, {
          headers: {
            'app-id': '5ffd1117af6833ab2dd0a2b4',
          }
        })
      const user = response.data
      setUser(user)
      setLoading(false)
    }
    
    if(id) fetch()
  }, [id])

  return (
    <div style={{ maxWidth: 768, margin: 'auto', textAlign: 'center' }}>
      {loading 
        ? <p>Loading...</p>
        : <User {...user} />}
    </div>
  ) 
}

export default UserPage