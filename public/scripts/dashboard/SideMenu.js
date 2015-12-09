'use strict';

var React = require('react/addons');
var RequestTaxiForm = require('./RequestTaxiForm');
var SideMenu = React.createClass({

  render: function () {
    return (
      <div id="sidebar-wrapper" className="col-sm-3">
          <div id="content" className='nav-collapse sidebar-nav'>
            <div>
              <RequestTaxiForm onRequestCreated={this.props.onRequestCreated} onRequestListChange={this.props.onRequestListChange} taxiStatus={this.props.status}/>
            </div>
          </div>
      </div>
    );
  }
});

module.exports = SideMenu;
