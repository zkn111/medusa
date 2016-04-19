var commonModal = require('client/components/modal_common/index');
var config = require('./config.json');
var request = require('../../request');
var __ = require('locale/client/admin.lang.json');

function pop(obj, parent, callback) {
  var {row, hostTypes} = obj;

  config.fields[0].text = row.name;
  config.fields[1].text = row.tenant_id;
  config.fields[2].text = row.user_id;

  var hosts = [];
  hosts.push({
    id: 'auto',
    name: __.auto
  });

  hostTypes.forEach((host) => {
    var name = host.service.host;

    if (row['OS-EXT-SRV-ATTR:host'] !== name) {
      hosts.push({
        id: name,
        name: name
      });
    }
  });

  var props = {
    __: __,
    parent: parent,
    config: config,
    onInitialize: function(refs) {
      refs.migrate_to.setState({
        data: hosts,
        value: hosts[0].id
      });
    },
    onConfirm: function(refs, cb) {
      var hostID = refs.migrate_to.state.value;
      if (hostID === 'auto') {
        hostID = null;
      }

      request.migrate(row.id, hostID).then((res) => {
        callback && callback(res);
        cb(true);
      });
    },
    onAction: function(field, state, refs) {
    },
    onLinkClick: function() {
    }
  };

  commonModal(props);
}

module.exports = pop;
