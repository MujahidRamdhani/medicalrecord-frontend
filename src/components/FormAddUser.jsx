import React from 'react'

const FormAddUser = () => {
  return (
    <div>
      <h1 className='title'>User</h1>
      <h2 className='subtittle'>Add New User</h2>
      <div className="card is-shadowless">
        <div className="card-content">
            <div className="content">
            <form>
                <div className="field">
                    <label className="label">Username</label>
                    <div className="control">
                        <input type="text" className="input" placeholder='Username'/>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                        <input type="password" className="input" placeholder='***********'/>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Confirm Password</label>
                    <div className="control">
                        <input type="password" className="input" placeholder='***********'/>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Role</label>
                    <div className="control">
                        <div className="select is-fullwidth">
                            <select>
                                <option value="DOKTER">DOKTER</option>
                                <option value="PASIEN">PASIEN</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <button className="button is-success">Save</button>
                    </div>
                </div>
            </form>
            </div>
        </div>
      </div>
    </div>
  )
}

export default FormAddUser
