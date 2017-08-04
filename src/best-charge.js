const loadAllItems = require('./items.js');
const promotions   = require('./promotions.js');
function bestCharge(selectedItems) {
	var shouldpay ;
	var discountpay	 ;
	var answer  = '';
	function ChangeGoodsOrderArrayToGoodsOrderObject(GoodsOrderArray , AllItemsInfo){
		var OrderObject =[] ;
		for ( let IdOfOrderArray of GoodsOrderArray  ){
			for ( let ItemOfAllItemsInfo of AllItemsInfo ){
				if (ItemOfAllItemsInfo.id === IdOfOrderArray.slice(0,8)){
					OrderObject.push({id:IdOfOrderArray.slice(0,8),name:ItemOfAllItemsInfo.name , price: ItemOfAllItemsInfo.price ,count :IdOfOrderArray[11], charge :Number(IdOfOrderArray[11] * ItemOfAllItemsInfo.price)});
				}
			}
		}
		return OrderObject ;
	} 
	function StringOfChargeInfo(OrderObject ){
		var string1 = '============= 订餐明细 =============\n' ;
		for ( OrderInfo of OrderObject ){
			string1 += OrderInfo.name + ' x ' + OrderInfo.count + ' = ' + OrderInfo.charge + '元\n';
		}
		return string1 ;
	}
	function ChooseBestcharge(OrderObject , promotions ){
		function TheFirstWay (OrderObject , promotions){
			let ObjectOfDiscount = {name:[],discountcharge: 0 };
			for ( let GoodsInfo of OrderObject ){
				let GoodsId = GoodsInfo.id; 
				for ( let DiscountGoodsId of promotions[1].items  ){
					if ( GoodsId === DiscountGoodsId ){
						ObjectOfDiscount.name.push(GoodsInfo.name);
						ObjectOfDiscount.discountcharge += GoodsInfo.price / 2 * GoodsInfo.count;
					}
				}
			}
			return ObjectOfDiscount ;
		}
		function TheSecondWay(GoodsOrderObject){
			let discountcharge = 0 ;
			let thetotalcharge = 0
			for ( let GoodsInfo of GoodsOrderObject  ){
				thetotalcharge += GoodsInfo.charge ;	
			}
			shouldpay = thetotalcharge ;
			if ( thetotalcharge >= 30 ){
				discountcharge = 6 ;
			}
			return discountcharge ;
		}
		var thefirstdiscount = TheFirstWay(OrderObject , promotions);
		var theseconddiscount = TheSecondWay(OrderObject);
		let string = '';
		if (thefirstdiscount.discountcharge == theseconddiscount && theseconddiscount ===  0){
			discountpay = 0 ;
			return string;
		}
		else if (thefirstdiscount.discountcharge >= theseconddiscount) {
			discountpay = thefirstdiscount.discountcharge ;
			string += '-----------------------------------\n使用优惠:\n指定菜品半价(';
			for ( let i = 0 ; i < thefirstdiscount.name.length ; i ++ ){
				if (i === 0){
					string += thefirstdiscount.name[i];
				}
				else {
					string += '，' + thefirstdiscount.name[i];
				}
			}
			string += ')' + '，省' + thefirstdiscount.discountcharge +'元\n';
			return string ;
		}
		else {
			discountpay = 6 ; 
			string +=  '-----------------------------------\n使用优惠:\n满30减6元，省6元\n';
			return string ;
		}
	}
	var GoodsOrderObject = ChangeGoodsOrderArrayToGoodsOrderObject(selectedItems , loadAllItems());
	answer += StringOfChargeInfo(GoodsOrderObject);
	answer  +=  ChooseBestcharge(GoodsOrderObject , promotions());
	answer += '-----------------------------------\n' + '总计：'  + String(shouldpay - discountpay )+  '元' + '\n==================================='; 
	return answer ; 
}
module.exports = bestCharge ;
