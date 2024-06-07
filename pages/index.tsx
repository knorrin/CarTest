import React, { useState, useEffect } from 'react'
import axios from 'axios'
import CarTable from '../components/CarTable'
import FilterForm from '../components/FilterForm'

interface Car {
  _id: string
  mark: string
  model: string
  engine: {
    power: number
    volume: number
    transmission: string
    fuel: string
  }
  drive: string
  equipmentName: string
  price: number
  createdAt: string
}

const HomePage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([])
  const [total, setTotal] = useState<number>(0)
  const [brand, setBrand] = useState<string | undefined>(undefined)
  const [models, setModels] = useState<string[]>([])
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [modelsCount, setModelsCount] = useState<{ [key: string]: number }>({})

  const fetchCars = async (brand?: string, models?: string[], page: number = 1, pageSize: number = 10) => {
    try {
      const response = await axios.get('/api/cars', {
        params: {
          brand,
          models: models?.join(','),
          page,
          pageSize,
        },
      })

      const cars = response.data
      const total = response.data.length

      setCars(cars)
      setTotal(total)
    } catch (error) {
      console.error('Error fetching cars:', error)
    }
  }

  const fetchModelsCount = async () => {
    try {
      const response = await axios.get('/api/brands')
      const countData = response.data.reduce(
        (acc: { [key: string]: number }, brand: { _id: string; count: number }) => {
          acc[brand._id] = brand.count
          return acc
        },
        {}
      )
      setModelsCount(countData)
    } catch (error) {
      console.error('Error fetching models count:', error)
    }
  }

  useEffect(() => {
    fetchCars(brand, models, page, pageSize)
  }, [brand, models, page, pageSize])

  useEffect(() => {
    fetchModelsCount()
  }, [])

  const handleFilter = (brand: string, models: string[]) => {
    setBrand(brand)
    setModels(models)
    setPage(1)
    fetchCars(brand, models, 1, pageSize)
  }

  const renderPagination = () => {
    const totalPages = Math.ceil(total / pageSize)
    const pageNumbers = []

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <span key={i} className={`page-number ${i === page ? 'active' : ''}`} onClick={() => setPage(i)}>
          {i}
        </span>
      )
    }

    return (
      <div className='pagination'>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          &lt;
        </button>
        {pageNumbers}
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
          &gt;
        </button>
        <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </select>
      </div>
    )
  }

  return (
    <div className='container'>
      <h1>Сток автомобилей</h1>
      <div className='models-list'>
        {Object.keys(modelsCount).map((brand) => (
          <a key={brand} href='#' onClick={() => handleFilter(brand, [])}>
            {brand} ({modelsCount[brand]})
          </a>
        ))}
      </div>
      <FilterForm onFilter={handleFilter} />
      <CarTable cars={cars} />
      {renderPagination()}
    </div>
  )
}

export default HomePage
