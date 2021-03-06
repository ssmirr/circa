CircaCtrl.prototype.applyOrderFunctions = function(scope) {

  var _this = this;

  scope.showOrder = function(orderId) {
    _this.showOrder(orderId);
  }

  scope.editOrder = function(orderId) {
    _this.goto('orders/' + orderId + '/edit');
  }

  scope.triggerOrderEvent = function(orderId, event, callback) {
    _this.triggerOrderEvent(scope, orderId, event, callback);
  }

  scope.refreshCurrentOrder = function(callback) {
    _this.refreshCurrentOrder(scope, callback);
  }

  scope.updateOrder = function(event) {
    _this.updateOrder(scope, event);
  }

  scope.updateOrderAndTriggerEvent = function(event) {
    _this.updateOrderAndTriggerEvent(scope, event);
  }

}


CircaCtrl.prototype.showOrder = function(orderId) {
  this.goto('orders/' + orderId);
}


CircaCtrl.prototype.getOrder = function(scope, id, callback) {
  var path = '/orders/' + id;
  var _this = this;
  scope.loading = true;
  this.apiRequests.get(path).then(function(response) {
    if (response.status == 200) {

      _this.refreshOrder(scope, response.data['order'], callback)
      // scope.order = response.data['order'];
      // _this.collectItemIds(scope, response.data['order']);
      // _this.collectUserEmails(scope, response.data['order']);
      // _this.collectAssigneeEmails(scope, response.data['order']);
      // _this.setStatesEvents(scope);
      // _this.setCheckOutAvailable(scope);
      // _this.commonUtils.executeCallback(callback, scope);
      scope.loading = false;
    }
    else if (response.data['error'] && response.data['error']['detail']) {
      scope.errorCode = response.status;
      scope.flash = response.data['error']['detail'];
    }
  });
}


CircaCtrl.prototype.refreshOrder = function(scope, order, callback) {
  scope.order = order;
  this.collectItemIds(scope, order);
  this.collectUserEmails(scope, order);
  this.collectAssigneeEmails(scope, order);
  this.setStatesEvents(scope);
  this.setCheckOutAvailable(scope);
  this.addAllItemOrdersToBulkEventsList(scope);
  this.setDateSingleOrRange(scope);
  scope.order['editInvoiceDate'] = !scope.order['invoice_date'] ?
    true : false;
  this.commonUtils.executeCallback(callback, scope);
}


CircaCtrl.prototype.refreshCurrentOrder = function(scope, callback) {
  if (scope.order) {
    var orderId = scope.order['id'];
    this.getOrder(scope, orderId, callback);
  }
}


// DEPRICATED AS DUPLICATE - use refreshCurrentOrder
// CircaCtrl.prototype.updateOrder = function(scope, callback) {
//   if (scope.order) {
//     this.getOrder(scope, scope.order['id'], callback);
//   }
// }


// Trigger event for order and reset $scope.order['states_events']
CircaCtrl.prototype.triggerOrderEvent = function(scope, orderId, event, callback) {
  var path = '/orders/' + orderId + '/' + event;
  var _this = this;
  scope.orderEventLoading = true;
  _this.apiRequests.put(path).then(function(response) {
    scope.orderEventLoading = false;
    if (response.status == 200) {
      scope.order = response.data['order'];
      _this.setStatesEvents(scope);
      _this.commonUtils.executeCallback(callback, response.data);
    }
    else if (response.data['error'] && response.data['error']['detail']) {
      scope.flash = response.data['error']['detail'];
    }
  });
}


CircaCtrl.prototype.updateOrder = function(scope, event, callback) {
  var _this = this;
  scope.loading = true;

  var data = { 'order': scope.order };
  if (event) {
    data['event'] = event;
  }

  this.apiRequests.put("orders/" + scope.order['id'], data).then(function(response) {
    if (response.status == 200) {
      scope.order = response.data['order'];
      _this.goto('orders/' + scope.order['id']);
      _this.commonUtils.executeCallback(callback, response.data);
      scope.loading = false;
    }
    else if (response.data['error'] && response.data['error']['detail']) {
      scope.flash = response.data['error']['detail'];
    }
  });
}


CircaCtrl.prototype.updateOrderAndTriggerEvent = function(scope, event, callback) {
  if (scope.order) {
    this.updateOrder(scope, event, callback);
  }
}
