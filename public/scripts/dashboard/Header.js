'use strict';

var React = require('react/addons');

var Header = React.createClass({

  getInitialState: function () {
    return {
      username: 'Atendente01'
    };
  },

  componentWillMount: function () {
   var user = AuthService.readUser();
   this.state.username = user.username;
  },

  showNewTaxi: function () {
    window.location.href = '/taxi/novo'
  },

  showNewUser: function () {
    window.location.href = '/users/new'
  },

  showMap: function () {
    window.location.href = '/mapa'
  },

  signOff: function () {
    AuthService.signOff(); 
    window.location.href = '/login';
  },

  render: function () {
    return (
      <header className='header dark-bg'>
        <a href="/" className="logo">
          Taxi
          <span className="lite">  Finder</span>
        </a>
        <div className="top-nav notification-row">
           <ul className="nav pull-right top-menu">
             <li className="dropdown">
               <a data-toggle="dropdown" className="dropdown-toggle" href="#">
                  <span className="username">{this.state.username}</span>
                  <b className="caret"></b>
               </a>
               <ul className="dropdown-menu extended logout">
                 <div className="log-arrow-up"></div>
                 <li className="eborder-top">
                   <a onClick={this.showNewTaxi} href="#"><i className="icon_key_alt"></i>Novo Taxi</a>
                   <a onClick={this.showNewUser} href="#"><i className="icon_key_alt"></i>Novo Usuário</a>
                   <a onClick={this.showMap} href="#"><i className="icon_key_alt"></i>Mapa</a>
                   <a onClick={this.signOff} href="#"><i className="icon_key_alt"></i> Sair</a>
                 </li>
               </ul>
             </li>
           </ul>
        </div>
      </header>
    );
  }
});

module.exports = Header;
