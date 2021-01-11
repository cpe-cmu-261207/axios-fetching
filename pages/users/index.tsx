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
  value?: OptionProps
  onSelect?: (value: OptionProps) => void
}

const Select: FC<SelectProps> = ({ label, options, value, onSelect }) => {
  if (value && options.includes(value)) throw Error('value must be included in the options')

  return (
    <div>
      <label>{label}: </label>

      <select 
        onChange={e => {
          const option = options.find(item => e.currentTarget.value === item.value.toString())
          onSelect && onSelect(option)
        }}
        value={value?.value || options[0].value}>
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
  const [page, setPage] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      const response = await Axios.get<UsersResponse>(
        'https://dummyapi.io/data/api/user', {
          headers: {
            'app-id': '5ffd1117af6833ab2dd0a2b4',
          },
          params: { limit, page }
        })
      const { data: users, total } = response.data

      setUsers(users)
      setTotalPages(Math.ceil(total/limit))
      setLoading(false)
    }

    fetch()
  }, [limit, page])

  console.log(page, totalPages)

  useEffect(() => {
    setPage(0)
    setTotalPages(0)
  }, [limit])

  return (
    <div style={{ maxWidth: 325, margin: 'auto' }}>
      {loading 
        ? <p>Loading...</p> 
        : users.map(user => <User key={user.id} {...user}/>)}
      <div style={{ display: 'flex'}}>
        <Select 
          label={'Limit'} 
          options={pageLimits.map<OptionProps>(item => ({ name: item, value: item }))}
          value={{ name: limit, value: limit }}
          onSelect={item => setLimit(item.value as number)} />
        <Select 
          label={'Page'}
          options={totalPages !== 0 
            ? Array(totalPages).fill(null).map((_, index) => ({ name: index, value: index }))
            : [{ name: 0, value: 0 }]} 
          value={{ name: page, value: page }}
          onSelect={item => setPage(item.value)} />
      </div>
    </div>
  )
}

export default Users