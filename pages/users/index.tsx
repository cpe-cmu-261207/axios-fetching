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

interface SelectProps {
  label: string
  options: number[]
  value?: number
  onSelect?: (value: number) => void
}

const Select: FC<SelectProps> = ({ label, options, value, onSelect }) => {
  if (value && !options.includes(value)) throw Error('value must be included in options')

  return (
    <div>
      <label>{label}: </label>
      <select 
        onChange={e => {
          const option = options.find(item => e.currentTarget.value === item.toString())
          onSelect && onSelect(option)
        }}
        value={value || options[0]}>
        {options.map((value, index) => <option key={index} value={value}>{value}</option>)}
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
  const [totalPages, setTotalPages] = useState<number>(1)

  useEffect(() => {
    let cancelSource = Axios.CancelToken.source()
    const fetch = async () => {
      setLoading(true)
      const response = await Axios.get<UsersResponse>(
        'https://dummyapi.io/data/api/user', {
          headers: {
            'app-id': '5ffd1117af6833ab2dd0a2b4',
          },
          params: { limit, page },
          cancelToken: cancelSource.token
        })
      const { data: users, total } = response.data

      setUsers(users)
      setTotalPages(Math.ceil(total/limit))
      setLoading(false)
    }

    fetch()
    return () => cancelSource.cancel()
  }, [limit, page])

  useEffect(() => {
    setPage(0)
    setTotalPages(1)
  }, [limit])

  return (
    <div style={{ maxWidth: 325, margin: 'auto' }}>
      {loading 
        ? <p>Loading...</p> 
        : users.map(user => <User key={user.id} {...user}/>)}
      <div style={{ display: 'flex'}}>
        <Select 
          label={'Limit'} 
          options={pageLimits}
          value={limit}
          onSelect={item => setLimit(item)} />
        <Select 
          label={'Page'}
          options={Array(totalPages).fill(null).map((_, index) => index)} 
          value={page}
          onSelect={item => setPage(item)} />
      </div>
    </div>
  )
}

export default Users