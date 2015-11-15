'use strict';

var React = require('react/addons');

var SideMenu = require('./SideMenu');
var Header = require('./Header');
var RequestList = require('./request_list/RequestList');

var DashboardPage = React.createClass({

  getInitialState: function() {
    return { requests: [] };
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

  componentDidMount: function () {
    this.loadRequestsFromServer();
    setInterval(function () {
      this.loadRequestsFromServer();
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
        <Header/>
          <div className="container-fluid">
            <div className="row">
              <SideMenu onRequestCreated={this.handleRequestCreated} onRequestListChange={this.loadRequestsFromServer} />
              <RequestList requests={this.state.requests} />
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
