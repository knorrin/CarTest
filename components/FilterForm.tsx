import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface FilterFormProps {
  onFilter: (brand: string, models: string[]) => void
}

const FilterForm: React.FC<FilterFormProps> = ({ onFilter }) => {
  const [brands, setBrands] = useState<{ _id: string; count: number }[]>([])
  const [models, setModels] = useState<string[]>([])
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>(undefined)
  const [selectedModels, setSelectedModels] = useState<string[]>([])

  useEffect(() => {
    const fetchBrands = async () => {
      const response = await axios.get('/api/brands')
      setBrands(response.data)
    }

    fetchBrands()
  }, [])

  useEffect(() => {
    if (selectedBrand) {
      const fetchModels = async () => {
        const response = await axios.get(`/api/models?brand=${selectedBrand}`)
        setModels(response.data.map((m: { _id: string }) => m._id))
      }

      fetchModels()
    } else {
      setModels([])
    }
  }, [selectedBrand])

  const handleModelClick = (model: string) => {
    setSelectedModels((prevModels) => {
      if (prevModels.includes(model)) {
        return prevModels.filter((m) => m !== model)
      } else {
        return [...prevModels, model]
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilter(selectedBrand!, selectedModels)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='select-wrapper'>
        <label>
          Марка:
          <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
            <option value=''>Выберите марку</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand._id} ({brand.count})
              </option>
            ))}
          </select>
        </label>
      </div>
      {selectedBrand && (
        <div className='models-list'>
          {models.map((model) => (
            <a
              key={model}
              href='#'
              onClick={() => handleModelClick(model)}
              className={selectedModels.includes(model) ? 'active' : ''}
            >
              {model}
            </a>
          ))}
        </div>
      )}
      <button type='submit'>Применить</button>
    </form>
  )
}

export default FilterForm
