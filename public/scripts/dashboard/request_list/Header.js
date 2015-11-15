'use strict';

var React = require('react/addons');
var SearchInput = require('react-search-input');

var RequestListHeader = React.createClass({

  filtered: [],

  onSearch: function (term) {
    this.setState({searchTerm: term});

    if (this.refs.search) {
      var filters = ['customer.name', 'customer.phone', 'customer.cellphone', 'customer.address'];
      this.filtered = this.props.requestList.filter(this.refs.search.filter(filters));
    }

   this.props.searchUpdated(this.filtered.sort(sortRequestByTimeGenerated));
  },

  render: function () {

    return (
     <div className="request-list-header">
      <div className="fixed-left-label">
        <h2>Chamados</h2>
      </div>
      <div className='search-request middle'>
        <SearchInput ref='search' className='search-input' placeholder='Pesquisar' onChange={this.onSearch} />
        <br />
      </div>
    </div>
   )
  }
});

module.exports = RequestListHeader;
