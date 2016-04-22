var commonModal = require('client/components/modal_common/index');
var config = require('./config.json');
var request = require('../../request');
var __ = require('locale/client/admin.lang.json');

function pop(obj, parent, callback) {
  config.fields[0].text = obj.name;

  var props = {
    __: __,
    parent: parent,
    config: config,
    onInitialize: function(refs) {
      request.getAllUsers().then((res) => {
        var users = res[0].users,
          roles = res[1].roles;
        if (users.length > 0 && roles.length > 0) {
          refs.user.setState({
            data: users,
            hide: false
          });
          refs.role.setState({
            data: roles,
            hide: false
          });
          refs.btn.setState({
            disabled: false
          });
        }
      });
    },
    onConfirm: function(refs, cb) {
      var roles = [];
      refs.role.state.data.forEach(function(ele) {
        if (ele.selected) {
          roles.push(ele.id);
        }
      });
      request.addUser(obj.id, refs.user.state.value, roles).then(() => {
        callback && callback();
        cb(true);
      });
    },
    onAction: function(field, status, refs) {}
  };

  commonModal(props);
}

module.exports = pop;