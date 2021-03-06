OrdersCtrl.prototype.applyReproductionFunctions = function(scope) {

  var _this = this;

  scope.setReproductionFormat = function(record) {
    _this.setReproductionFormat(record);
  }

  scope.setUnitFee = function(record, fee) {
    _this.setUnitFee(record, fee);
  }

  scope.showCustomUnitFee = function(record) {
    _this.showCustomUnitFee(record);
  }

  scope.hideCustomUnitFee = function(record) {
    _this.hideCustomUnitFee(record);
  }

  scope.updateCustomUnitFee = function(record) {
    _this.updateCustomUnitFee(record);
  }

  scope.editInvoiceDate = function() {
    _this.editInvoiceDate(scope);
  }

}


OrdersCtrl.prototype.enableFees = function(scope) {
  var _this = this;

  if (scope.order && scope.order['item_orders']) {
    scope.order['item_orders'].forEach(function(itemOrder) {
      _this.setReproductionFormat(itemOrder);
    });
  }
}


OrdersCtrl.prototype.setReproductionFormat = function(record) {
  var format = record['reproduction_spec']['reproduction_format'];

  if (!format) {
    var formatId = record['reproduction_spec']['reproduction_format_id'];
    format = this.controlledValues['reproduction_format'].find(function(element) {
      return element.id == formatId;
    });
  }
  if (format) {
    record['reproduction_spec']['reproduction_format'] = format;
    record['order_fee'] = {};
    this.setUnitFeeOptions(record, format);
  }
}


OrdersCtrl.prototype.setUnitFeeOptions = function(record, reproductionFormat) {
  var options = [];
  if (reproductionFormat.default_unit_fee) {
    options.push({ name: 'default', value: reproductionFormat.default_unit_fee });
  }
  if (reproductionFormat.default_unit_fee_internal && reproductionFormat.default_unit_fee_external) {
    options.push({ name: 'default_internal', value: reproductionFormat.default_unit_fee_internal });
    options.push({ name: 'default_external', value: reproductionFormat.default_unit_fee_external });
  }
  record['order_fee']['unit_fee_options'] = options;
}


OrdersCtrl.prototype.setUnitFee = function(record, fee) {
  record['order_fee']['per_unit_fee'] = Number(fee).toFixed(2);
}


OrdersCtrl.prototype.showCustomUnitFee = function(record) {
  record['order_fee']['showCustom'] = true;
  record['order_fee']['custom'] = record['order_fee']['custom'] || record['order_fee']['per_unit_fee'];
  record['order_fee']['per_unit_fee'] = record['order_fee']['custom'];
}


OrdersCtrl.prototype.hideCustomUnitFee = function(record) {
  delete record['order_fee']['showCustom'];
}


OrdersCtrl.prototype.editInvoiceDate = function(scope) {
  scope.order['editInvoiceDate'] = true;
}
