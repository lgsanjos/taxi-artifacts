'use strict';

var appElement = document.getElementById('my-content');

ReactModal.setAppElement(appElement);

var LoginPage = React.createClass({

  getInitialState: function () {
    return { modalIsOpen: false };
  },

  openModal: function() {
    this.setState({modalIsOpen: true});
  },

  closeModal: function() {
    this.setState({modalIsOpen: false});
  },

  handleSubmit: function(e) {
      e.preventDefault();
      var username = React.findDOMNode(this.refs.username).value.trim();
      var password = React.findDOMNode(this.refs.password).value.trim();
      if (!username || !password) {
        return;
      }

      var user = {
        username: username,
        password: password
      };

      $.ajax({
          url: '/api/v1/auth/login',
          dataType: 'json',
          type: 'POST',
          data: JSON.stringify(user),
          processData: false,
          success: function(data) {
            AuthService.saveUser(data);
            window.location.href = 'dashboard';
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
            this.openModal();
          }.bind(this)
      });
      return;
  },
 
  render: function () {
    return (
     <div className='container'>

       <ReactModal
         className="Modal__Bootstrap modal-dialog"
         isOpen={this.state.modalIsOpen}
         onRequestClose={this.state.closeModal}>
         <div className="modal-content">
           <div className="modal-header modal-header-red">
             <button type="button" className="close" onClick={this.closeModal}>
               <span aria-hidden="true">&times;</span>
               <span className="sr-only">Fechar</span>
             </button>
             <h4 className="modal-title">Erro: </h4>
           </div>
           <div className="modal-body">
             <h4>Usuário ou senha inválido.</h4>
           </div>
           <div className="modal-footer">
             <button type="button" className="btn btn-default" onClick={this.closeModal}>Ok</button>
           </div>
         </div>  
       </ReactModal>

       <form className='login-form' onSubmit={this.handleSubmit}>
        <div className='login-wrap'>
            <h2>Entrar no sistema</h2>
            <p className='login-img'><i className='icon_lock_alt'></i></p>
            <div className='input-group'>
              <span className='input-group-addon'><i className='icon_profile'></i></span>
              <input type='text' className='form-control' placeholder='Usuário' ref='username' html='autofocus' />
            </div>
            <div className='input-group'>
                <span className='input-group-addon'><i className='icon_key_alt'></i></span>
                <input type='password' className='form-control' ref='password' placeholder='Senha' />
            </div>
            <button className='btn btn-primary btn-lg btn-block' type='submit'>Entrar</button>
            <br />
        </div>
      </form>
      </div>
   );
  }
});

var content = document.getElementById('my-content');
React.render(<LoginPage/>, content);
