'use strict';

var LoginPage = React.createClass({

  _onChange: function (e) {
    var nextState = {}
    nextState[e.target.name] = e.target.value
    this.setState(nextState)
  },

  getInitialState: function () {
    return {
      edit_mode: false,

      taxi_list: [],
      user_list: [],

      name: '',
      username: '',
      email: '',
      password: '',
      confirm_password: '',
      phone: '',
      taxi_id: ''
    }
  },

  clearFields: function () {
    this.setState({
      name: '',
      username: '',
      email: '',
      password: '',
      confirm_password: '',
      phone: '',
      taxi_id: ''
    }); 
  },

  edit: function (user) {
    this.setState({ edit_mode: true  });

    this.setState({
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
        confirm_password: user.confirm_password,
        phone: user.phone,
        taxi_id: user.taxi_id,
      });

  },

  cancel_edit: function () {
    this.setState({ edit_mode: false  });
  },

  updateUserList: function () {
    var token = AuthService.currentToken();
      $.ajax({
          url: '/api/v1/users',
          type: 'GET',
          headers: {"x-access-token": token},
          processData: false,
          success: function(data) {
              this.setState({ user_list: data});
          }.bind(this),
          error: function(xhr, status, err) {
              console.error(this.props.url, status, err.toString());
          }.bind(this)
      });
  },

  updateTaxiList: function () {
      $.ajax({
          url: '/api/v1/taxis/list',
          type: 'GET',
          success: function(data) {
              this.setState({ taxi_list: data});
          }.bind(this),
          error: function(xhr, status, err) {
              console.error(this.props.url, status, err.toString());
          }.bind(this)
      });
  },

  submitUpdate: function (user) {
       $.ajax({
          url: '/api/v1/user/update',
          dataType: 'json',
          type: 'POST',
          data: JSON.stringify(user),
          processData: false,
          success: function(data) {
              document.getElementById('success').removeAttribute("hidden");
          }.bind(this),
          error: function(xhr, status, err) {
              console.error(this.props.url, status, err.toString());
          }.bind(this)
      });
  },

  submitNewUser: function (user) {
      $.ajax({
          url: '/api/v1/auth/signup',
          dataType: 'json',
          type: 'POST',
          data: JSON.stringify(user),
          processData: false,
          success: function(data) {
              document.getElementById('success').removeAttribute("hidden");
          }.bind(this),
          error: function(xhr, status, err) {
              console.error(this.props.url, status, err.toString());
          }.bind(this)
      });
  },

  handleSubmit: function(e) {
      e.preventDefault();
      
     if (!name || !username) {
        return;
      }

      var user = {
        name: this.state.name,
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        confirm_password: this.state.confirm_password,
        phone: this.state.phone,
        taxi_id: this.state.taxi_id,
      };

      if (this.state.edit_mode)
          this.submitUpdate(user);
      else
          this.submitNewUser(user);

     this.clearFields();
     return;
  },

  getTaxiDescription: function(id) {
    let taxi = _.findWhere(this.state.taxi_list, {'id': parseInt(id)});
    if (taxi === undefined)
      return;

    let code = taxi.code === null ? '' : taxi.code;
    let separator = code === '' ? '' : ' - ';
    return code + separator + taxi.license_plate;
  },

  componentDidMount: function () {
    this.updateTaxiList();
    this.updateUserList();
  },

  render: function () {
    return (
    <div className='container'>
      <h2 id='success' hidden>Usuário cadastrado com sucesso</h2>
      <div className='row'>
        <div className='col-md-3'>
          <form onSubmit={this.handleSubmit}>
            <div className='form-group'>
              <label>Nome</label>
              <input type='text' id='name' ref="name" name='name' className='form-control' required placeholder='Nome Completo' onChange={this._onChange} value={this.state.name}/>
            </div>
            <div className='form-group'>
              <label>Usuário</label>
              <input type='text' id='username' ref='username' name='username' className='form-control' required placeholder='Nome de usuário' value={this.state.username} onChange={this._onChange}/>
            </div>
            <div className='form-group'>
              <label>Email</label>
              <input type='email' className='form-control' ref='email' name='email' required placeholder='Email' value={this.state.email} onChange={this._onChange}/>
            </div>
            <div className='form-group'>
              <label>Senha</label>
              <input type='password' className='form-control' ref='password' required placeholder='Senha' name='password' value={this.state.password} onChange={this._onChange}/>
            </div>
            <div className='form-group'>
              <label>Confirmar senha</label>
              <input type='password' name='confirm_password' ref='confirmPassword' className='form-control' required placeholder='Confirmar senha' value={this.state.password_confirm} onChange={this._onChange}/>
            </div>
            <div className='form-group'>
              <label>Telefone</label>
              <input type='text' className='form-control' name='phone' ref='phone' placeholder='(51) xxxx-xxxx' value={this.state.phone} onChange={this._onChange}/>
            </div>
            <div className='form-group'>
                <select className='form-control' id="taxi_id" name='taxi_id' ref="taxi_id" onChange={this._onChange} value={this.state.taxi_id}>
                {
                    this.state.taxi_list.map( (taxi) => {
                        return (<option value={taxi.id}>{taxi.code} - {taxi.license_plate}</option>)
                    })
                }
                </select>
            </div>

            <button type='submit' className='btn btn-primary' >Cadastrar</button>
          </form>
        </div>


        <div id="taxi_list" className='col-md-9'>
          <table className='table table-condensed table-hover'>
              <thead>
                <tr>
                  <td>Id</td>
                  <td>Nome</td>
                  <td>Email</td>
                  <td>Usuário</td>
                  <td>Telefone</td>
                  <td>Carro</td>
                </tr>
              </thead>
              <tbody>
          { 
              this.state.user_list.map((user) => {
                return (
                  <tr onClick={this.edit.bind(this, user)}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.username}</td>
                    <td>{user.phone}</td>
                    <td>{this.getTaxiDescription(user.taxi_id)}</td>
                  </tr>
                ) 
              })
            }
            </tbody>
          </table>
        </div>

      </div>
    </div>
   )
  }
});

var content = document.getElementById('my-content');
React.render(<LoginPage/>, content);
