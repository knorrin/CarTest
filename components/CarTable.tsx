import React from 'react'

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

interface CarTableProps {
  cars: Car[]
}

const CarTable: React.FC<CarTableProps> = ({ cars }) => {
  if (!cars || cars.length === 0) {
    return <div>No cars available</div>
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Марка/Модель</th>
          <th>Модификация</th>
          <th>Комплектация</th>
          <th>Стоимость</th>
          <th>Дата создания</th>
        </tr>
      </thead>
      <tbody>
        {cars.map((car) => (
          <tr key={car._id}>
            <td>{car._id}</td>
            <td>{`${car.mark} / ${car.model}`}</td>
            <td>{`${car.engine.volume}L ${car.engine.power}HP ${car.drive}`}</td>
            <td>{car.equipmentName}</td>
            <td>{car.price.toLocaleString()} ₽</td>
            <td>{new Date(car.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CarTable
