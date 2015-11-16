'use strict';

var React = require('react/addons');
var Modal = require('react-modal');

var requestAddress = {};
var firstTime = true;

var AddressModal = React.createClass({
  
  setupAddressInput: function () {
     /*jshint unused:false*/
    var autocomplete = new google.maps.places.Autocomplete( (document.getElementById('address')), {types: ['geocode']});
    autocomplete.addListener('place_changed', function() {

    var place = autocomplete.getPlace();
    var componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name',
        neighborhood: 'long_name'
      };
      var address = {};
      for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
          var val = place.address_components[i][componentForm[addressType]];
          address[addressType] = val
        }
      }
      address.location = {};
      address.location.lat = place.geometry.location.lat();
      address.location.lng = place.geometry.location.lng();
      requestAddress = address;
    }.bind(this));
  },

  isValidAddress: function () {
    return requestAddress.street_number !== undefined && 
      requestAddress.locality !== undefined &&
      requestAddress.location !== undefined;
  },

  cancelModal: function () {
    this.props.onCancel();
  },

  closeModal: function () {
    if (this.isValidAddress()) {
      this.props.onClose(requestAddress, document.getElementById('address').value); 
      firstTime = true;
    }
  },

  getInitialState: function () {
    return {
      address : '',
      street: '',
      number: '',
      city: '',
      state: ''
    };
  },

  componentDidMount: function () {
    this.refs.address.getDOMNode().focus();
  },

  _onChange(e) {
    if (firstTime) {
      firstTime = false;
      this.refs.address.getDOMNode().focus();
      this.setupAddressInput();
    }

    var stateChange = {};
    stateChange[e.target.name] = e.target.value;
    this.setState(stateChange);
  },

  render: function () {
   return (
     <Modal
       className="Modal__Bootstrap modal-dialog dialog"
       isOpen={this.props.show}
       onRequestClose={this.closeModal}>
       <div className="modal-content">
         <div className="modal-header">
           <button type="button" className="close" onClick={this.cancelModal}>
             <span aria-hidden="true">&times;</span>
             <span className="sr-only">Fechar</span>
           </button>
           <h4 className="modal-title">Endereço</h4>
         </div>
         <div className="modal-body">
         <div className='form-group'>
           <input className='form-control' id='address' ref="address" name='address' minlength='5' type='text' onChange={this._onChange} autofocus />
         </div>
        <p><b>Rua:</b> {requestAddress.route},</p>
        <p><b>Número:</b> {requestAddress.street_number}</p>
        <p><b>Cidade:</b> {requestAddress.locality} - {requestAddress.administrative_area_level_1}</p>

         </div>
         <div className="modal-footer">
           <button type="button" className="btn btn-default" onClick={this.cancelModal}>Voltar</button>
           <button type="button" className="btn btn-primary" disabled={!this.isValidAddress()} onClick={this.closeModal}>Confirmar</button>
         </div>
       </div>  
     </Modal>
   ) 
 }
});

module.exports = AddressModal;
