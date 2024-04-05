import { useState } from 'react'
import './userForm.css'

const data = [
  {
    employeeId: '01',
    name: 'John Doe',
    email: 'johndoe@email.com',
    position: 'Frontend Developer',
  },
  
]

const EditableTable = () => {
  const [employeeData, setEmployeeData] = useState(data)

  const onChangeInput = (e, employeeId) => {
    const { name, value } = e.target

    const editData = employeeData.map((item) =>
      item.employeeId === employeeId && name ? { ...item, [name]: value } : item
    )

    setEmployeeData(editData)
  }

  return (
    <div className="container-form5">
      <h1 className="title-form5">PERIODIC HEALTH EXAMINATION FORM</h1>
      <table>
        <thead>
          <tr>
            <th>Last Name</th>
            <th>First Name</th>
            <th>Middle Initial</th>
          </tr>
        </thead>
        <tbody>
          {employeeData.map(({ employeeId, name, email, position }) => (
            <tr key={employeeId}>
              <td>
                <input
                  name="name"
                  value={name}
                  type="text"
                  onChange={(e) => onChangeInput(e, employeeId)}
                  placeholder="Type Name"
                />
              </td>
              <td>
                <input
                  name="email"
                  value={email}
                  type="text"
                  onChange={(e) => onChangeInput(e, employeeId)}
                  placeholder="Type Email"
                />
              </td>
              <td>
                <input
                  name="position"
                  type="text"
                  value={position}
                  onChange={(e) => onChangeInput(e, employeeId)}
                  placeholder="Type Position"
                />
              </td>
            </tr>
          ))}
        </tbody>
        <thead>
          <tr>
            <th>Age</th>
            <th>Sex</th>
            <th>Status</th>
          </tr>
        </thead>
      </table>
    </div>
  )
}

export default EditableTable