'use strict';

var React = require('react/addons');

var SideMenu = require('./SideMenu');
var Header = require('./Header');
var RequestList = require('./request_list/RequestList');

var DashboardPage = React.createClass({

  getInitialState: function() {
    return {
        requests: [],
        status: { free: { total: 0}, busy: { total: 0} }
    };
  },

  loadRequestsFromServer: function() {
    var token = AuthService.currentToken();

    $.ajax({
      url: '/api/v1/requests',
      dataType: 'json',
      cache: false,
      headers: {"x-access-token": token},
      success: function(data) {
                 this.setState({requests: data});
               }.bind(this),
      error: function(xhr, status, err) {
                 console.error(this.props.url, status, err.toString());
             }.bind(this)
      });
  },

  requestTaxiStatus: function() {
    $.ajax({
      url: '/api/v1/taxis/count',
      dataType: 'json',
      cache: false,
      success: function(data) {
                 this.setState({ status: data });
               }.bind(this),
      error: function(xhr, status, err) {
                 console.error(this.props.url, status, err.toString());
             }.bind(this)
      });
  },

  componentDidMount: function () {
    this.loadRequestsFromServer();
    this.requestTaxiStatus();
    setInterval(function () {
      this.loadRequestsFromServer();
      this.requestTaxiStatus();
    }.bind(this), 3000)
  },

  handleRequestCreated: function(request) {
    var requests = this.state.requests;
    var newRequests = requests.concat([request]);
    this.setState({requests: newRequests});
  },

  render: function () {
    return (
        <section>
        <Header status={this.state.status} />
          <div className="container-fluid">
            <div className="row">
              <SideMenu onRequestCreated={this.handleRequestCreated} onRequestListChange={this.loadRequestsFromServer} taxiStatus={this.state.status} />
              <RequestList requests={this.state.requests}/>
            </div>
          </div>
        </section>
    )
  }
});

module.exports = DashboardPage;

if (AuthService.validateUser()) {
  var content = document.getElementById('my-content');
  React.render(<DashboardPage/>, content);
} else {
  console.log('not logged in');
  window.location.href = 'login';
}
