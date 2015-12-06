'use strict';

var NewTaxiPage = React.createClass({

  getInitialState: function () {
    return {
      taxi_list: [],

      edit_mode: false,

      license_plate: '',
      code: '',
      payment_method: '',
      bagageiro: '',
      dinheiro: true,
      cartao: false
    }
  },

  clearFields: function() {
     this.setState({
        edit_mode: false,
        license_plate: '',
        code: '',
        payment_method: '',
        bagageiro: '',
        dinheiro: true,
        cartao: false
    });
  },

  edit: function(taxi) {
    this.setState({
        edit_mode: true,

        license_plate: taxi.license_plate,
        code: taxi.code,
        bagageiro: taxi.large_trunk,
        dinheiro: taxi.payment_methods.indexOf('dinheiro') > -1,
        cartao: taxi.payment_methods.indexOf('cartao') > -1,
        payment_method: taxi.payment_methods
    });
  },

  stopEditing: function () {
      this.clearFields();
  },

  handleChange: function(field, e) {
    var nextState = {}
    nextState[field] = e.target.checked
    this.setState(nextState)
  },

  _onChange: function (e) {
    var nextState = {}
    nextState[e.target.name] = e.target.value
    this.setState(nextState)
  },

  updateTaxi: function (taxi) {
       $.ajax({
          url: '/api/v1/taxis/update',
          dataType: 'json',
          type: 'PUT',
          data: JSON.stringify(taxi),
          processData: false,
            success: function(data) {
                this.updateTaxiList();
                this.clearFields();
          }.bind(this),
          error: function(xhr, status, err) {
              console.error(this.props.url, status, err.toString());
          }.bind(this)
      });
  },

  submitNewTaxi: function (newTaxi) {
       $.ajax({
          url: '/api/v1/taxis/signup',
          dataType: 'json',
          type: 'POST',
          data: JSON.stringify(newTaxi),
          processData: false,
            success: function(data) {
                this.updateTaxiList();
                this.clearFields();
                alert('Cadastrado com sucesso');
          }.bind(this),
          error: function(xhr, status, err) {
              console.error(this.props.url, status, err.toString());
          }.bind(this)
      });

  },

  handleSubmit: function(e) {
      e.preventDefault();

      var payment_methods = this.state.dinheiro ? ["dinheiro"] : [];
      payment_methods = payment_methods.concat(this.state.cartao ? ["cartao"] : []);

      var newTaxi = {
        license_plate: this.state.license_plate,
        code: this.state.code,
        large_trunk: this.state.bagageiro ? 'Sim' : '',
        payment_methods: payment_methods,
      };


      if (this.state.edit_mode) {
        this.updateTaxi(newTaxi);
      } else {
        this.submitNewTaxi(newTaxi);
      }

      return;
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

  componentDidMount: function () {
    this.updateTaxiList();
  },

  render: function () {
    return (
    <div className='container'>
      <div className='row'>

       <div id='new_taxi_div' className='col-md-3'>
          <form onSubmit={this.handleSubmit}>

            <div className='form-group'>
              <label>Placa do taxi</label>
              <input type='text' name='license_plate' ref="license_plate" className='form-control' maxLength="8" required placeholder='Placa do carro' value={this.state.license_plate}  onChange={this._onChange}/>
            </div>

            <div className='form-group'>
              <label>Código</label>
              <input type='text' name='code' ref="code" className='form-control' required placeholder='Código interno' value={this.state.code}  onChange={this._onChange}/>
            </div>

            <div className='form-group'>
              <label>Bagageiro grande?</label>

              <div className="pull-down">
                <label className="checkbox-inline">
                  <input type="checkbox"
                    checked={this.state.bagageiro}
                    onChange={this.handleChange.bind(this, 'bagageiro')}/> Sim
                </label>
               </div>
            </div>

            <div className='form-group'>
              <label>Formas de pagamento aceito</label>

              <div className="pull-down">
                <label className="checkbox-inline">
                  <input type="checkbox"
                    checked={this.state.dinheiro}
                    onChange={this.handleChange.bind(this, 'dinheiro')} /> Dinheiro
                </label>
                <label className="checkbox-inline">
                  <input type="checkbox"
                    checked={this.state.cartao}
                    onChange={this.handleChange.bind(this, 'cartao')} /> Cartão
                </label>
              </div>
            </div>

            <button type='submit' className='btn btn-primary' >Salvar</button>
            &nbsp;
            <button className='btn btn-default' disabled={!this.state.edit_mode} onClick={this.stopEditing} >Cancelar</button>
          </form>
        </div>

        <div id="taxi_list" className='col-md-9'>
          <table className='table table-condensed table-hover'>
              <thead>
                <tr>
                  <td>Id</td>
                  <td>Codigo</td>
                  <td>Placa</td>
                  <td>Bagageiro</td>
                  <td>Formas de pagamento</td>
                  <td>Situação</td>
                </tr>
              </thead>
              <tbody>
          {
              this.state.taxi_list.map((taxi) => {
                return (
                  <tr onClick={this.edit.bind(this, taxi)}>
                    <td>{taxi.id}</td>
                    <td>{taxi.code}</td>
                    <td>{taxi.license_plate}</td>
                    <td>{taxi.large_trunk}</td>
                    <td>{taxi.payment_methods.join(', ')}</td>
                    <td>{taxi.busy ? 'Sim' : taxi.busy}</td>
                  </tr>
                )
              })
            }
            </tbody>
          </table>
        </div>
      </div>
    </div>
   );
  }
});

var content = document.getElementById('my-content');
React.render(<NewTaxiPage/>, content);
