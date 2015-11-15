'use strict';

var React = require('react/addons');

var RequestListHeader = require('./Header.js');
var RequestListRow = require('./Row.js');

var RequestList = React.createClass({
  requests: null,
  filteredRequests: null,

  getInitialState: function() {
    return {
      requests: []
    };
   },

  searchUpdated: function (filtered) {
   this.filteredRequests = filtered;
   this.forceUpdate();
  },

  render: function () {
   this.requests = this.filteredRequests ? this.filteredRequests : this.props.requests;
   this.requests.sort(sortRequestByTimeGenerated);

   return (
      <div id='main-content' className="col-sm-9">
        <div className='wrapper'>
          <RequestListHeader requestList={this.props.requests} searchUpdated={this.searchUpdated}/>
          <div className='request-list container-fluid'>
            {
              this.requests.map(function (request) {
                return <RequestListRow request={request} />
              })
            }
          </div>
        </div>
      </div>
    );
  }

});

module.exports = RequestList;
