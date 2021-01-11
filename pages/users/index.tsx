import { FC, useEffect, useState, SelectHTMLAttributes } from 'react'
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

interface OptionProps {
  name: number
  value: number
}

interface SelectProps {
  label: string
  options: OptionProps[]
  onSelect?: (value: OptionProps) => void
}

const Select: FC<SelectProps> = ({ label, options, onSelect }) => {
  return (
    <div>
      <label>Limit: </label>

      <select 
        onChange={e => {
          const option = options.find(item => e.currentTarget.value === item.value.toString())
          onSelect && onSelect(option)
        }}>
        {options.map(({ name, value }) => <option value={value}>{name}</option>)}
      </select>
    </div>
  )
}

const pageLimits: number[] = [5, 10, 15 , 20]

const Users = () => {
  const [users, setUsers] = useState<UserProps[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [limit, setLimit] = useState<number>(5)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      const response = await Axios.get<UsersResponse>(
        'https://dummyapi.io/data/api/user', {
          headers: {
            'app-id': '5ffd1117af6833ab2dd0a2b4',
          },
          params: { limit }
        })
      const { data: users } = response.data
      setUsers(users)
      setLoading(false)
    }

    fetch()
  }, [limit])

  return (
    <div style={{ maxWidth: 325, margin: 'auto' }}>
      {loading 
        ? <p>Loading...</p> 
        : users.map(user => <User key={user.id} {...user}/>)}
      <Select 
        label={'Limit :'} 
        options={pageLimits.map<OptionProps>(item => ({ name: item, value: item }))}
        onSelect={item => setLimit(item.value as number)}/>
    </div>
  )
}

export default Users