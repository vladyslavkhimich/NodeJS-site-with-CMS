module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function (item, productName, Sub_Product_ID) {
        let storedItem = this.items[Sub_Product_ID];
        if (!storedItem) {
            storedItem = this.items[Sub_Product_ID] = { item: item, qty: 0, price: item.Price, productName: productName }
        }
        storedItem.qty++;
        storedItem.price = parseFloat((Math.round((storedItem.item.Price + Number.EPSILON) * 100 * storedItem.qty) / 100).toFixed(2));
        this.totalQty++;
        this.totalPrice += parseFloat((Math.round((storedItem.item.Price + Number.EPSILON) * 100) / 100).toFixed(2));
    };

    this.reduceByOne = function(Sub_Product_ID) {
      this.items[Sub_Product_ID].qty--;
        this.items[Sub_Product_ID].price -= parseFloat((Math.round((this.items[Sub_Product_ID].item.Price + Number.EPSILON) * 100) / 100).toFixed(2));
        this.totalQty--;
        this.totalPrice -= parseFloat((Math.round((this.items[Sub_Product_ID].item.Price + Number.EPSILON) * 100) / 100).toFixed(2));
        if (this.items[Sub_Product_ID].qty <= 0) {
            delete this.items[Sub_Product_ID];
        }
    };

    this.removeItem = function(Sub_Product_ID) {
        this.totalQty -= this.items[Sub_Product_ID].qty;
        this.totalPrice -= this.items[Sub_Product_ID].price;
        delete this.items[Sub_Product_ID];
    };

    this.generateArray = function () {
        let arrayToReturn = [];
        for (let Sub_Product_ID in this.items) {
            arrayToReturn.push(this.items[Sub_Product_ID]);
        }
        return arrayToReturn;
    }
};