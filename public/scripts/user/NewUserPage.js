'use strict';

var LoginPage = React.createClass({

  getInitialState: function () {
    return {
      taxi_list: [],
      user_list: [],
    }
  },

  edit: function (user) {
  
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

  handleSubmit: function(e) {
      e.preventDefault();
      var name = React.findDOMNode(this.refs.name).value.trim();
      var username = React.findDOMNode(this.refs.username).value.trim();
      var email = React.findDOMNode(this.refs.email).value.trim();
      var password = React.findDOMNode(this.refs.password).value.trim();
      var confirmPassword = React.findDOMNode(this.refs.confirmPassword).value.trim();
      var phone = React.findDOMNode(this.refs.phone).value.trim();
      var taxi_id = React.findDOMNode(this.refs.taxi_id).value.trim();
      if (!name || !username) {
        return;
      }

      var user = {
        name: name,
        username: username,
        email: email,
        password: password,
        phone: phone,
        taxi_id: taxi_id,
      };

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
              <input type='text' id='name' ref="name" className='form-control' required placeholder='Nome Completo'/>
            </div>
            <div className='form-group'>
              <label>Usuário</label>
              <input type='text' id='username' ref='username' className='form-control' required placeholder='Nome de usuário'/>
            </div>
            <div className='form-group'>
              <label>Email</label>
              <input type='email' className='form-control' ref='email' required placeholder='Email'/>
            </div>
            <div className='form-group'>
              <label>Senha</label>
              <input type='password' className='form-control' ref='password' required placeholder='Senha' name='password'/>
            </div>
            <div className='form-group'>
              <label>Confirmar senha</label>
              <input type='password' name='confirmPassword' ref='confirmPassword' className='form-control' required placeholder='Confirmar senha' />
            </div>
            <div className='form-group'>
              <label>Telefone</label>
              <input type='text' className='form-control' ref='phone' placeholder='(51) xxxx-xxxx' />
            </div>
            <div className='form-group'>
                <select className='form-control' id="taxi_id" ref="taxi_id">
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
