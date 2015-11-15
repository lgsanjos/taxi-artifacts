'use strict';

var React = require('react/addons');

var convertDate = function (date) {
  function padDateTime(dt) { //Add a preceding zero to months and days < 10
    return dt < 10 ? "0"+dt : dt;
  }

  var dateParsed = new Date(Date.parse(date));
  var dd = padDateTime(dateParsed.getDate());
  var mm = padDateTime(dateParsed.getMonth()+1);
  var yyyy = dateParsed.getFullYear();
  var hrs = padDateTime(dateParsed.getHours());
  var mins = padDateTime(dateParsed.getMinutes());

   return dd+"/"+mm+"/"+yyyy+" às: "+hrs+":"+mins;
}

var RequestRow = React.createClass({

  rideInfoAccepted: function (request) {
    return (
       <div>
         <p><b>Aceito:</b> { convertDate(request.accepted_at)}</p>
         <p><b>Por:</b> {request.taxi.username} <b> Cod.: </b> {request.taxi.id}</p>
         <p><b>Placa:</b> {request.taxi.license_plate}</p>
       </div>
    );
  },

  rideInfoPendding: function (request) {
    return (
      <div>
        <p>Situação: Aguardando...</p>
        <p>Tentativa: {request.tryouts}</p>
      </div>
    );
  },

  rideInfo: function (request) {
    var isAccepted = request.taxi ? true : false
    if (isAccepted)
      return this.rideInfoAccepted(request);

    return this.rideInfoPendding(request);
  },

  fullInfo: function (request) {
    var address = request.address;
    if (address === null || address === undefined) {
      address = { route: '', street_number: '', neighborhood: '', locality: '', administrative_area_level_1: ''};
    }
    return (
     <div id={"collapse" + request.id} className='row collapse'>
      <div className='request-info col-md-4'>
        <p><b>Celular: </b>{request.customer.cellphone}</p>
        <p><b>Telefone: </b>{request.customer.phone}</p>
        <p><b>Endereço: </b>
          <br />&nbsp;&nbsp;{address.route + ", " + address.street_number}
          <br />&nbsp;&nbsp;{address.neighborhood + ", " + address.locality + " - " + address.administrative_area_level_1}</p>
      </div>
      <div className='request-info col-md-4'>
        { this.rideInfo(request) }
     </div>
     <div className='request-info col-md-4'>
       <p><b>Forma de pagamento: </b>{paymentMethodLabel(request.payment)}</p>
       <p><b>Obs: </b>{request.observation}</p>
     </div>
    </div>
  ) 
  },

  format_date: function(datetime) {
    return moment(datetime).format('HH:mm - MM/DD/YYYY');
  },

  title: function (request) {
    var imgSrc = "/imgs/waiting_icon.png";
    if (request.taxi)
      imgSrc = "/imgs/accepted_icon.png";

    if (request.tryouts >= 5)
      var alarmImg = <img className="icon" src='/imgs/alarm.png' />

    return (
      <div className="request row">
        <div className="request-info col-md-4">
          <p>
            <img className="icon" src={imgSrc} />
            {alarmImg}
            <b>{request.customer.name}</b>
          </p>
        </div>
        <div className="request-info col-md-6">
          <p><b>Aberto por:</b> {request.creator.name} 
          <b> às </b>{this.format_date(request.created_at)}</p>
        </div>
         <div className="request-info col-md-2">
           <a role="button" data-toggle="collapse" data-target={"#collapse" + request.id}>Mais detalhes</a>
        </div>
      </div>
    )
  }, 

  render: function () {
    var request = this.props.request;
    var rideInfo = this.rideInfo(request);

    return (
      <div>
        { this.title(request) }
        { this.fullInfo(request) }
      </div>
    )
  }

});

module.exports = RequestRow;
