import ProductService from "@/service/products/ProductService";
export default class Products{
    constructor(primaryKey="ref",api="products",ref="",label="",finished="",fk_default_warehouse="",stock="",price="",sale=1,purchase=1){
       this.api=api;
        this.ref=ref;
        this.label=label;
        this.finished=finished;
        this.fk_default_warehouse=fk_default_warehouse;
        this.stock=stock;   
        this.price=price;
        this.primaryKey=primaryKey;
        this.sale=sale;
        this.purchase=purchase;
    }
    
    Empty(jsonList){
        return ProductService.Empty(jsonList);
    }

}
