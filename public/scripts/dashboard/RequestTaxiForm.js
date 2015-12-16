'use strict';

var React = require('react/addons');

var MaskedInput = require('../tools/MaskedInput');
var Modal = require('react-modal');
var AddressModal = require('./request_form/AddressModal');

var requestAddress = {};
var RequestTaxiForm = React.createClass({

  submitRequest: function (request) {
    $.ajax({
      url: '/api/v1/requests',
      dataType: 'json',
      type: 'POST',
      data: request,
      success: function(data) {
        this.props.onRequestListChange();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  closeConfirmModal: function () {
    this.setState({ isConfirmRequestModal: false });
  },

  getInitialState: function () {
    return {
      //confirm modal
      isConfirmRequestModal: false,
      userWantsToOpenAddressModal: true,
      showAddressModal: false,

      // Error modal
      isMissingInfoDialogOpen: false,
      messageMissingInfoDialog: '',

     // fields
      name: '',
      phone: '',
      cellphone: '',
      large_trunk: false,
      address: '',
      observation: '',
      payment: 'dinheiro'
    };
  },

  componentDidMount: function() {
    this.refs.name.getDOMNode().focus();
 },

  _onChange(e) {
    var stateChange = {};
    stateChange[e.target.name] = e.target.value;
    this.setState(stateChange);
  },

  clearFields: function () {
    this.setState({
      name: '',
      phone: '',
      cellphone: '',
      address: '',
      observation: '',
      large_trunk: false,
      payment: 'dinheiro'
    });

    this.refs.requestForm.getDOMNode().reset();
    this.refs.cellphone.clear();
    this.refs.phone.clear();
  },

  toggleLargeTrunk: function() {
    this.setState({ large_trunk: !this.state.large_trunk });
  },

  setMissingInfoError: function (message) {
    this.setState({ isMissingInfoDialogOpen: true });
    this.setState({ messageMissingInfoDialog: message });
  },

  cancelAddressModal: function () {
      this.hideAddressModal();
  },

  closeAddressModal: function (addressObject, completeAddressInLine) {
    this.setState({ address: completeAddressInLine });
    requestAddress = addressObject;

    this.hideAddressModal();
  },

  hideAddressModal: function () {
    React.findDOMNode(this.refs.name).focus();
    this.setState({ showAddressModal: false });
    setTimeout(() => {this.setState({ userWantsToOpenAddressModal: true }) }, 100);
  },

  openAddressModal: function () {
    if (this.state.userWantsToOpenAddressModal)
      this.setState({ showAddressModal: true, userWantsToOpenAddressModal: false });
  },

  closeMissingInfoModal: function () {
    this.setState({ isMissingInfoDialogOpen: false });
  },

  confirmModalAccepted: function () {
    var username = AuthService.readUser().username;

    var request = {};
    request.address = requestAddress;
    request.observation = this.state.observation;
    request.payment = this.state.payment;
    request.created_at = new Date().toString();
    request.creator = {name: username };
    request.large_trunk = Boolean(this.state.large_trunk);

    var customer = {};
    customer.name = this.state.name;
    customer.phone = this.state.phone;
    customer.cellphone = this.state.cellphone;
    request.customer = customer;

    this.submitRequest(request);

    this.clearFields();
    React.findDOMNode(this.refs.name).focus();
    this.closeConfirmModal();
  },

  canSubmit: function () {
    if (this.state.name.length == 0){
      this.setMissingInfoError('O Nome do cliente é obrigatório.');
      return false;
    }

    if (this.state.cellphone.length == 0) {
      this.setMissingInfoError('O Número do Celular é obrigatório.');
      return false;
    }

   if (this.state.address.length == 0) {
      this.setMissingInfoError('O Endereço é obrigatório.');
      return false;
    }

   return true;
  },

  openConfirmRequestModal: function () {
    React.findDOMNode(this.refs.name).enabled = false;
    this.setState({ isConfirmRequestModal: true });
  },

  handleSubmit: function(e) {
      e.preventDefault();

      if (this.canSubmit()) {
        this.openConfirmRequestModal();
      }
      return;
  },

  countTaxisAvailable: function () {
      if (this.state.large_trunk && this.state.payment == 'dinheiro')
          return this.props.taxiStatus.free.large_trunk.dinheiro;

      if (this.state.large_trunk && this.state.payment == 'cartao')
          return this.props.taxiStatus.free.large_trunk.cartao;

      if (!this.state.large_trunk && this.state.payment == 'dinheiro')
          return this.props.taxiStatus.free.dinheiro;

      if (!this.state.large_trunk && this.state.payment == 'cartao')
          return this.props.taxiStatus.free.cartao;

      return 0;
  },

  render: function () {
    return (
    <div className='form'>

       <AddressModal
         show={this.state.showAddressModal}
         defaultAddressString={this.state.address}
         defaultAddressObject={requestAddress}
         onCancel={this.cancelAddressModal}
         onClose={this.closeAddressModal}/>

       <Modal
         className="Modal__Bootstrap modal-dialog dialog"
         isOpen={this.state.isMissingInfoDialogOpen}
         onRequestClose={this.state.closeMissingInfoModal}>
         <div className="modal-content">
           <div className="modal-header modal-header-red">
             <button type="button" className="close" onClick={this.closeMissingInfoModal}>
               <span aria-hidden="true">&times;</span>
               <span className="sr-only">Fechar</span>
             </button>
             <h4 className="modal-title">Erro: </h4>
           </div>
           <div className="modal-body">
             <h4>{this.state.messageMissingInfoDialog}</h4>
           </div>
           <div className="modal-footer">
             <button type="button" className="btn btn-default" onClick={this.closeMissingInfoModal}>Ok</button>
           </div>
         </div>
       </Modal>

       <Modal
         className="Modal__Bootstrap modal-dialog dialog"
         isOpen={this.state.isConfirmRequestModal}
         onRequestClose={this.state.closeConfirmModal}>
         <div className="modal-content">
           <div className="modal-header">
             <button type="button" className="close" onClick={this.closeConfirmModal}>
               <span aria-hidden="true">&times;</span>
               <span className="sr-only">Fechar</span>
             </button>
             <h4 className="modal-title">Realizar chamado?</h4>
           </div>
           <div className="modal-body container-fluid">
             <div className="row">
                 <div className="col-md-6">
                     <h4>Cliente:</h4>
                     <p><b>Nome:</b> {this.state.name}</p>
                     <p><b>Celular:</b> {this.state.cellphone}</p>
                     <p><b>Telefone:</b> {this.state.phone}</p>
                 </div>
                 <div className="col-md-6">
                     <h4>Endereço:</h4>
                     <p><b>Rua:</b> {requestAddress.route}, N. {requestAddress.street_number}</p>
                     <p><b>Cidade:</b> {requestAddress.locality} - {requestAddress.administrative_area_level_1}</p>
                 </div>
             </div>
             <div className="row">
                <div className="col-md-6">
                   <h4>Outros:</h4>
                   <p><b>Bagageiro:</b> {this.state.large_trunk ? 'Sim' : 'Não'}</p>
                   <p><b>Pagamento:</b> {paymentMethodLabel(this.state.payment)}</p>
                </div>
                 <div className="col-md-6">
                   <h4>Taxis Disponíveis: <b className={this.countTaxisAvailable() === 0 ? 'zero' : 'positive'}>{this.countTaxisAvailable()}</b></h4>
                   <p><b>Obs:</b> {this.state.observation}</p>
                 </div>
             </div>
           </div>
           <div className="modal-footer">
             <button type="button" className="btn btn-default" onClick={this.closeConfirmModal}>Voltar</button>
             <button type="button" className="btn btn-primary" onClick={this.confirmModalAccepted}>Confirmar</button>
           </div>
         </div>
       </Modal>

      <form className='form-validate' onSubmit={this.handleSubmit} ref="requestForm" id='feedback_form' >
      <div className='form-group'>
        <label htmlFor='name' className='control-label'>
          Nome
          <span className='required'>*</span></label>
        <input className='form-control' id='name' ref="name" name="name" minlength='5' type='text' disabled={this.state.isConfirmRequestModal} onChange={this._onChange} autofocus />
      </div>
      <div className='form-group'>
        <label htmlFor='cellphone' className='control-label'>
          Celular
        <span className='required'>*</span></label>
        <MaskedInput pattern="(11) 1111-1111" className="form-control" ref="cellphone"name="cellphone" id="cellphone" disabled={this.state.isConfirmRequestModal} onChange={this._onChange} size="12" />
      </div>
      <div className='form-group'>
        <label htmlFor='phone' className='control-label'>
          Telefone
        </label>
        <MaskedInput pattern="(11) 1111-1111" className="form-control" ref="phone" name="phone" disabled={this.state.isConfirmRequestModal} onChange={this._onChange} id="phone" size="12" />
      </div>
     <div className='form-group'>
        <label htmlFor='address' className='control-label'>
          Endereço
          <span className='required'>*</span>
        </label>
        <input className='form-control'
        id='complete_address'
        ref="complete_address"
        name='complete_address'
        type='text'
        onFocus={this.openAddressModal}
        value={this.state.address} />
      </div>

      <div className="checkbox">
        <label>
          <input type="checkbox" name='large_trunk' onChange={this.toggleLargeTrunk} disabled={this.state.isConfirmRequestModal} checked={this.state.large_trunk}/> Bagageiro grande?
        </label>
      </div>

      <div className='form-group'>
        <label htmlFor='Pagamento' className='control-label'>
          Pagamento
        </label>
        <br />
        <div className="btn-group" data-toggle="buttons">
         <div className='radio'>
            <label onClick={() => { this.setState({ payment: 'cartao'})}}><input type='radio' name='payment' value='cartao' onChange={this._onChange} disabled={this.state.isConfirmRequestModal} checked={this.state.payment=='cartao'}/>Cartão</label>
          </div>
         <div className='radio'>
            <label onClick={() => { this.setState({ payment: 'dinheiro'})}}><input type='radio' name='payment' value='dinheiro' onChange={this._onChange} disabled={this.state.isConfirmRequestModal} checked={this.state.payment=='dinheiro'}/>Dinheiro</label>
          </div>
        </div>
      </div>
      <div className='form-group '>
        <label htmlFor='observation' className='control-label'>
        Observação:
        </label>
        <textarea className='form-control' id='observation' ref='observation' name='observation' disabled={this.state.isConfirmRequestModal} onChange={this._onChange}> </textarea>
      </div>
      <div className='form-group'>
          <button className='btn btn-primary' disabled={this.state.isConfirmRequestModal}>Salvar</button>
          <button className='btn btn-default' type='button' disabled={this.state.isConfirmRequestModal} onClick={this.clearFields}>Limpar</button>
      </div>
     </form>
    </div>
    );
  }

});

var appElement = document.getElementById('my-content');
Modal.setAppElement(appElement);
module.exports = RequestTaxiForm;
